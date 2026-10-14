"use client";

import Giscus from "@giscus/react";
import { useResolvedTheme } from "./ThemeToggle";

// Configure via environment variables:
//   NEXT_PUBLIC_GISCUS_REPO_ID   — from https://giscus.app
//   NEXT_PUBLIC_GISCUS_CATEGORY_ID — from https://giscus.app
const REPO_ID = process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? "";
const CATEGORY_ID = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? "";

// Custom theme CSS served from the same origin, one file per site theme. The
// widget lives in its own iframe, so it follows the toggle through this prop.
function themeUrl(theme: "light" | "dark"): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://davideimola.dev";
  return `${origin}/giscus-theme${theme === "dark" ? "-dark" : ""}.css`;
}

export function GiscusComments() {
  const theme = useResolvedTheme();
  if (!REPO_ID || !CATEGORY_ID) return null;

  return (
    <div className="mt-16 pt-10 border-t border-border">
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
    </div>
  );
}
