import type { Meta, StoryObj } from "@storybook/react";
import { Mark, Wordmark } from "../components/ui/BrandMark";

const meta: Meta<typeof Mark> = {
  title: "UI/BrandMark",
  component: Mark,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    cut: { control: "select", options: ["s", "m", "l"] },
  },
};

export default meta;
type Story = StoryObj<typeof Mark>;

export const Default: Story = {
  args: { cut: "s", size: 36, title: "Davide Imola" },
  render: (args) => (
    <div className="text-fg">
      <Mark {...args} />
    </div>
  ),
};

/** Three cuts of one drawing: switch cut instead of shrinking the large one. */
export const Cuts: Story = {
  render: () => (
    <div className="flex items-end gap-10 text-fg">
      <div className="flex flex-col items-center gap-2">
        <Mark cut="s" size={32} />
        <span className="font-mono text-meta text-fg-subtle">S · 32px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Mark cut="m" size={64} />
        <span className="font-mono text-meta text-fg-subtle">M · 64px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Mark cut="l" size={128} />
        <span className="font-mono text-meta text-fg-subtle">L · 128px</span>
      </div>
    </div>
  ),
};

/** Tone-on-tone, for social card watermarks only. */
// Traces the graph and ties the knot once, as it mounts. Re-render the story
// (or reload) to see it again.
export const Draw: Story = {
  args: { cut: "l", size: 160, title: "Davide Imola", draw: true },
  render: (args) => (
    <div className="text-fg">
      <Mark {...args} />
    </div>
  ),
};

// The NavBar pair on the first load of the home: the mark draws, then the
// wordmark's knots answer.
export const DrawWithEcho: Story = {
  render: () => (
    <div className="flex items-center gap-3 text-fg">
      <Mark cut="s" size={34} draw />
      <Wordmark weight="bold" width={172} echo />
    </div>
  ),
};

export const Tonal: Story = {
  render: () => (
    <div className="text-border">
      <Mark cut="l" size={200} tonal />
    </div>
  ),
};

export const Wordmarks: Story = {
  render: () => (
    <div className="flex flex-col gap-8 text-fg">
      <Wordmark weight="bold" width={172} title="davide imola" />
      <Wordmark weight="regular" width={360} title="davide imola" />
    </div>
  ),
};

/** The NavBar lockup: S mark plus the bold wordmark. */
export const Lockup: Story = {
  render: () => (
    <div className="flex items-center gap-2.5 text-fg">
      <Mark cut="s" size={34} />
      <Wordmark weight="bold" width={172} />
    </div>
  ),
};
