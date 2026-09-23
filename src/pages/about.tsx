import { Link } from "@tanstack/react-router";

import { localizePath, type Locale } from "@/lib/i18n";
import { pageHead } from "@/lib/seo/head";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

const ABOUT_CONTENT: Record<
  Locale,
  { title: string; description: string; eyebrow: string; lede: string }
> = {
  en: {
    title: "About this template",
    description:
      "What ships with the TanStack Start website starter, and where to change the pieces you will touch first.",
    eyebrow: "About",
    lede: `${SITE_NAME} is a reusable foundation for pure-frontend content sites: TanStack Start (React 19) + Vite + Tailwind CSS 4, deployed to Cloudflare Workers.`,
  },
  zh: {
    title: "关于本模板",
    description:
      "TanStack Start 网站起步模板包含哪些内容，以及你最可能先修改的部分在哪里。",
    eyebrow: "关于",
    lede: "本模板是纯前端内容站的可复用底座：TanStack Start（React 19）+ Vite + Tailwind CSS 4，部署在 Cloudflare Workers 上。",
  },
};

export function aboutHead(locale: Locale) {
  const content = ABOUT_CONTENT[locale];
  return pageHead({
    title: content.title,
    description: content.description,
    canonical: localizePath("/about/", locale),
    locale,
  });
}

export function AboutPage({ locale }: { locale: Locale }) {
  const content = ABOUT_CONTENT[locale];

  return (
    <section className="page-hero section-space">
      <div className="shell narrow-column">
        <p className="eyebrow eyebrow--accent">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <div className="prose-copy">
          <p className="page-lede">{content.lede}</p>
          <SourceNote locale={locale} />
        </div>
      </div>
    </section>
  );
}

function SourceNote({ locale }: { locale: Locale }) {
  if (locale === "zh") {
    return (
      <div className="source-note">
        <p style={{ margin: 0 }}>
          定制入口：站点名与联系方式在 <code>src/lib/site.ts</code>
          ；语言与词典在 <code>src/lib/i18n.ts</code>；页面文案在{" "}
          <code>src/pages/</code>；部署配置在 <code>wrangler.jsonc</code>
          。完整说明见仓库 <code>README.md</code>，联系邮箱{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          。也可以返回<Link to="/">首页</Link>。
        </p>
      </div>
    );
  }

  return (
    <div className="source-note">
      <p style={{ margin: 0 }}>
        Where to customize: site name and contact live in{" "}
        <code>src/lib/site.ts</code>; locales and dictionaries in{" "}
        <code>src/lib/i18n.ts</code>; page copy in <code>src/pages/</code>;
        deployment in <code>wrangler.jsonc</code>. See <code>README.md</code>{" "}
        for the full guide, or write to{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. You can also
        head back <Link to="/">home</Link>.
      </p>
    </div>
  );
}
