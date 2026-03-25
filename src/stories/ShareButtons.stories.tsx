import type { Meta, StoryObj } from "@storybook/react";
import { ShareButtons } from "../components/ui/ShareButtons";

const meta: Meta<typeof ShareButtons> = {
  title: "UI/ShareButtons",
  component: ShareButtons,
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#080807" }],
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ShareButtons>;

export const Default: Story = {
  args: {
    slug: "ai-will-not-secure-your-codebase",
    title: "AI will not secure your codebase",
  },
};
