import { Button, Section } from "@react-email/components";
import type { CSSProperties, ReactNode } from "react";
import { emailColors as c, emailFonts as f } from "../theme";
import { absoluteUrl } from "../url";

type CtaVariant = "primary" | "ghost";

interface CtaButtonProps {
  href: string;
  children: ReactNode;
  /** "primary" = Akane fill (main action), "ghost" = subtle outline. Default "primary". */
  variant?: CtaVariant;
  /** Alignment within the row. Default "left". */
  align?: "left" | "center";
}

const variantStyles: Record<CtaVariant, CSSProperties> = {
  primary: {
    backgroundColor: c.accent,
    color: "#FFFFFF",
    border: `1px solid ${c.accent}`,
  },
  ghost: {
    backgroundColor: "transparent",
    color: c.text2,
    border: `1px solid ${c.borderMid}`,
  },
};

// Bulletproof CTA button for the digest. React Email's Button renders the VML/table
// fallback Outlook needs, so it stays a real tappable button everywhere. Echoes the
// on-site Button (src/components/ui/Button.tsx): mono, medium weight, 3px radius, Akane
// fill for primary / subtle outline for ghost. Email has no hover, so there is no hover
// state (the on-site hover shift is dropped by design).
export function CtaButton({ href, children, variant = "primary", align = "left" }: CtaButtonProps) {
  return (
    <Section style={{ textAlign: align, marginTop: "8px", marginBottom: "8px" }}>
      <Button
        href={absoluteUrl(href)}
        style={{
          ...variantStyles[variant],
          fontFamily: f.mono,
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: "0.02em",
          borderRadius: "3px",
          padding: "12px 22px",
          textDecoration: "none",
        }}
      >
        {children}
      </Button>
    </Section>
  );
}
