import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../components/ui/Badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#080807" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "active", "coming-soon", "category"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    variant: "default",
    children: "Community · Active",
  },
};

export const Active: Story = {
  args: {
    variant: "active",
    children: "Active",
  },
};

export const ComingSoon: Story = {
  args: {
    variant: "coming-soon",
    children: "Coming soon",
  },
};

export const Category: Story = {
  args: {
    variant: "category",
    children: "Security",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap p-6">
      <Badge variant="default">Community · Active</Badge>
      <Badge variant="active">Active</Badge>
      <Badge variant="coming-soon">Coming soon</Badge>
      <Badge variant="category">Security</Badge>
      <Badge variant="category">DevOps</Badge>
      <Badge variant="category">Go</Badge>
    </div>
  ),
};
