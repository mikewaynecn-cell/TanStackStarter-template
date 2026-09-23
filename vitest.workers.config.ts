import { cloudflareTest } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: "./dist/server/wrangler.json" },
    }),
  ],
  test: {
    include: ["tests/routes.worker.test.ts"],
  },
});
