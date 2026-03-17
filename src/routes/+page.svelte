<script lang="ts">
  import { goto } from "$app/navigation";
  import LoadingView from "$lib/components/loading-view.svelte";
  import { route } from "$lib/ROUTES";

  $effect(() => {
    goto(route("/demo"));
  });
</script>

<LoadingView class="h-screen w-screen" />
