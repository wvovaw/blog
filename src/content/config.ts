import { z, defineCollection, reference } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    author: z.string().default("Anonymous"),
    title: z.string(),
    description: z.string(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
      width: z.number(),
      height: z.number(),
    }),
    tags: z.array(z.string()),
    relatedPosts: z.array(reference("blog")).optional(),
    publishDate: z.date(),
    isDraft: z.boolean().optional().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};
