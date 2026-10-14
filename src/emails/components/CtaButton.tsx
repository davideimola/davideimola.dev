import { Button, Section } from "@react-email/components";
import type { CSSProperties, ReactNode } from "react";
import { emailColors as c, emailFonts as f } from "../theme";
import { absoluteUrl } from "../url";

type CtaVariant = "primary" | "ghost";

interface CtaButtonProps {
  href: string;
  children: ReactNode;
  /** "primary" = filled ink (the main action), "ghost" = ink outline. Default "primary". */
  variant?: CtaVariant;
  /** Alignment within the row. Default "left". */
  align?: "left" | "center";
}

const variantStyles: Record<CtaVariant, CSSProperties> = {
  primary: {
    backgroundColor: c.text1,
    color: c.bg,
    border: `1px solid ${c.text1}`,
  },
  ghost: {
    backgroundColor: "transparent",
    color: c.text1,
    border: `1px solid ${c.text1}`,
  },
};

// Bulletproof CTA button for the digest. React Email's Button renders the VML/table
// fallback Outlook needs, so it stays a real tappable button everywhere. Echoes the
// on-site Button (src/components/ui/Button.tsx): sans semibold, filled ink for primary,
// ink outline for ghost, never red. Email has no hover, so there is no hover state.
export function CtaButton({ href, children, variant = "primary", align = "left" }: CtaButtonProps) {
  return (
    <Section style={{ textAlign: align, marginTop: "8px", marginBottom: "8px" }}>
      <Button
        href={absoluteUrl(href)}
        style={{
          ...variantStyles[variant],
          fontFamily: f.sans,
          fontSize: "15px",
          fontWeight: 600,
          borderRadius: "0",
          padding: "12px 22px",
          textDecoration: "none",
        }}
      >
        {children}
      </Button>
    </Section>
  );
}
