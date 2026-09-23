import {
  HeadContent,
  Scripts,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";

import { JsonLd } from "@/components/seo/json-ld";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { LOCALE_HTML_LANG, localeFromPath, t } from "@/lib/i18n";
import {
  CONTACT_EMAIL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_NAME_ALT,
  SITE_URL,
  absoluteUrl,
} from "@/lib/site";

import appCss from "../styles.css?url";

const SITE_ICON_PATH = "/icon.svg";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: SITE_NAME_ALT,
  url: SITE_URL,
  logo: absoluteUrl(SITE_ICON_PATH),
  email: CONTACT_EMAIL,
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${SITE_NAME} — ${SITE_NAME_ALT}` },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#f5f6f8" },
    ],
    links: [
      { rel: "icon", href: SITE_ICON_PATH, type: "image/svg+xml" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  notFoundComponent: NotFoundPage,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  // The shell renders inside the router, so the current pathname (and
  // thus the page locale) is available during SSR and on the client.
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = localeFromPath(pathname);

  return (
    <html lang={LOCALE_HTML_LANG[locale]}>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body>
        <JsonLd data={organizationJsonLd} />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <Scripts />
      </body>
    </html>
  );
}

/**
 * Applies the stored theme before first paint to avoid a light flash for
 * dark-mode users. Mirrors theme-toggle.tsx (THEME_KEY / theme-color).
 */
const THEME_BOOT_SCRIPT = `(function(){try{if(localStorage.getItem("site-theme")==="dark"){document.documentElement.classList.add("dark");var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content","#0d121c");}}catch(e){}})();`;

function NotFoundPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const strings = t(localeFromPath(pathname));
  return (
    <section className="page-hero section-space">
      <div className="shell narrow-column">
        <p className="eyebrow eyebrow--accent">{strings.notFoundEyebrow}</p>
        <h1>{strings.notFoundTitle}</h1>
        <p className="page-lede">{strings.notFoundLede}</p>
        <div className="hero-actions">
          <a className="button button--primary" href="/">
            {strings.notFoundCta}
          </a>
        </div>
      </div>
    </section>
  );
}
