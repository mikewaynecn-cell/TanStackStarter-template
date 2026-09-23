import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    trailingSlash: "always",
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
