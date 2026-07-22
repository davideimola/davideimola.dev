import type { Meta, StoryObj } from "@storybook/react";
import { SubscribeCTA } from "../components/ui/SubscribeCTA";

const meta: Meta<typeof SubscribeCTA> = {
  title: "UI/SubscribeCTA",
  component: SubscribeCTA,
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
type Story = StoryObj<typeof SubscribeCTA>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[520px] max-w-full">
      <SubscribeCTA {...args} />
    </div>
  ),
};

export const TalksFramed: Story = {
  args: {
    heading: "Catch my next talk",
    description:
      "Get my upcoming talks and workshops in your inbox, plus what I publish, once a month. No spam, unsubscribe anytime.",
  },
  render: (args) => (
    <div className="w-[520px] max-w-full">
      <SubscribeCTA {...args} />
    </div>
  ),
};
