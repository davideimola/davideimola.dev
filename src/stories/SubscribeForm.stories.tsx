import type { Meta, StoryObj } from "@storybook/react";
import { SubscribeForm } from "../components/ui/SubscribeForm";

const meta: Meta<typeof SubscribeForm> = {
  title: "UI/SubscribeForm",
  component: SubscribeForm,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    mode: { control: "radio", options: ["full", "inline", "compact"] },
    field: { control: "radio", options: ["surface", "bg"] },
  },
};

export default meta;
type Story = StoryObj<typeof SubscribeForm>;

/** The /newsletter hero. */
export const Full: Story = {
  args: { mode: "full", note: "One email a month. Unsubscribe from any issue." },
  render: (args) => (
    <div className="max-w-[620px]">
      <SubscribeForm {...args} />
    </div>
  ),
};

/** Inside the white newsletter block on the home page. */
export const InlineInBlock: Story = {
  args: { mode: "inline", field: "bg" },
  render: (args) => (
    <div className="max-w-[460px] bg-surface border border-border p-8">
      <SubscribeForm {...args} />
    </div>
  ),
};

/** /links: a sans label above the joined field. */
export const InlineNoLabel: Story = {
  args: { mode: "inline", label: null },
  render: (args) => (
    <div className="max-w-[360px]">
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
