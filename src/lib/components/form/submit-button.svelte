<script lang="ts">
  import type { ButtonProps } from "$lib/components/ui/button/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Spinner } from "$lib/components/ui/spinner/index.js";
  import type { Form } from "./types";

  type SubmitButtonProps = Omit<ButtonProps, "form"> & {
    label?: string;
    loadingLabel?: string;
    form: Form;
  };

  const { label, loadingLabel, form, ...props }: SubmitButtonProps = $props();
</script>

<form.Subscribe selector={(state) => state.isSubmitting}>
  {#snippet children(isSubmitting)}
    <Button type="submit" disabled={isSubmitting} {...props}>
      {#if loadingLabel && isSubmitting}
        <Spinner /> {loadingLabel}
      {:else}
        {label}
      {/if}
    </Button>
  {/snippet}
</form.Subscribe>
