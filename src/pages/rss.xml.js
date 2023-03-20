import rss, { pagesGlobToRssItems } from "@astrojs/rss";

export async function get() {
  return rss({
    title: "Wvovaw blog",
    description:
      "I post here knowledges and my experience that people might consider as useful",
    site: "https://wvovaw.github.io/blog",
    items: await pagesGlobToRssItems(import.meta.glob("./**/*.md")),
    customData: `<language>en-us</language>`,
  });
}
