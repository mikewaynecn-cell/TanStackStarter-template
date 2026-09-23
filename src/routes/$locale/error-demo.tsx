import { createFileRoute } from "@tanstack/react-router";

import { crashDemoLoader } from "@/pages/crash-demo";

// Locale-prefixed twin of src/routes/error-demo.tsx (see crash-demo.tsx
// before deleting).
export const Route = createFileRoute("/$locale/error-demo")({
  loader: crashDemoLoader,
});
