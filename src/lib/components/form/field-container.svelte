<script lang="ts">
  import * as Field from "$lib/components/ui/field/index.js";
  import { cn } from "$lib/utils";
  import type { AnyFieldApi } from "@tanstack/svelte-form";
  import type { Snippet } from "svelte";

  type ContainerProps = {
    label?: string;
    description?: string;
    field: AnyFieldApi;
    children: Snippet;
    hideErrors?: boolean;
    required?: boolean;
  };

  const {
    label,
    description,
    field,
    children,
    hideErrors = false,
    required = false
  }: ContainerProps = $props();
  const isInvalid = $derived(field.state.meta.isTouched && !field.state.meta.isValid);
</script>

<Field.Field data-invalid={isInvalid}>
  {#if label}
    <Field.Label
      for={field.name}
      class={cn(required && "after:-ml-2 after:text-red-500 after:content-['*']")}
      >{label}</Field.Label
    >
  {/if}
  {@render children()}
  {#if description && !isInvalid}
    <Field.Description>{description}</Field.Description>
  {/if}
  {#if isInvalid && !hideErrors}
    <Field.Error errors={field.state.meta.errors} />
  {/if}
</Field.Field>
