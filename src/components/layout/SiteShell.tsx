"use client";

import { useEffect, useState } from "react";
import type { SearchItem } from "../../lib/search";
import { CommandPalette } from "./CommandPalette";
import { NavBar } from "./NavBar";

interface SiteShellProps {
  items: SearchItem[];
  children: React.ReactNode;
}

export function SiteShell({ items, children }: SiteShellProps) {
  const [open, setOpen] = useState(false);

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
    <>
      <NavBar onSearchOpen={() => setOpen(true)} />
      <CommandPalette open={open} onClose={() => setOpen(false)} items={items} />
      {children}
    </>
  );
}
