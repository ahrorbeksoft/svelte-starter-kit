<script lang="ts">
  import Navbar from "$lib/components/navbar.svelte";
  import * as ScrollArea from "$lib/components/ui/scroll-area";
  import { route } from "$lib/ROUTES";

  const { children } = $props();
</script>

<div>
  <ScrollArea.Root class="h-screen w-screen overflow-hidden">
    <Navbar
      menuLinks={[
        { href: route("/demo"), label: "Todo Demo" },
        { href: route("/demo/form"), label: "Form" }
      ]}
    />
    <div>
      {@render children()}
    </div>
    <ScrollArea.Scrollbar orientation="vertical" />
    <ScrollArea.Scrollbar orientation="horizontal" />
  </ScrollArea.Root>
</div>
