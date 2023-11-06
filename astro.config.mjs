import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import remarkCodeTitles from "remark-code-titles";
import remarkObsidianCallout from "remark-obsidian-callout";
import astroRemark from "@astrojs/markdown-remark";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://wvovaw.github.io",
  base: "/blog",
  markdown: {
    shikiConfig: {
      theme: "dark-plus",
    },
    remarkPlugins: [remarkCodeTitles, remarkObsidianCallout],
    rehypePlugins: [
      "rehype-slug",
      ["rehype-autolink-headings", { behavior: "prepend" }],
      ["rehype-toc", { headings: ["h1", "h2", "h3"], placeholder: "TOC" }],
    ],
  },
  integrations: [vue(), sitemap({})],
});
