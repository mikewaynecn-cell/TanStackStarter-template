import { createFileRoute } from "@tanstack/react-router";

import { crashDemoLoader } from "@/pages/crash-demo";

// Preview route for the global error page; see src/pages/crash-demo.tsx
// before deleting. Kept out of SITE_PAGE_PATHS so the sitemap ignores it.
export const Route = createFileRoute("/error-demo")({
  loader: crashDemoLoader,
});
