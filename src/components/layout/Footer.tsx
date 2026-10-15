// Read as a JSON import, not through lib/cv.ts: that module reads the
// filesystem, and the Footer also renders in Storybook.
import cvRecord from "../../content/cv.json";
import { SOCIAL_PROFILES } from "../../lib/social";
import { Mark } from "../ui/BrandMark";

// The personal pages and the profiles sit here rather than in the NavBar,
// which carries only Writing, Built, Talks and About.
export const FOOTER_PAGES = [
  { label: "Now", href: "/now" },
  { label: "Uses", href: "/uses" },
  { label: "Shelf", href: "/shelf" },
  { label: "CV", href: "/cv" },
  { label: "Contact", href: "/contact" },
];

const SOCIAL_LINKS = [
  ...SOCIAL_PROFILES.map((profile) => ({
    label: profile.label === "BlueSky" ? "Bluesky" : profile.label,
    href: profile.url,
  })),
  { label: "RSS", href: "/rss.xml" },
];

const SITE_LINKS = [
  { label: "Newsletter", href: "/newsletter" },
  { label: "Colophon", href: "/colophon" },
  { label: "Privacy", href: "/privacy" },
  { label: "Source", href: "https://github.com/davideimola/davideimola.dev" },
];

const linkClasses =
  "font-mono text-[13px] sm:text-[14px] text-fg no-underline transition-colors duration-150 hover:text-accent";

function LinkRow({ links, label }: { links: { label: string; href: string }[]; label: string }) {
  return (
    <nav aria-label={label} className="flex flex-wrap gap-x-[18px] sm:gap-x-6 gap-y-2">
      {links.map((link) => {
        const external = link.href.startsWith("http");
        return (
          <a
            key={link.href}
            href={link.href}
            className={linkClasses}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {link.label}
          </a>
        );
      })}
    </nav>
  );
}

// An ink hairline, the S mark with the name and the place, the personal pages
// and the profiles in mono. The newsletter form lives on the pages, not here.
export function Footer() {
  const { name, location } = cvRecord.identity;
  const place = location.split("·")[0].trim();
  const city = place.split(",")[0].trim();
  const year = new Date().getFullYear();

  return (
    // data-print-hide: site chrome is screen-only, so it never reaches paper.
    <footer data-print-hide="" className="mt-auto pt-16 md:pt-24">
      <div className="max-w-[1136px] mx-auto px-4 sm:px-8">
        <div className="border-t border-rule pt-6 sm:pt-8 pb-7 sm:pb-12 flex flex-col gap-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-10">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Mark cut="s" size={26} className="text-fg" />
              <span className="font-sans text-[14px] sm:text-[15px] text-fg-muted">
                {name} · {place}
              </span>
            </div>
            <LinkRow links={FOOTER_PAGES} label="Pages" />
            <LinkRow links={SOCIAL_LINKS} label="Elsewhere" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <nav aria-label="Site" className="flex flex-wrap gap-x-5 gap-y-1.5">
              {SITE_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-mono text-[12px] text-fg-subtle no-underline hover:text-accent transition-colors duration-150"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <p className="font-mono text-[12px] text-fg-subtle m-0">
              © {year} {name} · Built in {city}, one commit at a time
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
