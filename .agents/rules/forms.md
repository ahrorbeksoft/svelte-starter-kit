---
trigger: always_on
---

# Form Rules

Use this project's shared form system for all data-entry UI.

Prefer the patterns already used in this repo: `createForm()` from `@tanstack/svelte-form`, shared components from `$lib/components/form`, `zod` validation, and `tryCatch()` in async submit handlers.

## 1. Required Form Stack

For normal forms, use:

- `createForm()` from `@tanstack/svelte-form`
- `AppForm` from `$lib/components/form`
- `<form.Field ...>` blocks with `{#snippet children(field)}`
- shared field components from `$lib/components/form`
- `SubmitButton` for submit actions
- `zod` schema via `validators.onSubmit`
- `tryCatch()` inside async submit handlers

Default structure:

- declare schema close to the form
- keep `defaultValues` aligned with schema shape
- render one `form.Field` per logical field
- pass the TanStack `field` object directly into the shared field component

## 2. Standard Pattern

Use this as the default shape:

```svelte
<script lang="ts">
  import z from "zod";
  import { i18n } from "$lib";
  import { createForm } from "@tanstack/svelte-form";
  import { tryCatch } from "$lib/utils";
  import { AppForm, SubmitButton, TextField } from "$lib/components/form";

  const { t } = $derived(i18n);

  const schema = $derived(
    z.object({
      name: z.string().min(1, t("input.required", { name: t("name") }))
    })
  );

  const form = createForm(() => ({
    defaultValues: {
      name: ""
    } as z.infer<typeof schema>,
    validators: {
      onSubmit: schema
    },
    onSubmit: async ({ value, formApi }) => {
      await tryCatch(async () => {
        // save value
        formApi.reset();
        return {
          success: t("toast.save-successfull-singular", { name: t("item") })
        };
      });
    }
  }));
</script>

<AppForm {form}>
  <form.Field name="name">
    {#snippet children(field)}
      <TextField {field} label={t("name")} placeholder={t("enter-name")} />
    {/snippet}
  </form.Field>

  <SubmitButton {form} label={t("save")} loadingLabel={t("loading-dot")} />
</AppForm>
```

## 3. Validation and Defaults

- Define a `zod` schema for every form.
- Pass the schema via `validators.onSubmit`.
- Keep schemas near the form declaration.
- When validation messages depend on locale, wrap the schema in `$derived(...)` and use `t(...)`.
- Keep `defaultValues` in the same shape and type as the schema.
- Prefer typed defaults with `z.infer<typeof schema>` when useful.
- Use schema validation for correctness; use `required` prop only for UI indication.
- Prefer localized validation messages and toast messages with `t(...)`.
- For labels/placeholders, use `t(...)` when suitable locale keys already exist; otherwise do not invent questionable example keys just for the pattern.

Good defaults:

- create form -> empty or sensible defaults
- edit form -> populate from the entity being edited
- conditional fields -> still keep the full value shape predictable

For conditional validation, prefer `.superRefine(...)` in the schema.

## 4. Field Wiring Rules

Inside each `form.Field`, always pass the provided `field` object into the shared field component.

Correct:

```svelte
<form.Field name="email">
  {#snippet children(field)}
    <TextField {field} label="Email" />
  {/snippet}
</form.Field>
```

Avoid:

- passing plain values instead of `field`
- manually syncing common inputs with custom `oninput` when a shared field already exists
- bypassing the shared field component for common field types

## 5. Existing Shared Form Components

Prefer existing components from `$lib/components/form`.

### Text inputs

- `TextField` -> default single-line text input
- `TextareaField` -> long-form text input

Use for:

- names
- email
- password
- titles
- descriptions
- notes

Useful notes:

- `TextField` supports `right` snippet content
- `TextField` and `TextareaField` support `getInitialValueAsync` for lazy initial fill
- use normal `defaultValues` instead of async fill unless the value truly is unavailable at form creation time

### Numeric inputs

- `NumberField` -> bounded stepper-style number UI
- `CurrencyField` -> formatted money input with `so'm`
- `PercentageField` -> numeric percent input clamped to `0..100`

Use:

- `NumberField` for counts/quantities
- `CurrencyField` for money values stored as numbers
- `PercentageField` for percentages stored as numbers

### Select inputs

- `SelectField` -> single select, no search
- `SearchableSelectField` -> single select with search
- `MultiSelectField` -> multiple selected values

Use:

- `SelectField` for small option sets
- `SearchableSelectField` when the list is large or scanning is hard
- `MultiSelectField` when the value is an array of selected items

### Date/time inputs

- `DateField` -> segmented date input with calendar popover
- `DateSelectField` -> simpler calendar picker button
- `DatetimeField` -> combined date + time editor
- `TimeField` -> time-only field

Use:

- `DateField` when users may type or segment-edit the date
- `DateSelectField` when a popup calendar is enough
- `DatetimeField` when one field stores a `Date`
- `TimeField` when the field stores a time string

### Specialized inputs

- `PhoneField` -> Uzbek phone mask
- `DomainField` -> domain/subdomain style input with `.1lc.uz` suffix
- `BirthdayField` -> day/month/year birthday selector
- `CheckboxField` -> boolean value
- `FileField` -> single file input
- `ImageField` -> image upload with preview/dropzone

Only use native `<input>`, `<textarea>`, or `<select>` directly if there is no matching shared form component and there is a clear reason.

## 6. Choosing the Right Field

Use the simplest field that matches the data shape and UX need.

Preferred choices:

- plain text/email/password -> `TextField`
- long text -> `TextareaField`
- boolean -> `CheckboxField`
- one option, no search -> `SelectField`
- one option, with search -> `SearchableSelectField`
- many selected options -> `MultiSelectField`
- bounded numeric count -> `NumberField`
- money -> `CurrencyField`
- percent -> `PercentageField`
- Uzbek phone -> `PhoneField`
- subdomain/slug with fixed suffix -> `DomainField`
- date -> `DateField` or `DateSelectField`
- time-only -> `TimeField`
- combined date-time -> `DatetimeField`
- birthday -> `BirthdayField`
- file upload -> `FileField`
- image upload with preview -> `ImageField`

Do not reach for a more complex field if a simpler one is enough.

## 7. Submit Handler Pattern

Use this shape for async submit handlers:

```ts
onSubmit: async ({ value, formApi }) => {
  await tryCatch(async () => {
    // save value
    return {
      success: t("toast.save-successfull-singular", { name: "Item" })
    };
  });
};
```

Rules:

- wrap async save logic in `tryCatch(...)`
- use localized toast messages with `t(...)`
- prefer existing `toast.*` locale keys before adding new ones
- return `{ success: "..." }` for success toasts when appropriate
- return `{ error: "..." }` for handled failures when appropriate
- call `formApi.reset()` after successful create flows when reset is the desired UX
- do not reset edit forms unless the UX explicitly calls for it

For example:

- create screen -> often reset after success
- edit screen -> usually keep values and/or close the UI instead of resetting

## 8. Non-Submit Async Actions

For async actions related to a form but not the submit itself, use `createAsync()`.

Good use cases:

- send verification code
- lazy autofill
- uniqueness lookup
- auxiliary button actions tied to current field values

This keeps loading state and toast behavior consistent.

## 9. Conditional and Dependent Fields

Use `listeners` on `form.Field` when one field should update another.

Example pattern:

```svelte
<form.Field
  name="teacher"
  listeners={{
    onChange: ({ value }) => {
      const teacher = teachers.find((t) => t.id === value);
      if (teacher) {
        form.setFieldValue("teacherShare", teacher.share ?? 0);
      }
    }
  }}
>
  {#snippet children(field)}
    <SearchableSelectField {field} options={teacherOptions} />
  {/snippet}
</form.Field>
```

Use `form.Subscribe` with `selector` when rendering depends on current form state.

Example pattern:

```svelte
<form.Subscribe selector={(state) => state.values.type}>
  {#snippet children(type)}
    {#if type === "teacher"}
      <form.Field name="share">
        {#snippet children(field)}
          <NumberField {field} label="Share" />
        {/snippet}
      </form.Field>
    {:else}
      <form.Field name="roleLabel">
        {#snippet children(field)}
          <TextField {field} label="Role label" />
        {/snippet}
      </form.Field>
    {/if}
  {/snippet}
</form.Subscribe>
```

## 10. Array Fields

For array values, use TanStack array mode.

Pattern:

- `form.Field name="..." mode="array"`
- `field.pushValue(...)` to append
- `field.handleChange(...)` to replace array values
- keep array item shape predictable and schema-aligned

Use shared form components for each item whenever possible.

## 11. Modal and Dialog Form Behavior

When a form is inside a modal, sheet, or dialog:

- keep `open` bindable with `bind:open`
- use a `close()` helper
- if the modal has editing state, clear it after a short timeout when closing
- call `form.reset()` on close only when needed to prevent stale values
- keep the action row at the bottom with cancel + submit actions

Preferred close helper pattern:

```ts
function close() {
  open = false;
  setTimeout(() => {
    entity = null;
  }, 200);
}
```

Use the reset-on-close pattern when the form should be fresh on reopen:

```ts
watch(
  () => open,
  () => {
    if (!open) {
      setTimeout(() => {
        entity = null;
        form.reset();
      }, 200);
    }
  }
);
```

## 12. Modal/Sheet Form Template

Use this as the standard modal form structure and adapt it as needed.

```svelte
<script lang="ts">
  import z from "zod";
  import { i18n } from "$lib";
  import { createForm } from "@tanstack/svelte-form";
  import { tryCatch } from "$lib/utils";
  import { AppForm, SubmitButton, TextField } from "$lib/components/form";
  import { Button } from "$lib/components/ui/button";
  import { watch } from "runed";
  import Modal from "$lib/components/modal.svelte";

  type ModalProps = {
    open: boolean;
    entity: { name?: string } | null;
  };

  let { open = $bindable(), entity = $bindable() }: ModalProps = $props();

  const { t } = $derived(i18n);

  const schema = $derived(
    z.object({
      name: z.string().min(1, t("input.required", { name: t("name") }))
    })
  );

  const form = createForm(() => ({
    defaultValues: {
      name: entity?.name ?? ""
    } as z.infer<typeof schema>,
    validators: {
      onSubmit: schema
    },
    onSubmit: async ({ value }) => {
      await tryCatch(async () => {
        // save value
        close();
        return {
          success: entity
            ? t("edit-succeful-singular", { name: t("item") })
            : t("add-succeful-singular", { name: t("item") })
        };
      });
    }
  }));

  function close() {
    open = false;
    setTimeout(() => {
      entity = null;
    }, 200);
  }

  watch(
    () => open,
    () => {
      if (!open) {
        setTimeout(() => {
          entity = null;
          form.reset();
        }, 200);
      }
    }
  );
</script>

<Modal bind:open title={entity ? t("edit-item") : t("add-item")} mode="sheet">
  <AppForm {form} class="space-y-8 px-1 pb-4">
    <div class="space-y-4">
      <form.Field name="name">
        {#snippet children(field)}
          <TextField {field} label={t("name")} placeholder={t("enter-name")} />
        {/snippet}
      </form.Field>
    </div>

    <div class="flex items-center justify-end gap-2">
      <Button variant="outline" onclick={close}>{t("cancel")}</Button>
      <SubmitButton
        {form}
        loadingLabel={entity ? t("saving-dot") : t("adding-dot")}
        label={entity ? t("save") : t("add")}
      />
    </div>
  </AppForm>
</Modal>
```

## 13. Modal Mode and Naming Conventions

Suggested conventions:

### Mode

| Use case                                             | `mode=`    |
| ---------------------------------------------------- | ---------- |
| complex forms with many fields or scrollable content | `"sheet"`  |
| simple forms with a few fields                       | `"dialog"` |

### File naming

| Use case            | File name             |
| ------------------- | --------------------- |
| complex entity form | `entity-sheet.svelte` |
| simple entity form  | `entity-modal.svelte` |

Use these as conventions, not hard law, when the surrounding route/component naming already suggests something better.

## 14. Detail Page Inline Edit Forms

For inline edit UIs on detail pages, use a `showForm` boolean and swap display vs edit controls in place.

Pattern:

```svelte
<script lang="ts">
  import z from "zod";
  import { i18n } from "$lib";
  import { createForm } from "@tanstack/svelte-form";
  import { tryCatch } from "$lib/utils";

  let showForm = $state(false);

  const { t } = $derived(i18n);

  const schema = $derived(
    z.object({
      name: z.string().min(1, t("input.required", { name: t("name") }))
    })
  );

  const form = createForm(() => ({
    defaultValues: {
      name: entity?.name ?? ""
    } as z.infer<typeof schema>,
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      await tryCatch(async () => {
        // save value
        showForm = false;
        return {
          success: t("toast.save-successfull-singular", { name: t("item") })
        };
      });
    }
  }));
</script>

<AppForm {form}>
  {#if showForm}
    <form.Field name="name">
      {#snippet children(field)}
        <TextField {field} sm placeholder={t("enter-name")} />
      {/snippet}
    </form.Field>

    <div class="flex items-center justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onclick={() => {
          showForm = false;
        }}
      >
        {t("cancel")}
      </Button>
      <SubmitButton {form} loadingLabel={t("loading-dot")} label={t("save")} />
    </div>
  {:else}
    <div>{entity.name}</div>
  {/if}
</AppForm>
```

Keep `createForm(...)` direct here too. Wrap the schema in `$derived(...)` for localized validation, and keep `defaultValues` inside `createForm(...)`.

## 15. Internationalization

- Use `t(...)` for labels, placeholders, descriptions, validation messages, and button text.
- New user-facing strings must be added to all locale files used by the app.
- Keep schema messages localized too, not just visible UI labels.

## 16. `AppForm`, `SubmitButton`, and `FieldContainer`

### `AppForm`

Use `AppForm` as the standard form wrapper.

It already handles:

- rendering the actual `<form>`
- preventing default submit behavior
- calling `form.handleSubmit()`
- grouping fields consistently
- optional title/description support

Do not manually duplicate the submit wiring that `AppForm` already provides.

### `SubmitButton`

Use `SubmitButton` instead of duplicating submit loading logic.

It already handles:

- subscribing to `form.state.isSubmitting`
- disabling itself during submit
- rendering spinner + `loadingLabel`

### `FieldContainer`

`FieldContainer` is the shared shell used inside form field components.

It already handles:

- label
- description
- required marker
- error rendering
- invalid state UI

Do not use `FieldContainer` directly in app code unless you are building a new shared field component.

## 17. Patterns to Follow

- use shared form components by default
- keep schemas near the form
- keep defaults aligned with schema shape
- keep form value types aligned with the chosen field component
- use `SubmitButton` for submit UX
- use `tryCatch()` in async submit handlers
- use `$derived.by(() => createForm(...))` only when reactive defaults actually require recreating the form
- use `form.Subscribe` and `listeners` for dependent UI/field behavior
- prefer simple fields over complex ones when both would work

## 18. Patterns to Avoid

Avoid:

- using raw inputs for field types already covered by `$lib/components/form`
- wrapping every form in `$derived.by(...)` without a reactive reason
- duplicating submit loading state manually instead of using `SubmitButton`
- using mismatched value types for a field component
- using async initial-value helpers when normal `defaultValues` would do
- bypassing `field.handleChange(...)` in custom field implementations
- resetting edit forms automatically when the UX should preserve current values

## 19. Summary

- use `createForm()` + `zod` + `AppForm`
- use shared components from `$lib/components/form`
- use `SubmitButton` for submit actions
- use `tryCatch()` for async submit flows
- use plain `createForm(...)` by default
- use `$derived.by(() => createForm(...))` only when reactive defaults require it
- prefer predictable, schema-aligned form state and the simplest fitting field component
