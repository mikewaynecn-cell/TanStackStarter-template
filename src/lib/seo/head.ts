import { LOCALE_HTML_LANG, localeAlternates, type Locale } from "@/lib/i18n";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

type PageHeadOptions = {
  title: string;
  description: string;
  /** Localized canonical path of this page ("/" or "/zh/about/"). */
  canonical: string;
  locale: Locale;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  openGraphType?: "website" | "article";
};

export function pageHead({
  title,
  description,
  canonical,
  locale,
  image,
  imageWidth = 1200,
  imageHeight = 800,
  openGraphType = "website",
}: PageHeadOptions) {
  const normalizedTitle = title.toLowerCase();
  const brand = SITE_NAME.toLowerCase();
  const hasBrand = normalizedTitle.includes(brand);
  const fullTitle = hasBrand ? title : `${title} | ${SITE_NAME}`;
  const imageUrl = image ? absoluteUrl(image) : undefined;

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:locale", content: LOCALE_HTML_LANG[locale] },
      { property: "og:type", content: openGraphType },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:url", content: absoluteUrl(canonical) },
      ...(imageUrl
        ? [
            { property: "og:image", content: imageUrl },
            { property: "og:image:width", content: String(imageWidth) },
            { property: "og:image:height", content: String(imageHeight) },
          ]
        : []),
      {
        name: "twitter:card",
        content: imageUrl ? "summary_large_image" : "summary",
      },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      ...(imageUrl ? [{ name: "twitter:image", content: imageUrl }] : []),
    ],
    links: [
      { rel: "canonical", href: absoluteUrl(canonical) },
      // hreflang cluster covers every enabled locale + x-default.
      ...localeAlternates(canonical).map((row) => ({
        rel: "alternate",
        hrefLang: row.hrefLang,
        href: row.href,
      })),
    ],
  };
}
