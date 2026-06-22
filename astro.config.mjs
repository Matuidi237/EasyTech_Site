import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";

export default defineConfig({
  site: "https://easytechgroup.net",
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [sitemap()],
  server: { port: 4322, host: true },
  i18n: {
    defaultLocale: "fr",
    locales: ["fr", "en"],
    routing: {
      prefixDefaultLocale: true
    }
  }
});
