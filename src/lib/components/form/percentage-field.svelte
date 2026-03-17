<script lang="ts">
  import { cn, numberToString, stringToNumber } from "$lib/utils";
  import type { AnyFieldApi } from "@tanstack/svelte-form";
  import { maska } from "maska/svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import * as InputGroup from "$lib/components/ui/input-group/index.js";
  import FieldContainer from "./field-container.svelte";

  type PercentageFieldProps = HTMLAttributes<HTMLInputElement> & {
    label?: string;
    description?: string;
    field: AnyFieldApi;
    required?: boolean;
  };

  let {
    label,
    description,
    field,
    required = false,
    class: className,
    ...props
  }: PercentageFieldProps = $props();

  const isInvalid = $derived(field.state.meta.isTouched && field.state.meta.errors.length > 0);

  const handleInput = (e: Event & { currentTarget: HTMLInputElement }) => {
    let val = stringToNumber(e.currentTarget.value);

    if (!val) {
      field.handleChange(undefined);
      return;
    }

    // Enforce 0-100 range logic
    if (val > 100) val = 100;
    if (val < 0) val = 0;

    field.handleChange(val);
  };
</script>

<FieldContainer {field} {label} {description} {required}>
  <InputGroup.Root>
    <input
      id={field.name}
      name={field.name}
      value={numberToString(field.state.value)}
      oninput={handleInput}
      onblur={field.handleBlur}
      aria-invalid={isInvalid}
      autocomplete="off"
      data-slot="input-group-control"
      type="text"
      step={1}
      inputmode="numeric"
      use:maska={{
        mask: "Z#", // 'Z' is a custom token for 0-99, but we handle 100 in logic
        tokens: {
          Z: { pattern: /[0-9]/, multiple: true }
        },
        number: {
          fraction: 0,
          unsigned: true // Prevents negative signs
        }
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
      <InputGroup.Text>%</InputGroup.Text>
    </InputGroup.Addon>
  </InputGroup.Root>
</FieldContainer>
