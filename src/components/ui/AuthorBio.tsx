import { SOCIAL_PROFILES } from "../../lib/social";
import { Mark } from "./BrandMark";

// The sign-off under every post: the mark in an ink disc, the motto and the
// short line. An ink hairline opens it, like the footer.
export function AuthorBio() {
  return (
    <div className="mt-14 pt-8 border-t border-fg flex flex-col sm:flex-row items-start sm:items-center gap-5">
      <div className="w-[72px] h-[72px] rounded-full bg-fg text-bg flex items-center justify-center shrink-0">
        <Mark cut="m" size={52} title="Davide Imola" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <p className="font-sans font-bold text-[20px] tracking-[-0.02em] text-fg m-0">
          Everything I learn, I share.
        </p>
        <p className="font-sans text-[16px] text-fg-muted leading-relaxed m-0">
          Davide Imola, Tech Lead at RedCarbon. Builder of AI agents for security, mostly in Go.
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
          {SOCIAL_PROFILES.map((social) => (
            <a
              key={social.url}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[13px] text-fg-muted no-underline hover:text-accent transition-colors duration-150"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
