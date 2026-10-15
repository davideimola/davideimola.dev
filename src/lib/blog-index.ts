// The shape of /blog, derived from the posts: the topic counts, the archive
// grouped by year, and the START HERE picks.
// Import-free apart from types, so the client list can use it.
import type { BlogPost } from "./content";
import { TOPICS, type TopicSlug, topicOf } from "./topics";

type PostLike = Pick<BlogPost, "slug" | "tags" | "category" | "date">;

export interface TopicCount {
  slug: TopicSlug;
  label: string;
  count: number;
}

/**
 * The three editorial topics with how many posts each holds, in the fixed
 * order: the one filter row on /blog, and the topic links above the home
 * WRITING block.
 */
export function topicCounts(posts: Pick<BlogPost, "topic" | "category" | "tags">[]): TopicCount[] {
  return TOPICS.map(({ slug, label }) => ({
    slug,
    label,
    count: posts.filter((post) => topicOf(post) === slug).length,
  })).filter((topic) => topic.count > 0);
}

export interface YearGroup<T> {
  /** The year, or "Earlier" for everything older than the recent years. */
  label: string;
  earlier: boolean;
  posts: T[];
}

/**
 * Posts (newest first) grouped by year. The `recentYears` most recent years
 * that have posts get a group each; everything older folds into one
 * "Earlier" group, where each row shows its own year.
 */
export function archiveByYear<T extends PostLike>(posts: T[], recentYears = 3): YearGroup<T>[] {
  const years = [...new Set(posts.map((p) => new Date(p.date).getFullYear()))].sort(
    (a, b) => b - a
  );
  const recent = new Set(years.slice(0, recentYears));
  const groups: YearGroup<T>[] = [];
  for (const year of years.slice(0, recentYears)) {
    groups.push({
      label: String(year),
      earlier: false,
      posts: posts.filter((p) => new Date(p.date).getFullYear() === year),
    });
  }
  const older = posts.filter((p) => !recent.has(new Date(p.date).getFullYear()));
  if (older.length > 0) groups.push({ label: "Earlier", earlier: true, posts: older });
  return groups;
}

/** A tag as the slug the ?tag= filter uses. */
export function tagSlug(tag: string): string {
  return tag.toLowerCase();
}

// START HERE: three posts picked by hand for a first-time reader, with one
// line each saying why. Referenced by slug and resolved loudly in the page.
export const START_HERE = [
  {
    slug: "introducing-argus",
    why: "My open-source bet on scanners as tools, a human in the loop, and a model to reason across it all.",
  },
  {
    slug: "stop-prompting-start-thinking",
    why: "The mental model I built working with AI, for code and for writing alike.",
  },
  {
    slug: "i-built-a-tool-i-dont-use",
    why: "What AI made cheap, what it didn't, and letting a project stay an experiment.",
  },
];
