<script lang="ts" module>
  import { cn, type WithElementRef } from "$lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";
  import { type VariantProps, tv } from "tailwind-variants";

  export const fixedLayoutVariants = tv({
    base: "fixed left-0 right-0 z-50", // Added z-50 for typical fixed layout behavior
    variants: {
      vertical: {
        top: "top-0",
        bottom: "bottom-0 pb-(--tgui--safe_area_inset_bottom)"
      }
    },
    defaultVariants: {
      vertical: "bottom"
    }
  });
  export type FixedLayoutVariant = VariantProps<typeof fixedLayoutVariants>["vertical"];
  export type FixedLayoutProps = WithElementRef<HTMLAttributes<HTMLElement>> & {
    vertical?: FixedLayoutVariant;
    component?: string;
    children?: import("svelte").Snippet;
  };
</script>

<script lang="ts">
  let {
    class: className,
    vertical = "bottom",
    component = "div",
    ref = $bindable(null),
    children,
    ...restProps
  }: FixedLayoutProps = $props();
</script>

<svelte:element
  this={component}
  bind:this={ref}
  class={cn(fixedLayoutVariants({ vertical }), className)}
  {...restProps}
>
  {@render children?.()}
</svelte:element>
