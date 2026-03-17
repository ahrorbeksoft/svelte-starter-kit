// src/lib/telegram.svelte.ts
import { browser } from "$app/environment";
import type { Telegram } from "telegram-web-app";

// A "No-Op" version of the WebApp for the server
const mockWebApp = new Proxy({} as Telegram["WebApp"], {
  get: () => () => {} // Returns an empty function for any method called
});

// This will be our global reactive state
export const tg = browser && window.Telegram ? window.Telegram.WebApp : mockWebApp;
