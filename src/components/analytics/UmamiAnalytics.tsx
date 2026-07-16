/**
 * Umami Cloud analytics, proxied first-party to survive ad blockers.
 *
 * Both the tracker script and its `/api/send` collection endpoint are served
 * from this domain through the `${UMAMI_PROXY_PATH}/*` rewrite in
 * `next.config.ts`, so `cloud.umami.is` never appears in a request an ad
 * blocker can match. `data-host-url` is a relative path (not an absolute URL)
 * so events resolve against the current origin — the same build works on
 * localhost, Vercel previews, and production without hardcoding a domain.
 *
 * Renders nothing until NEXT_PUBLIC_UMAMI_WEBSITE_ID is set, so local dev and
 * preview deploys without the variable stay clean.
 */

// Keep in sync with the rewrite source in next.config.ts. Deliberately neutral
// (not "umami"/"analytics"/"stats") so path-based blocklist rules don't match.
export const UMAMI_PROXY_PATH = "/relay";

export function UmamiAnalytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (!websiteId) return null;

  return (
    <script
      defer
      src={`${UMAMI_PROXY_PATH}/script.js`}
      data-website-id={websiteId}
      data-host-url={UMAMI_PROXY_PATH}
    />
  );
}
