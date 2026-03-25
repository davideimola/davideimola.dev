"use client";

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
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-[rgba(8,8,7,0.85)] backdrop-blur-[12px]">
      <div className="relative z-10 max-w-[860px] mx-auto px-8 flex items-center justify-between h-[52px]">
        {/* Logo */}
        <a
          href="/"
          className="font-mono text-[13px] font-medium text-text-1 no-underline tracking-[-0.02em]"
        >
          <span className="text-accent">~</span>/davideimola
        </a>

        {/* Nav links + search */}
        <ul className="flex items-center gap-7 list-none m-0 p-0">
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
      </div>
    </nav>
  );
}
