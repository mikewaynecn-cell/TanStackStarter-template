import { createFileRoute } from "@tanstack/react-router";

import { AboutPage, aboutHead } from "@/pages/about";
import type { Locale } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/about")({
  head: ({ params }) => aboutHead(params.locale as Locale),
  component: LocaleAbout,
});

function LocaleAbout() {
  const { locale } = Route.useParams() as { locale: Locale };
  return <AboutPage locale={locale} />;
}
