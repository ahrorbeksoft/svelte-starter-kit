import { authStorageKey } from "$lib/db/auth.svelte";
import type { User } from "$lib/db/types";

export const load = async ({ cookies }) => {
  let user: undefined | User;

  const raw_user = cookies.get(authStorageKey);

  if (raw_user) {
    user = JSON.parse(raw_user) as User;
  }

  return { cookies: cookies.getAll(), user };
};
