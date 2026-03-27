import type { User } from "$lib/db/index.js";
import { parseUser } from "@sveltebase/instant";
export const load = async ({ cookies }) => {
  const all_cookies = cookies.getAll();
  const user = parseUser<User>(all_cookies);

  return { cookies: all_cookies, user };
};
