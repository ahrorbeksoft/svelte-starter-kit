<script lang="ts">
  import { cn } from "$lib/utils";
  import { Spinner } from "./ui/spinner";

  const { class: className }: { class?: string } = $props();
</script>

<div class={cn("flex items-center justify-center", className)}>
  <Spinner class="h-10 w-10 text-primary" />
</div>
