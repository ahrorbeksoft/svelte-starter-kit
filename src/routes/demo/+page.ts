import { prefetchQuery } from "$lib/db";
import type { PageLoad } from "./$types";
import { todosQuery } from "./_components/query.js";

export const load: PageLoad = async ({ fetch, parent }) => {
  const { user } = await parent();
  if (!user) return { todos: null };
  const data = await prefetchQuery(todosQuery(user?.id), fetch);

  return { todos: data };
};
