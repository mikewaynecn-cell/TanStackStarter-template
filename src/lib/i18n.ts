/**
 * i18n foundation for the whole template.
 *
 * Scheme: the default locale (en) lives on unprefixed URLs; every other
 * locale gets a path prefix (/zh/…). All pages exist in every enabled
 * locale under the same slug, so alternate/hreflang URLs, the language
 * switcher and the sitemap all derive from SITE_PAGE_PATHS + the prefix
 * table — no per-route bookkeeping.
 *
 * Adding a locale:
 *   1. append its code to LOCALES,
 *   2. add LOCALE_HTML_LANG / LOCALE_PREFIX / LOCALE_SELF_NAME entries,
 *   3. translate CHROME dictionaries (missing keys fall back to English),
 *   4. translate the page dictionaries in src/pages/*.tsx,
 *   5. add it to ENABLED_LOCALES.
 * Routes need no changes: /$locale/ handles any enabled prefix.
 */

export const LOCALES = ["en", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

/** Unprefixed locale for the root of the site. */
export const DEFAULT_LOCALE: Locale = "en";

/** Locales with live pages; disabled ones 404 and show as "soon" in the
 *  language menu. */
export const ENABLED_LOCALES: readonly Locale[] = ["en", "zh"];

/** Locales served under a path prefix (everything except the default). */
export const NON_DEFAULT_LOCALES: readonly Locale[] = ENABLED_LOCALES.filter(
  (locale) => locale !== DEFAULT_LOCALE,
);

/** HTML lang / og:locale value per locale. */
export const LOCALE_HTML_LANG: Record<Locale, string> = {
  en: "en",
  zh: "zh-CN",
};

/** URL prefix per locale; the default locale stays unprefixed. */
export const LOCALE_PREFIX: Record<Locale, string> = {
  en: "",
  zh: "/zh",
};

/** Language name in its own tongue (switcher rows, always self-named). */
export const LOCALE_SELF_NAME: Record<Locale, string> = {
  en: "English",
  zh: "中文",
};

/**
 * Default-locale (canonical) paths of every page, trailing-slash form.
 * Drives the sitemap; keep in sync with src/routes + src/pages.
 */
export const SITE_PAGE_PATHS = ["/", "/about/"] as const;

export function isLocaleEnabled(locale: Locale): boolean {
  return ENABLED_LOCALES.includes(locale);
}

/** Type-guard + parse: narrows an untrusted string (route param) to Locale. */
export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Derive the locale from a pathname: /zh/… → zh, anything else → en. */
export function localeFromPath(pathname: string): Locale {
  for (const locale of NON_DEFAULT_LOCALES) {
    const prefix = LOCALE_PREFIX[locale];
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return locale;
    }
  }
  return DEFAULT_LOCALE;
}

/** Strip any locale prefix: /zh/about/ → /about/ (canonical form). */
export function canonicalPath(pathname: string): string {
  for (const locale of NON_DEFAULT_LOCALES) {
    const prefix = LOCALE_PREFIX[locale];
    if (pathname === prefix) return "/";
    if (pathname.startsWith(`${prefix}/`)) {
      return pathname.slice(prefix.length) || "/";
    }
  }
  return pathname;
}

/** Localize a canonical path: "/about/" → "/zh/about/", "/" → "/zh/". */
export function localizePath(canonical: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return canonical;
  return `${LOCALE_PREFIX[locale]}${canonical === "/" ? "/" : canonical}`;
}

/** Same page in another locale, or null when that locale is not live. */
export function pathInLocale(pathname: string, locale: Locale): string | null {
  if (!isLocaleEnabled(locale)) return null;
  return localizePath(canonicalPath(pathname), locale);
}

/* ---------- Chrome dictionaries ---------- */

const EN_STRINGS = {
  navHome: "Home",
  navAbout: "About",
  navMenuOpen: "Open navigation menu",
  navMenuClose: "Close navigation menu",
  themeToDark: "Switch to the dark theme",
  themeToLight: "Switch to the light theme",
  langSwitchLabel: "Switch language",
  langSoon: "soon",
  footerNote:
    "A starter template for fast, SEO-friendly websites. Edit this line in src/lib/i18n.ts.",
  footerBottomTag: "Built with TanStack Start",
  footerLinkHome: "Home",
  footerLinkAbout: "About this template",
  notFoundEyebrow: "404 / page not found",
  notFoundTitle: "This page took a wrong turn.",
  notFoundLede:
    "The address you tried to open does not exist. Head back home and start again.",
  notFoundCta: "Back to home",
} as const;

/** String-widened shape of EN_STRINGS: locale dictionaries fill the same
 *  keys (per-key English fallback happens at merge time, not here). */
export type ChromeStrings = { [K in keyof typeof EN_STRINGS]: string };

const ZH_STRINGS: ChromeStrings = {
  navHome: "首页",
  navAbout: "关于",
  navMenuOpen: "打开导航菜单",
  navMenuClose: "关闭导航菜单",
  themeToDark: "切换到深色主题",
  themeToLight: "切换到浅色主题",
  langSwitchLabel: "切换语言",
  langSoon: "即将上线",
  footerNote:
    "一个用于快速搭建、SEO 友好网站的起步模板。请在 src/lib/i18n.ts 中修改这句话。",
  footerBottomTag: "基于 TanStack Start 构建",
  footerLinkHome: "首页",
  footerLinkAbout: "关于本模板",
  notFoundEyebrow: "404 / 页面不存在",
  notFoundTitle: "这个页面走丢了。",
  notFoundLede: "你访问的地址不存在。返回首页重新开始吧。",
  notFoundCta: "返回首页",
};

const STRINGS: Record<Locale, ChromeStrings> = {
  en: EN_STRINGS,
  zh: ZH_STRINGS,
};

/** Chrome strings for a locale (future locales fall back to en per key). */
export function t(locale: Locale): ChromeStrings {
  return STRINGS[locale];
}

/** hreflang cluster for a localized path: one row per live locale plus
 *  x-default pointing at the default locale. */
export function localeAlternates(pathname: string) {
  const canonical = canonicalPath(pathname);
  const rows: Array<{ hrefLang: string; href: string }> = [];
  for (const locale of ENABLED_LOCALES) {
    rows.push({
      hrefLang: LOCALE_HTML_LANG[locale],
      href: new URL(
        localizePath(canonical, locale),
        SITE_URL_ORIGIN,
      ).toString(),
    });
  }
  rows.push({
    hrefLang: "x-default",
    href: new URL(canonical, SITE_URL_ORIGIN).toString(),
  });
  return rows;
}

const SITE_URL_ORIGIN =
  import.meta.env.VITE_SITE_URL ?? "https://www.example.com";
