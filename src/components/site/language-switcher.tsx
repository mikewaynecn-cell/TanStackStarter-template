import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

import {
  LOCALES,
  LOCALE_SELF_NAME,
  isLocaleEnabled,
  localeFromPath,
  pathInLocale,
  t,
  type Locale,
} from "@/lib/i18n";

/** Locale badge: a quiet rounded chip with the locale's short label —
 *  no flags, so it stays neutral for any language pair. */
const LOCALE_BADGE_LABEL: Record<Locale, string> = {
  en: "EN",
  zh: "中",
};

function LocaleBadge({ locale }: { locale: Locale }) {
  return (
    <svg
      className="lang-badge"
      viewBox="0 0 22 14"
      role="img"
      aria-hidden="true"
    >
      <rect
        width="22"
        height="14"
        rx="3"
        fill="var(--paper-deep)"
        stroke="var(--line)"
        strokeWidth="1"
      />
      <text
        x="11"
        y="7.5"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        fontSize="7"
        fontWeight="700"
        fontFamily="inherit"
      >
        {LOCALE_BADGE_LABEL[locale]}
      </text>
    </svg>
  );
}

/**
 * Header language picker: shows the active locale's badge and opens a
 * small menu with every site locale. Disabled locales stay visible as a
 * "soon" row until they flip on in ENABLED_LOCALES.
 */
export function LanguageSwitcher() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = localeFromPath(pathname);
  const strings = t(locale);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const rows: Array<{
    key: Locale;
    label: string;
    badge: () => ReactElement;
    enabled: boolean;
    href: string | null;
  }> = LOCALES.map((key) => ({
    key,
    label: LOCALE_SELF_NAME[key],
    badge: () => <LocaleBadge locale={key} />,
    enabled: isLocaleEnabled(key),
    href: pathInLocale(pathname, key),
  }));

  return (
    <div className="lang-switch" ref={rootRef}>
      <button
        type="button"
        className="lang-button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={strings.langSwitchLabel}
        title={strings.langSwitchLabel}
        onClick={() => setOpen((value) => !value)}
      >
        <LocaleBadge locale={locale} />
      </button>

      {open && (
        <div
          className="lang-menu"
          role="menu"
          aria-label={strings.langSwitchLabel}
        >
          {rows.map((row) => {
            const Badge = row.badge;
            const active = row.key === locale;
            const common = {
              className: active
                ? "lang-menu__item lang-menu__item--active"
                : "lang-menu__item",
              role: "menuitemradio",
              "aria-checked": active,
            };

            if (row.enabled && row.href) {
              return (
                <Link
                  key={row.key}
                  to={row.href}
                  {...common}
                  onClick={() => setOpen(false)}
                >
                  <Badge />
                  <span>{row.label}</span>
                  {active && <span className="lang-check">✓</span>}
                </Link>
              );
            }

            return (
              <button
                key={row.key}
                type="button"
                {...common}
                aria-disabled="true"
                title={strings.langSoon}
              >
                <Badge />
                <span>{row.label}</span>
                <span className="lang-soon">{strings.langSoon}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
