import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

import { LanguageSwitcher } from "@/components/site/language-switcher";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { localizePath, localeFromPath, t } from "@/lib/i18n";
import { SITE_NAME } from "@/lib/site";

/** Brand-constant logo: rounded chip + white glyph, identical in
 *  light/dark/footer/favicon (see public/icon.svg). */
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

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = localeFromPath(pathname);
  const strings = t(locale);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  const links = [
    { to: localizePath("/", locale), label: strings.navHome },
    { to: localizePath("/about/", locale), label: strings.navAbout },
  ];

  useEffect(() => {
    if (!mobileOpen) return;

    function onPointerDown(event: PointerEvent) {
      if (!mobileNavRef.current?.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link
          className="wordmark"
          to={localizePath("/", locale)}
          aria-label={`${SITE_NAME} — ${strings.navHome}`}
        >
          <WordmarkMark />
          <span>{SITE_NAME}</span>
        </Link>

        <nav className="desktop-nav" aria-label={strings.navHome}>
          {links.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-controls">
          <LanguageSwitcher />
          <ThemeToggle />
          <div className="mobile-nav" ref={mobileNavRef}>
            <button
              type="button"
              className="mobile-nav-toggle"
              aria-expanded={mobileOpen}
              aria-controls="mobile-site-nav"
              aria-label={
                mobileOpen ? strings.navMenuClose : strings.navMenuOpen
              }
              title={mobileOpen ? strings.navMenuClose : strings.navMenuOpen}
              onClick={() => setMobileOpen((value) => !value)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {mobileOpen ? (
                  <path d="m6 6 12 12M18 6 6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>

            {mobileOpen && (
              <nav
                id="mobile-site-nav"
                className="mobile-nav-panel"
                aria-label={strings.navMenuClose}
              >
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
