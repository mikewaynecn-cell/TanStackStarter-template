import { createFileRoute, notFound } from "@tanstack/react-router";

import { NON_DEFAULT_LOCALES, type Locale } from "@/lib/i18n";

/**
 * Layout for every locale-prefixed page (/$locale/…). It doubles as the
 * locale gate: any single-segment path that is not an enabled non-default
 * locale prefix falls through to the localized 404.
 */
export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params }) => {
    const enabled = NON_DEFAULT_LOCALES.includes(params.locale as Locale);
    if (!enabled) {
      throw notFound();
    }
  },
});
