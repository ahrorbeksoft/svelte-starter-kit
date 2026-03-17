<script lang="ts">
  import { auth } from "$lib/db";
  import Login from "./_components/login.svelte";
  const { children } = $props();
</script>

{#if auth.user}
  {@render children()}
{:else}
  <Login />
{/if}
