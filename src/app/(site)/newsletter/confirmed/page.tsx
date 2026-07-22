import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../../../../components/ui/PageHero";
import { StdoutPanel } from "../../../../components/ui/StdoutPanel";

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
    <div className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-24 pb-20">
      <PageHero
        command="cat ./welcome.md"
        title="You're in"
        description="Your subscription is confirmed. Thanks for joining, I'm glad to have you."
      />

      <StdoutPanel className="max-w-2xl">
        <div className="px-4 py-8 flex flex-col gap-4">
          <p className="font-mono text-[13px]">
            <span className="text-accent">✓</span>{" "}
            <span className="text-text-1">Subscription confirmed.</span>
          </p>
          <p className="font-sans text-[14px] text-text-2 leading-relaxed">
            Once a month you'll get a short digest of what I published: new posts, upcoming talks,
            and the occasional project. One email a month, no spam, unsubscribe anytime.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/blog"
              className="font-mono text-[12px] text-text-3 hover:text-accent transition-colors duration-150"
            >
              <span className="text-accent mr-1.5">→</span>read the blog
            </Link>
            <Link
              href="/"
              className="font-mono text-[12px] text-text-3 hover:text-accent transition-colors duration-150"
            >
              <span className="text-accent mr-1.5">→</span>back home
            </Link>
          </div>
        </div>
      </StdoutPanel>
    </div>
  );
}
