import { getAllPosts } from "../../lib/content";
import { buildLlmsFullTxt } from "../../lib/llms";

export async function GET() {
  const body = buildLlmsFullTxt(getAllPosts());

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
