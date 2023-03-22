import { defineConfig } from 'astro/config';
import vue from "@astrojs/vue";
import image from "@astrojs/image";
import remarkCodeTitles from "remark-code-titles";

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: "vitesse-dark"
    },
    remarkPlugins: [remarkCodeTitles]
  },
  integrations: [vue(), image()]
});
