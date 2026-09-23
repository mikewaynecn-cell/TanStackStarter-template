import { Link } from "@tanstack/react-router";

import { JsonLd } from "@/components/seo/json-ld";
import { LOCALE_HTML_LANG, localizePath, type Locale } from "@/lib/i18n";
import { pageHead } from "@/lib/seo/head";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Page copy lives next to the page, one entry per locale; the shared
 * chrome strings (header/footer/404) live in src/lib/i18n.ts instead.
 * Adding a page with the same slug in every locale requires only:
 * content here, route files, and a line in SITE_PAGE_PATHS.
 */
const HOME_CONTENT: Record<
  Locale,
  {
    title: string;
    description: string;
    eyebrow: string;
    heading: string;
    lede: string;
    ctaLabel: string;
    featuresHeading: string;
    features: readonly { title: string; body: string }[];
    faqHeading: string;
    faq: readonly { question: string; answer: string }[];
  }
> = {
  en: {
    title: `Multilingual sites on Cloudflare Workers`,
    description:
      "A pure-frontend website starter with built-in i18n, SEO foundation and one-command deploys to Cloudflare Workers.",
    eyebrow: "TanStack Start template",
    heading: "Ship multilingual sites on Cloudflare Workers.",
    lede: "This is the home page of the starter template. Replace its copy in src/pages/home.tsx, adjust the chrome strings in src/lib/i18n.ts, and deploy — everything else (routing, hreflang, sitemap, themes) is already wired.",
    ctaLabel: "About this template",
    featuresHeading: "What is in the foundation",
    features: [
      {
        title: "i18n built in",
        body: "Default locale on unprefixed URLs, extra locales under /zh/… prefixes. Language switcher, localized html lang and hreflang clusters all derive from one config file.",
      },
      {
        title: "Cloudflare Workers",
        body: "SSR through @cloudflare/vite-plugin with security headers, canonical-host redirects and permanent trailing-slash normalization in src/server.ts.",
      },
      {
        title: "SEO foundation",
        body: "Per-page canonical + Open Graph/Twitter metadata, robots.txt and sitemap.xml as server routes, JSON-LD helpers, light/dark themes without a flash.",
      },
      {
        title: "Quality gates",
        body: "ESLint + typescript-eslint, strict tsc, unit tests and real Worker route tests behind one command: npm run check.",
      },
    ],
    faqHeading: "FAQ",
    faq: [
      {
        question: "How do I add a new language?",
        answer:
          "Append the locale code to LOCALES in src/lib/i18n.ts, fill its prefix and dictionary (missing keys fall back to English), translate the page dictionaries, then flip it into ENABLED_LOCALES. The /$locale/ route segment starts serving it immediately.",
      },
      {
        question: "How do I add a new page?",
        answer:
          "Create a content module in src/pages/, add two thin route files (one at the root for the default locale, one under src/routes/$locale/), and register the canonical path in SITE_PAGE_PATHS so it joins the sitemap and hreflang clusters.",
      },
    ],
  },
  zh: {
    title: "部署在 Cloudflare Workers 上的多语言网站",
    description:
      "内置 i18n、SEO 基础设施、一条命令部署到 Cloudflare Workers 的纯前端网站起步模板。",
    eyebrow: "TanStack Start 模板",
    heading: "在 Cloudflare Workers 上交付多语言网站。",
    lede: "这是起步模板的首页。请在 src/pages/home.tsx 中替换文案，在 src/lib/i18n.ts 中调整站点通用文案，然后部署 —— 路由、hreflang、站点地图、明暗主题等其余部分都已就绪。",
    ctaLabel: "关于本模板",
    featuresHeading: "底座包含什么",
    features: [
      {
        title: "内置 i18n",
        body: "默认语言使用无前缀 URL，其他语言挂在 /zh/… 前缀下。语言切换器、html lang、hreflang 集群全部由同一个配置文件派生。",
      },
      {
        title: "Cloudflare Workers",
        body: "通过 @cloudflare/vite-plugin 进行 SSR，src/server.ts 统一注入安全响应头、规范域名跳转与永久尾斜杠归一化。",
      },
      {
        title: "SEO 基础",
        body: "每页独立的 canonical 与 Open Graph/Twitter 元数据、以服务端路由实现的 robots.txt 和 sitemap.xml、JSON-LD 辅助组件、无闪烁的明暗主题。",
      },
      {
        title: "质量门禁",
        body: "ESLint + typescript-eslint、严格模式 tsc、单元测试与真实 Worker 路由测试，全部汇总在一条命令里：npm run check。",
      },
    ],
    faqHeading: "常见问题",
    faq: [
      {
        question: "如何新增一种语言？",
        answer:
          "在 src/lib/i18n.ts 的 LOCALES 中追加语言代码，补齐前缀和词典（缺失的键会回退到英文），翻译各页面词典，然后把它加入 ENABLED_LOCALES。/$locale/ 路由段会立即开始服务该语言。",
      },
      {
        question: "如何新增一个页面？",
        answer:
          "在 src/pages/ 下创建内容模块，添加两个薄路由文件（默认语言一个放在 src/routes/ 根下，另一个放在 src/routes/$locale/ 下），并把规范路径登记进 SITE_PAGE_PATHS，使其进入站点地图和 hreflang 集群。",
      },
    ],
  },
};

export function homeHead(locale: Locale) {
  const content = HOME_CONTENT[locale];
  return pageHead({
    title: content.title,
    description: content.description,
    canonical: localizePath("/", locale),
    locale,
  });
}

export function HomePage({ locale }: { locale: Locale }) {
  const content = HOME_CONTENT[locale];

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: LOCALE_HTML_LANG[locale],
    description: content.description,
  };

  return (
    <>
      <JsonLd data={websiteJsonLd} />

      <section className="hero-section">
        <div className="shell">
          <p className="eyebrow eyebrow--accent">{content.eyebrow}</p>
          <h1>{content.heading}</h1>
          <p className="hero-lede">{content.lede}</p>
          <div className="hero-actions">
            <Link
              className="button button--primary"
              to={localizePath("/about/", locale)}
            >
              {content.ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="section-tint section-space">
        <div className="shell">
          <h2>{content.featuresHeading}</h2>
          <div className="feature-grid">
            {content.features.map((feature) => (
              <div className="feature-card" key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="shell narrow-column">
          <h2>{content.faqHeading}</h2>
          <div className="faq-list">
            {content.faq.map((item) => (
              <details className="faq-item" key={item.question}>
                <summary>{item.question}</summary>
                <div className="faq-answer">{item.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
