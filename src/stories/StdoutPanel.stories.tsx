import type { Meta, StoryObj } from "@storybook/react";
import { StdoutPanel } from "../components/ui/StdoutPanel";

const meta: Meta<typeof StdoutPanel> = {
  title: "UI/StdoutPanel",
  component: StdoutPanel,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#080807" }],
    },
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
            <span className="text-accent">✓</span>{" "}
            <span className="text-text-1">Almost there.</span>
          </p>
          <p className="font-sans text-[13px] text-text-3">
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
          <p className="font-mono text-[13px] text-accent">✗ Something went wrong.</p>
        </div>
      </StdoutPanel>
    </div>
  ),
};
