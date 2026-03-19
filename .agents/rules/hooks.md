---
trigger: always_on
---

# Hooks

## `getFormat()` — from `$lib/hooks/format.svelte.ts`

Locale-aware date/time formatter. Must be called at component top-level (it reads reactive i18n state).

```svelte
<script lang="ts">
  import { getFormat } from "$lib/hooks/format.svelte";
  const format = getFormat();
</script>

<!-- Basic date (auto locale) -->
{format(createdAt)}

<!-- With time -->
{format(createdAt, { withTime: true })}

<!-- Full date (e.g. "2026-yil, 24-fevral") -->
{format(createdAt, { preset: "full" })}

<!-- Relative time ("5 minutes ago", "Today at 12:30") -->
{format(createdAt, { preset: "custom" })}

<!-- Month only ("February" / "Fevral") -->
{format(createdAt, { preset: "month" })}

<!-- Birthday format -->
{format(birthday, { preset: "birthday" })}

<!-- Parse "HH:mm:ss" time strings -->
{format("14:30:00", { preset: "timestring" })}
```

**Available presets**: `"default"` | `"custom"` | `"birthday"` | `"month"` | `"timestring"` | `"full"`

**Key behavior**:

- `"custom"` returns relative timestamps: "just now" → "5 minutes ago" → "Today at 14:30" → "Yesterday at 12:00" → weekday name → full date.
- All presets respect the current i18n locale (`uz`, `ru`, `en`).
- Uzbek locale uses hardcoded month/weekday names since `Intl` doesn't fully support it.

---

## `createAsync()` — from `$lib/hooks/create-async.svelte.ts`

Helper for async actions with built-in loading state, toast notifications, and error tracking.

Wrap an async function that returns either:

- `{ success: string }` → shows a success toast
- `{ error: string }` → shows an error toast
- `null` / `void` → no automatic toast

```svelte
<script lang="ts">
  import { createAsync } from "$lib/hooks/create-async.svelte";

  const clearCompletedTodos = createAsync(async () => {
    const res = await api.todos.clearCompleted();

    if (!res.ok) {
      return { error: "Failed to clear completed todos" };
    }

    return { success: "Completed todos cleared" };
  });
</script>

<button onclick={() => clearCompletedTodos.run()} disabled={clearCompletedTodos.isLoading()}>
  {#if clearCompletedTodos.isLoading()}
    Clearing...
  {:else}
    Clear completed
  {/if}
</button>
```

**Keyed loading states**:

Use `run()` with `isLoading()` when the action is rendered in only one place.

Use `runWithKey(key, ...args)` with `isLoading(key)` only when the same async action appears multiple times (for example, inside a loop/list) and each instance needs its own loading state.

`run(...args)` accepts only the arguments of the async function you passed to `createAsync()`.

`runWithKey(key, ...args)` accepts a loading key first, then the arguments of the async function you passed to `createAsync()`.

```svelte
<script lang="ts">
  import { createAsync } from "$lib/hooks/create-async.svelte";

  const removeMember = createAsync(async (memberId: string) => {
    const res = await api.members.remove(memberId);

    if (!res.ok) {
      return { error: "Could not remove member" };
    }

    return { success: "Member removed" };
  });
</script>

{#each members as member}
  <button
    onclick={() => removeMember.runWithKey(member.id, member.id)}
    disabled={removeMember.isLoading(member.id)}
  >
    {#if removeMember.isLoading(member.id)}
      Removing...
    {:else}
      Remove
    {/if}
  </button>
{/each}
```

**Returned API**:

| Member                     | Type                                                        | Description                                                                                                                                     |
| -------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `run(...args)`             | `(...args) => Promise<TryCatchReturn \| void>`              | Executes the wrapped async function using the global loading key. Pass only the wrapped function's arguments.                                   |
| `runWithKey(key, ...args)` | `(key: string, ...args) => Promise<TryCatchReturn \| void>` | Executes with an explicit loading key for per-item/per-action loading state. Pass the loading key first, then the wrapped function's arguments. |
| `isLoading(key?)`          | `(key?: string) => boolean`                                 | Returns loading state for the global key or a specific key.                                                                                     |
| `error`                    | `Error \| null`                                             | Last thrown error caught by the wrapper.                                                                                                        |

**Behavior**:

- `run(...args)` is the default for a single action/button, accepts only the wrapped function's arguments, and sets a global loading state.
- `runWithKey(key, ...args)` is for loops/lists or multiple independent instances of the same action, accepts a loading key first and the wrapped function's arguments after that, and sets both the keyed loading state and the global loading state during execution.
- Thrown errors are stored in `error` and re-thrown.
- In development, thrown errors also show a detailed toast and are logged to the console.
- In production, thrown errors show a generic `"Something went wrong"` toast.

## `getConfirm()` — from `$lib/components/ui/alert-dialog`

Svelte 5 context-based confirmation dialog. Returns a `Promise<boolean>` — resolves `true` if confirmed, `false` if cancelled.

```svelte
<script lang="ts">
  import { getConfirm } from "$lib/components/ui/alert-dialog";

  const confirm = getConfirm();

  async function handleDelete() {
    const ok = await confirm({
      title: t("delete-room"),
      description: t("delete-room-description"),
      confirmLabel: t("delete"),
      cancelLabel: t("cancel"),
      confirmVariant: "destructive"
    });
    if (!ok) return;
    // proceed with delete...
  }
</script>
```

**`ConfirmParams`**:
| Param | Type | Default |
|------------------|----------------------------------|---------------|
| `title` | `string` | _required_ |
| `description` | `string \| Snippet` | _required_ |
| `confirmLabel` | `string` | `"Confirm"` |
| `cancelLabel` | `string` | `"Cancel"` |
| `confirmVariant` | Button variant string | `"default"` |

---

## `IsMobile` — from `$lib/hooks/is-mobile.svelte.ts`

Reactive media query class that extends Svelte 5's `MediaQuery`. Use to check if the viewport is mobile-sized.

```svelte
<script lang="ts">
  import { IsMobile } from "$lib/hooks/is-mobile.svelte";
  const isMobile = new IsMobile(); // default: 768px breakpoint
</script>

{#if isMobile.current}
  <!-- Mobile layout -->
{:else}
  <!-- Desktop layout -->
{/if}
```
