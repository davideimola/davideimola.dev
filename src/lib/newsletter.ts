import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// A frozen newsletter issue: one .mdx file per issue in src/content/newsletter,
// snapshotted at generation time ("photograph, not mirror", per ADR-0002). The same
// file is the single source for both the sent email and this on-site archive.
export interface NewsletterIssue {
  slug: string; // filename without .mdx, e.g. "2026-07"
  issue: number; // sequential issue number
  subject: string; // issue title / email subject
  previewText: string; // short preview / description
  date: string; // send date (ISO), mapped from sendDate
  draft?: boolean;
  content: string; // MDX body
}

const NEWSLETTER_DIR = path.join(process.cwd(), "src/content/newsletter");

function parseIssue(slug: string): NewsletterIssue {
  const raw = fs.readFileSync(path.join(NEWSLETTER_DIR, `${slug}.mdx`), "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    issue: data.issue ?? 0,
    subject: data.subject ?? "",
    previewText: data.previewText ?? "",
    date: data.sendDate,
    draft: data.draft ?? false,
    content,
  };
}

export function getAllIssues(): NewsletterIssue[] {
  const isDev = process.env.NODE_ENV === "development";
  if (!fs.existsSync(NEWSLETTER_DIR)) return [];
  return fs
    .readdirSync(NEWSLETTER_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => parseIssue(f.replace(".mdx", "")))
    .filter((i) => isDev || !i.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getIssueBySlug(slug: string): NewsletterIssue | null {
  const isDev = process.env.NODE_ENV === "development";
  const filePath = path.join(NEWSLETTER_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const issue = parseIssue(slug);
  if (!isDev && issue.draft) return null;
  return issue;
}

export function getLatestIssue(): NewsletterIssue | null {
  return getAllIssues()[0] ?? null;
}
