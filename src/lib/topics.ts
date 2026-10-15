// Editorial topics: the grouping the blog offers, and the filter links above
// the home WRITING block. Each post names its topic in frontmatter
// (`topic:`); a post without one falls back to a rule on its category and
// tags, so a new post is never left out.
import type { BlogPost } from "./content";

export const TOPICS = [
  { slug: "ai-security", label: "AI and security" },
  { slug: "engineering", label: "Engineering and Go" },
  { slug: "looking-back", label: "Looking back" },
] as const;

export type TopicSlug = (typeof TOPICS)[number]["slug"];

const SLUGS = new Set<string>(TOPICS.map((t) => t.slug));

export function topicOf(post: Pick<BlogPost, "topic" | "category" | "tags">): TopicSlug {
  if (post.topic && SLUGS.has(post.topic)) return post.topic as TopicSlug;
  if (post.category === "Personal") return "looking-back";
  if (post.tags.some((t) => t === "AI" || t === "Security")) return "ai-security";
  return "engineering";
}
