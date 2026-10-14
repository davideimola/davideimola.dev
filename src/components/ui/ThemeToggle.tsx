"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { resolveTheme, THEME_STORAGE_KEY, type Theme } from "../../lib/theme";

// Fired on window whenever the visitor flips the theme, so widgets that render
// in their own iframe (giscus, Turnstile) can follow.
export const THEME_CHANGE_EVENT = "themechange";

function currentTheme(): Theme {
  const systemDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  return resolveTheme(document.documentElement.getAttribute("data-theme"), systemDark);
}

/**
 * The theme the page is showing, kept in sync with the toggle and with the
 * system preference. `null` until mounted: the server cannot know it.
 */
export function useResolvedTheme(): Theme | null {
  const [theme, setTheme] = useState<Theme | null>(null);
  useEffect(() => {
    const update = () => setTheme(currentTheme());
    update();
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    media?.addEventListener("change", update);
    window.addEventListener(THEME_CHANGE_EVENT, update);
    return () => {
      media?.removeEventListener("change", update);
      window.removeEventListener(THEME_CHANGE_EVENT, update);
    };
  }, []);
  return theme;
}

interface ThemeToggleProps {
  className?: string;
}

// Light by default, the system preference until the visitor picks, then the
// pick, stored per browser. The icon is chosen by CSS (`dark:`), not state, so
// the server render is already right and nothing flips on hydration.
export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  function toggle() {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage blocked: the choice lasts for this page view only.
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      data-print-hide=""
      aria-label="Toggle dark theme"
      title="Toggle dark theme"
      className={`inline-flex items-center justify-center w-9 h-9 text-fg-muted hover:text-fg cursor-pointer transition-colors duration-150 ${className}`}
    >
      <IconMoon size={18} stroke={1.75} className="dark:hidden" aria-hidden="true" />
      <IconSun size={18} stroke={1.75} className="hidden dark:block" aria-hidden="true" />
    </button>
  );
}
