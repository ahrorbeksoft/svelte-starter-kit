import type { User } from "@instantdb/svelte";
import {} from "@sveltebase/instant";
export const load = async ({ cookies }) => {
  let user: undefined | User;

  const raw_user = cookies.get("instant_user");
  if (raw_user) {
    user = JSON.parse(raw_user) as User;
  }

  return { cookies: cookies.getAll(), user };
};
