import { Section, Text } from "@react-email/components";
import { emailColors as c, emailFonts as f } from "../theme";

interface SectionHeaderProps {
  /** Section label, e.g. "New on the blog". Rendered uppercase. */
  title: string;
}

// Email echo of the on-site SectionHeader (src/components/ui/SectionHeader.tsx): a mono,
// uppercase, letter-spaced label with the accent "//" prefix and a thin hairline under it.
// It gives the digest scannable section breaks instead of a bare markdown h2.
export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <Section style={{ marginTop: "34px", marginBottom: "18px" }}>
      <Text
        style={{
          fontFamily: f.mono,
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: c.text2,
          margin: 0,
          paddingBottom: "10px",
          borderBottom: `1px solid ${c.border}`,
        }}
      >
        <span style={{ color: c.accent, marginRight: "8px" }}>{"//"}</span>
        {title}
      </Text>
    </Section>
  );
}
