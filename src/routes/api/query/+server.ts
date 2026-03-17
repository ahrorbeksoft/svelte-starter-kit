import { json } from "@sveltejs/kit";
import { adminDB } from "$lib/server/db.js";
import { authStorageKey } from "$lib/db/auth.svelte.js";
import type { User } from "$lib/db/types.js";

export const POST = async ({ request, cookies }) => {
  const { query } = await request.json();
  let user: undefined | User;
  const raw_user = cookies.get(authStorageKey);

  if (raw_user) {
    user = JSON.parse(raw_user) as User;
  }

  if (!user?.refresh_token) {
    console.log(JSON.stringify(user, null, 2));
    return json({ data: null }, { status: 401 });
  }

  const db = adminDB.asUser({ token: user.refresh_token });

  const result = await db.query(query as never);

  return json(result);
};
