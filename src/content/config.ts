import { defineCollection, z } from "astro:content";

const articles = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    lang: z.enum(["fr", "en"]),
    image: z.string().optional(),
    category: z.string().optional(),
    source: z.string().optional(),
    sourceUrl: z.string().url().optional()
  })
});

export const collections = { articles };
