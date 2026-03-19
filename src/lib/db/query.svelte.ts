import { db } from "./db";
import type { AppSchema } from "$lib/instant.schema";
import type { InstaQLParams, InstaQLResult } from "@instantdb/svelte";
import { browser } from "$app/environment";

// cached query
export async function queryOnce<T extends InstaQLParams<AppSchema>>(
  query: T,
  timeoutMs = 5000
): Promise<InstaQLResult<AppSchema, T>> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line prefer-const
    let unsubscribe: (() => void) | undefined;
    let resolved = false;

    // 1. Set a safety timeout
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        unsubscribe?.();
        reject(new Error("InstantDB query timed out"));
      }
    }, timeoutMs);

    const cleanup = (data: any) => {
      resolved = true;
      clearTimeout(timeout);
      // We use a slight delay or check to ensure unsubscribe exists
      // because of the sync-callback behavior
      if (unsubscribe) {
        unsubscribe();
      }
      resolve(data);
    };

    // 2. Subscribe
    // @ts-expect-error fuck this
    unsubscribe = db.core.subscribeQuery(query, (resp) => {
      if (resp.error) {
        cleanup(null);
        reject(resp.error);
        return;
      }

      if (resp.data) {
        cleanup(resp.data);
      }
    });

    // 3. Handle the "Immediate Sync" edge case
    // If the callback ran immediately, 'resolved' is true, but 'unsubscribe'
    // was just assigned. We kill it now.
    if (resolved && unsubscribe) {
      unsubscribe();
    }
  });
}

type QueryState<T extends InstaQLParams<AppSchema>> =
  | { isLoading: true; data: null }
  | { isLoading: false; data: InstaQLResult<AppSchema, T> };

const unwrap = <T>(val: T | (() => T)): T => (typeof val === "function" ? (val as any)() : val);

// NEVER SPREAD THE OUTPUT OF THIS FUNCTION, IT JUST LOOSES IT'S REACTIVITY IF YOU DO SO
export function useQuery<T extends InstaQLParams<AppSchema>>(
  queryInput: T | null | (() => T | null),
  initialData?: any | (() => any)
) {
  const state = $state<QueryState<T>>({
    isLoading: !initialData,
    data: unwrap(initialData) ?? null
  });

  $effect(() => {
    const query = unwrap(queryInput);

    if (!query) return;

    // @ts-expect-error fuck you
    const unsubscribe = db.core.subscribeQuery(query, (resp) => {
      if (resp.error) {
        throw resp.error;
      }

      if (resp.data) {
        state.isLoading = false;
        state.data = resp.data as InstaQLResult<AppSchema, T>;
      }
    });

    return unsubscribe;
  });

  return state;
}

export async function prefetchQuery<T extends InstaQLParams<AppSchema>>(
  query: T,
  fetcher: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
): Promise<InstaQLResult<AppSchema, T> | null> {
  if (browser) {
    const data = await queryOnce(query);
    return data;
  }

  const res = await fetcher("/api/query", {
    method: "POST",
    body: JSON.stringify({ query })
  });

  return res.ok ? await res.json() : null;
}
