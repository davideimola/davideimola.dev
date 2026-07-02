import type { Meta, StoryObj } from "@storybook/react";
import { TableOfContents } from "../components/ui/TableOfContents";
import type { TocItem } from "../lib/content";

const meta: Meta<typeof TableOfContents> = {
  title: "UI/TableOfContents",
  component: TableOfContents,
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#080807" }],
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TableOfContents>;

const sampleItems: TocItem[] = [
  { id: "the-problem", text: "The problem", level: 2 },
  { id: "why-ai-is-not-enough", text: "Why AI is not enough", level: 2 },
  { id: "false-positives", text: "False positives", level: 3 },
  { id: "missing-context", text: "Missing context", level: 3 },
  { id: "what-to-do-instead", text: "What to do instead", level: 2 },
  { id: "conclusion", text: "Conclusion", level: 2 },
];

export const Default: Story = {
  args: {
    items: sampleItems,
  },
};

// With matching headings in the document, the IntersectionObserver
// highlights the active section as you scroll through the article.
export const WithArticleContent: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="bg-bg min-h-screen px-4 sm:px-8 py-16">
      <div className="max-w-[960px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_220px] gap-12">
        <article>
          {sampleItems.map((item) => (
            <section key={item.id}>
              <h2 id={item.id} className="font-mono text-[18px] text-text-1 mt-12 mb-4">
                {item.text}
              </h2>
              <p className="font-sans text-[14px] leading-relaxed text-text-2 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="font-sans text-[14px] leading-relaxed text-text-2 mb-4">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
              </p>
            </section>
          ))}
          <div className="h-[50vh]" />
        </article>
        <aside className="hidden md:block">
          <div className="sticky top-24">
            <TableOfContents items={sampleItems} />
          </div>
        </aside>
      </div>
    </div>
  ),
};
