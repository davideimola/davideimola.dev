import { getAllPosts } from "../../lib/content";
import { buildLlmsFullTxt, SITE_URL } from "../../lib/llms";
import { getAllSeries, seriesOfPost } from "../../lib/series";

// Hourly, so a scheduled post appears on its publishDate without a deploy.
export const revalidate = 3600;

export async function GET() {
  const series = getAllSeries();
  const body = buildLlmsFullTxt(getAllPosts(), SITE_URL, (slug) => seriesOfPost(series, slug));

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
