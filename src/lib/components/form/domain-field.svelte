<script lang="ts">
  import * as InputGroup from "$lib/components/ui/input-group/index.js";
  import { cn } from "$lib/utils";
  import type { AnyFieldApi } from "@tanstack/svelte-form";
  import FieldContainer from "./field-container.svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { maska } from "maska/svelte";

  type DomainFieldProps = HTMLAttributes<HTMLInputElement> & {
    label?: string;
    description?: string;
    field: AnyFieldApi;
    required?: boolean;
    disabled?: boolean;
  };

  let {
    label,
    description,
    field,
    class: className,
    required = false,
    disabled = false,
    ...props
  }: DomainFieldProps = $props();

  // Derived state for validation UI
  const isInvalid = $derived(field.state.meta.isTouched && field.state.meta.errors.length > 0);
</script>

<FieldContainer {field} {label} {description} {required}>
  <InputGroup.Root>
    <input
      id={field.name}
      name={field.name}
      oninput={(e) => {
        field.handleChange(e.currentTarget.value);
      }}
      onblur={field.handleBlur}
      value={field.state.value}
      aria-invalid={isInvalid}
      autocomplete="off"
      data-slot="input-group-control"
      type="text"
      use:maska={{
        mask: "A",
        tokens: {
          A: { pattern: /[a-z0-9-]/, repeated: true }
        },
        preProcess: (val) => {
          return val
            .toLowerCase()
            .replace(/^\s+/, "") // 1. Ignore leading spaces
            .replace(/^-+/, "") // 2. Ignore leading hyphens
            .replace(/\s+/g, "-") // 3. Convert middle spaces to hyphens
            .replace(/-{2,}/g, "-"); // 4. Prevent double hyphens (optional)
        }
      }}
      {disabled}
      class={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-input bg-background px-3 py-1 text-base shadow-xs ring-offset-background transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent",
        className
      )}
      {...props}
    />
    <InputGroup.Addon align="inline-end">
      <InputGroup.Text>.1lc.uz</InputGroup.Text>
    </InputGroup.Addon>
  </InputGroup.Root>
</FieldContainer>
