<script lang="ts" generics="T">
  import { DotIcon } from "@lucide/svelte";
  import CheckIcon from "@lucide/svelte/icons/check";
  import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
  import type { AnyFieldApi } from "@tanstack/svelte-form";
  import { tick } from "svelte";
  import { i18n } from "$lib";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { cn } from "$lib/utils.js";
  import type { RenderSnippetConfig } from "../render.svelte";
  import Render from "../render.svelte";
  import FieldContainer from "./field-container.svelte";
  import { getTranslations } from "@sveltebase/i18n";

  type Option<T> = {
    value: string;
    label: string;
    color?: string;
    render?: RenderSnippetConfig<T>;
    disabled?: boolean;
  };

  type ContainerProps<T> = {
    label?: string;
    description?: string;
    options?: Option<T>[];
    disabled?: boolean;
    placeholder?: string;
    searchText?: string;
    notFoundText?: string;
    class?: string;
    sm?: boolean;
    field: AnyFieldApi;
    required?: boolean;
  };

  const {
    label,
    description,
    placeholder,
    searchText,
    notFoundText,
    class: className,
    sm = false,
    options = [],
    disabled = false,
    field,
    required = false
  }: ContainerProps<T> = $props();
  const isInvalid = $derived(field.state.meta.isTouched && !field.state.meta.isValid);
  const t = getTranslations();
  const resolvedPlaceholder = $derived(placeholder ?? t("select-option"));
  const resolvedSearchText = $derived(searchText ?? t("search-options"));
  const resolvedNotFoundText = $derived(notFoundText ?? t("no-options-left"));

  let open = $state(false);
  let triggerRef = $state<HTMLButtonElement>(null!);
  let triggerWidth = $state(0);

  const selectedOption = $derived(options.find((f) => f.value === field.state.value));

  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
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
            aria-invalid={isInvalid}
            {disabled}
            class={cn("w-full justify-between", sm && "h-7", className)}
            role="combobox"
            aria-expanded={open}
          >
            <span class={cn("truncate", !field.state.value && "text-muted-foreground")}>
              {#if selectedOption}
                <div class="flex items-center gap-2">
                  {#if selectedOption.color}
                    <DotIcon
                      className={selectedOption.color}
                      width={10}
                      height={10}
                      strokeWidth={20}
                    />
                  {/if}
                  {selectedOption.label}
                </div>
              {:else}
                {resolvedPlaceholder}
              {/if}
            </span>
            <ChevronsUpDownIcon class="opacity-50" />
          </Button>
        </div>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-full p-0">
      <Command.Root class="w-full" style="width: {triggerWidth}px;">
        <Command.Input placeholder={resolvedSearchText} />
        <Command.List>
          <Command.Empty>{resolvedNotFoundText}</Command.Empty>
          <Command.Group value="options">
            {#each options as option (option.value)}
              <Command.Item
                disabled={!!option.disabled}
                onSelect={() => {
                  field.handleChange(option.value);
                  closeAndFocusTrigger();
                }}
              >
                <CheckIcon class={cn(field.state.value !== option.value && "text-transparent")} />
                {#if option.render}
                  <Render content={option.render} />
                {:else}
                  {option.label}
                {/if}
              </Command.Item>
            {/each}
          </Command.Group>
        </Command.List>
      </Command.Root>
    </Popover.Content>
  </Popover.Root>
</FieldContainer>
