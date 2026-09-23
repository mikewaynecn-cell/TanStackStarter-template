# TanStackStarter Template

通用的**纯前端网站起步模板**：内置 i18n 底座、SEO 基础设施与明暗主题，一条命令部署到 Cloudflare Workers，可直接复用于各类内容站 / 工具站。

## 特性一览

- **TanStack Start**（React 19）+ **Vite 8** + **Tailwind CSS 4**：file-based routing、`trailingSlash: "always"`、`defaultPreload: "intent"`、滚动恢复
- **i18n 底座**：默认语言无前缀 URL，其他语言挂 `/zh/` 前缀；语言切换器、`html lang`、hreflang 集群、sitemap、404 文案全部由单一配置文件（`src/lib/i18n.ts`）派生，新增语言零路由改动
- **SEO**：每页 canonical + Open Graph/Twitter 元数据、`robots.txt` / `sitemap.xml` 服务端路由、Organization/WebSite JSON-LD、规范域名 301 与尾斜杠 308 归一化
- **安全**：CSP、`X-Frame-Options: DENY`、`nosniff`、Referrer-Policy、Permissions-Policy、HTTPS 下自动 HSTS
- **体验**：明暗双主题（首帧前应用，无白闪）、响应式布局（桌面导航 + 移动端菜单）、`prefers-reduced-motion` 适配
- **质量门禁**：Prettier + ESLint + 严格 tsc + 单元测试 + 真实 Worker 运行时路由测试 + 客户端产物体积预算，全部汇总在 `npm run check`

## 快速开始

前置要求：Node.js ≥ 22、npm。依赖版本已通过 `package-lock.json` 固化，直接安装即可。

```bash
npm install
npm run generate-routes   # 创建/删除 src/routes/ 下文件后重新生成 src/routeTree.gen.ts
npm run dev               # http://localhost:3000
```

可用页面：`/`、`/about/`（默认语言 en）与 `/zh/`、`/zh/about/`（中文），另加 `/robots.txt`、`/sitemap.xml`。

## 常用脚本

| 命令                              | 说明                                         |
| --------------------------------- | -------------------------------------------- |
| `npm run dev`                     | 本地开发服务器（端口 3000）                  |
| `npm run build`                   | 生产构建到 `dist/`                           |
| `npm run preview`                 | 本地运行生产构建的 Worker                    |
| `npm run deploy`                  | `build` + `wrangler deploy` 一键部署         |
| `npm run generate-routes`         | 重新生成 TanStack Router 路由树              |
| `npm run cf-typegen`              | 生成 Cloudflare 环境类型（`wrangler types`） |
| `npm run format` / `format:check` | Prettier 格式化 / 校验                       |
| `npm run lint`                    | ESLint（`--max-warnings=0`，零警告）         |
| `npm run typecheck`               | 严格模式 `tsc --noEmit`                      |
| `npm run test:unit`               | i18n / redirect 纯函数单测                   |
| `npm run test:routes`             | build 后在真实 Worker 运行时里测 HTTP 路由   |
| `npm run check:bundle`            | 客户端 JS 产物 gzip 体积预算（130 KiB）      |
| `npm run check`                   | 上述全部门禁一次跑完                         |

## 环境变量

| 变量               | 位置                                  | 说明                                                                   |
| ------------------ | ------------------------------------- | ---------------------------------------------------------------------- |
| `VITE_SITE_URL`    | `.env`（见 `.env.example`）           | 站点规范 URL，本地预览或部署环境可覆盖；默认 `https://www.example.com` |
| （Worker secrets） | `.dev.vars`（见 `.dev.vars.example`） | 底座阶段无需任何密钥；未来接入 API 时在此添加                          |

## 站点定制清单

克隆后按顺序改这几处即可变成自己的站：

1. **站点信息**：`src/lib/site.ts` —— 站名、描述、联系邮箱、`SITE_URL`；绑定域名后把 `CANONICAL_HOST` 设为规范主机名（如 `www.example.com`），启用全站 301 规范化
2. **语言配置**：`src/lib/i18n.ts` —— 语言列表、默认语言、前缀、chrome 词典（页头/页脚/404 文案）
3. **页面内容**：`src/pages/*.tsx` —— 每页一份按语言的文案字典 + 页面组件
4. **品牌视觉**：`public/icon.svg`（favicon）+ `src/components/site/site-header.tsx` / `site-footer.tsx` 里的 wordmark SVG + `src/app/globals.css` 设计令牌（`--signal` 强调色、`--paper` 底色等，`.dark` 一节同步调整）
5. **部署配置**：`wrangler.jsonc` —— Worker 名称、`routes` 自定义域名

## 目录结构

```
├── public/               # 静态资源（icon.svg、_headers 不可变缓存规则）
├── scripts/
│   └── check-client-assets.mjs   # 产物体积预算检查
├── src/
│   ├── app/globals.css   # 设计令牌（明/暗两套）+ 站点骨架样式（Tailwind 可叠加）
│   ├── components/
│   │   ├── seo/json-ld.tsx       # JSON-LD 注入组件
│   │   └── site/                 # 页头、页脚、语言切换、主题切换
│   ├── lib/
│   │   ├── i18n.ts       # 语言注册表、路径派生、hreflang、chrome 词典（i18n 单一事实来源）
│   │   ├── site.ts       # 站点名、URL、联系方式、规范域名
│   │   ├── redirect.ts   # 尾斜杠 / 规范域名跳转纯函数
│   │   └── seo/head.ts   # 每页 meta 辅助（OG/Twitter/canonical/hreflang）
│   ├── pages/            # 页面内容组件 + 按语言文案字典
│   ├── routes/           # TanStack file routes
│   │   ├── __root.tsx    # 文档外壳（html lang、主题启动脚本、404）
│   │   ├── index.tsx / about.tsx        # 默认语言页面
│   │   ├── $locale.tsx   # 非默认语言布局门（校验前缀，未启用即 404）
│   │   ├── $locale/      # 非默认语言页面（index、about）
│   │   └── robots[.]txt.ts / sitemap[.]xml.ts   # 服务端路由
│   ├── router.tsx        # 路由器配置
│   ├── server.ts         # Worker 入口：安全响应头、HSTS、301/308 跳转
│   └── styles.css        # 样式入口
└── tests/                # 单测 + Worker 路由测试
```

## i18n 指南

方案：默认语言（`en`）使用无前缀 URL；其他语言使用路径前缀（如 `/zh/…`）。所有语言共享同一 slug，因此 hreflang、语言切换器和 sitemap 都从 `SITE_PAGE_PATHS` + 前缀表自动派生，无需逐路由登记。

**新增语言**（以 `ja` 为例）：

1. `src/lib/i18n.ts`：在 `LOCALES` 追加 `"ja"`，补 `LOCALE_HTML_LANG`（`"ja"`）、`LOCALE_PREFIX`（`"/ja"`）、`LOCALE_SELF_NAME`（`"日本語"`）；
2. 翻译 chrome 词典（新增 `JA_STRINGS`，缺失键自动回退英文）与 `src/pages/*.tsx` 里的页面文案；
3. 把 `"ja"` 加进 `ENABLED_LOCALES`，并在 `language-switcher.tsx` 的 `LOCALE_BADGE_LABEL` 补徽章标签。

`/$locale/` 路由段即刻开始服务 `/ja/…`，sitemap 与 hreflang 自动扩展。

**新增页面**（以 `/pricing/` 为例）：

1. `src/pages/pricing.tsx`：按语言的文案字典 + `pricingHead(locale)` + `PricingPage({ locale })`；
2. 两个薄路由文件：`src/routes/pricing.tsx`（默认语言）与 `src/routes/$locale/pricing.tsx`（前缀语言）；
3. `src/lib/i18n.ts` 的 `SITE_PAGE_PATHS` 登记规范路径 `"/pricing/"`（进 sitemap / hreflang）；
4. 需要进导航的话，在 `site-header.tsx` / `site-footer.tsx` 的 links 里补一行。

**禁用某语言**：从 `ENABLED_LOCALES` 移除即可 —— 该前缀返回 404，语言菜单显示“即将上线”。

**更换默认语言**：改 `DEFAULT_LOCALE` 并同步调整 `LOCALE_PREFIX`（新默认语言前缀清空、原默认语言补前缀），再翻译根路由页面的 `locale` 参数。

## SEO 基线

- 每页独立的 `<title>`（自动追加站名后缀，已含站名则不重复）、description、canonical、og:locale/og:url、Twitter card（`src/lib/seo/head.ts`）
- hreflang 集群覆盖全部启用语言 + `x-default`（React 以 `hrefLang` 驼峰输出该属性，HTML 属性名大小写不敏感，解析后即 `hreflang`）
- `robots.txt` 指向 sitemap；`sitemap.xml` 由 `SITE_PAGE_PATHS × ENABLED_LOCALES` 自动生成全部语言的 URL
- Organization JSON-LD 在根文档注入，WebSite JSON-LD 在首页注入（`src/components/seo/json-ld.tsx`）
- 无扩展名路径 308 到尾斜杠形式（保留查询串），带扩展名的静态文件与 `/robots.txt` 除外

## 安全与性能基线

- `src/server.ts` 统一注入 CSP、`X-Frame-Options: DENY`、`nosniff`、Referrer-Policy、Permissions-Policy；HTTPS 非本地响应带 HSTS
- 主题在首帧前由内联脚本应用（localStorage `site-theme`），深色模式无白闪
- `public/_headers` 对 `/assets/*` 设置 `max-age=31536000, immutable`（内容寻址文件名）
- 客户端 JS 产物预算 130 KiB gzip（`npm run check:bundle`，超出即失败；额度可在 `scripts/check-client-assets.mjs` 调整）

## 部署（Cloudflare Workers）

```bash
npx wrangler login     # 一次
npm run deploy         # vite build + wrangler deploy
```

默认部署到 `<name>.workers.dev`（`wrangler.jsonc` 的 `name` 决定）。绑定自定义域名：

1. `wrangler.jsonc` 加 `"routes": [{ "pattern": "www.example.com", "custom_domain": true }]`；
2. `src/lib/site.ts` 设置 `CANONICAL_HOST = "www.example.com"` —— 之后所有非规范 host 301 到 `https://<规范域名>`（保留路径与查询串）并启用 HSTS；
3. 环境变量 `VITE_SITE_URL` 在构建时指向正式域名（CI 里设置，或构建前 export）。

## 测试说明

- **单元测试**（`tests/*.unit.test.ts`）：i18n 路径派生 / hreflang、跳转纯函数，node 环境直接跑
- **Worker 路由测试**（`tests/routes.worker.test.ts`）：先 `vite build`，再用 `@cloudflare/vitest-plugin` 在真实 Worker 运行时里请求构建产物，覆盖双语言页面渲染、canonical/hreflang、308 跳转、安全响应头、robots/sitemap、双语言 404、未启用前缀拒绝

## 已知注意事项

- 依赖版本已由 `package-lock.json` 固化；本机 npm ≤ 10.9 直接解析本套依赖可能触发 Arborist 的 `edgesOut` 崩溃，保留 lockfile 安装即可避开
- `src/routeTree.gen.ts` 为生成文件（已加入 lint/format 忽略），不要手改

## 许可证

[MIT](./LICENSE) — 可自由用于个人与商业项目，克隆改造成自己的站点时无需保留署名。
