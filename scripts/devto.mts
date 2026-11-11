// Brings posts to dev.to as Syndicated copies (ADR-0007), through the Forem API.
//
//   pnpm devto:sync [--dry-run]         what the daily Action runs: creates the copy of
//                                       every post due (three days after its publishDate,
//                                       from SYNDICATION_START on) and rewrites any
//                                       published copy whose post has changed
//   pnpm devto:push <slug> [--dry-run]  creates or rewrites one post's copy and publishes
//                                       it, whatever its date: the way the archive goes over
//
// --dry-run prints what would be sent and sends nothing. Requires DEVTO_API_KEY (read
// from .env.local by the pnpm scripts, a repo secret in the Action). A post is matched to
// its copy by canonical URL, so nothing is stored here and a copy is never duplicated.

import { type BlogPost, getAllPosts, getPostBySlug, romeToday } from "../src/lib/content";
import {
  canonicalKey,
  type DevtoArticle,
  type DevtoExisting,
  planSync,
  toDevtoArticle,
} from "../src/lib/devto";
import { SITE_URL } from "../src/lib/llms";
import { getPostSeries } from "../src/lib/series";

const API = "https://dev.to/api";
// dev.to allows about ten new articles every thirty seconds: stay well under it.
const PAUSE_MS = 4000;

const [command, ...rest] = process.argv.slice(2);
const dryRun = rest.includes("--dry-run");
const slugArg = rest.find((a) => !a.startsWith("--"));

function headers(): Record<string, string> {
  const key = process.env.DEVTO_API_KEY;
  if (!key) {
    console.error("DEVTO_API_KEY is not set (.env.local locally, a repo secret in CI).");
    process.exit(1);
  }
  return {
    "api-key": key,
    accept: "application/vnd.forem.api-v1+json",
    "content-type": "application/json",
    "user-agent": "davideimola.dev-syndication",
  };
}

async function devto<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, { ...init, headers: headers() });
  if (!res.ok)
    throw new Error(`${init.method ?? "GET"} ${path}: HTTP ${res.status} ${await res.text()}`);
  return (await res.json()) as T;
}

async function listCopies(): Promise<DevtoExisting[]> {
  const all: DevtoExisting[] = [];
  for (let page = 1; ; page++) {
    const batch = await devto<DevtoExisting[]>(`/articles/me/all?per_page=1000&page=${page}`);
    all.push(...batch);
    if (batch.length < 1000) return all;
  }
}

function articleFor(post: BlogPost): DevtoArticle {
  return toDevtoArticle(post, getPostSeries(post.slug)?.series.title ?? null);
}

async function send(post: BlogPost, id: number | null): Promise<void> {
  const article = articleFor(post);
  const verb = id ? `rewrite #${id}` : "create";
  if (dryRun) {
    console.log(`\n── would ${verb}: ${post.slug}`);
    console.log(JSON.stringify({ ...article, body_markdown: undefined }, null, 2));
    console.log(article.body_markdown);
    return;
  }
  const saved = await devto<{ id: number; url: string }>(id ? `/articles/${id}` : "/articles", {
    method: id ? "PUT" : "POST",
    body: JSON.stringify({ article }),
  });
  console.log(`✓ ${verb}: ${post.slug} → ${saved.url}`);
}

const pause = () => new Promise((resolve) => setTimeout(resolve, PAUSE_MS));

async function sync(): Promise<void> {
  const today = romeToday();
  const steps = planSync(getAllPosts(), await listCopies(), today);
  if (steps.length === 0) {
    console.log(`Nothing to do on ${today}: every copy matches its post.`);
    return;
  }
  let failed = 0;
  for (const [i, step] of steps.entries()) {
    if (i > 0 && !dryRun) await pause();
    try {
      await send(step.post, step.action === "update" ? step.id : null);
    } catch (error) {
      failed++;
      console.error(`✗ ${step.post.slug}: ${(error as Error).message}`);
    }
  }
  if (failed) process.exit(1);
}

async function push(slug: string): Promise<void> {
  const post = getPostBySlug(slug);
  if (!post) {
    console.error(`No published post "${slug}" (a draft, a future date or a typo).`);
    process.exit(1);
  }
  if (post.syndicate === false) {
    console.error(`"${slug}" says syndicate: false; remove it from the frontmatter first.`);
    process.exit(1);
  }
  const key = canonicalKey(`${SITE_URL}/blog/${slug}`);
  const copy = (await listCopies()).find((a) => canonicalKey(a.canonical_url) === key);
  await send(post, copy?.id ?? null);
}

if (command === "sync") await sync();
else if (command === "push" && slugArg) await push(slugArg);
else {
  console.error("Usage: pnpm devto:sync [--dry-run] | pnpm devto:push <slug> [--dry-run]");
  process.exit(1);
}
