<script lang="ts">
  import * as InputGroup from "$lib/components/ui/input-group/index.js";
  import type { AnyFieldApi } from "@tanstack/svelte-form";
  import { type ComponentProps } from "svelte";
  import type { InputGroupTextarea } from "../ui/input-group";
  import { i18n } from "$lib";
  import { cn } from "$lib/utils";
  import FieldContainer from "./field-container.svelte";
  import { watch } from "runed";
  import { createAsync } from "$lib/hooks/create-async.svelte";
  import { Spinner } from "../ui/spinner";

  type TextareaFieldProps = ComponentProps<typeof InputGroupTextarea> & {
    label?: string;
    description?: string;
    field: AnyFieldApi;
    required?: boolean;
    getInitialValueAsync?: () => Promise<string | undefined>;
  };

  let {
    label,
    description,
    field,
    class: className,
    required = false,
    getInitialValueAsync,
    ...props
  }: TextareaFieldProps = $props();

  const { t } = $derived(i18n);

  // svelte-ignore state_referenced_locally
  let count = $state(field.state.value.length as number);

  const action = createAsync(async () => {
    const initialValue = await getInitialValueAsync?.();
    if (initialValue) {
      field.handleChange(initialValue);
    }
  });

  // Derived state for validation UI
  const isInvalid = $derived(field.state.meta.isTouched && field.state.meta.errors.length > 0);

  watch(
    () => field.state.value,
    () => {
      count = field.state.value.length;
    }
  );

  $effect(() => {
    if (
      getInitialValueAsync &&
      field.form.options.defaultValues[field.name] === field.state.value
    ) {
      action.execute();
    }
  });
</script>

<FieldContainer {field} {label} {description} {required}>
  <InputGroup.Root>
    <InputGroup.Textarea
      id={field.name}
      name={field.name}
      value={field.state.value}
      onblur={field.handleBlur}
      oninput={(e) => {
        count = e.currentTarget.value.length;
        field.handleChange(e.currentTarget.value);
      }}
      class={cn("max-h-12 min-h-24 resize-none", className)}
      aria-invalid={isInvalid}
      {...props}
      disabled={(getInitialValueAsync && action.isLoading()) || props.disabled}
      placeholder={getInitialValueAsync && action.isLoading() ? undefined : props.placeholder}
    />

    {#if props.maxlength}
      <InputGroup.Addon align="block-end">
        <InputGroup.Text class="tabular-nums">
          {t("textarea-counter", {
            count,
            max: props.maxlength
          })}
        </InputGroup.Text>
      </InputGroup.Addon>
    {/if}

    {#if getInitialValueAsync && action.isLoading()}
      <InputGroup.Addon align="block-start">
        <Spinner />
        <span class="text-muted-foreground">{t("loading-dot")}</span>
      </InputGroup.Addon>
    {/if}
  </InputGroup.Root>
</FieldContainer>
