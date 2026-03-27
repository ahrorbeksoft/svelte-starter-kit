import { init, type InstaQLResult, type User as InstantUser } from "@instantdb/svelte";
import { PUBLIC_INSTANT_APP_ID } from "$env/static/public";
import schema, { type AppSchema } from "../instant.schema";
import { createInstantHelpers } from "@sveltebase/instant";

export const db = init({ appId: PUBLIC_INSTANT_APP_ID, schema, devtool: false });

export type User = InstantUser & InstaQLResult<AppSchema, { $users: {} }>["$users"][number];
export const { useQuery, prefetchQuery, auth } = createInstantHelpers<User>(db);
