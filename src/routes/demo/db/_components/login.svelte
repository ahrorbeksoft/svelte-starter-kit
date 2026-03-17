<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input/index.js";
  import { auth, db } from "$lib/db";
  import { createAsync } from "$lib/hooks/create-async.svelte";

  let email = $state("");
  let code = $state("");
  let sentEmail = $state("");
  let error = $state("");

  const currentUser = $derived(auth.user);

  function getErrorMessage(err: unknown) {
    if (typeof err === "object" && err !== null) {
      const message =
        "body" in err &&
        typeof err.body === "object" &&
        err.body !== null &&
        "message" in err.body &&
        typeof err.body.message === "string"
          ? err.body.message
          : "message" in err && typeof err.message === "string"
            ? err.message
            : null;

      if (message) return message;
    }

    return "Something went wrong. Please try again.";
  }

  const sendCodeAction = createAsync(async (normalizedEmail: string) => {
    await db.auth.sendMagicCode({ email: normalizedEmail });

    sentEmail = normalizedEmail;
    email = normalizedEmail;
    code = "";

    return { success: "Verification code sent." };
  });

  const verifyCodeAction = createAsync(async (sentEmail: string, normalizedCode: string) => {
    await db.auth.signInWithMagicCode({
      email: sentEmail,
      code: normalizedCode
    });

    code = "";

    return { success: "Signed in successfully." };
  });

  const signOutAction = createAsync(async () => {
    await db.auth.signOut();

    email = "";
    code = "";
    sentEmail = "";

    return { success: "Signed out." };
  });

  async function sendCode() {
    error = "";

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      error = "Please enter your email address.";
      return;
    }

    try {
      await sendCodeAction.executeWithKey("send", normalizedEmail);
    } catch (err) {
      error = getErrorMessage(err);
      sentEmail = "";
    }
  }

  async function verifyCode() {
    error = "";

    const normalizedCode = code.trim();
    if (!sentEmail) {
      error = "Please request a code first.";
      return;
    }

    if (!normalizedCode) {
      error = "Please enter the verification code.";
      return;
    }

    try {
      await verifyCodeAction.executeWithKey("verify", sentEmail, normalizedCode);
    } catch (err) {
      error = getErrorMessage(err);
      code = "";
    }
  }

  async function signOut() {
    error = "";

    try {
      await signOutAction.executeWithKey("signout");
    } catch (err) {
      error = getErrorMessage(err);
    }
  }

  function resetFlow() {
    error = "";
    code = "";
    sentEmail = "";
  }
</script>

<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
  <div class="w-full max-w-md rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
    {#if currentUser}
      <div class="space-y-4">
        <div class="space-y-1">
          <h2 class="text-xl font-semibold">You are signed in</h2>
          <p class="text-sm text-muted-foreground">
            Logged in as <span class="font-medium text-foreground">{currentUser.email}</span>
          </p>
        </div>

        <Button class="w-full" onclick={signOut} disabled={signOutAction.isLoading("signout")}>
          {signOutAction.isLoading("signout") ? "Signing out..." : "Sign out"}
        </Button>
      </div>
    {:else}
      <div class="space-y-5">
        <div class="space-y-1">
          <h2 class="text-xl font-semibold">Email OTP login</h2>
          <p class="text-sm text-muted-foreground">
            Enter your email and InstantDB will send you a one-time verification code.
          </p>
        </div>

        {#if !sentEmail}
          <form
            class="space-y-4"
            onsubmit={(e) => {
              e.preventDefault();
              void sendCode();
            }}
          >
            <div class="space-y-2">
              <label class="text-sm font-medium" for="email">Email</label>
              <Input
                id="email"
                type="email"
                bind:value={email}
                placeholder="you@example.com"
                autocomplete="email"
                required
              />
            </div>

            <Button type="submit" class="w-full" disabled={sendCodeAction.isLoading("send")}>
              {sendCodeAction.isLoading("send") ? "Sending code..." : "Send code"}
            </Button>
          </form>
        {:else}
          <form
            class="space-y-4"
            onsubmit={(e) => {
              e.preventDefault();
              void verifyCode();
            }}
          >
            <div class="rounded-md border bg-muted/40 p-3 text-sm">
              We sent a verification code to
              <span class="font-medium">{sentEmail}</span>.
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium" for="code">Verification code</label>
              <Input
                id="code"
                type="text"
                bind:value={code}
                placeholder="123456"
                inputmode="numeric"
                autocomplete="one-time-code"
                required
              />
            </div>

            <div class="flex gap-2">
              <Button type="submit" class="flex-1" disabled={verifyCodeAction.isLoading("verify")}>
                {verifyCodeAction.isLoading("verify") ? "Verifying..." : "Verify code"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onclick={resetFlow}
                disabled={verifyCodeAction.isLoading("verify")}
              >
                Change email
              </Button>
            </div>
          </form>
        {/if}

        {#if error}
          <p class="text-sm text-destructive">{error}</p>
        {/if}
      </div>
    {/if}
  </div>
</div>
