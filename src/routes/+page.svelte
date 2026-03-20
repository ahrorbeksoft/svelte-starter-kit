<script lang="ts">
  import { goto } from "$app/navigation";
  import LoadingView from "$lib/components/loading-view.svelte";
  import Navbar from "$lib/components/navbar.svelte";
  import { route } from "$lib/ROUTES";
  import { getTranslations } from "@sveltebase/i18n";

  // $effect(() => {
  //   goto(route("/demo"));
  // });

  const t = getTranslations();
</script>

<Navbar />

{t("cancel")}

<!-- <LoadingView class="h-screen w-screen" /> -->
