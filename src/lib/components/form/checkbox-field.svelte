<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox";
  import type { AnyFieldApi } from "@tanstack/svelte-form";
  import type { ComponentProps } from "svelte";
  import { extract } from "runed";
  import { id } from "@instantdb/core";
  import FieldContainer from "./field-container.svelte";
  import { Label } from "$lib/components/ui/label";
  import { cn } from "$lib/utils";

  type CheckboxProps = ComponentProps<typeof Checkbox> & {
    label?: string;
    description?: string;
    field: AnyFieldApi;
  };

  let { label, description, field, required = false, ...props }: CheckboxProps = $props();

  const uniqueId = extract(() => props.id, id());
</script>

<FieldContainer {field} {description} {required}>
  {#if label}
    <div class="flex items-center gap-3">
      <Checkbox
        id={uniqueId}
        class="cursor-pointer"
        checked={field.state.value}
        onCheckedChange={(value) => field.handleChange(value)}
        {...props}
      />
      <Label
        for={uniqueId}
        class={cn(
          "cursor-pointer",
          required && "after:-ml-2 after:text-red-500 after:content-['*']"
        )}>{label}</Label
      >
    </div>
  {/if}
</FieldContainer>
