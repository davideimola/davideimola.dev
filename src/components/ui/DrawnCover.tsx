"use client";

import { useEffect, useRef, useState } from "react";

// A post's cover that draws itself the first time it scrolls into view: the
// ink lines trace in (~1.2s) and the one red detail lands last, like a
// signature. Same frame as PostCover (16:9, hairline), same night twin in the
// dark theme. The SVGs arrive prepared by the brand's prepareDrawSvg, read from
// the site's own public/ covers, never from user input. The timing lives in
// the brand's draw.css (`.draw`): reduced motion shows it drawn at once, and
// so do print and the <noscript> rule in the root layout.

interface DrawnCoverProps {
  /** The prepared light cover. */
  light: string;
  /** The prepared night twin, if the cover has one. */
  dark: string | null;
  alt: string;
  className?: string;
}

export function DrawnCover({ light, dark, alt, className = "" }: DrawnCoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setDrawn(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const svgClasses = "absolute inset-0 [&>svg]:w-full [&>svg]:h-full";
  return (
    <div
      ref={ref}
      role="img"
      aria-label={alt}
      data-drawn={drawn ? "" : undefined}
      className={`draw relative w-full aspect-video overflow-hidden border border-border bg-[var(--di-color-paper)] dark:bg-[var(--di-color-night)] ${className}`}
    >
      <div
        aria-hidden="true"
        className={`${svgClasses} ${dark ? "dark:hidden" : ""}`}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: the site's own cover SVG from public/, prepared by prepareDrawSvg
        dangerouslySetInnerHTML={{ __html: light }}
      />
      {dark && (
        <div
          aria-hidden="true"
          className={`${svgClasses} hidden dark:block`}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: as above, the night twin
          dangerouslySetInnerHTML={{ __html: dark }}
        />
      )}
    </div>
  );
}
