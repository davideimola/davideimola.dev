"use client";

import Giscus from "@giscus/react";
import { SectionHeader } from "./SectionHeader";
import { useResolvedTheme } from "./ThemeToggle";

// Configure via environment variables:
//   NEXT_PUBLIC_GISCUS_REPO_ID   — from https://giscus.app
//   NEXT_PUBLIC_GISCUS_CATEGORY_ID — from https://giscus.app
const REPO_ID = process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? "";
const CATEGORY_ID = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? "";

// The theme CSS is built from the brand tokens and served by a route per site
// theme (src/lib/giscus-theme.ts). The widget lives in its own iframe, so it
// follows the toggle through this prop.
function themeUrl(theme: "light" | "dark"): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://davideimola.dev";
  return `${origin}/giscus-theme${theme === "dark" ? "-dark" : ""}.css`;
}

export function GiscusComments() {
  const theme = useResolvedTheme();
  if (!REPO_ID || !CATEGORY_ID) return null;

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <SectionHeader title="Comments" tilt={2} className="mb-6" />
      <Giscus
        repo="davideimola/davideimola.dev"
        repoId={REPO_ID}
        category="Announcements"
        categoryId={CATEGORY_ID}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={themeUrl(theme ?? "light")}
        lang="en"
        loading="lazy"
      />
    </section>
  );
}
