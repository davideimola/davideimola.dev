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
      <div className="relative z-10 max-w-[860px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0">
        <p className="font-mono text-[11px] text-text-3">
          © {year} <span className="text-accent">Davide Imola</span>
        </p>
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
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
