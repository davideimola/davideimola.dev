import { getAllPosts, getPostBySlug } from "../../../lib/content";
import { postToMarkdown } from "../../../lib/llms";

// Serves the raw-Markdown version of a post. Reached as /blog/<slug>.md via
// the rewrite in next.config.ts; noindex keeps it out of search results as a
// duplicate of the canonical HTML page.

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function GET(_req: Request, { params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return new Response("Not found", { status: 404 });

  return new Response(postToMarkdown(post), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
