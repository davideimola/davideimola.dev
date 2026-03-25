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
        <p style={{ color: "#EAE5DF", fontFamily: "JetBrains Mono, monospace" }}>Card content</p>
        <p style={{ color: "#9A948E", fontSize: "13px", marginTop: "8px" }}>
          Some description text goes here.
        </p>
      </div>
    ),
  },
};

export const WithBadge: Story = {
  render: () => (
    <div style={{ width: "340px" }}>
      <Card href="#">
        <Badge variant="active">Community · Active</Badge>
        <p
          style={{
            color: "#EAE5DF",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "16px",
            fontWeight: 600,
            marginTop: "16px",
            marginBottom: "8px",
          }}
        >
          Schrodinger Hat
        </p>
        <p style={{ color: "#9A948E", fontSize: "13px", lineHeight: 1.55 }}>
          International open source community. 20k+ people reached, 100+ speakers.
        </p>
      </Card>
    </div>
  ),
};

export const ComingSoon: Story = {
  render: () => (
    <div style={{ width: "340px" }}>
      <Card>
        <Badge variant="coming-soon">Coming soon</Badge>
        <p
          style={{
            color: "#EAE5DF",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "16px",
            fontWeight: 600,
            marginTop: "16px",
            marginBottom: "8px",
          }}
        >
          Worky
        </p>
        <p style={{ color: "#9A948E", fontSize: "13px", lineHeight: 1.55 }}>
          A tool for running workshops. Still in the works.
        </p>
      </Card>
    </div>
  ),
};

export const NonHoverable: Story = {
  args: {
    hoverable: false,
    children: <p style={{ color: "#9A948E", fontSize: "13px" }}>This card has no hover effect.</p>,
  },
};
