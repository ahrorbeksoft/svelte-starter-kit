---
trigger: always_on
---

# Data fetching

Use the simplest valid InstantDB pattern.

## Defaults

- Live client data → `db.useQuery(...)`
- One-time client read → `db.queryOnce(...)`
- Server-side read → `adminDB`
- Prefetching → use custom `prefetchQuery(...)` + custom `useQuery(...)` only when explicitly needed

Do not use prefetching by default.

## Query placement

For route-specific queries:

- one query → `src/routes/<route>/_components/query.ts`
- multiple queries → `src/routes/<route>/_components/queries.ts`

Keep query objects out of page components when they are more than a tiny inline query.

## Prefer `db.useQuery(...)`

Use `db.useQuery(...)` when data should stay live.

Use function form when the query depends on reactive state like:

- auth user
- route params
- filters
- selected ids

Return `null` until required inputs exist.

### Example: static live query

In `src/routes/posts/_components/query.ts`:

```ts
export const postsQuery = {
  posts: {
    $: {
      order: { createdAt: "desc" }
    }
  }
};
```

In `src/routes/posts/+page.svelte`:

```ts
<script lang="ts">
  import { db } from "$lib/db";
  import { postsQuery } from "./_components/query";

  const q = db.useQuery(postsQuery);
</script>
```

### Example: reactive live query

In `src/routes/posts/_components/query.ts`:

```ts
export const userPostsQuery = (userId: string) => ({
  posts: {
    $: {
      where: { "author.id": userId }
    }
  }
});
```

In `src/routes/posts/+page.svelte`:

```ts
<script lang="ts">
  import { auth, db } from "$lib/db";
  import { userPostsQuery } from "./_components/query";

  const q = db.useQuery(() => {
    if (!auth.user) return null;
    return userPostsQuery(auth.user.id);
  });
</script>
```

## Prefer `db.queryOnce(...)`

Use `db.queryOnce(...)` when you only need one snapshot.

Good for:

- dialogs/modals
- click-triggered reads
- validation/lookups
- after-mount utility fetches

Do not use a live query when a one-time read is enough.

### Example: one-time client read

In `src/routes/posts/_components/query.ts`:

```ts
export const postBySlugQuery = (slug: string) => ({
  posts: {
    $: {
      where: { slug }
    }
  }
});
```

In a component:

```ts
<script lang="ts">
  import { db } from "$lib/db";
  import { postBySlugQuery } from "./_components/query";

  async function loadPost(slug: string) {
    const data = await db.queryOnce(postBySlugQuery(slug));
    return data?.posts?.[0] ?? null;
  }
</script>
```

## Use `adminDB` on the server

Use `adminDB` in server-only files:

- `+page.server.ts`
- `+layout.server.ts`
- `+server.ts`
- server utilities

Keep privileged querying on the server.

Do not move privileged server querying into client code.

### Example: server read

In `src/routes/posts/_components/query.ts`:

```ts
export const postsQuery = {
  posts: {}
};
```

In `src/routes/posts/+page.server.ts`:

```ts
import { adminDB } from "$lib/server/db";
import { postsQuery } from "./_components/query";

export const load = async () => {
  const data = await adminDB.query(postsQuery);
  return { data };
};
```

## Prefetching

Prefetching is a special case.

Use it only when:

- first-render quality matters
- the data is primary page content
- avoiding a loading flash is worth extra wiring
- the page should still stay live after mount

If prefetching is not clearly useful, do not add it.

## Prefetch pattern

Use this only when prefetching is intentionally required.

1. define query in `query.ts` or `queries.ts`
2. prefetch in `+page.ts`
3. return data from `load`
4. hydrate with custom `useQuery(...)` in `+page.svelte`

Custom `prefetchQuery(...)` + custom `useQuery(...)` are for the prefetch-and-hydrate flow only. They are not the default fetching pattern.

### Example: prefetched route

In `src/routes/posts/_components/query.ts`:

```ts
export const postsQuery = {
  posts: {
    $: {
      order: { createdAt: "desc" }
    }
  }
};
```

In `src/routes/posts/+page.ts`:

```ts
import { prefetchQuery } from "$lib/db";
import { postsQuery } from "./_components/query";

export const load = async ({ fetch }) => {
  const posts = await prefetchQuery(postsQuery, fetch);
  return { posts };
};
```

In `src/routes/posts/+page.svelte`:

```ts
<script lang="ts">
  import { useQuery } from "$lib/db";
  import { postsQuery } from "./_components/query";

  let { data } = $props();

  const q = useQuery(postsQuery, () => data.posts);
</script>
```

## Anti-patterns

Avoid:

- using prefetching for every page
- using live queries for one-time reads
- putting large query objects inline in page components
- moving privileged server querying into client code
- mixing multiple fetch styles without a reason
- basing permanent rules on temporary demo/starter code

## Summary

- default live data → `db.useQuery(...)`
- default one-time client read → `db.queryOnce(...)`
- default server read → `adminDB`
- use custom prefetch helpers only when prefetching is intentionally needed
