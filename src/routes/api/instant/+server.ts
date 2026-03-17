import { dev } from "$app/environment";
import type { User } from "$lib/db/types.js";
import { authStorageKey } from "$lib/db/auth.svelte.js";
import { error, json } from "@sveltejs/kit";

export const POST = async ({ request, cookies }) => {
  let body: { user?: User | null };
  try {
    body = await request.json();
  } catch {
    return error(400, "Invalid JSON body");
  }

  if (body.user && body.user.refresh_token) {
    cookies.set(authStorageKey, JSON.stringify(body.user), {
      path: "/",
      secure: !dev,
      sameSite: "strict",
      httpOnly: true,
      maxAge: 604800
    });
    return json({ ok: true });
  } else {
    cookies.delete(authStorageKey, { path: "/" });
    return json({ ok: true });
  }
};
