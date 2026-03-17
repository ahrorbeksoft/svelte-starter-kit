import { init } from "@instantdb/svelte";
import { PUBLIC_INSTANT_APP_ID } from "$env/static/public";
import schema from "../instant.schema";

export const db = init({ appId: PUBLIC_INSTANT_APP_ID, schema, devtool: false });
