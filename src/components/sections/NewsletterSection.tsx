import { SubscribeForm } from "../ui/SubscribeForm";
import { Tape } from "../ui/Tape";

// The one newsletter block on the home page: a white card with its tape on
// the edge, the pitch on the left and the form on the right.
export function NewsletterSection() {
  return (
    <section className="max-w-[1136px] mx-auto px-4 sm:px-8 mt-14 md:mt-[120px]">
      <div className="relative bg-surface border border-border px-[18px] pt-8 pb-6 md:p-14 lg:px-16 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_460px] gap-3 lg:gap-14 items-center">
        <Tape tilt={0} className="absolute -left-1.5 md:-left-2.5 -top-3.5">
          Newsletter
        </Tape>
        <div className="flex flex-col gap-3 md:gap-3.5">
          <h2 className="m-0 font-sans font-bold text-fg text-[26px] md:text-[40px] leading-[1.05] tracking-[-0.04em]">
            One email a month
          </h2>
          <p className="m-0 font-sans text-[16px] md:text-[19px] leading-[1.55] text-fg-body">
            A monthly digest of everything I write, build and speak about.
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          <SubscribeForm mode="inline" field="bg" />
          <a
            href="/newsletter"
            className="self-start font-sans text-[14px] text-fg-subtle no-underline hover:text-accent transition-colors duration-150"
          >
            Read past issues
          </a>
        </div>
      </div>
    </section>
  );
}
