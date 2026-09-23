export const SITE_URL =
  import.meta.env.VITE_SITE_URL ?? "https://www.example.com";

/**
 * Canonical hostname for production ("www.example.com"). While empty the
 * server skips host canonicalization; fill it in when the custom domain
 * goes live so every other hostname 301s here (path + query preserved).
 */
export const CANONICAL_HOST = "";

export const SITE_NAME = "Starter Site";

export const SITE_NAME_ALT = "TanStack Start Template";

export const SITE_DESCRIPTION =
  "A fast, SEO-friendly multilingual website starter built with TanStack Start and deployed on Cloudflare Workers.";

export const CONTACT_EMAIL = "hello@example.com";

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();
