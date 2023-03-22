import rss, { pagesGlobToRssItems } from "@astrojs/rss";

export async function get() {
  console.log("Base url now: ", import.meta.env.PUBLIC_BASE_URL);
  return rss({
    stylesheet: "public/rss/styles.xsl",
    title: "Wvovaw blog",
    description:
      "I post here my knowledges and experience that people might consider as useful",
    site: import.meta.env.PUBLIC_BASE_URL,
    // site: "https://wvovaw.github.io/blog",
    items: await pagesGlobToRssItems(import.meta.glob("./blog/**/*.md")),
    customData: `<language>en-us</language>`,
  });
}
