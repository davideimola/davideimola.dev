import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#080807" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    hoverable: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    hoverable: true,
    children: (
      <div>
        <p className="font-mono text-text-1">Card content</p>
        <p className="font-sans text-text-2 text-[13px] mt-2">Some description text goes here.</p>
      </div>
    ),
  },
};

export const WithBadge: Story = {
  render: () => (
    <div className="w-[340px]">
      <Card href="#">
        <Badge variant="active">Community · Active</Badge>
        <p className="font-mono text-text-1 text-base font-semibold mt-4 mb-2">Schrodinger Hat</p>
        <p className="font-sans text-text-2 text-[13px] leading-relaxed">
          International open source community. 20k+ people reached, 100+ speakers.
        </p>
      </Card>
    </div>
  ),
};

export const ComingSoon: Story = {
  render: () => (
    <div className="w-[340px]">
      <Card>
        <Badge variant="coming-soon">Coming soon</Badge>
        <p className="font-mono text-text-1 text-base font-semibold mt-4 mb-2">Worky</p>
        <p className="font-sans text-text-2 text-[13px] leading-relaxed">
          A tool for running workshops. Still in the works.
        </p>
      </Card>
    </div>
  ),
};

export const NonHoverable: Story = {
  args: {
    hoverable: false,
    children: <p className="font-sans text-text-2 text-[13px]">This card has no hover effect.</p>,
  },
};
