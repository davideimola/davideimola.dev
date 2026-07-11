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
      // Deep paths on the links subdomain bounce to the main site, so the
      // subdomain serves only the link-in-bio page. /_next is excluded:
      // the rewritten page must load its assets from the same host.
      {
        source: "/:path((?!_next/).+)",
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
