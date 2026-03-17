import type { AppSchema } from "$lib/instant.schema";
import type { User as InstantUser, InstaQLResult } from "@instantdb/svelte";

export type User = InstantUser & InstaQLResult<AppSchema, { $users: {} }>["$users"][number];
