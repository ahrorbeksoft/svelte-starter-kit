<script lang="ts">
  import type { Snippet } from "svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import * as ScrollArea from "$lib/components/ui/scroll-area/index.js";
  import { cn } from "$lib/utils";
  import { IsMobile } from "$lib/hooks/is-mobile.svelte";

  type ModalProps = {
    title?: string;
    description?: string;
    containerClass?: string;
    open: boolean;
    children: Snippet;
    mode: "dialog" | "sheet";
  };

  let {
    title,
    description,
    containerClass,
    open = $bindable(),
    children,
    mode
  }: ModalProps = $props();

  const isMobile = new IsMobile();
</script>

{#if mode === "dialog"}
  <Dialog.Root {open} onOpenChange={(o) => (open = o)}>
    <Dialog.Content class={cn("sm:max-w-106.25", containerClass)}>
      {#if title || description}
        <Dialog.Header>
          {#if title}
            <Dialog.Title>{title}</Dialog.Title>
          {/if}
          {#if description}
            <Dialog.Description>{description}</Dialog.Description>
          {/if}
        </Dialog.Header>
      {/if}
      {@render children()}
    </Dialog.Content>
  </Dialog.Root>
{:else if isMobile.current}
  <Drawer.Root bind:open>
    <Drawer.Content class={cn("min-h-[96vh]", containerClass)}>
      {#if title || description}
        <Drawer.Header class="text-center">
          {#if title}
            <Drawer.Title class="text-xl font-bold">{title}</Drawer.Title>
          {/if}
          {#if description}
            <Drawer.Description>{description}</Drawer.Description>
          {/if}
        </Drawer.Header>
      {/if}
      <ScrollArea.Root class="h-[calc(100vh-119px)]">
        <div class="px-5 pb-5">
          {@render children()}
        </div>
        <ScrollArea.Scrollbar orientation="vertical" />
      </ScrollArea.Root>
    </Drawer.Content>
  </Drawer.Root>
{:else}
  <Sheet.Root {open} onOpenChange={(o) => (open = o)}>
    <Sheet.Content class={cn("p-0", containerClass)}>
      {#if title || description}
        <Sheet.Header class="p-4 pb-0">
          {#if title}
            <Sheet.Title>
              {title}
            </Sheet.Title>
          {/if}
        </Sheet.Header>
      {/if}
      <ScrollArea.Root class="h-[calc(100vh-62px)]">
        {#if description}
          <Sheet.Description class="px-4 pb-4">
            {description}
          </Sheet.Description>
        {/if}

        <div class="px-4 pb-4">
          {@render children()}
        </div>
        <ScrollArea.Scrollbar orientation="vertical" />
      </ScrollArea.Root>
    </Sheet.Content>
  </Sheet.Root>
{/if}
