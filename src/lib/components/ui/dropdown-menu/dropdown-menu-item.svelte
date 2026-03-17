<script lang="ts" module>
  import { type VariantProps, tv } from "tailwind-variants";

  export const dropdownMenuItemVariants = tv({
    base: "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:ps-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground transition-colors cursor-pointer",
    variants: {
      variant: {
        default: "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        destructive:
          "text-destructive data-highlighted:bg-destructive/10 dark:data-highlighted:bg-destructive/20 data-highlighted:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive",
        warning:
          "text-yellow-600 dark:text-yellow-500 data-highlighted:bg-yellow-500/10 dark:data-highlighted:bg-yellow-500/20 data-highlighted:text-yellow-700 dark:data-highlighted:text-yellow-400 data-[variant=warning]:*:[svg]:!text-yellow-600",
        success:
          "text-emerald-600 dark:text-emerald-500 data-highlighted:bg-emerald-500/10 dark:data-highlighted:bg-emerald-500/20 data-highlighted:text-emerald-700 dark:data-highlighted:text-emerald-400 data-[variant=success]:*:[svg]:!text-emerald-600"
      },
      inset: {
        true: "ps-8"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  });

  export type DropdownMenuItemVariant = VariantProps<typeof dropdownMenuItemVariants>["variant"];
</script>

<script lang="ts">
  import { cn } from "$lib/utils.js";
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

  let {
    ref = $bindable(null),
    class: className,
    inset,
    variant = "default",
    ...restProps
  }: DropdownMenuPrimitive.ItemProps & {
    inset?: boolean;
    variant?: DropdownMenuItemVariant;
  } = $props();
</script>

<DropdownMenuPrimitive.Item
  bind:ref
  data-slot="dropdown-menu-item"
  data-inset={inset}
  data-variant={variant}
  class={cn(dropdownMenuItemVariants({ variant, inset }), className)}
  {...restProps}
/>
