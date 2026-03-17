import { PUBLIC_INSTANT_APP_ID } from "$env/static/public";
import { db } from "./db";
import type { User } from "./types";

export const authStorageKey = `instant_user_${PUBLIC_INSTANT_APP_ID}`;
// auth.svelte.ts
class Auth {
  #init_user = $state<User | undefined>(undefined);
  #user = $state<User | undefined>(undefined);
  #initComplete = $state(false);
  #unsubscribe; // Private variable to hold the cleanup function

  constructor() {
    this.#unsubscribe = db.core.subscribeAuth((resp) => {
      this.#user = resp.user as User;
    });

    // 2. Set up a side effect to sync changes back to Cookies
    // In Svelte 5, $effect automatically tracks any $state read inside it
    $effect.root(() => {
      $effect(() => {
        if (this.#initComplete) {
          // 1. Create clean snapshots for comparison
          const currentUser = $state.snapshot(this.#user);
          const initialUser = $state.snapshot(this.#init_user);
          if (JSON.stringify(currentUser) !== JSON.stringify(initialUser)) {
            // 2. Fire and forget, but handle the baseline update internally
            this.performSync(currentUser);
          }
        }
      });
    });
  }

  public init(user: User | undefined) {
    this.#init_user = user;

    if (!this.#user) {
      this.#user = user;
    }

    this.#initComplete = true;
  }

  private async performSync(userData: User | undefined) {
    try {
      await fetch("/api/instant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user: userData })
      });
      this.#init_user = userData;
    } catch (error) {
      console.error("Failed to sync user to server-side cookie:", error);
      // Optionally: trigger a toast notification or revert local state
    }
  }

  public get user() {
    return this.#user;
  }

  // A manual "Cleaning" method
  destroy() {
    this.#unsubscribe?.();
  }
}

export const auth = new Auth();
