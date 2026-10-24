import matter from "gray-matter";
import { z } from "zod";
import type { Talk } from "./content";
import { getAllTalks } from "./content";
import { readContentJson } from "./content-json";

// The /skills page lists the Agent Skills I publish on GitHub. The skills
// themselves are never written down here: each one is a `skills/<name>/SKILL.md`
// in its repo, and this module reads them from there, so a skill added upstream
// shows up on the next hourly revalidation without a commit to this repo.
//
// What this repo does own is the framing of each repo, in src/content/skills.json:
// the tape, the title, why the collection exists and how to install it. That is
// editorial copy about the repo, not a fact about any one skill.
//
// GitHub is allowed to be slow, rate limited or down, so a failed read falls back,
// repo by repo, to the committed snapshot in src/content/skills.fallback.json,
// refreshed by hand with `pnpm skills:snapshot`.

// ── Schema ─────────────────────────────────────────────────────────────────

// The Agent Skills frontmatter. Only `name` and `description` are required by
// the format; anything else (license, metadata) is dropped.
const frontmatterSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

export const skillSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  // The skill's folder in its repo, e.g. "skills/idea".
  path: z.string().min(1),
});

export type Skill = z.infer<typeof skillSchema>;

// Keyed by repo ("owner/name").
export const skillsSnapshotSchema = z.record(z.string(), z.array(skillSchema));

export type SkillsSnapshot = z.infer<typeof skillsSnapshotSchema>;

const collectionSchema = z.object({
  repo: z.string().regex(/^[\w.-]+\/[\w.-]+$/),
  tape: z.string().min(1),
  title: z.string().min(1),
  intro: z.string().min(1),
  install: z.string().min(1).optional(),
  talk: z.string().min(1).optional(),
});

type CollectionEntry = z.infer<typeof collectionSchema>;

export interface SkillCollection extends Omit<CollectionEntry, "talk"> {
  url: string;
  talk: Talk | null;
  skills: Skill[];
  source: "live" | "fallback";
}

// ── Reading a repo ─────────────────────────────────────────────────────────

const SKILL_FILE = /^skills\/([^/]+)\/SKILL\.md$/;

function githubHeaders(): Record<string, string> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  // Optional: unauthenticated, the API allows 60 requests an hour per IP, which
  // a shared build machine can exhaust. A read-only token lifts that.
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/**
 * Reads every `skills/<name>/SKILL.md` on the default branch of `repo`, sorted
 * by name. Throws when the repo itself cannot be listed, so the caller decides
 * what that means. One SKILL.md that cannot be read (a non-2xx, frontmatter
 * that is not valid YAML or lacks a description) is skipped with a warning,
 * so it never takes its siblings down with it; `strict` throws instead, which
 * is what the snapshot script wants.
 */
export async function fetchRepoSkills(
  repo: string,
  { strict = false }: { strict?: boolean } = {}
): Promise<Skill[]> {
  const treeResponse = await fetch(
    `https://api.github.com/repos/${repo}/git/trees/HEAD?recursive=1`,
    { headers: githubHeaders(), next: { revalidate: 3600 } }
  );
  if (!treeResponse.ok) {
    throw new Error(`${repo}: the tree answered ${treeResponse.status}`);
  }
  const tree = (await treeResponse.json()) as { tree?: Array<{ path: string }> };
  const files = (tree.tree ?? []).map((entry) => entry.path).filter((p) => SKILL_FILE.test(p));

  const skills = await Promise.all(
    files.map(async (file): Promise<Skill | null> => {
      try {
        const response = await fetch(`https://raw.githubusercontent.com/${repo}/HEAD/${file}`, {
          next: { revalidate: 3600 },
        });
        if (!response.ok) {
          throw new Error(`answered ${response.status}`);
        }
        const frontmatter = frontmatterSchema.parse(matter(await response.text()).data);
        return { ...frontmatter, path: file.replace(/\/SKILL\.md$/, "") };
      } catch (error) {
        const message = `${repo}/${file} could not be read: ${(error as Error).message}`;
        if (strict) throw new Error(message);
        console.warn(`[skills] ${message}`);
        return null;
      }
    })
  );

  return skills
    .filter((skill): skill is Skill => skill !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
}

// ── The fallback ───────────────────────────────────────────────────────────

let fallbackCache: SkillsSnapshot | null = null;

export function getSkillsFallback(): SkillsSnapshot {
  if (!fallbackCache) {
    fallbackCache = skillsSnapshotSchema.parse(readContentJson<unknown>("skills.fallback.json"));
  }
  return fallbackCache;
}

export function getSkillCollectionEntries(): CollectionEntry[] {
  return z.array(collectionSchema).parse(readContentJson<unknown>("skills.json"));
}

// ── The seam ───────────────────────────────────────────────────────────────

export async function getSkillCollections(): Promise<SkillCollection[]> {
  const talks = getAllTalks();
  const fallback = getSkillsFallback();

  return Promise.all(
    getSkillCollectionEntries().map(async ({ talk: talkSlug, ...entry }) => {
      const talk = talkSlug ? (talks.find((t) => t.slug === talkSlug) ?? null) : null;
      if (talkSlug && !talk) {
        throw new Error(
          `skills.json: ${entry.repo} names the talk "${talkSlug}", which does not exist.`
        );
      }

      let skills: Skill[];
      let source: SkillCollection["source"] = "live";
      try {
        skills = await fetchRepoSkills(entry.repo);
      } catch {
        skills = fallback[entry.repo] ?? [];
        source = "fallback";
      }

      return { ...entry, url: `https://github.com/${entry.repo}`, talk, skills, source };
    })
  );
}

// ── Rendering helpers ──────────────────────────────────────────────────────

/**
 * A skill's description is written for the agent: what it does, then when to
 * reach for it ("Use when the user asks…"). The page prints only the first
 * half, because the trigger addresses the agent and not the reader.
 */
export function skillSummary(description: string): string {
  const [what] = description.split(/\s+Use (?:it |this )?when\b/);
  return what.trim();
}

export function skillUrl(repo: string, skill: Skill): string {
  return `https://github.com/${repo}/tree/HEAD/${skill.path}`;
}

/** The id of a repo's block on /skills: the repo's own name. */
export function collectionAnchor(repo: string): string {
  return repo.split("/")[1];
}

/** Talk slug to the /skills block of the repo that names it. */
export function talkSkillsLinks(): Map<string, string> {
  const links = new Map<string, string>();
  for (const { repo, talk } of getSkillCollectionEntries()) {
    if (talk) links.set(talk, `/skills#${collectionAnchor(repo)}`);
  }
  return links;
}
