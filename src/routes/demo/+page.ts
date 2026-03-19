import type { PageLoad } from "./$types";
import { prefetchQuery } from "$lib/db/query.svelte.js";
import { todosQuery } from "./_components/query.js";

export const load: PageLoad = async ({ fetch, parent }) => {
  const { user } = await parent();
  if (!user) return { todos: null };
  const data = await prefetchQuery(todosQuery(user?.id), fetch);

  return { todos: data };
};
