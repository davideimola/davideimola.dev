import { getAllPosts, getAllProjects, getAllTalks } from "../../lib/content";
import { buildLlmsTxt } from "../../lib/llms";

// Hourly, so a scheduled post appears on its publishDate without a deploy.
export const revalidate = 3600;

export async function GET() {
  const body = buildLlmsTxt({
    posts: getAllPosts(),
    talks: getAllTalks(),
    projects: getAllProjects(),
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
