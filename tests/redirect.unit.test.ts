import { describe, expect, it } from "vitest";

import {
  canonicalRedirectLocation,
  hasFileExtension,
  trailingSlashRedirectLocation,
} from "@/lib/redirect";

describe("hasFileExtension", () => {
  it.each([
    ["/robots.txt", true],
    ["/icon.svg", true],
    ["/assets/index-abc123.js", true],
    ["/about/", false],
    ["/about", false],
    ["/zh/about/", false],
  ])("classifies %s", (pathname, expected) => {
    expect(hasFileExtension(pathname)).toBe(expected);
  });
});

describe("trailingSlashRedirectLocation", () => {
  it.each([
    ["https://site.test/about", "https://site.test/about/"],
    ["https://site.test/about?q=1", "https://site.test/about/?q=1"],
    ["https://site.test/zh", "https://site.test/zh/"],
  ])("redirects %s permanently", (requestUrl, expected) => {
    expect(trailingSlashRedirectLocation(requestUrl)).toBe(expected);
  });

  it.each([
    "https://site.test/",
    "https://site.test/about/",
    "https://site.test/robots.txt",
    "https://site.test/assets/app.js",
  ])("leaves %s alone", (requestUrl) => {
    expect(trailingSlashRedirectLocation(requestUrl)).toBeNull();
  });
});

describe("canonicalRedirectLocation", () => {
  it("canonicalizes scheme and host in a single hop", () => {
    expect(
      canonicalRedirectLocation("http://alternate.test/about?q=1", "site.test"),
    ).toBe("https://site.test/about/?q=1");
  });

  it("drops any explicit port", () => {
    expect(
      canonicalRedirectLocation("https://site.test:8443/", "site.test"),
    ).toBe("https://site.test/");
  });
});
