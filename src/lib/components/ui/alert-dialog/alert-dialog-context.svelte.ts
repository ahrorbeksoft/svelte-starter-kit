// src/lib/confirm.svelte.ts
import { createContext } from "svelte";
import type { Snippet } from "svelte";

export type ConfirmParams = {
  title: string;
  description: string | Snippet;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
};

export type ConfirmFn = (params: ConfirmParams) => Promise<boolean>;

// Svelte 5's type-safe context helper
export const [getConfirm, setConfirm] = createContext<ConfirmFn>();
