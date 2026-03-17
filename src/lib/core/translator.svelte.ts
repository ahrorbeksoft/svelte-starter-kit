import z from "zod";
import { browser } from "$app/environment";
import { createFormatter, createTranslator } from "use-intl/core";
import { Cookies } from "../utils";
// import type { AppConfig } from "use-intl/core";
import { SvelteDate } from "svelte/reactivity";

// type Messages = AppConfig["Messages"];
type Messages = Record<string, any>;

export class Translator<T extends { code: string; messages: Messages }> {
  #locale = $state<string>() as T["code"];
  private languages: readonly T[];
  private fallback: T["code"];
  private storageKey = "locale" as const;
  private schema: z.ZodEnum<Readonly<Record<string, T["code"]>>>;

  constructor(languages: readonly T[], fallback: T["code"]) {
    this.languages = languages;
    this.fallback = fallback;

    const codes = languages.map((l) => l.code) as [string, ...string[]];
    this.schema = z.enum(codes);

    // 1. Initial hydration (Client-side only)
    this.#locale = this.hydrate();

    // 2. Sync changes to Cookies
    $effect.root(() => {
      $effect(() => {
        Cookies.set(this.storageKey, this.#locale, {
          sameSite: "Lax",
          expires: 365
        });
      });
    });
  }

  private hydrate(): T["code"] {
    if (!browser) return this.fallback;
    const cookieValue = Cookies.get(this.storageKey);
    const result = this.schema.safeParse(cookieValue);
    return result.success ? (result.data as T["code"]) : this.fallback;
  }

  /**
   * Server-side initialization to prevent hydration mismatch
   */
  public init(cookies: { name: string; value: string }[]) {
    if (browser) return;
    const cookie = cookies.find((c) => c.name === this.storageKey);
    if (cookie) {
      const result = this.schema.safeParse(cookie.value);
      if (result.success) this.#locale = result.data as T["code"];
    }
  }

  // --- Core i18n Logic ---

  public get currentLanguage() {
    return (
      this.languages.find((l) => l.code === this.#locale) ??
      this.languages.find((l) => l.code === this.fallback)!
    );
  }

  public get t() {
    return createTranslator({
      locale: this.currentLanguage.code as "en",
      messages: this.currentLanguage.messages
    });
  }

  public get format() {
    return createFormatter({
      locale: this.currentLanguage.code as "en",
      timeZone: "Asia/Tashkent",
      now: new SvelteDate()
    });
  }

  // --- State Management ---

  get locale() {
    return this.#locale;
  }

  set locale(next: T["code"]) {
    const result = this.schema.safeParse(next);
    if (result.success) {
      this.#locale = result.data as T["code"];
    }
  }
}
