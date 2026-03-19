<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { scenarioCards } from "./form-demo-data";
  import MediaIntakeDialog from "./media-intake-dialog.svelte";
  import QuickContactDialog from "./quick-contact-dialog.svelte";
  import SchedulingSheet from "./scheduling-sheet.svelte";
  import WorkspaceOnboardingSheet from "./onboarding-sheet.svelte";

  let contactOpen = $state(false);
  let onboardingOpen = $state(false);
  let schedulingOpen = $state(false);
  let mediaOpen = $state(false);

  type ScenarioId = (typeof scenarioCards)[number]["id"];

  function openScenario(id: ScenarioId) {
    if (id === "dialog-contact") {
      contactOpen = true;
      return;
    }

    if (id === "sheet-profile") {
      onboardingOpen = true;
      return;
    }

    if (id === "sheet-schedule") {
      schedulingOpen = true;
      return;
    }

    if (id === "dialog-media") {
      mediaOpen = true;
    }
  }

  function getButtonVariant(id: ScenarioId): "default" | "outline" | "secondary" {
    if (id === "dialog-contact") return "default";
    if (id === "sheet-schedule") return "secondary";
    return "outline";
  }

  function getButtonLabel(id: ScenarioId) {
    if (id === "dialog-contact") return "Open quick contact dialog";
    if (id === "sheet-profile") return "Open onboarding sheet";
    if (id === "sheet-schedule") return "Open scheduling sheet";
    return "Open media intake dialog";
  }
</script>

<div class="space-y-4">
  <div class="space-y-2">
    <h2 class="text-xl font-semibold tracking-tight">Modal and sheet scenarios</h2>
    <p class="max-w-3xl text-sm text-muted-foreground">
      Use these buttons to preview different form experiences. The demo mixes compact dialogs and
      larger sheets so you can compare how the same shared form system behaves across layouts.
    </p>
  </div>

  <div class="grid gap-4 md:grid-cols-2">
    {#each scenarioCards as scenario (scenario.id)}
      <section class="rounded-2xl border bg-card p-4 text-card-foreground shadow-sm">
        <div class="space-y-3">
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1">
              <h3 class="leading-none font-medium">{scenario.title}</h3>
              <p class="text-sm text-muted-foreground">{scenario.description}</p>
            </div>

            <span
              class="shrink-0 rounded-full border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground capitalize"
            >
              {scenario.mode}
            </span>
          </div>

          <Button
            variant={getButtonVariant(scenario.id)}
            onclick={() => {
              openScenario(scenario.id);
            }}
          >
            {getButtonLabel(scenario.id)}
          </Button>
        </div>
      </section>
    {/each}
  </div>
</div>

<QuickContactDialog bind:open={contactOpen} />
<WorkspaceOnboardingSheet bind:open={onboardingOpen} />
<SchedulingSheet bind:open={schedulingOpen} />
<MediaIntakeDialog bind:open={mediaOpen} />
