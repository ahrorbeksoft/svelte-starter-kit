<script lang="ts">
  import { i18n } from "$lib";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import type { AnyFieldApi } from "@tanstack/svelte-form";
  import { fromDate, getLocalTimeZone } from "@internationalized/date";
  import { cn } from "$lib/utils";
  import { ChevronDownIcon } from "@lucide/svelte";
  import { addYears } from "date-fns";
  import { getFormat, type FormatOptions } from "$lib/hooks/format.svelte";
  import FieldContainer from "./field-container.svelte";

  type DateSelectFieldProps = {
    label?: string;
    description?: string;
    field: AnyFieldApi;
    sm?: boolean;
    formatOptions?: FormatOptions;
    placeholder?: string;
    class?: string;
    disabled?: boolean;
    hidden?: {
      before?: Date;
      after?: Date;
    };
    required?: boolean;
  };

  let {
    label,
    description,
    field,
    sm = false,
    class: className,
    placeholder,
    disabled = false,
    formatOptions,
    hidden = { before: addYears(new Date(), -5), after: addYears(new Date(), 5) },
    required = false
  }: DateSelectFieldProps = $props();

  const format = getFormat();
  const { t } = $derived(i18n);
  const resolvedPlaceholder = $derived(placeholder ?? t("select-date"));

  const isInvalid = $derived(field.state.meta.isTouched && field.state.meta.errors.length > 0);

  let calendarOpen = $state(false);
</script>

<FieldContainer {field} {label} {description} {required}>
  <Popover.Root bind:open={calendarOpen}>
    <Popover.Trigger>
      {#snippet child({ props })}
        <Button
          {disabled}
          aria-invalid={isInvalid}
          {...props}
          variant="outline"
          class={cn(
            "flex w-full justify-between font-normal",
            !field.state.value && "text-muted-foreground",
            sm && "h-7!",
            className
          )}
          id={field.name}
        >
          {field.state.value ? format(field.state.value, formatOptions) : resolvedPlaceholder}
          <ChevronDownIcon />
        </Button>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-auto overflow-hidden p-0" align="start">
      <Calendar
        type="single"
        captionLayout="dropdown"
        value={field.state.value ? fromDate(field.state.value, getLocalTimeZone()) : undefined}
        onValueChange={(d) => {
          field.handleChange(d ? d.toDate(getLocalTimeZone()) : undefined);
          calendarOpen = false;
        }}
        minValue={fromDate(hidden.before ?? addYears(new Date(), -5), getLocalTimeZone())}
        maxValue={fromDate(hidden.after ?? addYears(new Date(), 5), getLocalTimeZone())}
      />
    </Popover.Content>
  </Popover.Root>
</FieldContainer>
