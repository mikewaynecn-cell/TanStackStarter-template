import { createFileRoute } from "@tanstack/react-router";

import { HomePage, homeHead } from "@/pages/home";
import type { Locale } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/")({
  // The parent layout's beforeLoad already rejected unknown prefixes.
  head: ({ params }) => homeHead(params.locale as Locale),
  component: LocaleHome,
});

function LocaleHome() {
  const { locale } = Route.useParams() as { locale: Locale };
  return <HomePage locale={locale} />;
}
