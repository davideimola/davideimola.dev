// Editorial topics: the three columns of the home "By topic" block and the
// grouping the blog offers. Each post names its topic in frontmatter
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

export interface TopicGroup<T> {
  slug: TopicSlug;
  label: string;
  posts: T[];
}

/**
 * Posts per topic, newest first (the input order), at most `perTopic` each,
 * leaving out `exclude` (the post already on the WRITING card). A topic with
 * nothing in it is dropped.
 */
export function groupByTopic<T extends Pick<BlogPost, "slug" | "topic" | "category" | "tags">>(
  posts: T[],
  { exclude, perTopic = 3 }: { exclude?: string; perTopic?: number } = {}
): TopicGroup<T>[] {
  return TOPICS.map(({ slug, label }) => ({
    slug,
    label,
    posts: posts.filter((p) => p.slug !== exclude && topicOf(p) === slug).slice(0, perTopic),
  })).filter((group) => group.posts.length > 0);
}
