import { SectionHeader as UiSectionHeader } from "../ui/SectionHeader";
import { Cta } from "./Cta";
import { PostCard } from "./PostCard";
import { TalkRow } from "./TalkRow";

// Shared MDX component map for newsletter issues (web side). The component NAMES here match
// the email map (src/emails/...), so one authored .mdx body renders on both surfaces:
// these dark-theme site components on the web, the light email components in the inbox.
export const newsletterMdxComponents = {
  SectionHeader: ({ title }: { title: string }) => (
    <div className="not-prose mt-10 mb-5">
      <UiSectionHeader title={title} className="mb-0" />
    </div>
  ),
  PostCard,
  TalkRow,
  Cta,
};
