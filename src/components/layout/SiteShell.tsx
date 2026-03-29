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

  // Console easter egg for curious devs
  useEffect(() => {
    console.log(
      "%c\n" +
        " ██████╗  █████╗ ██╗   ██╗██╗██████╗ ███████╗\n" +
        " ██╔══██╗██╔══██╗██║   ██║██║██╔══██╗██╔════╝\n" +
        " ██║  ██║███████║██║   ██║██║██║  ██║█████╗  \n" +
        " ██║  ██║██╔══██║╚██╗ ██╔╝██║██║  ██║██╔══╝  \n" +
        " ██████╔╝██║  ██║ ╚████╔╝ ██║██████╔╝███████╗\n" +
        " ╚═════╝ ╚═╝  ╚═╝  ╚═══╝  ╚═╝╚═════╝ ╚══════╝\n" +
        "  ██╗███╗   ███╗ ██████╗ ██╗      █████╗     \n" +
        "  ██║████╗ ████║██╔═══██╗██║     ██╔══██╗    \n" +
        "  ██║██╔████╔██║██║   ██║██║     ███████║    \n" +
        "  ██║██║╚██╔╝██║██║   ██║██║     ██╔══██║    \n" +
        "  ██║██║ ╚═╝ ██║╚██████╔╝███████╗██║  ██║    \n" +
        "  ╚═╝╚═╝     ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝    \n",
      "color: #C91F37; font-family: monospace;"
    );
    console.log(
      "%c Hey, you found the console. Clearly one of us. 👾",
      "color: #EAE5DF; font-size: 14px; font-weight: bold;"
    );
    console.log(
      "%c → davideimola.dev  |  github.com/davideimola",
      "color: #9A948E; font-family: monospace;"
    );
    console.log(
      "%c Psst: try typing 'hire me' in the ⌘K palette.",
      "color: #7E7874; font-family: monospace; font-style: italic;"
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
    <>
      <NavBar onSearchOpen={() => setOpen(true)} />
      <CommandPalette open={open} onClose={() => setOpen(false)} items={items} />
      {children}
    </>
  );
}
