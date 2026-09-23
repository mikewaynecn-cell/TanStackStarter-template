/** Matches a path whose final segment carries a file extension, e.g.
 *  /robots.txt, /icon.svg, /assets/index-abc123.js — those never take a
 *  trailing slash. */
const FILE_EXTENSION_PATH = /\/[^/]+\.[^/]+$/;

export function hasFileExtension(pathname: string): boolean {
  return FILE_EXTENSION_PATH.test(pathname);
}

/**
 * Permanent trailing-slash destination for extensionless page paths
 * ("/about" → "/about/"), preserving query and hash. Returns null when
 * the path already ends in "/" or looks like a file.
 */
export function trailingSlashRedirectLocation(
  requestUrl: string,
): string | null {
  const destination = new URL(requestUrl);
  if (
    destination.pathname === "/" ||
    destination.pathname.endsWith("/") ||
    hasFileExtension(destination.pathname)
  ) {
    return null;
  }
  destination.pathname = `${destination.pathname}/`;
  return destination.toString();
}

/**
 * Canonical https://host form of the request URL, preserving path and
 * query. Feed it the site's canonical host when redirecting alternate
 * hostnames (see CANONICAL_HOST in src/lib/site.ts).
 */
export function canonicalRedirectLocation(
  requestUrl: string,
  canonicalHost: string,
): string {
  const destination = new URL(requestUrl);
  destination.protocol = "https:";
  destination.hostname = canonicalHost;
  destination.port = "";
  return (
    trailingSlashRedirectLocation(destination.toString()) ??
    destination.toString()
  );
}
