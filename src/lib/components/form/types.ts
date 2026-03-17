import type { AnyFormApi, SvelteFormApi } from "@tanstack/svelte-form";

export type Form = SvelteFormApi<any, any, any, any, any, any, any, any, any, any, any, any> &
  AnyFormApi;
