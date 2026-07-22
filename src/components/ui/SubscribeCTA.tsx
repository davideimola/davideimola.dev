import { SubscribeForm } from "./SubscribeForm";

interface SubscribeCTAProps {
  heading?: string;
  description?: string;
  className?: string;
}

/**
 * A compact, self-contained subscribe call-to-action: a short pitch above the compact
 * SubscribeForm, in a bordered card. Reused at the end of blog posts, on the Sharing
 * page (talks-framed copy), and inside the home NewsletterSection. The footer uses a
 * plain text link instead, to keep the site's sober tone.
 */
export function SubscribeCTA({
  heading = "Subscribe to the newsletter",
  description = "One email a month: new posts, upcoming talks, and the occasional project. No spam, unsubscribe anytime.",
  className = "",
}: SubscribeCTAProps) {
  return (
    <div className={`border border-border rounded-sm bg-bg-card px-6 py-6 ${className}`}>
      <h3 className="font-mono text-[14px] text-text-1 mb-1.5">{heading}</h3>
      <p className="font-sans text-[13px] text-text-3 leading-relaxed mb-4 max-w-md">
        {description}
      </p>
      <div className="max-w-md">
        <SubscribeForm mode="compact" />
      </div>
    </div>
  );
}
