<script lang="ts">
  import FormScenarios from "./_components/form-scenarios.svelte";
</script>

<svelte:head>
  <title>Form Demo</title>
  <meta name="description" content="Form demo with dialog and sheet-based form scenarios." />
</svelte:head>

<div class="space-y-8 p-5">
  <section class="space-y-3">
    <div class="space-y-2">
      <h1 class="text-3xl font-semibold tracking-tight">Form components demo</h1>
      <p class="max-w-3xl text-sm text-muted-foreground">
        This page showcases focused form scenarios opened from buttons as dialogs and sheets.
      </p>
    </div>
  </section>

  <FormScenarios />
</div>
