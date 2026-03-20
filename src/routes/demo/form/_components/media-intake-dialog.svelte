<script lang="ts">
  import { createForm } from "@tanstack/svelte-form";
  import z from "zod";

  import Modal from "$lib/components/modal.svelte";
  import type { Form } from "$lib/components/form/types";
  import {
    AppForm,
    CheckboxField,
    FileField,
    ImageField,
    SelectField,
    SubmitButton,
    TextField,
    TextareaField
  } from "$lib/components/form";
  import { Button } from "$lib/components/ui/button";
  import { tryCatch, wait } from "@sveltebase/utils";

  let { open = $bindable(false) }: { open?: boolean } = $props();

  const assetTypeOptions = [
    { value: "brand", label: "Brand asset" },
    { value: "campaign", label: "Campaign creative" },
    { value: "product", label: "Product image" }
  ];

  const mediaSchema = z.object({
    assetTitle: z.string().min(2, "Asset title is required."),
    assetType: z.string().min(1, "Choose an asset type."),
    notes: z.string().min(10, "Add a few notes for the asset."),
    attachment: z.any().optional(),
    coverImage: z.any().optional(),
    featured: z.boolean().optional()
  });

  const form = createForm(() => ({
    defaultValues: {
      assetTitle: "",
      assetType: "",
      notes: "",
      attachment: undefined,
      coverImage: undefined,
      featured: false
    } as z.infer<typeof mediaSchema>,
    validators: {
      onSubmit: mediaSchema
    },
    onSubmit: async ({ formApi }) => {
      await tryCatch(async () => {
        await wait(700);
        formApi.reset();
        open = false;

        return {
          success: "Media intake form submitted."
        };
      });
    }
  }));
</script>

<Modal
  bind:open
  mode="dialog"
  title="Media intake dialog"
  description="A richer dialog that highlights upload-oriented inputs alongside standard metadata."
  containerClass="sm:max-w-5xl"
>
  {#snippet children()}
    <AppForm {form} containerClass="grid gap-6 lg:grid-cols-2">
      <div class="space-y-4">
        <form.Field name="assetTitle">
          {#snippet children(field)}
            <TextField {field} label="Asset title" placeholder="Summer launch hero" />
          {/snippet}
        </form.Field>

        <form.Field name="assetType">
          {#snippet children(field)}
            <SelectField {field} label="Asset type" options={assetTypeOptions} />
          {/snippet}
        </form.Field>

        <form.Field name="notes">
          {#snippet children(field)}
            <TextareaField
              {field}
              label="Notes"
              placeholder="Add usage notes, target surfaces, or handoff details"
              maxlength={280}
            />
          {/snippet}
        </form.Field>

        <form.Field name="attachment">
          {#snippet children(field)}
            <FileField
              {field}
              label="Source file"
              description="Single-file upload for source material or briefs."
            />
          {/snippet}
        </form.Field>
      </div>

      <div class="space-y-4">
        <form.Field name="coverImage">
          {#snippet children(field)}
            <ImageField
              {field}
              label="Preview image"
              description="Drag and drop an image to preview it instantly."
            />
          {/snippet}
        </form.Field>

        <form.Field name="featured">
          {#snippet children(field)}
            <CheckboxField
              {field}
              label="Mark this asset as featured"
              description="Useful for promo carousels or gallery sorting."
            />
          {/snippet}
        </form.Field>
      </div>

      <div class="flex items-center justify-end gap-2 lg:col-span-2">
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
        <SubmitButton form={form as Form} label="Save asset" loadingLabel="Saving..." />
      </div>
    </AppForm>
  {/snippet}
</Modal>
