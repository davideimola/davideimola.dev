import type { Meta, StoryObj } from "@storybook/react";
import { JsonLd } from "../components/ui/JsonLd";

const meta: Meta<typeof JsonLd> = {
  title: "UI/JsonLd",
  component: JsonLd,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof JsonLd>;

const personData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Davide Imola",
  url: "https://davideimola.dev",
  jobTitle: "Tech Lead",
  sameAs: ["https://github.com/davideimola", "https://bsky.app/profile/davideimola.dev"],
};

const blogPostingData = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "AI will not secure your codebase",
  datePublished: "2025-03-10",
  author: {
    "@type": "Person",
    name: "Davide Imola",
    url: "https://davideimola.dev",
  },
  url: "https://davideimola.dev/blog/ai-will-not-secure-your-codebase",
};

// JsonLd renders an invisible <script type="application/ld+json"> tag.
// Each story also shows a <pre> preview of the payload so the canvas is not blank.
function JsonLdPreview({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="max-w-[640px]">
      <JsonLd data={data} />
      <p className="font-mono text-[10px] text-fg-subtle tracking-widest uppercase mb-3">
        {"// "} injected &lt;script type=&quot;application/ld+json&quot;&gt; payload
      </p>
      <pre className="border border-border bg-surface px-4 py-3 font-mono text-[12px] text-fg-muted overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

export const Person: Story = {
  args: { data: personData },
  render: (args) => <JsonLdPreview data={args.data} />,
};

export const BlogPosting: Story = {
  args: { data: blogPostingData },
  render: (args) => <JsonLdPreview data={args.data} />,
};
