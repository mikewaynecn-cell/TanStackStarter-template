import { createFileRoute } from "@tanstack/react-router";

import { AboutPage, aboutHead } from "@/pages/about";
import { DEFAULT_LOCALE } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => aboutHead(DEFAULT_LOCALE),
  component: () => <AboutPage locale={DEFAULT_LOCALE} />,
});
