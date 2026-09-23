import { createFileRoute } from "@tanstack/react-router";

import { ENABLED_LOCALES, SITE_PAGE_PATHS, localizePath } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/site";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        // One <url> per live locale for every registered page path.
        const urls = SITE_PAGE_PATHS.flatMap((canonical) =>
          ENABLED_LOCALES.map((locale) => localizePath(canonical, locale)).map(
            (path) => `  <url><loc>${absoluteUrl(path)}</loc></url>`,
          ),
        );

        const body = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls,
          "</urlset>",
        ].join("\n");

        return new Response(body, {
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
