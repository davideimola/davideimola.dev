import { giscusThemeCss } from "../../lib/giscus-theme";

// The light giscus theme (see src/lib/giscus-theme.ts). Static: it changes only
// when the brand dependency does, which is a deploy.
export const dynamic = "force-static";

export function GET() {
  return new Response(giscusThemeCss("light"), {
    headers: {
      "Content-Type": "text/css; charset=utf-8",
      // giscus.app fetches it from inside its iframe.
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
