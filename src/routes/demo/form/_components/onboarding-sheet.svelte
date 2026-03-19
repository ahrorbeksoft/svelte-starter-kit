<script lang="ts">
  import { createForm } from "@tanstack/svelte-form";
  import z from "zod";

  import Modal from "$lib/components/modal.svelte";
  import type { Form } from "$lib/components/form/types";
  import {
    AppForm,
    CheckboxField,
    DomainField,
    MultiSelectField,
    NumberField,
    PhoneField,
    SubmitButton,
    TextField
  } from "$lib/components/form";
  import { Button } from "$lib/components/ui/button";
  import { tryCatch, wait } from "$lib/utils";

  const departmentOptions = [
    { value: "sales", label: "Sales" },
    { value: "marketing", label: "Marketing" },
    { value: "design", label: "Design" },
    { value: "engineering", label: "Engineering" },
    { value: "support", label: "Support" }
  ];

  let { open = $bindable(false) }: { open?: boolean } = $props();

  const schema = z.object({
    companyName: z.string().min(2, "Company name is required."),
    workspace: z.string().min(3, "Workspace should be at least 3 characters."),
    phone: z.string().min(9, "Phone number is required."),
    teamSize: z.number().min(1, "Team size should be at least 1."),
    departments: z.array(z.string()).min(1, "Select at least one department."),
    termsAccepted: z.boolean().refine((value) => value, "You need to accept the terms to continue.")
  });

  const form = createForm(() => ({
    defaultValues: {
      companyName: "",
      workspace: "",
      phone: "",
      teamSize: 5,
      departments: ["engineering"],
      termsAccepted: false
    } as z.infer<typeof schema>,
    validators: {
      onSubmit: schema
    },
    onSubmit: async ({ formApi }) => {
      await tryCatch(async () => {
        await wait(600);
        formApi.reset();
        open = false;

        return {
          success: "Workspace onboarding form submitted."
        };
      });
    }
  }));
</script>

<Modal
  bind:open
  mode="sheet"
  title="Workspace onboarding sheet"
  description="A broader setup flow that feels more natural in a sheet or mobile drawer."
>
  {#snippet children()}
    <AppForm {form} class="space-y-4">
      <form.Field name="companyName">
        {#snippet children(field)}
          <TextField {field} label="Company name" placeholder="Acme Studio" />
        {/snippet}
      </form.Field>

      <form.Field name="workspace">
        {#snippet children(field)}
          <DomainField {field} label="Workspace domain" placeholder="acme-studio" />
        {/snippet}
      </form.Field>

      <form.Field name="phone">
        {#snippet children(field)}
          <PhoneField
            {field}
            label="Admin phone"
            description="PhoneField matches the stored string value with an Uzbek phone mask."
          />
        {/snippet}
      </form.Field>

      <form.Field name="teamSize">
        {#snippet children(field)}
          <NumberField
            {field}
            label="Initial team size"
            description="Best for bounded numeric values."
            min={1}
            max={100}
          />
        {/snippet}
      </form.Field>

      <form.Field name="departments">
        {#snippet children(field)}
          <MultiSelectField
            {field}
            label="Departments"
            options={departmentOptions}
            description="Multi-select works well for setup or filtering flows."
          />
        {/snippet}
      </form.Field>

      <form.Field name="termsAccepted">
        {#snippet children(field)}
          <CheckboxField
            {field}
            label="I agree to the onboarding requirements"
            description="A required checkbox is common in setup sheets."
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

        <SubmitButton form={form as Form} label="Create workspace" loadingLabel="Creating..." />
      </div>
    </AppForm>
  {/snippet}
</Modal>
