import type { Meta, StoryObj } from "@storybook/react";
import { SubscribeForm } from "../components/ui/SubscribeForm";

const meta: Meta<typeof SubscribeForm> = {
  title: "UI/SubscribeForm",
  component: SubscribeForm,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#080807" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    mode: {
      control: "radio",
      options: ["full", "compact"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof SubscribeForm>;

export const Full: Story = {
  args: { mode: "full" },
  render: (args) => (
    <div className="w-[420px] max-w-full">
      <SubscribeForm {...args} />
    </div>
  ),
};

export const Compact: Story = {
  args: { mode: "compact" },
  render: (args) => (
    <div className="w-[320px] max-w-full">
      <SubscribeForm {...args} />
    </div>
  ),
};
