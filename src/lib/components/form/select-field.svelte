<script lang="ts" generics="T">
  import { DotIcon } from "@lucide/svelte";
  import type { AnyFieldApi } from "@tanstack/svelte-form";
  import type { Snippet } from "svelte";
  import { i18n } from "$lib";
  import * as Select from "$lib/components/ui/select/index.js";
  import { cn } from "$lib/utils.js";
  import type { RenderSnippetConfig } from "../render.svelte";
  import Render from "../render.svelte";
  import FieldContainer from "./field-container.svelte";

  type Option<T> = {
    value: string;
    label: string;
    color?: string;
    render?: RenderSnippetConfig<T>;
    disabled?: boolean;
  };

  type SelectFieldProps<T> = {
    label?: string;
    description?: string;
    options?: Option<T>[];
    disabled?: boolean;
    placeholder?: string;
    class?: string;
    sm?: boolean;
    field: AnyFieldApi;
    formatValue?: (value: string) => unknown;
    right?: Snippet;
    required?: boolean;
  };

  const {
    label,
    description,
    placeholder,
    class: className,
    sm = false,
    options = [],
    disabled = false,
    field,
    formatValue = (value) => value.toString(),
    required = false,
    right
  }: SelectFieldProps<T> = $props();

  const { t } = $derived(i18n);
  const resolvedPlaceholder = $derived(placeholder ?? t("select-option"));
  const isInvalid = $derived(field.state.meta.isTouched && !field.state.meta.isValid);

  // Find selected option to display custom UI in the trigger
  const selectedOption = $derived(options.find((f) => f.value === String(field.state.value)));
</script>

<FieldContainer {field} {label} {description} {required}>
  <Select.Root
    type="single"
    bind:value={() => String(field.state.value), (v) => field.handleChange(formatValue(v))}
    {disabled}
  >
    <div class="flex items-center gap-2">
      <Select.Trigger
        id={field.name}
        aria-invalid={isInvalid}
        class={cn(
          "w-full justify-between",
          isInvalid && "border-destructive text-destructive",
          !field.state.value && "text-muted-foreground",
          sm && "h-7!",
          className
        )}
      >
        {#if selectedOption}
          <div class="line-clamp-1 flex items-center gap-2 truncate">
            {#if selectedOption.color}
              <DotIcon class={selectedOption.color} width={10} height={10} strokeWidth={20} />
            {/if}
            {selectedOption.label}
          </div>
        {:else}
          {resolvedPlaceholder}
        {/if}
      </Select.Trigger>
      {@render right?.()}
    </div>

    <Select.Content class="max-h-80 overflow-y-auto">
      {#each options as option (option.value)}
        <Select.Item value={option.value} label={option.label} disabled={option.disabled}>
          {#if option.render}
            <Render content={option.render} />
          {:else}
            <div class="flex items-center gap-2">
              {#if option.color}
                <DotIcon class={option.color} width={10} height={10} strokeWidth={20} />
              {/if}
              {option.label}
            </div>
          {/if}
        </Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>
</FieldContainer>
