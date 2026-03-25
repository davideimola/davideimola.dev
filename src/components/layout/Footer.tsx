const FOOTER_LINKS = [
  { label: "privacy", href: "/privacy" },
  { label: "now", href: "/now" },
  { label: "rss", href: "/rss.xml" },
  { label: "source", href: "https://github.com/davideimola/davideimola.dev" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-6">
      <div className="relative z-10 max-w-[860px] mx-auto px-8 flex items-center justify-between">
        <p className="font-mono text-[11px] text-text-3">
          © {year} <span className="text-accent">Davide Imola</span>
        </p>
        <nav className="flex gap-5">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] text-text-3 no-underline transition-colors duration-150 hover:text-text-2"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
