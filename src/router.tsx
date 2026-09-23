import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { GlobalErrorPage } from "@/components/site/error-page";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    trailingSlash: "always",
    // Router-level (not root-route-level): a crashing route renders its
    // own boundary, so without a default each leaf would fall through to
    // TanStack Router's built-in "Something went wrong!" panel.
    defaultErrorComponent: GlobalErrorPage,
    defaultOnCatch: (error, errorInfo) => {
      // The router's own console warning only fires in development; keep
      // render-time crashes visible in production logs (SSR + client).
      console.error(error, errorInfo.componentStack);
    },
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
