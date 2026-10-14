import type { Metadata } from "next";
import { ButtonLink } from "../components/ui/Button";
import { Tape } from "../components/ui/Tape";

export const metadata: Metadata = {
  title: "404: Page not found",
  description: "This page does not exist.",
};

const SUGGESTIONS = [
  { label: "Writing", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Sharing", href: "/sharing" },
  { label: "Now", href: "/now" },
];

export default function NotFound() {
  return (
    <div className="max-w-[1136px] mx-auto px-4 sm:px-8 pt-12 md:pt-16 pb-20 min-h-[60vh] flex items-center">
      <div className="flex flex-col gap-6 max-w-[42rem]">
        <Tape tilt={0}>404</Tape>
        <h1 className="m-0 font-sans font-bold text-fg text-[40px] sm:text-[52px] lg:text-h1 leading-[1.02] tracking-[-0.045em]">
          This page does not exist.
        </h1>
        <p className="m-0 font-sans text-[19px] sm:text-lead leading-[1.5] text-fg-muted">
          The link may be old, or the page moved. Try one of these instead.
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 list-none m-0 p-0">
          {SUGGESTIONS.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                className="font-mono text-[14px] text-fg no-underline hover:text-accent transition-colors duration-150"
              >
                {s.label} →
              </a>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-6 mt-2">
          <ButtonLink variant="primary" href="/">
            Back to the home page
          </ButtonLink>
          <ButtonLink variant="link" href="/terminal">
            Or open a shell
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
