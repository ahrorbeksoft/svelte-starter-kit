<script lang="ts" generics="T">
  import CheckIcon from "@lucide/svelte/icons/check";
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";
  import { type Snippet } from "svelte";
  import type { AnyFieldApi } from "@tanstack/svelte-form";
  import { SvelteSet } from "svelte/reactivity";
  import { i18n } from "$lib";
  import FieldContainer from "./field-container.svelte";
  import type { RenderSnippetConfig } from "../render.svelte";
  import Render from "../render.svelte";

  type Option<T> = {
    value: string;
    label: string | Snippet;
    disabled?: boolean;
    render?: RenderSnippetConfig<T>;
  };

  type Props<T> = {
    options: Option<T>[];
    field: AnyFieldApi;
    label?: string;
    placeholder?: string;
    searchable?: boolean;
    searchText?: string;
    emptyText?: string;
    disabled?: boolean;
    description?: string;
    renderSelected?: Snippet<[string[]]>;
    class?: string;
    sm?: boolean;
    required?: boolean;
  };

  let {
    options = [],
    field,
    label,
    description,
    placeholder,
    searchable = true,
    searchText,
    emptyText,
    disabled = false,
    sm = false,
    renderSelected,
    class: className,
    required = false
  }: Props<T> = $props();

  // Svelte 5 State
  let open = $state(false);
  let triggerRef = $state<HTMLButtonElement>(null!);
  let triggerWidth = $state(0);

  // Derived values for validation and selection
  const selectedValues = $derived(new Set(field.state.value as string[]));

  const { t } = $derived(i18n);
  const resolvedPlaceholder = $derived(placeholder ?? t("select-options"));
  const resolvedSearchText = $derived(searchText ?? t("search-options"));
  const resolvedEmptyText = $derived(emptyText ?? t("no-options-left"));

  const isInvalid = $derived(field.state.meta.isTouched && !!field.state.meta.errors.length);

  function handleSelect(currentValue: string, isSelected: boolean) {
    const updatedValues = new SvelteSet(selectedValues);
    if (isSelected) {
      updatedValues.delete(currentValue);
    } else {
      updatedValues.add(currentValue);
    }

    const filterValue = updatedValues.size ? Array.from(updatedValues) : undefined;

    field.handleChange(filterValue);
  }

  function handleClear() {
    field.handleChange([]);
  }
</script>

<FieldContainer {field} {label} {description} {required}>
  <Popover.Root bind:open>
    <Popover.Trigger bind:ref={triggerRef}>
      {#snippet child({ props })}
        <div bind:clientWidth={triggerWidth} class="w-full">
          <Button
            {...props}
            variant="outline"
            {disabled}
            class={cn(
              "w-full justify-between px-3 font-normal",
              selectedValues.size > 0 ? "text-foreground" : "text-muted-foreground",
              isInvalid && "border-destructive text-destructive",
              sm && "h-7",
              className
            )}
            role="combobox"
            aria-expanded={open}
          >
            <span class="truncate">
              {#if renderSelected}
                {@render renderSelected(Array.from(selectedValues))}
              {:else if selectedValues.size > 0}
                {t("items-selected", { count: selectedValues.size })}
              {:else}
                {resolvedPlaceholder}
              {/if}
            </span>
            <ChevronDownIcon size={16} class="opacity-50" />
          </Button>
        </div>
      {/snippet}
    </Popover.Trigger>

    <Popover.Content class="p-0" style="width: {triggerWidth}px" align="start">
      <Command.Root>
        {#if searchable}
          <Command.Input placeholder={resolvedSearchText} />
        {/if}
        <Command.List>
          <Command.Empty>{resolvedEmptyText}</Command.Empty>
          <Command.Group>
            {#each options as option, index (index)}
              {@const isSelected = selectedValues.has(option.value)}
              <Command.Item
                value={option.value}
                disabled={option.disabled}
                onSelect={() => handleSelect(option.value, isSelected)}
              >
                <div
                  class={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  )}
                >
                  <CheckIcon class="text-primary-foreground" size={12} />
                </div>
                {#if option.render}
                  <Render content={option.render} />
                {:else if typeof option.label === "string"}
                  {option.label}
                {:else}
                  {@render option.label()}
                {/if}
              </Command.Item>
            {/each}
          </Command.Group>

          {#if selectedValues.size > 0}
            <Command.Separator />
            <Command.Group>
              <Command.Item onSelect={handleClear} class="justify-center text-center">
                {t("clear")}
              </Command.Item>
            </Command.Group>
          {/if}
        </Command.List>
      </Command.Root>
    </Popover.Content>
  </Popover.Root>
</FieldContainer>
