"use client";

import { useEffect, useRef } from "react";

// A figure in a post body (a diagram, a chart) that draws itself the first
// time it scrolls into view, like the cover: the ink traces in and the red
// detail lands last. A drawing split into <g data-step="n"> parts draws one
// part after the other, in step order: a page has no clicks, so each part
// waits for the one before it. Reduced motion shows every part at once, and
// print and the <noscript> rule in the root layout show it drawn. The SVGs
// arrive prepared by loadFigure (src/lib/cover-files.ts), read from the site's
// own public/, never from user input; the timing lives in the brand's draw.css.

/** One part's draw (1.2s) plus the red detail landing after it. */
export const STEP_MS = 1700;

interface DrawnFigureProps {
  /** The prepared light drawing. */
  light: string;
  /** The prepared night twin. */
  dark: string | null;
  alt: string;
  caption?: string;
  className?: string;
}

export function DrawnFigure({ light, dark, alt, caption, className = "" }: DrawnFigureProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const draw = () => {
      // Both twins carry the same steps: group them by number across the two.
      const byStep = new Map<number, Element[]>();
      for (const g of el.querySelectorAll("g[data-step]")) {
        const n = Number(g.getAttribute("data-step"));
        byStep.set(n, [...(byStep.get(n) ?? []), g]);
      }
      if (byStep.size === 0) {
        el.setAttribute("data-drawn", "");
        return;
      }
      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
      [...byStep.keys()]
        .sort((a, b) => a - b)
        .forEach((n, i) => {
          const reveal = () => {
            for (const g of byStep.get(n) ?? []) g.setAttribute("data-drawn", "");
          };
          if (reduced || i === 0) reveal();
          else timers.push(setTimeout(reveal, i * STEP_MS));
        });
    };

    if (typeof IntersectionObserver === "undefined") {
      draw();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          draw();
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      for (const t of timers) clearTimeout(t);
    };
  }, []);

  const svgClasses = "[&>svg]:block [&>svg]:w-full [&>svg]:h-auto [&_text]:font-mono";
  return (
    <figure className={`my-10 ${className}`}>
      <div ref={ref} role="img" aria-label={alt} className="draw">
        <div
          aria-hidden="true"
          className={`${svgClasses} ${dark ? "dark:hidden" : ""}`}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: the site's own figure SVG from public/, prepared by prepareDrawSvg
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
      {caption && (
        <figcaption className="mt-3 font-mono text-[13px] text-fg-subtle">{caption}</figcaption>
      )}
    </figure>
  );
}
