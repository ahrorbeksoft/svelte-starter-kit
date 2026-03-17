<script lang="ts">
  import { cn } from "$lib/utils";
  import type { AnyFieldApi } from "@tanstack/svelte-form";
  import { maska } from "maska/svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import FieldContainer from "./field-container.svelte";

  type PhoneFieldProps = HTMLAttributes<HTMLInputElement> & {
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
    sm,
    required = false,
    class: className,
    ...props
  }: PhoneFieldProps = $props();

  // Derived state for validation UI
  const isInvalid = $derived(field.state.meta.isTouched && field.state.meta.errors.length > 0);
  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();

    // 1. Get clipboard text and strip everything except digits
    const pastedData = e.clipboardData?.getData("text") || "";
    const digits = pastedData.replace(/\D/g, "");

    // 2. Extract the last 9 digits (the core Uzbek number)
    const lastNine = digits.slice(-9);

    if (lastNine.length === 9) {
      // 3. Manually construct the formatted string
      const area = lastNine.substring(0, 2);
      const mid = lastNine.substring(2, 5);
      const tail1 = lastNine.substring(5, 7);
      const tail2 = lastNine.substring(7, 9);

      const formatted = `+998 (${area}) ${mid}-${tail1}-${tail2}`;

      // 4. Update the form state directly
      field.handleChange(formatted);
    }
  };
</script>

<FieldContainer {field} {label} {description} {required}>
  <input
    class={cn(
      "flex h-9 w-full min-w-0 rounded-md border border-input bg-background px-3 py-1 text-base shadow-xs ring-offset-background transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
      "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
      "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
      sm && "h-7",
      className
    )}
    id={field.name}
    name={field.name}
    value={field.state.value}
    oninput={(e) => field.handleChange(e.currentTarget.value)}
    onblur={field.handleBlur}
    aria-invalid={isInvalid}
    autocomplete="off"
    onpaste={handlePaste}
    placeholder="+998 (__) ___-__-__"
    use:maska={"+998 (##) ###-##-##"}
    {...props}
  />
</FieldContainer>
