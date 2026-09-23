import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

import { localeFromPath, t } from "@/lib/i18n";

const THEME_KEY = "site-theme";
const THEME_COLOR_LIGHT = "#f5f6f8";
const THEME_COLOR_DARK = "#0d121c";

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path
        d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ThemeToggle() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const strings = t(localeFromPath(pathname));
  // SSR renders the light default; the post-mount effect syncs the icon
  // with the class the inline script may have applied before hydration.
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setDark(isDark);
      syncThemeColor(isDark);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {
      // Storage may be unavailable (private mode): the toggle still works
      // for this visit, just without persistence.
    }
    syncThemeColor(next);
    setDark(next);
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={dark ? strings.themeToLight : strings.themeToDark}
      title={dark ? strings.themeToLight : strings.themeToDark}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function syncThemeColor(dark: boolean) {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", dark ? THEME_COLOR_DARK : THEME_COLOR_LIGHT);
}
