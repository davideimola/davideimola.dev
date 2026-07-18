/**
 * First-party collection endpoint for Umami Cloud, kept in sync with
 * UMAMI_PROXY_PATH ("/relay") in src/components/analytics/UmamiAnalytics.tsx.
 *
 * Unlike the tracker script (a passive rewrite in next.config.ts), the collect
 * POST is proxied here by hand so we can forward the visitor's real IP. A
 * config-level rewrite makes Umami Cloud see the Vercel edge node's IP and
 * geolocate every hit to that region (e.g. Frankfurt / "Germany") instead of
 * the actual visitor. Here we read the client IP from x-forwarded-for and pass
 * it upstream explicitly, along with the browser's User-Agent (which drives
 * Umami's browser/OS/device parsing — the proxy's UA would poison it).
 */

const UMAMI_COLLECT_URL = "https://cloud.umami.is/api/send";

export const runtime = "edge";

export async function POST(request: Request) {
  const body = await request.text();

  // On Vercel the first hop of x-forwarded-for is the real client IP; the
  // rest of the chain is intermediary proxies.
  const clientIp = (request.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim();

  const headers: Record<string, string> = {
    "content-type": request.headers.get("content-type") ?? "application/json",
    "user-agent": request.headers.get("user-agent") ?? "",
  };
  // Umami echoes a session cache token the tracker replays on later events.
  const cache = request.headers.get("x-umami-cache");
  if (cache) headers["x-umami-cache"] = cache;
  if (clientIp) {
    headers["x-forwarded-for"] = clientIp;
    headers["x-real-ip"] = clientIp;
  }

  const upstream = await fetch(UMAMI_COLLECT_URL, {
    method: "POST",
    headers,
    body,
  });

  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "text/plain",
    },
  });
}
