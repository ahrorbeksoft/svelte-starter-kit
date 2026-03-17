<script lang="ts">
  import { cn, numberToString, stringToNumber } from "$lib/utils";
  import type { AnyFieldApi } from "@tanstack/svelte-form";
  import { maska } from "maska/svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import * as InputGroup from "$lib/components/ui/input-group/index.js";
  import FieldContainer from "./field-container.svelte";

  type CurrencyFieldProps = HTMLAttributes<HTMLInputElement> & {
    label?: string;
    description?: string;
    field: AnyFieldApi;
    required?: boolean;
  };

  let {
    label,
    description,
    field,
    class: className,
    required = false,
    ...props
  }: CurrencyFieldProps = $props();

  const isInvalid = $derived(field.state.meta.isTouched && field.state.meta.errors.length > 0);
</script>

<FieldContainer {field} {label} {description} {required}>
  <InputGroup.Root>
    <input
      id={field.name}
      name={field.name}
      value={numberToString(field.state.value)}
      oninput={(e) => field.handleChange(stringToNumber(e.currentTarget.value))}
      onblur={field.handleBlur}
      aria-invalid={isInvalid}
      autocomplete="off"
      step={1000}
      data-slot="input-group-control"
      type="text"
      inputmode="numeric"
      use:maska={{
        number: { locale: "ru", unsigned: true, fraction: 0 }
      }}
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
      <InputGroup.Text>so'm</InputGroup.Text>
    </InputGroup.Addon>
  </InputGroup.Root>
</FieldContainer>
