<script lang="ts">
  import { i18n } from "$lib";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { buttonVariants } from "$lib/components/ui/button";
  import { cn } from "$lib/utils";
  import { getTranslations } from "@sveltebase/i18n";
  import { setConfirm, type ConfirmParams } from "./alert-dialog-context.svelte";

  let { children } = $props();

  // Reactive state for the dialog
  let isOpen = $state(false);
  let params = $state<ConfirmParams | null>(null);

  // Store the resolver function for the current promise
  let resolvePromise: ((value: boolean) => void) | null = null;

  const t = getTranslations();

  function confirm(newParams: ConfirmParams): Promise<boolean> {
    return new Promise((resolve) => {
      // Cancel any existing pending dialogs
      if (resolvePromise) resolvePromise(false);

      resolvePromise = resolve;
      params = newParams;
      isOpen = true;
    });
  }

  function handleAction(result: boolean) {
    isOpen = false;
    if (resolvePromise) {
      resolvePromise(result);
      resolvePromise = null;
    }
  }

  // Set the context for all children
  setConfirm(confirm);
</script>

{@render children()}

<AlertDialog.Root
  open={isOpen}
  onOpenChange={() => {
    if (!open) handleAction(false);
  }}
>
  {#if params}
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>{params.title}</AlertDialog.Title>
        <AlertDialog.Description>
          {#if typeof params.description === "string"}
            {params.description}
          {:else}
            {@render params.description()}
          {/if}
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer class="flex flex-row items-center gap-2">
        <AlertDialog.Cancel class="flex-1" onclick={() => handleAction(false)}>
          {params.cancelLabel ?? t("cancel")}
        </AlertDialog.Cancel>
        <AlertDialog.Action
          onclick={() => handleAction(true)}
          class={cn(buttonVariants({ variant: params.confirmVariant }), "flex-1")}
        >
          {params.confirmLabel ?? t("confirm")}
        </AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  {/if}
</AlertDialog.Root>
