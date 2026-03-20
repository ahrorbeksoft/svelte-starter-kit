<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import { ModeWatcher } from "mode-watcher";
  import { Toaster } from "$lib/components/ui/sonner";
  import { IsMobile } from "$lib/hooks/is-mobile.svelte";
  import { RenderScan } from "svelte-render-scan";
  import { i18n } from "$lib";
  import { QueryClient } from "@tanstack/svelte-query";
  import { dev, browser } from "$app/environment";
  import { PersistQueryClientProvider } from "@tanstack/svelte-query-persist-client";
  import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
  import { AlertDialogProvider } from "$lib/components/ui/alert-dialog/index.js";
  import { siteTitle } from "$lib/constants.js";
  import { auth } from "$lib/db";

  let { children, data } = $props();

  const isMobile = new IsMobile();

  // svelte-ignore state_referenced_locally
  i18n.init(data.cookies);
  // svelte-ignore state_referenced_locally
  auth.init(data.user);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser
      }
    }
  });

  const persister = createAsyncStoragePersister({
    storage: browser ? window.localStorage : null
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <script src="https://telegram.org/js/telegram-web-app.js?59"></script>
  <title>{siteTitle}</title>
</svelte:head>

{#if dev}
  <RenderScan />
{/if}

<ModeWatcher />

<Toaster
  richColors
  duration={1000}
  position={isMobile.current ? "bottom-center" : "bottom-right"}
/>

<PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
  <AlertDialogProvider>
    {@render children()}
  </AlertDialogProvider>
</PersistQueryClientProvider>
