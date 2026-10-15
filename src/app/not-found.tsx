import type { Metadata } from "next";
import { ButtonLink } from "../components/ui/Button";
import { DrawnCover } from "../components/ui/DrawnCover";
import { Tape } from "../components/ui/Tape";
import { loadDrawableCover } from "../lib/cover-files";

export const metadata: Metadata = {
  title: "404: Page not found",
  description: "This page does not exist.",
};

const SUGGESTIONS = [
  { label: "Writing", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Talks", href: "/sharing" },
  { label: "Now", href: "/now" },
];

// Drawn like a post cover: a thread on its nail, frayed where it gave way, and
// the knot on the floor. It draws itself, the knot landing last.
const COVER = "/images/pages/not-found/cover.svg";

export default function NotFound() {
  const cover = loadDrawableCover(COVER);
  return (
    <div className="max-w-[1136px] mx-auto px-4 sm:px-8 pt-12 md:pt-16 pb-20 min-h-[60vh] grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 lg:gap-16 items-center">
      <div className="flex flex-col items-start gap-6 max-w-[42rem]">
        <Tape tilt={0}>404</Tape>
        <h1 className="m-0 font-sans font-bold text-fg text-[40px] sm:text-[52px] lg:text-h1 leading-[1.02] tracking-[-0.045em]">
          This page came undone.
        </h1>
        <p className="m-0 font-sans text-[19px] sm:text-lead leading-[1.5] text-fg-muted">
          The link is old, or the page moved without leaving a forwarding address. These are still
          where they were.
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-3 list-none m-0 p-0">
          {SUGGESTIONS.map((s) => (
            <li key={s.href}>
              <ButtonLink variant="link" href={s.href}>
                {s.label}
              </ButtonLink>
            </li>
          ))}
        </ul>
        <div className="mt-2">
          <ButtonLink variant="primary" href="/">
            Back to the home page
          </ButtonLink>
        </div>
      </div>
      {cover && (
        <DrawnCover
          light={cover.light}
          dark={cover.dark}
          alt="A thread hanging from a nail, frayed at the end, its red knot fallen to the floor"
        />
      )}
    </div>
  );
}
