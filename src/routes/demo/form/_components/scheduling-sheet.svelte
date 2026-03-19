<script lang="ts">
  import { createForm } from "@tanstack/svelte-form";
  import z from "zod";

  import Modal from "$lib/components/modal.svelte";
  import type { Form } from "$lib/components/form/types";
  import {
    AppForm,
    CheckboxField,
    DateField,
    DateSelectField,
    MultiSelectField,
    SubmitButton,
    TextField,
    TextareaField,
    TimeField
  } from "$lib/components/form";
  import { Button } from "$lib/components/ui/button";
  import { tryCatch, wait } from "$lib/utils";

  let { open = $bindable(false) }: { open: boolean } = $props();

  const attendeeOptions = [
    { value: "alex", label: "Alex Johnson" },
    { value: "maria", label: "Maria Petrova" },
    { value: "sam", label: "Sam Wilson" },
    { value: "nargiza", label: "Nargiza Karimova" },
    { value: "timur", label: "Timur Ahmedov" }
  ];

  const schedulingSchema = z.object({
    title: z.string().min(3, "Title is required."),
    summary: z.string().min(10, "Add a short summary."),
    eventDate: z
      .date()
      .optional()
      .refine((value) => value instanceof Date, "Pick an event date."),
    checkInTime: z.string().min(1, "Choose a check-in time."),
    reminderDate: z
      .date()
      .optional()
      .refine((value) => value instanceof Date, "Pick a reminder date."),
    attendees: z.array(z.string()).min(1, "Select at least one attendee."),
    notifyAttendees: z.boolean().optional()
  });

  const form = createForm(() => ({
    defaultValues: {
      title: "",
      summary: "",
      eventDate: undefined,
      checkInTime: "",
      reminderDate: undefined,
      attendees: [],
      notifyAttendees: true
    } as z.infer<typeof schedulingSchema>,
    validators: {
      onSubmit: schedulingSchema
    },
    onSubmit: async ({ formApi }) => {
      await tryCatch(async () => {
        await wait(600);
        formApi.reset();
        open = false;

        return {
          success: "Scheduling form submitted."
        };
      });
    }
  }));
</script>

<Modal
  bind:open
  mode="sheet"
  title="Scheduling sheet"
  description="This scenario combines date, time, multi-select, and long-text fields in a spacious layout."
>
  {#snippet children()}
    <AppForm {form} class="space-y-4">
      <form.Field name="title">
        {#snippet children(field)}
          <TextField {field} label="Session title" placeholder="Product discovery workshop" />
        {/snippet}
      </form.Field>

      <form.Field name="summary">
        {#snippet children(field)}
          <TextareaField
            {field}
            label="Summary"
            placeholder="What should participants prepare before the session?"
            maxlength={300}
          />
        {/snippet}
      </form.Field>

      <div class="grid gap-4 lg:grid-cols-2">
        <form.Field name="eventDate">
          {#snippet children(field)}
            <DateField
              {field}
              label="Event date"
              description="Segmented date input with calendar support."
            />
          {/snippet}
        </form.Field>

        <form.Field name="checkInTime">
          {#snippet children(field)}
            <TimeField {field} label="Check-in time" description="Time-only input." />
          {/snippet}
        </form.Field>
      </div>

      <form.Field name="reminderDate">
        {#snippet children(field)}
          <DateSelectField
            {field}
            label="Reminder date"
            description="A lighter date picker button."
          />
        {/snippet}
      </form.Field>

      <form.Field name="attendees">
        {#snippet children(field)}
          <MultiSelectField
            {field}
            label="Attendees"
            options={attendeeOptions}
            description="Multi-select matches the array-based attendee value shape."
          />
        {/snippet}
      </form.Field>

      <form.Field name="notifyAttendees">
        {#snippet children(field)}
          <CheckboxField
            {field}
            label="Notify attendees automatically"
            description="Toggle secondary behavior from the same form."
          />
        {/snippet}
      </form.Field>

      <div class="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onclick={() => {
            form.reset();
            open = false;
          }}
        >
          Cancel
        </Button>
        <SubmitButton form={form as Form} label="Schedule" loadingLabel="Scheduling..." />
      </div>
    </AppForm>
  {/snippet}
</Modal>
