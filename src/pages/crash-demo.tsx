/**
 * Demo loader that fails on purpose, so the global error page
 * (GlobalErrorPage, wired via defaultErrorComponent in src/router.tsx)
 * can be previewed and regression-tested. A loader failure is the path
 * that reaches crawlers hardest: the response is a real HTTP 500 whose
 * body still carries the localized error page plus a noindex robots tag.
 *
 * Note: components that crash mid-RENDER behave differently — React SSR
 * cannot render an error boundary's fallback server-side, so the route
 * subtree bails to client rendering and the error page (with its noindex
 * tag) only appears after hydration. That case needs no demo: any
 * throwing component exercises it.
 *
 * Safe to delete when bootstrapping a real site: remove this file plus
 * the two routes that use it (src/routes/error-demo.tsx and
 * src/routes/$locale/error-demo.tsx) and its worker test.
 */
export function crashDemoLoader(): never {
  throw new Error(
    "Crash demo: intentional error thrown while loading this page.",
  );
}
