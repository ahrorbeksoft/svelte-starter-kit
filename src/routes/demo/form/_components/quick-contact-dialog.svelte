<script lang="ts">
  import { createForm } from "@tanstack/svelte-form";
  import z from "zod";

  import Modal from "$lib/components/modal.svelte";
  import type { Form } from "$lib/components/form/types";
  import {
    AppForm,
    CheckboxField,
    SelectField,
    SubmitButton,
    TextField,
    TextareaField
  } from "$lib/components/form";
  import { Button } from "$lib/components/ui/button";
  import { tryCatch, wait } from "$lib/utils";

  let { open = $bindable(false) }: { open?: boolean } = $props();

  const categoryOptions = [
    { value: "lead", label: "Lead" },
    { value: "customer", label: "Customer" },
    { value: "partner", label: "Partner" }
  ];

  const schema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Enter a valid email address."),
    category: z.string().min(1, "Pick a lead category."),
    message: z.string().min(10, "Message must be at least 10 characters."),
    subscribe: z.boolean().optional()
  });

  const form = createForm(() => ({
    defaultValues: {
      fullName: "",
      email: "",
      category: "",
      message: "",
      subscribe: true
    } as z.infer<typeof schema>,
    validators: {
      onSubmit: schema
    },
    onSubmit: async ({ formApi }) => {
      await tryCatch(async () => {
        await wait(500);
        formApi.reset();
        open = false;

        return {
          success: "Quick contact form submitted."
        };
      });
    }
  }));
</script>

<Modal
  bind:open
  mode="dialog"
  title="Quick contact dialog"
  description="A compact dialog form for short lead capture or support intake."
>
  {#snippet children()}
    <AppForm {form} class="space-y-4">
      <form.Field name="fullName">
        {#snippet children(field)}
          <TextField {field} label="Full name" placeholder="Enter the contact name" />
        {/snippet}
      </form.Field>

      <form.Field name="email">
        {#snippet children(field)}
          <TextField {field} label="Email" type="email" placeholder="Enter the email address" />
        {/snippet}
      </form.Field>

      <form.Field name="category">
        {#snippet children(field)}
          <SelectField {field} label="Category" options={categoryOptions} />
        {/snippet}
      </form.Field>

      <form.Field name="message">
        {#snippet children(field)}
          <TextareaField
            {field}
            label="Message"
            placeholder="Write a short request or context"
            maxlength={250}
          />
        {/snippet}
      </form.Field>

      <form.Field name="subscribe">
        {#snippet children(field)}
          <CheckboxField
            {field}
            label="Send follow-up product updates"
            description="Useful for marketing or sales demos."
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

        <SubmitButton form={form as Form} label="Submit" loadingLabel="Submitting..." />
      </div>
    </AppForm>
  {/snippet}
</Modal>
