<script lang="ts">
  import type { AnyFieldApi } from "@tanstack/svelte-form";
  import { parseTime } from "@internationalized/date";
  import { TimeField } from "bits-ui";
  import { i18n } from "$lib";
  import { cn } from "$lib/utils";
  import FieldContainer from "./field-container.svelte";

  type TimeFieldProps = TimeField.InputProps & {
    label?: string;
    description?: string;
    hideErrors?: boolean;
    field: AnyFieldApi;
    sm?: boolean;
    required?: boolean;
  };

  let {
    label,
    description,
    field,
    hideErrors = false,
    sm = false,
    class: className,
    required = false,
    ...props
  }: TimeFieldProps = $props();

  // Derived state for validation UI
  const isInvalid = $derived(field.state.meta.isTouched && field.state.meta.errors.length > 0);
</script>

<FieldContainer {field} {label} {description} {required} {hideErrors}>
  <TimeField.Root
    locale={i18n.locale}
    value={field.state.value ? parseTime(field.state.value) : undefined}
    onValueChange={(time) => {
      if (time) {
        field.handleChange(time.toString());
      }
    }}
  >
    <TimeField.Input
      id={field.name}
      aria-invalid={isInvalid}
      class={cn(
        "flex h-10 items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        sm && "h-7 text-sm",
        className
      )}
      {...props}
    >
      {#snippet children({ segments })}
        {#each segments as { part, value }, i (part + i)}
          {#if part === "literal"}
            <TimeField.Segment {part} class="px-0.5 text-muted-foreground">
              {value}
            </TimeField.Segment>
          {:else}
            <TimeField.Segment
              {part}
              class="py-0.5: rounded-sm px-0.5 tabular-nums focus:bg-accent focus:text-accent-foreground focus:outline-none data-invalid:text-destructive"
            >
              {value}
            </TimeField.Segment>
          {/if}
        {/each}
      {/snippet}
    </TimeField.Input>
  </TimeField.Root>
</FieldContainer>
