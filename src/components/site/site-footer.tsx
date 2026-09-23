import { Link, useRouterState } from "@tanstack/react-router";

import { localizePath, localeFromPath, t } from "@/lib/i18n";
import { SITE_NAME } from "@/lib/site";

function WordmarkMark() {
  return (
    <svg
      className="wordmark-mark"
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="14" fill="#1d5fd6" />
      <path d="M18 20h28v8H36v18h-8V28H18z" fill="#ffffff" />
    </svg>
  );
}

export function SiteFooter() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = localeFromPath(pathname);
  const strings = t(locale);

  const links = [
    { to: localizePath("/", locale), label: strings.footerLinkHome },
    { to: localizePath("/about/", locale), label: strings.footerLinkAbout },
  ];

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Link
            className="wordmark footer-wordmark"
            to={localizePath("/", locale)}
            aria-label={`${SITE_NAME} — ${strings.navHome}`}
          >
            <WordmarkMark />
            <span>{SITE_NAME}</span>
          </Link>
          <p className="footer-note">{strings.footerNote}</p>
        </div>
        <div className="footer-links">
          {links.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>
          © {new Date().getFullYear()} {SITE_NAME}
        </span>
        <span>{strings.footerBottomTag}</span>
      </div>
    </footer>
  );
}
