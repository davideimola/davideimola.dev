import { Section, Text } from "@react-email/components";
import { emailColors as c, emailFonts as f } from "../theme";

interface SectionHeaderProps {
  /** Section label, e.g. "New on the blog". Rendered uppercase. */
  title: string;
}

// Email echo of the on-site SectionHeader (src/components/ui/SectionHeader.tsx): the
// brand's label-maker tape, ink with paper letters, Barlow Condensed uppercase. Kept flat:
// rotation is not reliable across mail clients.
export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <Section style={{ marginTop: "36px", marginBottom: "18px" }}>
      <Text style={{ margin: 0, lineHeight: 1 }}>
        <span
          style={{
            display: "inline-block",
            fontFamily: f.label,
            fontSize: "15px",
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: c.tapeFg,
            backgroundColor: c.tapeBg,
            borderRadius: "3px",
            padding: "4px 10px",
          }}
        >
          {title}
        </span>
      </Text>
    </Section>
  );
}
