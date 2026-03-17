import { INSTANT_APP_ADMIN_TOKEN } from "$env/static/private";
import { PUBLIC_INSTANT_APP_ID } from "$env/static/public";
import { init } from "@instantdb/admin";
import schema from "$lib/instant.schema";

export const adminDB = init({
  appId: PUBLIC_INSTANT_APP_ID,
  adminToken: INSTANT_APP_ADMIN_TOKEN,
  schema
});
