import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "../components/ui/Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "UI/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#080807" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    command: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const BlogPost: Story = {
  args: {
    command: "cat",
    items: [{ label: "blog", href: "/blog" }, { label: "securing-secrets-in-the-gitops-era.mdx" }],
  },
};

export const DeepPath: Story = {
  args: {
    command: "cat",
    items: [{ label: "blog", href: "/blog" }, { label: "ai-will-not-secure-your-codebase.mdx" }],
  },
};

export const CustomCommand: Story = {
  args: {
    command: "open",
    items: [{ label: "projects", href: "/projects" }, { label: "schrodinger-hat" }],
  },
};
