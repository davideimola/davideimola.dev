import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking — disallow embedding in iframes from other origins
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Limit referrer info sent to third parties
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable browser features not needed on a portfolio
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Basic XSS protection for older browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
];

const nextConfig: NextConfig = {
  // StrictMode causes framer-motion scroll animations to flash in dev
  // (double-mount resets initial state before IntersectionObserver re-fires).
  // Has no effect on production builds.
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      // Legacy security.txt location (RFC 9116 fallback) points to the
      // canonical /.well-known/ path.
      {
        source: "/security.txt",
        destination: "/.well-known/security.txt",
        permanent: true,
      },
      // Deep paths on the links subdomain bounce to the main site, so the
      // subdomain serves only the link-in-bio page. /_next is excluded:
      // the rewritten page must load its assets from the same host. /relay is
      // excluded too, so the Umami analytics proxy (see rewrites below) still
      // works on the subdomain instead of being redirected away.
      {
        source: "/:path((?!_next/|relay/).+)",
        has: [{ type: "host", value: "links.davideimola.dev" }],
        destination: "https://davideimola.dev/:path",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        // links.davideimola.dev serves the /links page directly, keeping the
        // subdomain in the address bar — replaces the old linktree service.
        {
          source: "/",
          has: [{ type: "host", value: "links.davideimola.dev" }],
          destination: "/links",
        },
        // First-party proxy for Umami Cloud (tracker script + /api/send
        // collection endpoint), so cloud.umami.is never appears in a request an
        // ad blocker can match. Trade-off: events reach Umami from the Vercel
        // edge node, so Umami geolocates the visitor's COUNTRY to that node's
        // region (e.g. Frankfurt) instead of the real visitor — an unavoidable
        // limit of Umami Cloud behind a proxy (umami#3478). Forwarding
        // X-Forwarded-For from a route handler does NOT help (Cloud ignores it),
        // so we keep the plain rewrite. Referrers and UTM params are unaffected
        // (they travel in the event payload, not the IP). Keep /relay in sync
        // with UMAMI_PROXY_PATH in src/components/analytics/UmamiAnalytics.tsx.
        {
          source: "/relay/:path*",
          destination: "https://cloud.umami.is/:path*",
        },
      ],
      afterFiles: [
        // Raw-Markdown version of each post for LLM consumers (llms.txt
        // convention): append .md to the canonical post URL.
        {
          source: "/blog/:slug.md",
          destination: "/blog-md/:slug",
        },
      ],
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
