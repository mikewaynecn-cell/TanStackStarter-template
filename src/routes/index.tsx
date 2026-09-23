import { createFileRoute } from "@tanstack/react-router";

import { HomePage, homeHead } from "@/pages/home";
import { DEFAULT_LOCALE } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => homeHead(DEFAULT_LOCALE),
  component: () => <HomePage locale={DEFAULT_LOCALE} />,
});
