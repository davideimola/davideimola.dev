import { Heading, Hr, Link, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { CtaButton } from "./components/CtaButton";
import { PostCard } from "./components/PostCard";
import { SectionHeader } from "./components/SectionHeader";
import { TalkRow } from "./components/TalkRow";
import { emailColors as c, emailFonts as f } from "./theme";
import { absoluteUrl } from "./url";

// Email MDX component map. The component NAMES match the web map
// (src/components/newsletter/mdx-components.tsx), so one authored .mdx issue body renders
// on both surfaces. Here the markdown primitives (p, headings, links, lists, ...) map to
// email-safe styled React Email elements - the job react-email's <Markdown> used to do -
// so prose renders alongside the custom components. The `a` primitive absolutizes links.

type MdxProps = { children?: ReactNode; href?: string };

export const emailMdxComponents = {
  // Custom components (same names as the web map).
  SectionHeader,
  PostCard,
  TalkRow,
  Cta: CtaButton,

  // Markdown primitives -> email-safe styled elements.
  p: ({ children }: MdxProps) => (
    <Text
      style={{
        fontFamily: f.sans,
        fontSize: "15px",
        lineHeight: 1.65,
        color: c.text2,
        margin: "0 0 14px",
      }}
    >
      {children}
    </Text>
  ),
  h2: ({ children }: MdxProps) => (
    <Heading
      as="h2"
      style={{ fontFamily: f.mono, fontSize: "18px", color: c.text1, margin: "28px 0 0" }}
    >
      {children}
    </Heading>
  ),
  h3: ({ children }: MdxProps) => (
    <Heading
      as="h3"
      style={{ fontFamily: f.mono, fontSize: "15px", color: c.text1, margin: "22px 0 0" }}
    >
      {children}
    </Heading>
  ),
  a: ({ href, children }: MdxProps) => (
    <Link href={absoluteUrl(href ?? "")} style={{ color: c.accent }}>
      {children}
    </Link>
  ),
  strong: ({ children }: MdxProps) => <strong style={{ color: c.text1 }}>{children}</strong>,
  em: ({ children }: MdxProps) => <em style={{ color: c.text2 }}>{children}</em>,
  ul: ({ children }: MdxProps) => (
    <ul
      style={{
        margin: "0 0 14px",
        paddingLeft: "20px",
        fontFamily: f.sans,
        fontSize: "15px",
        lineHeight: 1.65,
        color: c.text2,
      }}
    >
      {children}
    </ul>
  ),
  ol: ({ children }: MdxProps) => (
    <ol
      style={{
        margin: "0 0 14px",
        paddingLeft: "20px",
        fontFamily: f.sans,
        fontSize: "15px",
        lineHeight: 1.65,
        color: c.text2,
      }}
    >
      {children}
    </ol>
  ),
  li: ({ children }: MdxProps) => (
    <li style={{ marginBottom: "6px", color: c.text2 }}>{children}</li>
  ),
  blockquote: ({ children }: MdxProps) => (
    <blockquote
      style={{
        borderLeft: `2px solid ${c.border}`,
        paddingLeft: "14px",
        margin: "0 0 14px",
        color: c.text3,
        fontStyle: "italic",
      }}
    >
      {children}
    </blockquote>
  ),
  code: ({ children }: MdxProps) => (
    <code
      style={{
        fontFamily: f.mono,
        fontSize: "13px",
        backgroundColor: c.border,
        borderRadius: "2px",
        padding: "1px 5px",
        color: c.text1,
      }}
    >
      {children}
    </code>
  ),
  hr: () => <Hr style={{ borderColor: c.border, margin: "22px 0" }} />,
};
