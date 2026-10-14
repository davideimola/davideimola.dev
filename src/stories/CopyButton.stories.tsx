import type { Meta, StoryObj } from "@storybook/react";
import { CopyButton } from "../components/ui/CopyButton";

const meta: Meta<typeof CopyButton> = {
  title: "UI/CopyButton",
  component: CopyButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {
  args: {
    code: "pnpm dev",
  },
};

export const CustomLabels: Story = {
  args: {
    code: "https://davideimola.dev/blog/ai-will-not-secure-your-codebase",
    label: "copy link",
    copiedLabel: "link copied!",
  },
};

// Typical usage: the button sits in the header bar of a code block.
export const InCodeBlockHeader: Story = {
  render: () => (
    <div className="w-[420px] border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-border">
        <span className="font-mono text-[10px] text-fg-subtle">bash</span>
        <CopyButton
          code={'kubectl get pods -n production -o jsonpath="{.items[*].metadata.name}"'}
        />
      </div>
      <pre className="px-4 py-3 bg-surface font-mono text-[12px] text-fg-muted overflow-x-auto">
        {'kubectl get pods -n production -o jsonpath="{.items[*].metadata.name}"'}
      </pre>
    </div>
  ),
};
