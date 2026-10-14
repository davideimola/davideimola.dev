"use client";

import { IconSearch } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Mark, Wordmark } from "../ui/BrandMark";
import { ThemeToggle } from "../ui/ThemeToggle";

interface NavLink {
  label: string;
  href: string;
}

// Contact lives in the footer and on /about; the route stays.
export const NAV_LINKS: NavLink[] = [
  { label: "Writing", href: "/blog" },
  { label: "Built", href: "/projects" },
  { label: "Talks", href: "/sharing" },
  { label: "About", href: "/about" },
];

export function isActiveLink(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface NavBarProps {
  onSearchOpen?: () => void;
}

// S mark plus the bold wordmark, links in sans, the current page in ink with a
// 2px underline (docs/brand.md, "Site").
export function NavBar({ onSearchOpen }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  // The mark draws itself on the first load of the home page only: captured
  // once, so a client-side visit to / later does not replay it.
  const [drawMark] = useState(() => pathname === "/");

  return (
    // data-print-hide: site chrome is screen-only, so it never reaches paper.
    <nav
      data-print-hide=""
      aria-label="Main"
      className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-md"
    >
      <div className="max-w-[1136px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-6 h-16 md:h-[76px]">
        <a
          href="/"
          aria-label="davide imola, home"
          className="flex items-center gap-2.5 text-fg no-underline"
        >
          <Mark
            cut="s"
            size={34}
            draw={drawMark}
            className="w-[30px] h-[30px] md:w-[34px] md:h-[34px]"
          />
          <Wordmark
            weight="bold"
            width={172}
            echo={drawMark}
            className="w-[136px] md:w-[172px] h-auto"
          />
        </a>

        {/* Desktop: links, search, theme */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-7 list-none m-0 p-0">
            {NAV_LINKS.map((link) => {
              const active = isActiveLink(pathname, link.href);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`font-sans text-[15px] no-underline pb-[3px] border-b-2 transition-colors duration-150 ${
                      active
                        ? "text-fg font-semibold border-fg"
                        : "text-fg-muted border-transparent hover:text-fg"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onSearchOpen}
              className="flex items-center gap-2 h-9 px-2.5 text-fg-muted border border-border cursor-pointer transition-colors duration-150 hover:border-fg hover:text-fg"
              aria-label="Open search"
            >
              <IconSearch size={15} stroke={1.75} aria-hidden="true" />
              <kbd className="font-mono text-[12px]">⌘K</kbd>
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile: theme + hamburger */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex flex-col justify-center items-center gap-[5px] w-11 h-11 border border-fg cursor-pointer"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span
              className={`block w-5 h-[2px] bg-fg transition-transform duration-200 origin-center ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`block w-5 h-[2px] bg-fg transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-[2px] bg-fg transition-transform duration-200 origin-center ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-border bg-bg">
          <ul className="max-w-[1136px] mx-auto px-4 py-2 flex flex-col list-none m-0">
            {NAV_LINKS.map((link) => {
              const active = isActiveLink(pathname, link.href);
              return (
                <li key={link.href} className="border-b border-border last:border-0">
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className="block py-3.5 font-sans text-[20px] font-semibold tracking-[-0.02em] text-fg no-underline"
                  >
                    <span className={active ? "border-b-2 border-fg pb-0.5" : ""}>
                      {link.label}
                    </span>
                  </a>
                </li>
              );
            })}
            <li>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onSearchOpen?.();
                }}
                className="flex items-center gap-2 py-3.5 font-mono text-[14px] text-fg-muted cursor-pointer"
              >
                <IconSearch size={15} stroke={1.75} aria-hidden="true" />
                Search
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
