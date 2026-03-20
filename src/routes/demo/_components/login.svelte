<script lang="ts">
  import { AppForm, TextField } from "$lib/components/form";
  import SubmitButton from "$lib/components/form/submit-button.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Spinner } from "$lib/components/ui/spinner";
  import { auth, db } from "$lib/db";
  import { createAsync, tryCatch } from "@sveltebase/utils";
  import { createForm } from "@tanstack/svelte-form";
  import z from "zod";

  const schema = z
    .object({
      email: z.email("Email is invalid"),
      isSent: z.boolean(),
      code: z.string()
    })
    .superRefine((data, ctx) => {
      if (!data.email || !data.isSent) return;

      if (!data.code) {
        ctx.addIssue({ code: "custom", message: "Please enter the verification code." });
      }

      if (data.code.length !== 6) {
        ctx.addIssue({ code: "custom", message: "Verification code must be 6 digits." });
      }
    });

  const form = createForm(() => ({
    defaultValues: {
      email: "",
      isSent: false,
      code: ""
    } as z.infer<typeof schema>,
    validators: {
      onSubmit: schema
    },
    onSubmit: async ({ value }) => {
      await tryCatch(async () => {
        await db.auth.signInWithMagicCode({ code: value.code, email: value.email });
      });
    }
  }));

  const sendCode = createAsync(async () => {
    await form.validateField("email", "submit");
    const errors = form.getFieldMeta("email")?.errors ?? [];
    if (errors.length > 0) return { error: errors[0].message };
    const email = form.getFieldValue("email");
    await db.auth.sendMagicCode({ email });
    form.setFieldValue("isSent", true);
    return { success: "Verification code sent." };
  });
</script>

<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
  <div class="w-full max-w-md rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
    {#if auth.user}
      <div class="space-y-4">
        <div class="space-y-1">
          <h2 class="text-xl font-semibold">You are signed in</h2>
          <p class="text-sm text-muted-foreground">
            Logged in as <span class="font-medium text-foreground">{auth.user.email}</span>
          </p>
        </div>

        <Button
          class="w-full"
          onclick={async () => {
            await db.auth.signOut();
          }}
        >
          sign out
        </Button>
      </div>
    {:else}
      <AppForm {form} title="Login" class="min-w-sm">
        <form.Subscribe selector={(state) => state.values.isSent}>
          {#snippet children(isSent)}
            {#if isSent}
              <p class="text-sm text-muted-foreground">
                Enter the verification code we sent to your email ({form.getFieldValue("email")}).
              </p>
              <form.Field name="code">
                {#snippet children(field)}
                  <TextField
                    {field}
                    class="text-center"
                    placeholder="Enter your the code"
                    disabled={!isSent}
                  />
                {/snippet}
              </form.Field>
              <SubmitButton {form} label="Verify code" loadingLabel="Verifying..." />
              <Button variant="ghost" onclick={() => form.reset()}>Change email</Button>
            {:else}
              <p class="text-sm text-muted-foreground">
                Enter your email and we will send you a one-time verification code.
              </p>

              <form.Field name="email">
                {#snippet children(field)}
                  <TextField {field} placeholder="Enter your email" disabled={isSent} />
                {/snippet}
              </form.Field>

              <Button onclick={sendCode.run} disabled={sendCode.isLoading()}>
                {#if sendCode.isLoading()}
                  <Spinner />
                  Sending...
                {:else}
                  Send code
                {/if}
              </Button>
            {/if}
          {/snippet}
        </form.Subscribe>
      </AppForm>
    {/if}
  </div>
</div>
