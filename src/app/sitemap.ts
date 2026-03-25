import type { MetadataRoute } from "next";
import { getAllPosts } from "../lib/content";

const BASE_URL = "https://davideimola.dev";

const STATIC_ROUTES = [
  { url: BASE_URL, priority: 1.0, changeFrequency: "weekly" as const },
  { url: `${BASE_URL}/about`, priority: 0.9, changeFrequency: "monthly" as const },
  { url: `${BASE_URL}/now`, priority: 0.8, changeFrequency: "weekly" as const },
  { url: `${BASE_URL}/blog`, priority: 0.8, changeFrequency: "weekly" as const },
  { url: `${BASE_URL}/speaking`, priority: 0.7, changeFrequency: "monthly" as const },
  { url: `${BASE_URL}/projects`, priority: 0.7, changeFrequency: "monthly" as const },
  { url: `${BASE_URL}/uses`, priority: 0.6, changeFrequency: "monthly" as const },
  { url: `${BASE_URL}/contact`, priority: 0.5, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  return [...STATIC_ROUTES, ...posts];
}
