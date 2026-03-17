<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
  import type { AnyFieldApi } from "@tanstack/svelte-form";
  import type { ComponentProps } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { MinusIcon, PlusIcon } from "@lucide/svelte";
  import FieldContainer from "./field-container.svelte";

  type NumberFieldProps = ComponentProps<typeof Input> & {
    label?: string;
    description?: string;
    min?: number;
    max?: number;
    step?: number;
    field: AnyFieldApi;
    required?: boolean;
  };

  let {
    label,
    description,
    field,
    min = 0,
    max = 100,
    step = 1,
    required = false,
    ...props
  }: NumberFieldProps = $props();

  const decrease = () => {
    field.setValue((prevValue: number) => Math.max(min, prevValue - step));
  };

  const increase = () => {
    field.setValue((prevValue: number) => Math.min(max, prevValue + step));
  };
</script>

<FieldContainer {field} {label} {description} {required}>
  <div class="flex items-center">
    <Button
      type="button"
      onclick={decrease}
      size="icon"
      variant="outline"
      class="w-10 rounded-r-none border-r-0 shadow-none"
    >
      <MinusIcon className="h-4 w-4" />
    </Button>
    <Input
      id={field.name}
      type="number"
      class="pointer-events-none h-9 w-12 [appearance:textfield] rounded-none border-x-0 p-0 text-center text-sm focus-visible:ring-0
            focus-visible:ring-offset-0 focus-visible:outline-hidden [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      value={field.state.value}
      readonly
      {min}
      {max}
      {step}
      {...props}
    />
    <Button
      type="button"
      onclick={increase}
      size="icon"
      variant="outline"
      class="w-10 rounded-l-none border-l-0 shadow-none"
    >
      <PlusIcon className="h-4 w-4" />
    </Button>
  </div>
</FieldContainer>
