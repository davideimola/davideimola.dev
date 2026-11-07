// Blog series: a run of posts announced as one, read in order. The series and
// their planned parts are editorial copy in src/content/series.json; a part
// becomes a post by naming it in `post`, and until then it shows as upcoming
// with its planned date (an honest public commitment: when a date slips, edit
// the JSON). Nothing about a published part is restated: its title and date
// come from the post itself, only `short` (the line in the narrow series list)
// is the JSON's own.
//
// `resolveSeries` and `seriesOfPost` are pure, so the tests and the stories
// reach them without the filesystem; `getAllSeries` / `getPostSeries` are the
// server-side seam.
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import type { BlogPost } from "./content";
import { getAllPosts } from "./content";
import { CONTENT_DIR, readContentJson } from "./content-json";

const SeriesEntrySchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  parts: z
    .array(
      z.object({
        title: z.string().min(1),
        short: z.string().min(1),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        post: z.string().min(1).optional(),
      })
    )
    .min(2),
});

export type SeriesEntry = z.infer<typeof SeriesEntrySchema>;

export interface SeriesPart {
  /** 1-based position in the series. */
  number: number;
  title: string;
  short: string;
  date: string;
  /** The post's slug once the part is published; null while it is upcoming. */
  slug: string | null;
}

export interface ResolvedSeries {
  slug: string;
  title: string;
  parts: SeriesPart[];
}

export interface PostInSeries {
  series: ResolvedSeries;
  part: SeriesPart;
  /** The part after this one, published or not; null on the last part. */
  next: SeriesPart | null;
}

type PostLike = Pick<BlogPost, "slug" | "title" | "date">;

/**
 * Resolves each part against the published posts. A `post` that names no
 * file at all throws, so a renamed post breaks the build instead of quietly
 * turning its part back into "upcoming"; a post that exists but is not
 * published (a draft, in production) stays upcoming on purpose.
 */
export function resolveSeries(
  entries: SeriesEntry[],
  published: PostLike[],
  postExists: (slug: string) => boolean
): ResolvedSeries[] {
  const seenSeries = new Set<string>();
  const seenPosts = new Set<string>();
  return entries.map((entry) => {
    if (seenSeries.has(entry.slug))
      throw new Error(`series.json: duplicate series "${entry.slug}".`);
    seenSeries.add(entry.slug);
    return {
      slug: entry.slug,
      title: entry.title,
      parts: entry.parts.map((part, i) => {
        const number = i + 1;
        if (!part.post) return { number, ...part, slug: null };
        if (seenPosts.has(part.post)) {
          throw new Error(`series.json: post "${part.post}" belongs to more than one part.`);
        }
        seenPosts.add(part.post);
        if (!postExists(part.post)) {
          throw new Error(
            `series.json: "${entry.slug}" part ${number} names unknown post "${part.post}".`
          );
        }
        const post = published.find((p) => p.slug === part.post);
        if (!post)
          return { number, title: part.title, short: part.short, date: part.date, slug: null };
        return { number, title: post.title, short: part.short, date: post.date, slug: post.slug };
      }),
    };
  });
}

/** The series a published post belongs to, its part and the part after it. */
export function seriesOfPost(all: ResolvedSeries[], slug: string): PostInSeries | null {
  for (const series of all) {
    const i = series.parts.findIndex((p) => p.slug === slug);
    if (i !== -1) return { series, part: series.parts[i], next: series.parts[i + 1] ?? null };
  }
  return null;
}

/** "Part 1 of 4", the label a series post carries wherever it is listed. */
export function partLabel({ series, part }: Pick<PostInSeries, "series" | "part">): string {
  return `Part ${part.number} of ${series.parts.length}`;
}

export function getAllSeries(): ResolvedSeries[] {
  const entries = z.array(SeriesEntrySchema).parse(readContentJson<unknown>("series.json"));
  return resolveSeries(entries, getAllPosts(), (slug) =>
    fs.existsSync(path.join(CONTENT_DIR, "blog", `${slug}.mdx`))
  );
}

export function getPostSeries(slug: string): PostInSeries | null {
  return seriesOfPost(getAllSeries(), slug);
}
