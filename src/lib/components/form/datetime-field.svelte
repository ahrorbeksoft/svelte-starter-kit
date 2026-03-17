<script lang="ts">
  import * as Popover from "$lib/components/ui/popover/index.js";
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import { FieldLabel } from "$lib/components/ui/field";
  import { Button } from "$lib/components/ui/button";
  import { TimeField, type TimeValue } from "bits-ui";
  import {
    CalendarDate,
    fromDate,
    getLocalTimeZone,
    Time,
    toCalendarDate
  } from "@internationalized/date";
  import { ChevronDownIcon } from "@lucide/svelte";
  import { cn } from "$lib/utils";
  import { i18n } from "$lib";
  import type { AnyFieldApi } from "@tanstack/svelte-form";
  import { getFormat } from "$lib/hooks/format.svelte";
  import FieldContainer from "./field-container.svelte";

  type DateTimeFieldProps = {
    label?: string;
    description?: string;
    dateLabel?: string;
    timeLabel?: string;
    field: AnyFieldApi;
    required?: boolean;
  };

  let {
    field,
    label,
    dateLabel,
    timeLabel,
    description,
    required = false
  }: DateTimeFieldProps = $props();

  const { t } = $derived(i18n);

  const format = getFormat();
  let calendarOpen = $state(false);

  // Internal UI states
  let dateValue = $state<CalendarDate | undefined>();
  let timeValue = $state<TimeValue | undefined>();

  // Sync external field value to internal UI components
  $effect(() => {
    const val = field.state.value;
    if (val instanceof Date && !isNaN(val.getTime())) {
      const tz = getLocalTimeZone();
      dateValue = toCalendarDate(fromDate(val, tz));
      timeValue = new Time(val.getHours(), val.getMinutes());
    }
  });

  function updateField() {
    if (!dateValue) return;

    // Use current time if timeValue isn't set yet
    const hours = timeValue?.hour ?? new Date().getHours();
    const mins = timeValue?.minute ?? new Date().getMinutes();

    const newDate = new Date(
      dateValue.year,
      dateValue.month - 1, // CalendarDate is 1-indexed
      dateValue.day,
      hours,
      mins
    );

    field.handleChange(newDate);
  }
</script>

<FieldContainer {field} {label} {description} {required}>
  <div class="grid grid-cols-12 items-center gap-4">
    <div class="col-span-7">
      {#if dateLabel}
        <FieldLabel
          class={cn(
            "px-1 pb-2",
            required && "after:ml-1 after:text-destructive after:content-['*']"
          )}>{dateLabel}</FieldLabel
        >
      {/if}
      <Popover.Root bind:open={calendarOpen}>
        <Popover.Trigger>
          {#snippet child({ props })}
            <Button
              {...props}
              variant="outline"
              class="w-full justify-between font-normal"
              id={field.name}
            >
              {dateValue ? format(dateValue.toDate(getLocalTimeZone())) : t("select-date")}
              <ChevronDownIcon class="size-4 opacity-50" />
            </Button>
          {/snippet}
        </Popover.Trigger>
        <Popover.Content class="w-auto p-0" align="start">
          <Calendar
            type="single"
            bind:value={dateValue}
            captionLayout="dropdown"
            onValueChange={() => {
              calendarOpen = false;
              updateField();
            }}
          />
        </Popover.Content>
      </Popover.Root>
    </div>
    <div class="col-span-5">
      {#if timeLabel}
        <FieldLabel
          class={cn(
            "px-1 pb-2",
            required && "after:ml-1 after:text-destructive after:content-['*']"
          )}>{timeLabel}</FieldLabel
        >
      {/if}
      <TimeField.Root bind:value={timeValue} onValueChange={updateField}>
        <TimeField.Input
          class={cn(
            "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none",
            "focus-visible:ring-[3px] focus-visible:ring-ring/50",
            "items-center aria-invalid:border-destructive"
          )}
        >
          {#snippet children({ segments })}
            {#each segments as { part, value }, i (part + i)}
              <div class="inline-block select-none">
                {#if part === "literal"}
                  <TimeField.Segment {part} class="p-0.5 text-muted-foreground">
                    {value}
                  </TimeField.Segment>
                {:else}
                  <TimeField.Segment
                    {part}
                    class="rounded-sm px-0.5 outline-none hover:bg-accent focus:bg-accent focus:text-accent-foreground"
                  >
                    {value}
                  </TimeField.Segment>
                {/if}
              </div>
            {/each}
          {/snippet}
        </TimeField.Input>
      </TimeField.Root>
    </div>
  </div>
</FieldContainer>
