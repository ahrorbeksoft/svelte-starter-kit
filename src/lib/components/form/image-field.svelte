<script lang="ts">
  import type { AnyFieldApi } from "@tanstack/svelte-form";
  import { UploadCloudIcon, XIcon } from "@lucide/svelte";
  import FieldContainer from "./field-container.svelte";
  import Dropzone, { type DropzoneEvent, type CustomDropzoneProps } from "svelte-dropzone-runes";
  import { i18n } from "$lib";
  import { getTranslations } from "@sveltebase/i18n";

  type ImageFieldProps = {
    label?: string;
    description?: string;
    field: AnyFieldApi;
    required?: boolean;
    accept?: string[];
    maxSizeLabel?: string;
    initialPreviewUrl?: string | null;
    initialFileName?: string;
    initialFileSize?: number | null;
    onDelete?: () => void | Promise<void>;
  };

  let {
    label,
    description,
    field,
    required = false,
    accept = ["image/png", "image/jpeg"],
    maxSizeLabel = "PNG, JPG (max 1MB)",
    initialPreviewUrl = null,
    initialFileName = "logo.png",
    initialFileSize = null,
    onDelete
  }: ImageFieldProps = $props();

  const t = getTranslations();

  let selectedFile = $state<File | null>(null);
  let previewUrl = $state<string | null>(null);
  let isDragOver = $state(false);

  let currentPreviewUrl = $derived(previewUrl ?? initialPreviewUrl);
  let currentFileName = $derived(
    selectedFile?.name ?? (initialPreviewUrl ? initialFileName : null)
  );
  let currentFileSize = $derived(selectedFile?.size ?? initialFileSize);
  let dropzoneElement: HTMLElement | undefined = $state();

  function handleFilesSelect(e: DropzoneEvent<File>) {
    if (e.acceptedFiles.length > 0) {
      selectedFile = e.acceptedFiles[0];
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      previewUrl = URL.createObjectURL(selectedFile);
      field.handleChange(selectedFile);
    }
    isDragOver = false;
  }

  function removeFile() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    selectedFile = null;
    previewUrl = null;
    field.handleChange(undefined);
    onDelete?.();
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
</script>

<FieldContainer {field} {label} {description} {required}>
  {#if currentPreviewUrl}
    <div class="relative flex items-center gap-4 rounded-lg border border-border bg-muted/30 p-4">
      <div
        class="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-white"
      >
        <img
          src={currentPreviewUrl}
          alt={currentFileName ?? ""}
          class="h-full w-full object-contain"
        />
      </div>
      <div class="min-w-0 flex-1">
        {#if currentFileName}
          <p class="truncate text-sm font-medium text-foreground">
            {currentFileName}
          </p>
        {/if}
        {#if currentFileSize}
          <p class="mt-0.5 text-xs text-muted-foreground">
            {formatFileSize(currentFileSize)}
          </p>
        {/if}
      </div>
      <button
        type="button"
        onclick={removeFile}
        class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <XIcon class="h-4 w-4" />
      </button>
    </div>
  {:else}
    {#snippet CustomDropzone(props: CustomDropzoneProps)}
      <div
        bind:this={dropzoneElement}
        {...props}
        class="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-all duration-200 outline-none
					{isDragOver
          ? 'scale-[1.01] border-primary bg-primary/5'
          : 'border-muted-foreground/25 bg-muted/20 hover:border-primary/50 hover:bg-muted/40'}"
      >
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-200
						{isDragOver ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}"
        >
          <UploadCloudIcon class="h-6 w-6" />
        </div>
        <div>
          <p class="text-sm font-medium text-foreground">
            {t("click-to-upload")}
          </p>
          <p class="mt-1 text-xs text-muted-foreground">
            {maxSizeLabel}
          </p>
        </div>
      </div>
    {/snippet}
    <Dropzone
      onDrop={handleFilesSelect}
      {accept}
      onDragenter={() => {
        isDragOver = true;
      }}
      onDragleave={() => {
        isDragOver = false;
      }}
      {dropzoneElement}
      {CustomDropzone}
    />
  {/if}
</FieldContainer>
