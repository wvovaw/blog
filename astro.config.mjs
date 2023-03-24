import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import image from "@astrojs/image";
import remarkCodeTitles from "remark-code-titles";
import astroRemark from "@astrojs/markdown-remark";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://wvovaw.github.io",
  base: "/blog",
  markdown: {
    shikiConfig: {
      theme: "vitesse-dark",
    },
    remarkPlugins: [remarkCodeTitles],
    rehypePlugins: [
      "rehype-slug",
      ["rehype-autolink-headings", { behavior: "prepend" }],
      ["rehype-toc", { headings: ["h1", "h2", "h3"], placeholder: "TOC" }],
    ],
  },
  integrations: [vue(), image(), sitemap({})],
});
