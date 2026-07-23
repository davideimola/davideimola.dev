import type { ReactNode } from "react";
import { ButtonLink } from "../ui/Button";

interface CtaProps {
  href: string;
  /** "primary" = Akane fill, "ghost" = subtle outline. Default "primary". */
  variant?: "primary" | "ghost";
  children: ReactNode;
}

// Web counterpart of the email CtaButton (src/emails/components/CtaButton.tsx): same props,
// wrapping the site's ButtonLink so the newsletter CTA matches every other button on the
// site. `not-prose` keeps prose link styles off it.
export function Cta({ href, variant = "primary", children }: CtaProps) {
  return (
    <div className="not-prose my-5">
      <ButtonLink href={href} variant={variant}>
        {children}
      </ButtonLink>
    </div>
  );
}
