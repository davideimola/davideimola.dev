import type { Meta, StoryObj } from "@storybook/react";
import { ScrollReveal } from "../components/ui/ScrollReveal";

const meta: Meta<typeof ScrollReveal> = {
  title: "UI/ScrollReveal",
  component: ScrollReveal,
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
type Story = StoryObj<typeof ScrollReveal>;

function DemoCard({ title }: { title: string }) {
  return (
    <div className="border border-border rounded-sm bg-bg-card px-6 py-5">
      <p className="font-mono text-[10px] text-text-3 tracking-widest uppercase mb-2">
        {"// "} revealed on scroll
      </p>
      <h3 className="font-mono text-[16px] text-text-1 mb-2">{title}</h3>
      <p className="font-sans text-[13px] text-text-2">
        This card fades in and slides up when it enters the viewport.
      </p>
    </div>
  );
}

// A tall spacer pushes the revealed content below the fold,
// so scrolling down demonstrates the fade + slide-up animation.
export const Default: Story = {
  render: () => (
    <div className="bg-bg px-4 sm:px-8">
      <div className="h-[120vh] flex items-center justify-center">
        <p className="font-mono text-[13px] text-text-3">↓ scroll down to reveal the content</p>
      </div>
      <div className="max-w-[520px] mx-auto">
        <ScrollReveal>
          <DemoCard title="Hello from below the fold" />
        </ScrollReveal>
      </div>
      <div className="h-[60vh]" />
    </div>
  ),
};

// Multiple ScrollReveal blocks with increasing delays produce a staggered entrance.
export const Staggered: Story = {
  render: () => (
    <div className="bg-bg px-4 sm:px-8">
      <div className="h-[120vh] flex items-center justify-center">
        <p className="font-mono text-[13px] text-text-3">↓ scroll down for a staggered reveal</p>
      </div>
      <div className="max-w-[520px] mx-auto flex flex-col gap-4">
        <ScrollReveal delay={0}>
          <DemoCard title="First (no delay)" />
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <DemoCard title="Second (150ms delay)" />
        </ScrollReveal>
        <ScrollReveal delay={300}>
          <DemoCard title="Third (300ms delay)" />
        </ScrollReveal>
      </div>
      <div className="h-[60vh]" />
    </div>
  ),
};
