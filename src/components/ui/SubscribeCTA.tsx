import { SubscribeForm } from "./SubscribeForm";

interface SubscribeCTAProps {
  heading?: string;
  description?: string;
  className?: string;
}

/**
 * A compact, self-contained subscribe call-to-action: a short pitch above the compact
 * SubscribeForm, in a bordered card. Reused at the end of blog posts, on the Sharing
 * page (talks-framed copy), and inside the home NewsletterSection. The footer carries
 * its own one-line form.
 */
export function SubscribeCTA({
  heading = "Subscribe to the newsletter",
  description = "One email a month: new posts, upcoming talks, and the occasional project. No spam, unsubscribe anytime.",
  className = "",
}: SubscribeCTAProps) {
  return (
    <div className={`border border-border bg-surface px-6 py-6 ${className}`}>
      <h3 className="font-sans text-[22px] font-bold tracking-[-0.025em] text-fg mb-2">
        {heading}
      </h3>
      <p className="font-sans text-[16px] text-fg-muted leading-relaxed mb-5 max-w-md">
        {description}
      </p>
      <div className="max-w-md">
        <SubscribeForm mode="compact" />
      </div>
    </div>
  );
}
