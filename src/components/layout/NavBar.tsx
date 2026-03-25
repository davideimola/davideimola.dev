"use client";

import { useState } from "react";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "blog", href: "/blog" },
  { label: "projects", href: "/projects" },
  { label: "speaking", href: "/speaking" },
  { label: "about", href: "/about" },
];

interface NavBarProps {
  onSearchOpen?: () => void;
}

export function NavBar({ onSearchOpen }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-[rgba(8,8,7,0.85)] backdrop-blur-md">
      <div className="relative z-10 max-w-[860px] mx-auto px-4 sm:px-8 flex items-center justify-between h-[52px]">
        {/* Logo */}
        <a
          href="/"
          className="font-mono text-[13px] font-medium text-text-1 no-underline tracking-[-0.02em]"
        >
          <span className="text-accent">~</span>/davideimola
        </a>

        {/* Desktop: Nav links + search */}
        <ul className="hidden md:flex items-center gap-7 list-none m-0 p-0">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-mono text-[11px] font-normal text-text-3 no-underline tracking-[0.04em] lowercase transition-colors duration-150 hover:text-text-1"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={onSearchOpen}
              className="flex items-center gap-1.5 font-mono text-[10px] text-text-3 bg-bg-card border border-border rounded-[4px] px-2 py-1 cursor-pointer transition-[border-color,color] duration-150 hover:border-border-mid hover:text-text-2"
              aria-label="Open command palette"
            >
              <span>⌘K</span>
              <kbd className="text-[10px] opacity-60">search</kbd>
            </button>
          </li>
        </ul>

        {/* Mobile: hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 cursor-pointer"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span
            className={`block h-px bg-text-2 transition-transform duration-200 origin-center ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span
            className={`block h-px bg-text-2 transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-px bg-text-2 transition-transform duration-200 origin-center ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-[rgba(8,8,7,0.95)] backdrop-blur-md">
          <ul className="max-w-[860px] mx-auto px-4 py-4 flex flex-col gap-0 list-none m-0">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block font-mono text-[13px] font-normal text-text-2 no-underline tracking-[0.04em] lowercase py-3 border-b border-border last:border-0 transition-colors duration-150 hover:text-text-1"
                >
                  <span className="text-accent mr-2">{"// "}</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
