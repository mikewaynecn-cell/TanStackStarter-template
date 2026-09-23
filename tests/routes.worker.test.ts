import { exports } from "cloudflare:workers";
import { describe, expect, it } from "vitest";

const appFetch = (url: string) =>
  exports.default.fetch(new Request(url, { redirect: "manual" }));

const ORIGIN = "https://www.example.com";

describe("public HTTP routes", () => {
  it("serves the default-locale homepage with canonical metadata", async () => {
    const response = await appFetch(`${ORIGIN}/`);
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain(`<html lang="en"`);
    expect(html).toContain(`<link rel="canonical" href="${ORIGIN}/"`);
    // React emits the attribute camel-cased; HTML attribute names are
    // case-insensitive, so parsers see hreflang.
    expect(html).toContain('hrefLang="zh-CN"');
    expect(html).toContain('hrefLang="x-default"');
    expect(html).toContain('"@type":"WebSite"');
    expect(html).toContain('aria-label="Open navigation menu"');
  });

  it("serves the zh homepage under its prefix", async () => {
    const response = await appFetch(`${ORIGIN}/zh/`);
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain(`<html lang="zh-CN"`);
    expect(html).toContain(`<link rel="canonical" href="${ORIGIN}/zh/"`);
    expect(html).toContain("在 Cloudflare Workers 上交付多语言网站");
    expect(html).toContain("首页");
  });

  it("serves the about page in both locales", async () => {
    const [enResponse, zhResponse] = await Promise.all([
      appFetch(`${ORIGIN}/about/`),
      appFetch(`${ORIGIN}/zh/about/`),
    ]);
    const [en, zh] = await Promise.all([enResponse.text(), zhResponse.text()]);

    expect(enResponse.status).toBe(200);
    expect(en).toContain(`<link rel="canonical" href="${ORIGIN}/about/"`);
    expect(en).toContain("About this template");
    expect(zhResponse.status).toBe(200);
    expect(zh).toContain(`<link rel="canonical" href="${ORIGIN}/zh/about/"`);
    expect(zh).toContain("关于本模板");
  });

  it("cross-links the two locales via hreflang", async () => {
    const response = await appFetch(`${ORIGIN}/about/`);
    const html = await response.text();

    expect(html).toContain(
      `<link rel="alternate" hrefLang="en" href="${ORIGIN}/about/"`,
    );
    expect(html).toContain(
      `<link rel="alternate" hrefLang="zh-CN" href="${ORIGIN}/zh/about/"`,
    );
  });

  it("uses permanent redirects for missing trailing slashes", async () => {
    const [about, zhHome, withQuery] = await Promise.all([
      appFetch(`${ORIGIN}/about`),
      appFetch(`${ORIGIN}/zh`),
      appFetch(`${ORIGIN}/about?q=1`),
    ]);

    expect(about.status).toBe(308);
    expect(about.headers.get("location")).toBe(`${ORIGIN}/about/`);
    expect(zhHome.status).toBe(308);
    expect(zhHome.headers.get("location")).toBe(`${ORIGIN}/zh/`);
    expect(withQuery.headers.get("location")).toBe(`${ORIGIN}/about/?q=1`);
  });

  it("applies security headers to page responses", async () => {
    const response = await appFetch(`${ORIGIN}/`);

    expect(response.headers.get("x-frame-options")).toBe("DENY");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("content-security-policy")).toContain(
      "frame-ancestors 'none'",
    );
    expect(response.headers.get("strict-transport-security")).toBe(
      "max-age=31536000; includeSubDomains",
    );
  });

  it("ships the no-flash theme boot script", async () => {
    const response = await appFetch(`${ORIGIN}/`);
    const html = await response.text();

    expect(html).toContain("site-theme");
  });

  it("publishes canonical robots and sitemap responses", async () => {
    const [robotsResponse, sitemapResponse] = await Promise.all([
      appFetch(`${ORIGIN}/robots.txt`),
      appFetch(`${ORIGIN}/sitemap.xml`),
    ]);
    const robots = await robotsResponse.text();
    const sitemap = await sitemapResponse.text();

    expect(robotsResponse.status).toBe(200);
    expect(robots).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
    expect(sitemapResponse.status).toBe(200);
    expect(sitemap).toContain(`<loc>${ORIGIN}/</loc>`);
    expect(sitemap).toContain(`<loc>${ORIGIN}/about/</loc>`);
    expect(sitemap).toContain(`<loc>${ORIGIN}/zh/</loc>`);
    expect(sitemap).toContain(`<loc>${ORIGIN}/zh/about/</loc>`);
  });

  it("returns a localized 404 for unknown paths", async () => {
    const [enResponse, zhResponse] = await Promise.all([
      appFetch(`${ORIGIN}/page-that-does-not-exist/`),
      appFetch(`${ORIGIN}/zh/nope/`),
    ]);
    const en = await enResponse.text();
    const zh = await zhResponse.text();

    expect(enResponse.status).toBe(404);
    expect(en).toContain("This page took a wrong turn.");
    expect(zhResponse.status).toBe(404);
    expect(zh).toContain("这个页面走丢了。");
  });

  it("rejects locale prefixes that are not enabled", async () => {
    const response = await appFetch(`${ORIGIN}/fr/`);

    expect(response.status).toBe(404);
  });
});
