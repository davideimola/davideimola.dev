export const SITE_URL = "https://davideimola.dev";

// Email links must be absolute. Issue .mdx authors links (and component `url`/`href` props)
// as root-relative (/blog/…, /sharing…), which resolve on the site but break in email:
// prepend the site origin. Absolute URLs, mailto:, and protocol-relative (//cdn…) links
// are left untouched.
export function absoluteUrl(url: string): string {
  if (url.startsWith("/") && !url.startsWith("//")) return `${SITE_URL}${url}`;
  return url;
}
