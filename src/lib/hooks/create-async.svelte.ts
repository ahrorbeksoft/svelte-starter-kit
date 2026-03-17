import { toast } from "svelte-sonner";
import { SvelteMap } from "svelte/reactivity";

type TryCatchReturn =
  | { success: string; error?: never }
  | { error: string; success?: never }
  | null
  | void;

const GLOBAL_KEY = "__global__";

export function createAsync<T extends (...args: any[]) => Promise<TryCatchReturn | void>>(
  asyncFn: T
) {
  const loadingStates = $state(new SvelteMap<string, boolean>());
  let error = $state<Error | null>(null);

  async function run(id: string, args: Parameters<T>) {
    try {
      loadingStates.set(id, true);
      error = null;

      const response = await asyncFn(...args);

      if (response?.success) {
        toast.success(response.success);
      } else if (response?.error) {
        toast.error(response.error);
      }

      return response;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      error = e;

      if (import.meta.env.DEV) {
        toast.error(e.name, { description: e.message });
        console.error("[Dev Error]:", e);
      } else {
        toast.error("Something went wrong");
      }

      throw e;
    } finally {
      loadingStates.set(id, false);
    }
  }

  /**
   * Execute using the global loading key.
   *
   * Backward compatibility:
   * If the first argument is a string, we also mirror loading state to that key.
   * Prefer `executeWithKey` for new code.
   */
  async function execute(...args: Parameters<T>) {
    const legacyKey = typeof args[0] === "string" ? args[0] : null;

    if (legacyKey && import.meta.env.DEV) {
      console.warn(
        "[createAsync] Passing a string as the first argument implicitly uses it as a loading key. Prefer executeWithKey(key, ...args)."
      );
    }

    if (!legacyKey) {
      return run(GLOBAL_KEY, args);
    }

    try {
      loadingStates.set(legacyKey, true);
      return await run(GLOBAL_KEY, args);
    } finally {
      loadingStates.set(legacyKey, false);
    }
  }

  /**
   * Execute using an explicit loading key.
   */
  async function executeWithKey(key: string, ...args: Parameters<T>) {
    if (!key) {
      return run(GLOBAL_KEY, args);
    }

    try {
      loadingStates.set(key, true);
      return await run(GLOBAL_KEY, args);
    } finally {
      loadingStates.set(key, false);
    }
  }

  return {
    /**
     * Check loading state.
     * Pass a key for specific actions, or call without args for global actions.
     */
    isLoading(key?: string) {
      return loadingStates.get(key ?? GLOBAL_KEY) ?? false;
    },
    get error() {
      return error;
    },
    execute,
    executeWithKey
  };
}
