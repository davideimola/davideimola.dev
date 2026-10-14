import { SOCIAL_PROFILES } from "../../lib/social";
import { Mark } from "../ui/BrandMark";
import { SubscribeForm } from "../ui/SubscribeForm";

const SITE_LINKS = [
  { label: "Newsletter", href: "/newsletter" },
  { label: "Now", href: "/now" },
  { label: "Uses", href: "/uses" },
  { label: "Shelf", href: "/shelf" },
  { label: "Terminal", href: "/terminal" },
  { label: "Brand", href: "/brand" },
  { label: "RSS", href: "/rss.xml" },
  { label: "Privacy", href: "/privacy" },
  { label: "Source", href: "https://github.com/davideimola/davideimola.dev" },
];

const linkClasses =
  "font-mono text-[14px] text-fg-muted no-underline transition-colors duration-150 hover:text-accent";

// S mark with the motto, the newsletter signup, links in mono (docs/brand.md,
// "Site"). An ink hairline opens it: the rule is the only divider.
export function Footer() {
  const year = new Date().getFullYear();

  return (
    // data-print-hide: site chrome is screen-only, so it never reaches paper.
    <footer data-print-hide="" className="mt-auto">
      <div className="max-w-[1136px] mx-auto px-4 sm:px-8">
        <div className="border-t border-fg pt-8 pb-10 flex flex-col gap-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex items-center gap-3.5">
              <Mark cut="s" size={28} className="text-fg" />
              <p className="font-sans font-bold text-[18px] tracking-[-0.02em] text-fg m-0">
                Everything I learn, I share.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-3.5">
              <p className="font-sans text-[15px] text-fg-muted m-0 sm:leading-[44px] shrink-0">
                One email a month
              </p>
              <SubscribeForm mode="inline" className="w-full sm:w-auto" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
              {SOCIAL_PROFILES.map((profile) => (
                <a
                  key={profile.url}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClasses}
                >
                  {profile.label}
                </a>
              ))}
              {SITE_LINKS.map((link) => (
                <a key={link.href} href={link.href} className={linkClasses}>
                  {link.label}
                </a>
              ))}
            </nav>
            <p className="font-mono text-[13px] text-fg-subtle m-0">© {year} Davide Imola</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
