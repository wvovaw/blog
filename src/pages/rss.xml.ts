import rss from "@astrojs/rss";
import { type CollectionEntry, getCollection } from "astro:content";

export async function get() {
  const posts = await getCollection("blog");
  return rss({
    stylesheet: "public/rss/styles.xsl",
    title: "Wvovaw blog",
    description:
      "I post here my knowledges and experience that people might consider as useful",
    site: import.meta.env.PUBLIC_BASE_URL,
    items: posts.map((post: CollectionEntry<"blog">) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,
      link: `/posts/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
