import type z from "zod";
import { Cookies } from "../utils";
import { browser } from "$app/environment";

export class PersistentState<TSchema extends z.ZodTypeAny> {
  // We use the $state rune to make the value reactive
  #value = $state<z.output<TSchema>>();

  private storageKey: string;
  private schema: TSchema;

  constructor(key: string, schema: TSchema) {
    this.storageKey = key;
    this.schema = schema;

    // 1. Hydrate state immediately upon instantiation
    this.#value = PersistentState.hydrate(key, schema);

    // 2. Set up a side effect to sync changes back to Cookies
    // In Svelte 5, $effect automatically tracks any $state read inside it
    $effect.root(() => {
      $effect(() => {
        if (typeof window !== "undefined") {
          Cookies.set(this.storageKey, JSON.stringify(this.#value), {
            sameSite: "Lax",
            expires: 365
          });
        }
      });
    });
  }

  // Getter for easy access (used as store.value)
  get current() {
    return this.#value!;
  }

  // Setter to allow direct assignment (store.value = newValue)
  set current(newValue: z.output<TSchema>) {
    this.#value = this.schema.parse(newValue);
  }

  private static hydrate<TSchema extends z.ZodTypeAny>(
    key: string,
    schema: TSchema
  ): z.output<TSchema> {
    if (typeof window === "undefined") return schema.parse(undefined);

    const rawCookie = Cookies.get(key);
    if (rawCookie) {
      try {
        const parsedJson = JSON.parse(rawCookie);
        return schema.parse(parsedJson);
      } catch {
        console.warn(`[PersistentStore] Invalid data for "${key}". Resetting.`);
      }
    }
    return schema.parse(undefined);
  }

  /**
   * init raw cookie pass all cookies here (only for server)
   */
  public init(cookies: { name: string; value: string }[]) {
    if (browser) return;
    const rawCookie = cookies.find((c) => c.name === this.storageKey);
    if (!rawCookie) return; // Don't do anything if this store's key isn't present
    try {
      const parsed = this.schema.parse(JSON.parse(rawCookie.value));
      // Only assign if it's actually different to avoid unnecessary effect triggers
      if (JSON.stringify(parsed) !== JSON.stringify(this.#value)) {
        this.#value = parsed;
      }
    } catch {
      console.warn(`[Store] Init failed for ${this.storageKey}`);
    }
  }

  public set(fn: (v: z.output<TSchema>) => z.output<TSchema>) {
    this.#value = fn(this.#value as z.output<TSchema>);
  }
}

export class State<T> {
  // Private field to hold the reactive state
  #internalState = $state<T>() as T;

  constructor(initialValue: T) {
    this.#internalState = initialValue;
  }

  // Accessor for the 'state' property
  get current() {
    return this.#internalState;
  }

  // Setter for the 'state' property
  set current(v: T) {
    this.#internalState = v;
  }

  // Functional update method
  set(fn: (v: T) => T) {
    this.#internalState = fn(this.#internalState);
  }
}
