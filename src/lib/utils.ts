import { clsx, type ClassValue } from "clsx";
import { toast } from "svelte-sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

interface CookieOptions {
  expires?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "Lax" | "Strict" | "None";
  partitioned?: boolean;
}

export const Cookies = {
  set(name: string, value: string, options: CookieOptions = {}): void {
    const defaults: CookieOptions = {
      path: "/",
      sameSite: "Lax",
      secure: window.location.protocol === "https:"
    };

    const settings = { ...defaults, ...options };

    // 1. Encode name and value
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    // 2. Expiration (Capped at 400 days by modern browsers)
    if (settings.expires) {
      const maxAge = settings.expires * 24 * 60 * 60;
      cookieString += `; max-age=${maxAge}`;
    }

    // 3. Attributes
    cookieString += `; path=${settings.path}`;

    if (settings.domain) {
      cookieString += `; domain=${settings.domain}`;
    }

    if (settings.sameSite) {
      cookieString += `; samesite=${settings.sameSite}`;
      // If SameSite is 'None', Secure MUST be true
      if (settings.sameSite === "None") settings.secure = true;
    }

    if (settings.secure) {
      cookieString += "; secure";
    }

    if (settings.partitioned) {
      cookieString += "; partitioned";
    }

    document.cookie = cookieString;
  },
  get(name: string): string | null {
    const match = document.cookie.match(
      new RegExp("(^| )" + encodeURIComponent(name) + "=([^;]+)")
    );
    return match ? decodeURIComponent(match[2]) : null;
  },
  remove(name: string, options: Pick<CookieOptions, "path" | "domain"> = {}): void {
    this.set(name, "", { ...options, expires: -1 });
  }
};

export function timestamps<T extends boolean>(
  updateOnly: T
): T extends true ? { updatedAt: number } : { createdAt: number; updatedAt: number } {
  const date = Date.now();

  return (updateOnly ? { updatedAt: date } : { createdAt: date, updatedAt: date }) as any;
}

type TryCatchReturn =
  | { success: string; error?: never }
  | { error: string; success?: never }
  | null
  | void;

export async function tryCatch(task: () => Promise<TryCatchReturn> | TryCatchReturn) {
  try {
    const response = await task();

    if (response?.success) {
      toast.success(response.success);
    } else if (response?.error) {
      toast.error(response.error);
    }
  } catch (err) {
    // Handle unexpected runtime crashes
    if (import.meta.env.DEV) {
      const error = err instanceof Error ? err : new Error(String(err));
      toast.error(error.name, { description: error.message });
      console.error("[Dev Error]:", error);
    } else {
      toast.error("Something went wrong");
    }
  }
}

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const numberToString = (value: number | string | undefined | null): string | undefined => {
  if (!value) return undefined;
  const parts = value.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
};

export const stringToNumber = (value: string | undefined | null): number | undefined => {
  if (!value) return 0;
  const cleanString = value.replace(/\s+/g, "");
  return Number(cleanString);
};
