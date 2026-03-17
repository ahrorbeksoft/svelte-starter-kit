<script lang="ts">
  import type { AnyFormApi } from "@tanstack/svelte-form";
  import type { Snippet } from "svelte";
  import * as Field from "$lib/components/ui/field/index.js";
  import type { HTMLFormAttributes } from "svelte/elements";

  type AppFormProps = HTMLFormAttributes & {
    children: Snippet;
    form: AnyFormApi;
    title?: string;
    description?: string;
    containerClass?: string;
  };

  const { children, form, title, description, containerClass, ...restProps }: AppFormProps =
    $props();
</script>

<form
  onsubmit={(e) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  }}
  {...restProps}
>
  <Field.Set>
    {#if title}
      <Field.Legend>{title}</Field.Legend>
    {/if}
    {#if description}
      <Field.Description>{description}</Field.Description>
    {/if}

    <Field.Group class={containerClass}>
      {@render children()}
    </Field.Group>
  </Field.Set>
</form>
