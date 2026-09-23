import handler from "@tanstack/react-start/server-entry";

import { CANONICAL_HOST } from "@/lib/site";
import {
  canonicalRedirectLocation,
  trailingSlashRedirectLocation,
} from "@/lib/redirect";

const SECURITY_HEADERS = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self' 'unsafe-inline'",
    "connect-src 'self'",
    "worker-src 'self' blob:",
    "upgrade-insecure-requests",
  ].join("; "),
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function withSecurityHeaders(response: Response, includeHsts: boolean) {
  const headers = new Headers(response.headers);

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }

  if (includeHsts) {
    headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function permanentRedirect(
  location: string,
  status: 301 | 308,
  includeHsts: boolean,
) {
  return withSecurityHeaders(
    new Response(null, { status, headers: { Location: location } }),
    includeHsts,
  );
}

const server = {
  async fetch(request: Request) {
    const url = new URL(request.url);
    const isLocalHost = ["localhost", "127.0.0.1", "::1"].includes(
      url.hostname,
    );
    const includeHsts = !isLocalHost && url.protocol === "https:";

    // With no CANONICAL_HOST configured the template serves any hostname
    // as-is; set one in src/lib/site.ts to 301 every public non-canonical
    // host to https://<canonical host> (path + query preserved).
    if (
      !isLocalHost &&
      CANONICAL_HOST !== "" &&
      (url.protocol !== "https:" || url.hostname !== CANONICAL_HOST)
    ) {
      return permanentRedirect(
        canonicalRedirectLocation(request.url, CANONICAL_HOST),
        301,
        includeHsts,
      );
    }

    const trailingSlashLocation = trailingSlashRedirectLocation(request.url);
    if (trailingSlashLocation) {
      return permanentRedirect(trailingSlashLocation, 308, includeHsts);
    }

    const response = await handler.fetch(request);
    return withSecurityHeaders(response, includeHsts);
  },
};

export default server;
