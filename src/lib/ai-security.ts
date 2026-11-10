// The /ai-security hub: one page that gathers what Davide writes, builds and
// says on stage about securing AI, ordered as a reading path. Everything on
// it is derived from the content the rest of the site already reads; the only
// editorial choices are the slugs below, and each one throws when it names
// nothing, so a rename breaks the build instead of quietly emptying a step.

import {
  type BlogPost,
  getAllPosts,
  getAllProjects,
  getAllTalks,
  type Project,
  type Talk,
} from "./content";
import { getAllSeries, type ResolvedSeries } from "./series";
import { stageSessions } from "./sharing";
import { type CollectionEntry, getSkillCollectionEntries } from "./skills";
import { topicOf } from "./topics";

/** Step 1: the post that states the argument the series builds on. */
export const START_POST = "ai-agent-sessions-data-store";
/** Step 2: the series read in order. */
export const HUB_SERIES = "four-boundaries";
/** Step 3: the skills pack shown beside the flagship. */
export const HUB_SKILLS = "davideimola/appsec-skills";
/** The talk tag that puts a stage session on the hub. */
export const HUB_TALK_TAG = "Security";

/** One talk as the hub lists it: the latest giving, and every event it was given at. */
export interface HubTalk {
  talk: Talk;
  events: string[];
}

/**
 * Stage sessions carrying the hub's tag, newest first, with a talk given more
 * than once folded into one entry under its latest giving.
 */
export function hubTalks(talks: Talk[]): HubTalk[] {
  const sessions = stageSessions(talks)
    .filter((t) => t.tags.includes(HUB_TALK_TAG))
    .sort((a, b) => b.date.localeCompare(a.date));
  const byTitle = new Map<string, HubTalk>();
  for (const talk of sessions) {
    const key = talk.session?.title ?? talk.slug;
    const entry = byTitle.get(key);
    if (entry) entry.events.push(talk.event);
    else byTitle.set(key, { talk, events: [talk.event] });
  }
  return [...byTitle.values()];
}

/** The mono line under the lead: what a CFP reviewer looks for in three seconds. */
export function hubFacts({
  sessions,
  posts,
  series,
  flagship,
}: {
  sessions: Talk[];
  posts: number;
  series: ResolvedSeries | null;
  flagship: Project | null;
}): string[] {
  const facts: string[] = [];
  if (sessions.length > 0) {
    const since = Math.min(...sessions.map((t) => Number(t.date.slice(0, 4))));
    facts.push(
      `${sessions.length} security talk${sessions.length === 1 ? "" : "s"} since ${since}`
    );
  }
  if (posts > 0) facts.push(`${posts} post${posts === 1 ? "" : "s"}`);
  if (series) facts.push(`a ${series.parts.length}-part series`);
  if (flagship) facts.push(`maintainer of ${flagship.title}`);
  return facts;
}

export interface AiSecurityHub {
  start: BlogPost;
  series: ResolvedSeries;
  flagship: Project | null;
  flagshipPost: BlogPost | null;
  skills: CollectionEntry | null;
  talks: HubTalk[];
  /** Step 5: the rest of the topic, without what the steps above already show. */
  further: BlogPost[];
  facts: string[];
}

export function getAiSecurityHub(): AiSecurityHub {
  const posts = getAllPosts().filter((p) => topicOf(p) === "ai-security");

  const start = posts.find((p) => p.slug === START_POST);
  if (!start)
    throw new Error(
      `/ai-security: START_POST "${START_POST}" is not a published ai-security post.`
    );

  const series = getAllSeries().find((s) => s.slug === HUB_SERIES);
  if (!series) throw new Error(`/ai-security: HUB_SERIES "${HUB_SERIES}" is not in series.json.`);

  const flagship = getAllProjects().find((p) => p.flagship) ?? null;
  const flagshipPost = flagship?.post
    ? (posts.find((p) => p.slug === flagship.post) ?? null)
    : null;

  const skills = getSkillCollectionEntries().find((c) => c.repo === HUB_SKILLS);
  if (!skills) throw new Error(`/ai-security: HUB_SKILLS "${HUB_SKILLS}" is not in skills.json.`);

  const allTalks = getAllTalks();
  const talks = hubTalks(allTalks);
  const sessions = stageSessions(allTalks).filter((t) => t.tags.includes(HUB_TALK_TAG));

  const shown = new Set<string>([start.slug]);
  for (const part of series.parts) if (part.slug) shown.add(part.slug);
  if (flagshipPost) shown.add(flagshipPost.slug);
  const further = posts.filter((p) => !shown.has(p.slug));

  return {
    start,
    series,
    flagship,
    flagshipPost,
    skills,
    talks,
    further,
    facts: hubFacts({ sessions, posts: posts.length, series, flagship }),
  };
}
