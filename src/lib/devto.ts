import type { BlogPost } from "./content";
import { rasterCover } from "./covers";
import { postBodyMarkdown, SITE_URL } from "./llms";

// A post's Syndicated copy on dev.to (ADR-0007, CONTEXT.md): the post's own
// words, adapted only to what dev.to can display, with the post as its
// canonical. Pure, so the daily Action and `pnpm devto:push` share it and the
// tests can read it.

/** The first publish date the daily Action brings over; older posts go by hand. */
export const SYNDICATION_START = "2026-11-12";

/** Days between a post going live and its copy, so search engines meet the original first. */
export const SYNDICATION_DELAY_DAYS = 3;

const MAX_TAGS = 4;
// dev.to refuses the whole article over a tag longer than this.
const MAX_TAG_LENGTH = 30;

/** What the API takes to create or rewrite an article. */
export interface DevtoArticle {
  title: string;
  description: string;
  body_markdown: string;
  published: boolean;
  tags: string[];
  canonical_url: string;
  main_image?: string;
  series?: string;
}

/** The fields of an article on the account that the sync compares (`GET /articles/me/all`). */
export interface DevtoExisting {
  id: number;
  published: boolean;
  title: string;
  description: string;
  body_markdown: string;
  tag_list: string[];
  canonical_url: string | null;
}

export type SyncStep =
  | { action: "create"; post: BlogPost }
  | { action: "update"; post: BlogPost; id: number };

/** dev.to tags: at most four, lowercase letters and digits only. */
export function devtoTags(post: BlogPost): string[] {
  const tags = (post.devtoTags ?? post.tags)
    .map((tag) => tag.toLowerCase().replace(/[^a-z0-9]/g, ""))
    .filter((tag) => tag.length > 0 && tag.length <= MAX_TAG_LENGTH);
  return [...new Set(tags)].slice(0, MAX_TAGS);
}

const ALERT = /^> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*$/gm;
const TITLED_FENCE = /^```(\w*)[ \t]+title="([^"]+)"[ \t]*$/gm;

/** The post's body as dev.to can display it, closed by the line naming the original. */
export function toDevtoMarkdown(post: BlogPost, baseUrl = SITE_URL): string {
  const body = postBodyMarkdown(post.content, baseUrl, true)
    .replace(
      TITLED_FENCE,
      (_fence, lang: string, title: string) => `**\`${title}\`**\n\n\`\`\`${lang}`
    )
    .replace(ALERT, (_alert, kind: string) => `> **${kind[0]}${kind.slice(1).toLowerCase()}**`);
  const footer =
    `*This post was first published on [davideimola.dev](${baseUrl}/blog/${post.slug}). ` +
    `If you want the next one in your inbox, [subscribe to the newsletter](${baseUrl}/newsletter).*`;
  return `${body}\n\n---\n\n${footer}\n`;
}

export function toDevtoArticle(
  post: BlogPost,
  series: string | null,
  baseUrl = SITE_URL
): DevtoArticle {
  return {
    title: post.title,
    description: post.excerpt,
    body_markdown: toDevtoMarkdown(post, baseUrl),
    published: true,
    tags: devtoTags(post),
    canonical_url: `${baseUrl}/blog/${post.slug}`,
    ...(post.heroImage ? { main_image: `${baseUrl}${rasterCover(post.heroImage)}` } : {}),
    ...(series ? { series } : {}),
  };
}

/**
 * The post a canonical URL names, however it was written: the RSS import
 * left copies behind with `www.` and trailing slashes.
 */
export function canonicalKey(url: string | null): string | null {
  if (!url) return null;
  return url
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "");
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Whether the daily Action should bring this post over by `today` (YYYY-MM-DD, Rome). */
export function isDueForSyndication(post: BlogPost, today: string): boolean {
  if (post.draft || post.syndicate === false) return false;
  if (post.date < SYNDICATION_START) return false;
  return addDays(post.date, SYNDICATION_DELAY_DAYS) <= today;
}

/** Whether dev.to holds something other than what the post generates now. */
export function articleChanged(existing: DevtoExisting, wanted: DevtoArticle): boolean {
  return (
    existing.published !== wanted.published ||
    existing.title !== wanted.title ||
    existing.description !== wanted.description ||
    existing.body_markdown.trim() !== wanted.body_markdown.trim() ||
    [...existing.tag_list].sort().join(",") !== [...wanted.tags].sort().join(",")
  );
}

/**
 * What the daily Action does, with no state of its own: a due post with no
 * copy gets one; a published copy is rewritten whenever the post has changed,
 * whatever its date; a draft copy (left by the old RSS import) is touched
 * only once the post is due, so the archive never lands all at once.
 */
export function planSync(posts: BlogPost[], existing: DevtoExisting[], today: string): SyncStep[] {
  const byKey = new Map(existing.map((a) => [canonicalKey(a.canonical_url), a]));
  const steps: SyncStep[] = [];
  for (const post of posts) {
    if (post.draft || post.syndicate === false) continue;
    const wanted = toDevtoArticle(post, null);
    const copy = byKey.get(canonicalKey(wanted.canonical_url));
    const due = isDueForSyndication(post, today);
    if (!copy) {
      if (due) steps.push({ action: "create", post });
      continue;
    }
    if (!copy.published && !due) continue;
    // The series and the cover are not compared: dev.to answers with its own
    // cover URL and no series, so they are sent with every write, not checked.
    if (articleChanged(copy, wanted)) {
      steps.push({ action: "update", post, id: copy.id });
    }
  }
  return steps;
}
