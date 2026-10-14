import type { Meta, StoryObj } from "@storybook/react";
import { StdoutPanel } from "../components/ui/StdoutPanel";

const meta: Meta<typeof StdoutPanel> = {
  title: "UI/StdoutPanel",
  component: StdoutPanel,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StdoutPanel>;

export const Default: Story = {
  render: () => (
    <div className="w-[420px] max-w-full">
      <StdoutPanel>
        <div className="px-4 py-6 flex flex-col gap-2">
          <p className="font-mono text-[13px]">
            <span className="text-fg">✓</span> <span className="text-fg">Almost there.</span>
          </p>
          <p className="font-sans text-[13px] text-fg-subtle">
            Check your inbox and click the confirmation link to finish subscribing.
          </p>
        </div>
      </StdoutPanel>
    </div>
  ),
};

export const CustomLabel: Story = {
  render: () => (
    <div className="w-[420px] max-w-full">
      <StdoutPanel label="stderr">
        <div className="px-4 py-6">
          <p className="font-mono text-[13px] text-fg">✗ Something went wrong.</p>
        </div>
      </StdoutPanel>
    </div>
  ),
};
