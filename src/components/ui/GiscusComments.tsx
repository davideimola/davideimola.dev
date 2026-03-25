"use client";

import Giscus from "@giscus/react";

// Configure via environment variables:
//   NEXT_PUBLIC_GISCUS_REPO_ID   — from https://giscus.app
//   NEXT_PUBLIC_GISCUS_CATEGORY_ID — from https://giscus.app
const REPO_ID = process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? "";
const CATEGORY_ID = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? "";

export function GiscusComments() {
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
        theme="dark"
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
