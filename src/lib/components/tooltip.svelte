<script lang="ts">
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";

  const {
    class: className,
    trigger,
    children
  }: {
    class?: string;
    trigger?: Snippet;
    children: Snippet;
  } = $props();
</script>

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#if trigger}
        {@render trigger()}
      {:else}
        {@render children()}
      {/if}
    </Tooltip.Trigger>
    <Tooltip.Content class={cn(className)}>
      <p>{@render children()}</p>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
