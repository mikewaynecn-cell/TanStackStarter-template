import { describe, expect, it } from "vitest";

import {
  canonicalPath,
  isLocale,
  localeAlternates,
  localeFromPath,
  localizePath,
  pathInLocale,
  t,
  type Locale,
} from "@/lib/i18n";

describe("localeFromPath", () => {
  it.each([
    ["/", "en"],
    ["/about/", "en"],
    ["/zh", "zh"],
    ["/zh/", "zh"],
    ["/zh/about/", "zh"],
    ["/zhabout/", "en"],
  ])("maps %s to %s", (pathname, expected) => {
    expect(localeFromPath(pathname)).toBe(expected);
  });
});

describe("canonicalPath", () => {
  it.each([
    ["/about/", "/about/"],
    ["/zh", "/"],
    ["/zh/", "/"],
    ["/zh/about/", "/about/"],
  ])("strips the prefix from %s", (pathname, expected) => {
    expect(canonicalPath(pathname)).toBe(expected);
  });
});

describe("localizePath", () => {
  it.each([
    ["/", "en", "/"],
    ["/about/", "en", "/about/"],
    ["/", "zh", "/zh/"],
    ["/about/", "zh", "/zh/about/"],
  ])("maps (%s, %s) to %s", (canonical, locale, expected) => {
    expect(localizePath(canonical, locale as Locale)).toBe(expected);
  });
});

describe("pathInLocale", () => {
  it("swaps the locale of the current page", () => {
    expect(pathInLocale("/about/", "zh")).toBe("/zh/about/");
    expect(pathInLocale("/zh/about/", "en")).toBe("/about/");
    expect(pathInLocale("/", "zh")).toBe("/zh/");
  });

  it("returns null for a locale that is not live", () => {
    expect(pathInLocale("/about/", "es" as never)).toBeNull();
  });
});

describe("localeAlternates", () => {
  it("emits one row per enabled locale plus x-default", () => {
    const rows = localeAlternates("/zh/about/");

    expect(rows).toEqual([
      { hrefLang: "en", href: "https://www.example.com/about/" },
      { hrefLang: "zh-CN", href: "https://www.example.com/zh/about/" },
      {
        hrefLang: "x-default",
        href: "https://www.example.com/about/",
      },
    ]);
  });
});

describe("isLocale", () => {
  it("narrows untrusted strings", () => {
    expect(isLocale("zh")).toBe(true);
    expect(isLocale("nope")).toBe(false);
  });
});

describe("t", () => {
  it("returns a complete dictionary per enabled locale", () => {
    expect(t("en").navHome).toBe("Home");
    expect(t("zh").navHome).toBe("首页");
    expect(t("zh").notFoundCta).toBe("返回首页");
  });

  it("carries the global error page copy in every locale", () => {
    expect(t("en").errorRetry).toBe("Try again");
    expect(t("zh").errorRetry).toBe("重试");
    expect(t("zh").errorTitle).toBe("页面出了点问题。");
    expect(t("zh").errorMetaTitle).toBe("页面出错了");
  });
});
