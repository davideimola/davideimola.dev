import type { Meta, StoryObj } from "@storybook/react";
import { ReadingProgress } from "../components/ui/ReadingProgress";

const meta: Meta<typeof ReadingProgress> = {
  title: "UI/ReadingProgress",
  component: ReadingProgress,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#080807" }],
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ReadingProgress>;

// Stable ids for the fake article paragraphs (avoids index-as-key)
const PARAGRAPHS = Array.from({ length: 24 }, (_, i) => ({
  id: `paragraph-${i + 1}`,
  number: i + 1,
}));

// The component tracks window scroll against the #article-content element,
// so the story provides a tall fake article to scroll through.
export const Default: Story = {
  render: () => (
    <div className="bg-bg min-h-screen">
      <ReadingProgress />
      <article id="article-content" className="max-w-[640px] mx-auto px-4 sm:px-8 py-24">
        <h2 className="font-mono text-[20px] text-text-1 mb-6">Scroll to see the progress bar</h2>
        <p className="font-sans text-[14px] text-text-3 mb-10">
          The accent bar fixed near the top of the viewport fills as you scroll through this
          article.
        </p>
        {PARAGRAPHS.map((paragraph) => (
          <p key={paragraph.id} className="font-sans text-[14px] leading-relaxed text-text-2 mb-6">
            Paragraph {paragraph.number} — Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat.
          </p>
        ))}
      </article>
    </div>
  ),
};
