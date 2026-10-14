import type { Metadata } from "next";
import { ButtonLink } from "../../../../components/ui/Button";
import { PageHero } from "../../../../components/ui/PageHero";

export const metadata: Metadata = {
  title: "You're in",
  description: "Your newsletter subscription is confirmed.",
  // Post-confirmation landing: not meant to be indexed or shared. The Kit double-opt-in
  // form must be configured to redirect here (https://davideimola.dev/newsletter/confirmed)
  // after a subscriber clicks the confirmation link.
  robots: { index: false, follow: false },
};

export default function NewsletterConfirmedPage() {
  return (
    <div className="max-w-[1136px] mx-auto px-4 sm:px-8 pt-12 md:pt-16 pb-20">
      <PageHero
        label="Welcome"
        title="You're in"
        description="Your subscription is confirmed. Thanks for joining, I'm glad to have you."
        className="mb-10"
      />

      <div className="h-px bg-rule max-w-[42rem]" />

      <div className="pt-8 flex flex-col gap-7 max-w-[42rem]">
        <p className="m-0 font-sans text-[18px] sm:text-[19px] leading-[1.6] text-fg-body">
          Once a month, at the start of the month, you'll get what actually happened: what I found,
          tried, built and killed. One email, and every issue has an unsubscribe link.
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <ButtonLink variant="primary" href="/newsletter">
            Read past issues
          </ButtonLink>
          <ButtonLink variant="link" href="/blog">
            Or the writing
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
