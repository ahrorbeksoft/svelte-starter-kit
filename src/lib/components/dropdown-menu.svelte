<script lang="ts" module>
  import type { DropdownMenuItemVariant } from "$lib/components/ui/dropdown-menu/dropdown-menu-item.svelte";
  import type { ConfirmParams } from "$lib/components/ui/alert-dialog";
  import { Icon as IconType } from "@lucide/svelte";
  import type { Component, Snippet } from "svelte";
  import { type VariantProps } from "tailwind-variants";

  export type DropdownMenuItem<T> =
    | {
        sep?: undefined;
        label: Snippet | string;
        icon?: Component | typeof IconType;
        iconClass?: string;
        confirm?: ConfirmParams;
        disabled?: boolean;
        class?: string;
        variant?: DropdownMenuItemVariant;
        onclick: (data: T) => void | Promise<void>;
      }
    | {
        sep?: true;
        label?: undefined;
        icon?: undefined;
        iconClass?: undefined;
        confirm?: undefined;
        disabled?: undefined;
        class?: string;
        onclick?: undefined;
        variant?: undefined;
      };

  export type DropdownMenuItems<T> = DropdownMenuItem<T>[];

  export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
  export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

  export type DropdownMenuProps<T> = {
    trigger:
      | {
          label?: string;
          icon?: Component | typeof IconType;
          class?: string;
          variant?: ButtonVariant;
          size?: ButtonSize;
        }
      | undefined;
    label?: string;
    contentAlign?: "start" | "center" | "end";
    onItemClick?: () => void;
    srLabel?: string;
    data: T;
    items: DropdownMenuItem<T>[];
  };
</script>

<script lang="ts" generics="T">
  import { getConfirm } from "$lib/components/ui/alert-dialog";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { EllipsisIcon } from "@lucide/svelte";

  import { buttonVariants } from "./ui/button";
  import { cn } from "$lib/utils";
  import { getTranslations } from "@sveltebase/i18n";
  const confirm = getConfirm();
  const t = getTranslations();

  const {
    trigger,
    items,
    label,
    contentAlign = "end",
    onItemClick,
    data,
    srLabel
  }: DropdownMenuProps<T> = $props();
  const resolvedSrLabel = $derived(srLabel ?? t("open-menu"));
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger
    class={cn(
      buttonVariants({ variant: trigger?.variant ?? "ghost", size: trigger?.size }),
      trigger?.class
    )}
  >
    <span class="sr-only">{resolvedSrLabel}</span>
    {#if trigger?.icon}
      {@const Icon = trigger?.icon}
      <Icon class="h-4 w-4" />
    {:else}
      <EllipsisIcon class="h-4 w-4" />
    {/if}
    {#if trigger?.label}
      {trigger?.label}
    {/if}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align={contentAlign}>
    {#if label}
      <DropdownMenu.Label>{label}</DropdownMenu.Label>
      <DropdownMenu.Separator />
    {/if}
    {#each items as item, index (index)}
      {#if item.sep}
        <DropdownMenu.Separator />
      {:else}
        <DropdownMenu.Item
          class={cn("flex items-center gap-2", item.class)}
          variant={item.variant}
          onclick={async () => {
            if (item.confirm) {
              const confirmed = await confirm(item.confirm);
              if (confirmed) {
                await item.onclick?.(data);
              }
            } else {
              await item.onclick?.(data);
            }

            onItemClick?.();
          }}
        >
          {#if item.icon}
            <item.icon class={cn("h-4 w-4", item.iconClass)} />
          {/if}
          {#if typeof item.label === "string"}
            {item.label}
          {:else}
            {@render item.label?.()}
          {/if}
        </DropdownMenu.Item>
      {/if}
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
