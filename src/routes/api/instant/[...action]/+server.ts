import { adminDB } from "$lib/server";
import { createInstantHandler } from "@sveltebase/instant";

export const POST = createInstantHandler(adminDB);
