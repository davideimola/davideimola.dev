"use client";

import { MotionConfig } from "motion/react";
import { useEffect, useState } from "react";
import type { SearchItem } from "../../lib/search";
import { CommandPalette } from "./CommandPalette";
import { NavBar } from "./NavBar";

/** The id of the page <main>, the target of the skip link. */
export const MAIN_CONTENT_ID = "main";

interface SiteShellProps {
  items: SearchItem[];
  children: React.ReactNode;
}

export function SiteShell({ items, children }: SiteShellProps) {
  const [open, setOpen] = useState(false);

  // A note for whoever opens the console, in the brand's own colours: read
  // from the tokens, so it follows the theme and never restates a hex value.
  useEffect(() => {
    const tokens = getComputedStyle(document.documentElement);
    const accent = tokens.getPropertyValue("--di-accent").trim();
    const subtle = tokens.getPropertyValue("--di-fg-subtle").trim();
    console.log(
      "%c■%c Hey, you found the console. Clearly one of us.",
      `color: ${accent}; font-size: 14px;`,
      "font-size: 14px; font-weight: bold;"
    );
    console.log(
      "%cThe source is open: github.com/davideimola/davideimola.dev",
      `color: ${subtle}; font-family: monospace;`
    );
  }, []);

  // Global ⌘K / Ctrl+K shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      {/* First focusable element of every page, so a keyboard or screen reader
          user can jump past the NavBar. Hidden until it takes focus. */}
      <a
        href={`#${MAIN_CONTENT_ID}`}
        data-print-hide
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-fg focus:text-bg focus:px-4 focus:py-2 focus:font-mono focus:text-[14px] focus:no-underline"
      >
        Skip to content
      </a>
      <NavBar onSearchOpen={() => setOpen(true)} />
      <CommandPalette open={open} onClose={() => setOpen(false)} items={items} />
      {children}
    </MotionConfig>
  );
}
