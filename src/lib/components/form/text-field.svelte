<script lang="ts">
  import * as InputGroup from "$lib/components/ui/input-group";
  import { cn } from "$lib/utils";
  import type { AnyFieldApi } from "@tanstack/svelte-form";
  import type { ComponentProps, Snippet } from "svelte";
  import FieldContainer from "./field-container.svelte";
  import { Spinner } from "../ui/spinner";
  import { getTranslations } from "@sveltebase/i18n";
  import { createAsync } from "@sveltebase/utils";

  type TextFieldProps = ComponentProps<typeof InputGroup.Input> & {
    label?: string;
    description?: string;
    field: AnyFieldApi;
    sm?: boolean;
    required?: boolean;
    right?: Snippet;
    getInitialValueAsync?: () => Promise<string | undefined>;
  };

  let {
    label,
    description,
    field,
    sm = false,
    class: className,
    required = false,
    getInitialValueAsync,
    right,
    ref = $bindable(null),
    ...props
  }: TextFieldProps = $props();

  const t = getTranslations();

  const action = createAsync(async () => {
    const initialValue = await getInitialValueAsync?.();
    if (initialValue) {
      field.handleChange(initialValue);
    }
  });

  // Derived state for validation UI
  const isInvalid = $derived(field.state.meta.isTouched && field.state.meta.errors.length > 0);

  $effect(() => {
    if (
      getInitialValueAsync &&
      field.form.options.defaultValues[field.name] === field.state.value
    ) {
      action.run();
    }
  });
</script>

<FieldContainer {field} {label} {description} {required}>
  <div class="flex items-center gap-2">
    <InputGroup.Root>
      <InputGroup.Input
        bind:ref
        id={field.name}
        name={field.name}
        value={field.state.value}
        oninput={(e) => field.handleChange(e.currentTarget.value)}
        onblur={field.handleBlur}
        aria-invalid={isInvalid}
        autocomplete="off"
        class={cn(sm && "h-7", className)}
        {...props}
        placeholder={getInitialValueAsync && action.isLoading()
          ? t("loading-dot")
          : props.placeholder}
        disabled={(getInitialValueAsync && action.isLoading()) || props.disabled}
      />
      {#if getInitialValueAsync && action.isLoading()}
        <InputGroup.Addon>
          <Spinner />
        </InputGroup.Addon>
      {/if}
    </InputGroup.Root>
    {#if right}
      {@render right()}
    {/if}
  </div>
</FieldContainer>
