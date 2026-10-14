"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";

// The marker (docs/brand.md, "The marker"): one rough red stroke per page under
// the word that matters most. It is the only large red gesture on a page.
//
// Skip-ink: the word sits above the stroke wearing a halo in the ground colour
// (`.marker-word` in globals.css), so the letters cut through the red and stay
// fully legible. On a card or any other non-ground surface, set the halo to that
// surface: `className="[--marker-halo-color:var(--di-surface)]"`.
//
// Motion: draws itself left to right once (~500ms) the first time it scrolls
// into view. Reduced motion collapses the transition to nothing (globals.css),
// and without JavaScript the <noscript> rule in the root layout shows it drawn.

interface MarkerProps {
  children: ReactNode;
  className?: string;
}

export function Marker({ children, className = "" }: MarkerProps) {
  const filterId = `marker-rough-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const ref = useRef<HTMLSpanElement>(null);
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
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      data-drawn={drawn ? "" : undefined}
      className={`marker relative inline-block ${className}`}
    >
      <span className="marker-word relative z-[1]">{children}</span>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 380 34"
        preserveAspectRatio="none"
        className="pointer-events-none absolute z-0 left-[-0.08em] bottom-[-0.1em] h-[0.42em] w-[calc(100%+0.16em)] overflow-visible"
      >
        <defs>
          <filter id={filterId} x="-10%" y="-60%" width="120%" height="220%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.7"
              numOctaves={2}
              seed={11}
              result="n"
            />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={4} />
          </filter>
        </defs>
        <path
          className="marker-stroke stroke-accent"
          d="M10 18 C110 8 270 8 370 13"
          fill="none"
          strokeWidth={16}
          strokeLinecap="round"
          pathLength={1}
          filter={`url(#${filterId})`}
        />
      </svg>
    </span>
  );
}
