import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
});

const speaking = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    eventName: z.string(),
    eventDate: z.coerce.date(),
    type: z.enum(["talk", "podcast", "video/live", "mc"]),
  }),
});

export const collections = {
  blog: blog,
  speaking: speaking,
};
