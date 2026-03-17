<script lang="ts">
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import type { AnyFieldApi } from "@tanstack/svelte-form";
  import { fromDate, getLocalTimeZone, toCalendarDate, today } from "@internationalized/date";
  import { DateField } from "bits-ui";
  import { i18n } from "$lib";
  import CalendarIcon from "@lucide/svelte/icons/calendar"; // Assuming you use Lucide
  import { cn } from "$lib/utils";
  import FieldContainer from "./field-container.svelte";

  type DateFieldProps = DateField.InputProps & {
    label?: string;
    description?: string;
    field: AnyFieldApi;
    sm?: boolean;
    required?: boolean;
  };

  let {
    label,
    description,
    field,
    sm = false,
    class: className,
    required = false,
    ...props
  }: DateFieldProps = $props();

  const todayDate = today(getLocalTimeZone());
  const isInvalid = $derived(field.state.meta.isTouched && field.state.meta.errors.length > 0);

  let calendarOpen = $state(false);

  // Helper to sync DateField and Calendar
  const calendarValue = $derived(
    field.state.value ? toCalendarDate(fromDate(field.state.value, getLocalTimeZone())) : undefined
  );
</script>

<FieldContainer {field} {label} {description} {required}>
  <div class="relative flex items-center gap-1">
    <DateField.Root
      minValue={todayDate.subtract({ years: 5 })}
      maxValue={todayDate.add({ years: 5 })}
      locale={i18n.locale === "en" ? "en" : "ru"}
      value={calendarValue}
      onValueChange={(d) => {
        if (d) field.handleChange(d.toDate(getLocalTimeZone()));
      }}
    >
      <div class="relative flex w-full items-center">
        <DateField.Input
          id={field.name}
          aria-invalid={isInvalid}
          onblur={field.handleBlur}
          class={cn(
            "flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 aria-invalid:border-destructive",
            sm && "h-7 text-sm",
            className
          )}
          {...props}
        >
          {#snippet children({ segments })}
            {#each segments as { part, value }, i (part + i)}
              {#if part === "literal"}
                <DateField.Segment {part} class="px-0.5 text-muted-foreground">
                  {value}
                </DateField.Segment>
              {:else}
                <DateField.Segment
                  {part}
                  class={cn(
                    "rounded-sm px-0.5 py-1 tabular-nums transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground focus:outline-none data-invalid:text-destructive",
                    sm && "p-0.5"
                  )}
                >
                  {#if value === "дд" && i18n.locale === "uz"}kk
                  {:else if value === "мм" && i18n.locale === "uz"}oo
                  {:else if value === "гггг" && i18n.locale === "uz"}yyyy
                  {:else}{value}{/if}
                </DateField.Segment>
              {/if}
            {/each}
          {/snippet}
        </DateField.Input>

        <div class="absolute right-2">
          <Popover.Root bind:open={calendarOpen}>
            <Popover.Trigger>
              {#snippet child({ props })}
                <Button
                  {...props}
                  variant="ghost"
                  size="icon-sm"
                  class={cn("size-8 text-muted-foreground hover:text-foreground", sm && "size-5")}
                >
                  <CalendarIcon class="size-4" />
                </Button>
              {/snippet}
            </Popover.Trigger>
            <Popover.Content class="w-auto p-0" align="end">
              <Calendar
                type="single"
                value={field.state.value
                  ? fromDate(field.state.value, getLocalTimeZone())
                  : undefined}
                onValueChange={(d) => {
                  if (d) {
                    field.handleChange(d.toDate(getLocalTimeZone()));
                  }
                  calendarOpen = false;
                }}
                initialFocus
              />
            </Popover.Content>
          </Popover.Root>
        </div>
      </div>
    </DateField.Root>
  </div>
</FieldContainer>
