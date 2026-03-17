<script lang="ts">
  import type { AnyFieldApi } from "@tanstack/svelte-form";
  import * as Select from "$lib/components/ui/select";
  import { i18n } from "$lib";
  import { extract } from "runed";
  import { cn } from "$lib/utils";
  import FieldContainer from "./field-container.svelte";

  type BirthdayFieldProps = {
    label?: string;
    description?: string;
    field: AnyFieldApi;
    required?: boolean;
  };

  let { label, description, field, required = false }: BirthdayFieldProps = $props();

  // 1. Safely extract value
  const fieldValue = $derived(extract(field.state.value, undefined) as Date | undefined);
  const isInvalid = $derived(field.state.meta.isTouched && field.state.meta.errors.length > 0);
  const { t } = $derived(i18n);

  // 2. Internal state handles empty strings for "undefined" state
  // svelte-ignore state_referenced_locally
  let day = $state(fieldValue?.getDate().toString() ?? "");
  // svelte-ignore state_referenced_locally
  let month = $state(fieldValue ? (fieldValue.getMonth() + 1).toString() : "");
  // svelte-ignore state_referenced_locally
  let year = $state(fieldValue?.getFullYear().toString() ?? "");

  // 3. Sync internal state if the field value changes externally (e.g., form reset)
  $effect(() => {
    if (fieldValue) {
      day = fieldValue.getDate().toString();
      month = (fieldValue.getMonth() + 1).toString();
      year = fieldValue.getFullYear().toString();
    } else {
      day = "";
      month = "";
      year = "";
    }
  });

  const currentYear = new Date().getFullYear();

  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

  // 4. Derived: Calculate days in the selected month/year (default to leap year Feb for safety)
  let daysInMonth = $derived(
    year && month ? new Date(parseInt(year), parseInt(month), 0).getDate() : 31
  );
  let dayOptions = $derived(Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString()));

  // 5. Effect: Update the TanStack field only when all parts are present
  $effect(() => {
    if (day && month && year) {
      const newDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      // Only update if the date is actually different to avoid loops
      if (!fieldValue || newDate.getTime() !== fieldValue.getTime()) {
        field.handleChange(newDate);
      }
    } else if (fieldValue !== undefined && (!day || !month || !year)) {
      // If segments are cleared, set field to undefined
      field.handleChange(undefined);
    }
  });

  // 6. Effect: Keep day in bounds if month changes
  $effect(() => {
    if (day && parseInt(day) > daysInMonth) {
      day = daysInMonth.toString();
    }
  });
</script>

<FieldContainer {field} {label} {description} {required}>
  <div class="flex items-center justify-evenly gap-2">
    <Select.Root type="single" bind:value={day}>
      <Select.Trigger
        id={field.name}
        class={cn("w-full", !day && "text-muted-foreground")}
        aria-invalid={isInvalid}
      >
        {day || t("day")}
      </Select.Trigger>
      <Select.Content class="max-h-75 overflow-y-auto">
        {#each dayOptions as d (d)}
          <Select.Item value={d}>{d}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>

    <Select.Root type="single" bind:value={month}>
      <Select.Trigger
        class={cn("w-full", !month && "text-muted-foreground")}
        aria-invalid={isInvalid}
      >
        {month ? t("render-month", { month }) : t("month")}
      </Select.Trigger>
      <Select.Content class="max-h-75 overflow-y-auto">
        <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
        {#each Array.from({ length: 12 }) as _, i (i)}
          <Select.Item value={(i + 1).toString()}>
            {t("render-month", { month: String(i + 1) })}
          </Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>

    <Select.Root type="single" bind:value={year}>
      <Select.Trigger
        class={cn("w-full", !year && "text-muted-foreground")}
        aria-invalid={isInvalid}
      >
        {year || t("year")}
      </Select.Trigger>
      <Select.Content class="max-h-75 overflow-y-auto">
        {#each years as y (y)}
          <Select.Item value={y}>{y}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </div>
</FieldContainer>
