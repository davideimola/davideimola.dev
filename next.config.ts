import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // StrictMode causes framer-motion scroll animations to flash in dev
  // (double-mount resets initial state before IntersectionObserver re-fires).
  // Has no effect on production builds.
  reactStrictMode: false,
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
