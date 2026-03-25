"use client";

import { useState } from "react";

interface ShareButtonsProps {
  slug: string;
  title: string;
}

export function ShareButtons({ slug, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const url = `https://davideimola.dev/blog/${slug}`;
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled or API unavailable — fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <span className="font-mono text-[11px] text-text-3 tracking-[0.06em]">SHARE</span>
      <a
        href={`https://bsky.app/intent/compose?text=${encodedTitle}%20${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-[11px] text-text-2 border border-border hover:border-border-hover hover:text-accent px-3 py-1.5 rounded-sm transition-colors duration-150"
      >
        BlueSky
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-[11px] text-text-2 border border-border hover:border-border-hover hover:text-accent px-3 py-1.5 rounded-sm transition-colors duration-150"
      >
        LinkedIn
      </a>
      <button
        type="button"
        onClick={handleShare}
        className="font-mono text-[11px] text-text-2 border border-border hover:border-border-hover hover:text-accent px-3 py-1.5 rounded-sm transition-colors duration-150 cursor-pointer"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
