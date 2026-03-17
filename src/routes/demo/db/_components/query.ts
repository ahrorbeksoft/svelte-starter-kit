import type { AppSchema } from "$lib/instant.schema";
import type { InstaQLParams } from "@instantdb/svelte";

export const usersQuery = { $users: {} } satisfies InstaQLParams<AppSchema>;
