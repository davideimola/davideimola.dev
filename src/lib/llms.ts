import type { BlogPost, Project, Talk } from "./content";
import { rasterCover } from "./covers";
import { figuresToMarkdown, rasterFigures } from "./figures";
import type { PostInSeries } from "./series";

// Plain-Markdown views of the site for LLM consumers, following the
// llms.txt convention (https://llmstxt.org): /llms.txt is a compact index,
// /llms-full.txt inlines every post, and each post is served as raw
// Markdown at /blog/<slug>.md.

export const SITE_URL = "https://davideimola.dev";

const SITE_SUMMARY =
  "Personal site of Davide Imola: Tech Lead at RedCarbon, co-founder of Schrodinger Hat, " +
  "co-organizer of Open Source Day. Building AI agents for cybersecurity. Writing and " +
  "speaking about AI applied to security, AI-assisted development, Go, and open source communities.";

const PAGES: { title: string; path: string; description: string }[] = [
  { title: "About", path: "/about", description: "Who Davide is, career timeline, and values" },
  { title: "Now", path: "/now", description: "What Davide is focused on right now" },
  { title: "Talks", path: "/sharing", description: "Talks, workshops, and speaker bios" },
  { title: "Projects", path: "/projects", description: "Work and side projects" },
  { title: "Uses", path: "/uses", description: "Hardware, software, and tools Davide uses" },
  { title: "Contact", path: "/contact", description: "How to get in touch" },
];

/** Rewrite root-relative Markdown links/images to absolute URLs. */
export function absolutizeUrls(markdown: string, baseUrl = SITE_URL): string {
  return markdown.replaceAll("](/", `](${baseUrl}/`);
}

// Drop MDX comments (the IMAGE placeholders a draft leaves behind), which plain
// Markdown would print as text.
export function stripMdxComments(markdown: string): string {
  return markdown.replace(/\{\/\*[\s\S]*?\*\/\}\n?/g, "");
}

/**
 * A post's MDX body as plain Markdown with absolute URLs, the starting point of
 * every surface that hands a post to something other than the page. `raster`
 * points figures at their PNG, for readers that will not show an SVG.
 */
export function postBodyMarkdown(content: string, baseUrl = SITE_URL, raster = false): string {
  const markdown = figuresToMarkdown(stripMdxComments(content).trim());
  return absolutizeUrls(raster ? rasterFigures(markdown) : markdown, baseUrl);
}

/** Render a blog post as a standalone Markdown document. */
export function postToMarkdown(
  post: BlogPost,
  baseUrl = SITE_URL,
  series: PostInSeries | null = null
): string {
  const lines = [
    `# ${post.title}`,
    "",
    `> ${post.excerpt}`,
    "",
    `- Published: ${post.date}`,
    `- Category: ${post.category}`,
    `- Tags: ${post.tags.join(", ")}`,
    `- Reading time: ${post.readingTime}`,
    `- Canonical: ${baseUrl}/blog/${post.slug}`,
  ];
  if (series) {
    const { part, series: s } = series;
    lines.push(`- Series: ${s.title}, part ${part.number} of ${s.parts.length}`);
  }
  if (post.heroImage) {
    lines.push(
      "",
      `![${post.heroImageAlt ?? post.title}](${baseUrl}${rasterCover(post.heroImage)})`
    );
  }
  lines.push("", "---", "", postBodyMarkdown(post.content, baseUrl), "");
  return lines.join("\n");
}

function talkLine(talk: Talk, baseUrl: string): string {
  const session = talk.session;
  if (!session) return "";
  const url = session.video ?? session.slides ?? `${baseUrl}/sharing`;
  const details = [session.format, talk.event, talk.date, talk.location].join(", ");
  return `- [${session.title}](${url}): ${details}`;
}

export interface LlmsTxtInput {
  posts: BlogPost[];
  talks: Talk[];
  projects: Project[];
}

/** Build the /llms.txt index document. */
export function buildLlmsTxt({ posts, talks, projects }: LlmsTxtInput, baseUrl = SITE_URL): string {
  const blog = posts.map(
    (post) => `- [${post.title}](${baseUrl}/blog/${post.slug}.md): ${post.excerpt}`
  );
  const sessions = talks.map((talk) => talkLine(talk, baseUrl)).filter(Boolean);
  const projectList = projects.map((project) => {
    const url = project.url ?? project.github ?? `${baseUrl}/projects`;
    return `- [${project.title}](${url}): ${project.description}`;
  });
  const pages = PAGES.map(
    (page) => `- [${page.title}](${baseUrl}${page.path}): ${page.description}`
  );

  return [
    "# Davide Imola",
    "",
    `> ${SITE_SUMMARY}`,
    "",
    "Every blog post is available as plain Markdown by appending `.md` to its URL. " +
      `The full blog content is inlined in [llms-full.txt](${baseUrl}/llms-full.txt).`,
    "",
    "## Blog",
    "",
    ...blog,
    "",
    "## Talks",
    "",
    ...sessions,
    "",
    "## Projects",
    "",
    ...projectList,
    "",
    "## Pages",
    "",
    ...pages,
    "",
  ].join("\n");
}

/** Build the /llms-full.txt document with every post inlined. */
export function buildLlmsFullTxt(
  posts: BlogPost[],
  baseUrl = SITE_URL,
  seriesOf: (slug: string) => PostInSeries | null = () => null
): string {
  const header = ["# Davide Imola, full blog content", "", `> ${SITE_SUMMARY}`, ""].join("\n");
  const body = posts
    .map((post) => postToMarkdown(post, baseUrl, seriesOf(post.slug)))
    .join("\n---\n\n");
  return `${header}\n${body}`;
}
