import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "../components/ui/Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "UI/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const NewsletterIssue: Story = {
  args: {
    items: [{ label: "Newsletter", href: "/newsletter" }, { label: "July 2026" }],
  },
};

export const DeepPath: Story = {
  args: {
    items: [
      { label: "Projects", href: "/projects" },
      { label: "Schrodinger Hat", href: "/projects/schrodinger-hat" },
      { label: "Events" },
    ],
  },
};
