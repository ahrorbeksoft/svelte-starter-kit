import { adminDB } from "$lib/server";
import { createQueryHandler } from "@sveltebase/instant";

export const POST = createQueryHandler(adminDB);
