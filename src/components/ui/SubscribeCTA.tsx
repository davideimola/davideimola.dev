import { SubscribeForm } from "./SubscribeForm";
import { Tape } from "./Tape";

interface SubscribeCTAProps {
  heading?: string;
  description?: string;
  className?: string;
}

/**
 * The newsletter block for the end of a piece (a blog post, a newsletter issue): the same
 * white card as the home NewsletterSection, with its tape on the edge, at the width of a
 * reading column, so the pitch and the field stack instead of sitting side by side.
 */
export function SubscribeCTA({
  heading = "One email a month",
  description = "What actually happened: what I found, tried, built and killed.",
  className = "",
}: SubscribeCTAProps) {
  return (
    <section
      className={`relative bg-surface border border-border px-[18px] pt-8 pb-6 sm:px-8 sm:pt-10 sm:pb-8 ${className}`}
    >
      <Tape tilt={1} className="absolute -left-1.5 sm:-left-2.5 -top-3.5">
        Newsletter
      </Tape>
      <h2 className="m-0 font-sans font-bold text-fg text-[24px] sm:text-[30px] leading-[1.1] tracking-[-0.035em]">
        {heading}
      </h2>
      <p className="mt-2.5 mb-5 font-sans text-[16px] sm:text-[18px] leading-[1.55] text-fg-body">
        {description}
      </p>
      <SubscribeForm mode="inline" label={null} field="bg" />
      <a
        href="/newsletter"
        className="inline-block mt-3 font-sans text-[14px] text-fg-subtle no-underline hover:text-accent transition-colors duration-150"
      >
        Read past issues
      </a>
    </section>
  );
}
