<script lang="ts">
  import { AppForm, SubmitButton, TextField } from "$lib/components/form";
  import { auth, db } from "$lib/db";
  import { timestamps, tryCatch } from "$lib/utils";
  import { id } from "@instantdb/svelte";
  import { createForm } from "@tanstack/svelte-form";
  import z from "zod";

  const schema = z.object({
    title: z.string().min(1, { message: "Title is required" }).trim()
  });

  const form = createForm(() => ({
    defaultValues: { title: "" },
    validators: {
      onSubmit: schema
    },
    onSubmit: async ({ value, formApi }) => {
      await tryCatch(async () => {
        if (!auth.user) return;

        await db.transact(
          db.tx.todos[id()]
            .create({
              title: value.title,
              completed: false,
              ...timestamps(false)
            })
            .link({
              owner: auth.user.id
            })
        );

        formApi.reset();
        return { success: "Todo added!" };
      });
    }
  }));
</script>

<AppForm {form}>
  <form.Field name="title">
    {#snippet children(field)}
      <TextField {field} placeholder="What needs to be done?" class="flex-1">
        {#snippet right()}
          <SubmitButton {form} label="Add todo" loadingLabel="Adding..." />
        {/snippet}
      </TextField>
    {/snippet}
  </form.Field>
</AppForm>
