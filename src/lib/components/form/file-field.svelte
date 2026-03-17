<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
  import { cn } from "$lib/utils";
  import type { AnyFieldApi } from "@tanstack/svelte-form";
  import type { ComponentProps } from "svelte";
  import FieldContainer from "./field-container.svelte";

  type FileFieldProps = ComponentProps<typeof Input> & {
    label?: string;
    description?: string;
    field: AnyFieldApi;
    sm?: boolean;
    required?: boolean;
  };

  let {
    label,
    description,
    field,
    sm = false,
    class: className,
    required = false,
    ...props
  }: FileFieldProps = $props();

  // Derived state for validation UI
  const isInvalid = $derived(field.state.meta.isTouched && field.state.meta.errors.length > 0);
</script>

<FieldContainer {field} {label} {description} {required}>
  <Input
    id={field.name}
    type="file"
    name={field.name}
    onchange={(e) => field.handleChange(e.currentTarget.files?.[0])}
    onblur={field.handleBlur}
    aria-invalid={isInvalid}
    autocomplete="off"
    class={cn(sm && "h-7", className)}
    {...props}
  />
</FieldContainer>
