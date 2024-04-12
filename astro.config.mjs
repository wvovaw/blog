import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import remarkCodeTitles from "remark-code-titles";
import remarkObsidianCallout from "remark-obsidian-callout";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://wvovaw.github.io",
  base: "/blog",
  markdown: {
    shikiConfig: {
      themes: {
        light: "min-light",
        dark: "min-dark",
      }
    },
    remarkPlugins: [remarkCodeTitles, remarkObsidianCallout],
    rehypePlugins: [
      "rehype-slug",
      ["rehype-autolink-headings", { behavior: "prepend" }],
      ["rehype-toc", { headings: ["h1", "h2", "h3"], placeholder: "TOC" }],
    ],
  },
  vite: {
    resolve: {
      alias: [
        { find: "@", replacement: fileURLToPath(new URL("./src", import.meta.url)) },
      ],
    },
  },
  publicDir: "./src/shared/public",
  integrations: [sitemap({})],
});
