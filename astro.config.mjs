import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import image from "@astrojs/image";
import remarkCodeTitles from "remark-code-titles";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://wvovaw.github.io",
  base: "/b/",
  markdown: {
    shikiConfig: {
      theme: "vitesse-dark",
    },
    remarkPlugins: [remarkCodeTitles],
  },
  integrations: [vue(), image(), sitemap({})],
});
