import {
  useRouter,
  useRouterState,
  type ErrorComponentProps,
} from "@tanstack/react-router";

import { localeFromPath, localizePath, t } from "@/lib/i18n";

/**
 * Global error boundary for every route, wired via `defaultErrorComponent`
 * in src/router.tsx. Replaces TanStack Router's built-in "Something went
 * wrong!" panel — a bare English fallback that crawlers have been known to
 * index verbatim when an interactive component crashes mid-render on an
 * otherwise-200 page.
 */
export function GlobalErrorPage({ error, info, reset }: ErrorComponentProps) {
  const router = useRouter();
  const locale = localeFromPath(
    useRouterState({ select: (s) => s.location.pathname }),
  );
  const strings = t(locale);

  return (
    <>
      {/* Loader failures look healthy to the root head() (which reacts to
       * match.status === "error" but not to this boundary), and render-time
       * crashes never even reach the SSR pass — React bails those subtrees
       * to client rendering. React 19 hoists this tag into <head>; with
       * conflicting robots directives crawlers apply the most restrictive
       * one, so noindex wins. */}
      <meta name="robots" content="noindex, follow" />
      <section className="page-hero section-space">
        <div className="shell narrow-column">
          <p className="eyebrow eyebrow--accent">{strings.errorEyebrow}</p>
          <h1>{strings.errorTitle}</h1>
          <p className="page-lede">{strings.errorLede}</p>
          <div className="hero-actions">
            <button
              type="button"
              className="button button--primary"
              /* reset only clears the boundary state (render errors);
               * invalidate re-runs loaders (loader errors reach this
               * component server-side without a reset callback). */
              onClick={() => {
                reset?.();
                router.invalidate();
              }}
            >
              {strings.errorRetry}
            </button>
            <a
              className="button button--quiet"
              href={localizePath("/", locale)}
            >
              {strings.notFoundCta}
            </a>
          </div>
          {import.meta.env.DEV ? (
            <pre className="source-note">
              {`Error details (development only)\n\n${
                error instanceof Error
                  ? `${error.name}: ${error.message}`
                  : String(error)
              }${info?.componentStack ? `\n\n${info.componentStack}` : ""}`}
            </pre>
          ) : null}
        </div>
      </section>
    </>
  );
}
