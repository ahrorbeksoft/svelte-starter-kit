<script lang="ts">
  import { i18n } from "$lib";
  import { AppForm, SubmitButton, TextField } from "$lib/components/form";
  import { Button } from "$lib/components/ui/button";
  import { tryCatch, wait } from "$lib/utils";
  import { createForm } from "@tanstack/svelte-form";
  import z from "zod";

  const { t } = $derived(i18n);

  const schema = $derived(
    z.object({
      name: z.string().min(2, t("input.min", { name: "Name", min: 2 })),
      email: z.email(t("input.invalid", { name: "Email" })),
      password: z.string().min(6, t("input.min", { name: "Password", min: 6 }))
    })
  );

  const form = createForm(() => ({
    defaultValues: {
      name: "",
      email: "",
      password: ""
    } as z.infer<typeof schema>,
    validators: {
      onSubmit: schema
    },
    onSubmit: async ({ value }) => {
      await tryCatch(async () => {
        await wait(5000);
        return { error: "fuck this" };
      });
    }
  }));
</script>

<div class="p-5">
  <AppForm {form} class="w-md">
    <form.Field name="name">
      {#snippet children(field)}
        <TextField {field} label="Name" placeholder="Enter your name" />
      {/snippet}
    </form.Field>
    <form.Field name="email">
      {#snippet children(field)}
        <TextField {field} label="Email" placeholder="Enter your email" />
      {/snippet}
    </form.Field>
    <form.Field name="password">
      {#snippet children(field)}
        <TextField {field} label="Password" placeholder="Enter your password" type="password" />
      {/snippet}
    </form.Field>

    <div class="ml-auto flex items-center gap-2">
      <Button
        variant="outline"
        onclick={() => {
          form.reset();
        }}
      >
        Cancel
      </Button>
      <SubmitButton {form} label="Save" loadingLabel="Saving..." />
    </div>
  </AppForm>
</div>
