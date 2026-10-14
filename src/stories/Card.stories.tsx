import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
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
        <p className="font-sans font-bold text-fg">Card content</p>
        <p className="font-sans text-fg-muted text-[15px] mt-2">Some description text goes here.</p>
      </div>
    ),
  },
};

export const WithBadge: Story = {
  render: () => (
    <div className="w-[340px]">
      <Card href="#">
        <Badge variant="active">Community · Active</Badge>
        <p className="font-sans text-fg text-[20px] font-bold tracking-[-0.02em] mt-4 mb-2">
          Schrodinger Hat
        </p>
        <p className="font-sans text-fg-muted text-[15px] leading-relaxed">
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
        <p className="font-sans text-fg text-[20px] font-bold tracking-[-0.02em] mt-4 mb-2">
          Next project
        </p>
        <p className="font-sans text-fg-muted text-[15px] leading-relaxed">
          Something being built in the open. Still in the works.
        </p>
      </Card>
    </div>
  ),
};

export const NonHoverable: Story = {
  args: {
    hoverable: false,
    children: <p className="font-sans text-fg-muted text-[15px]">This card has no hover effect.</p>,
  },
};

/** A tape on the top-left edge says what the card is. The card stays straight. */
export const WithTape: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-7 max-w-[960px] p-6">
      <Card href="#" tape="Writing" tapeTilt={0}>
        <p className="font-sans font-bold text-[23px] leading-[1.2] tracking-[-0.025em] text-fg">
          AI Agent Sessions Are a Data Store Nobody Designed
        </p>
      </Card>
      <Card href="#" tape="Building" tapeTilt={1}>
        <p className="font-sans font-bold text-[23px] tracking-[-0.025em] text-fg">Argus</p>
        <p className="font-sans text-[16px] text-fg-subtle mt-2">
          Open-source AI security review agent, in Go
        </p>
      </Card>
      <Card href="#" tape="Next talk" tapeTilt={2}>
        <p className="font-sans font-bold text-[23px] tracking-[-0.025em] text-fg">
          Securing Go for Production
        </p>
        <p className="font-sans text-[16px] text-fg-subtle mt-2">GoLab 2026 · 1 Nov</p>
      </Card>
    </div>
  ),
};
