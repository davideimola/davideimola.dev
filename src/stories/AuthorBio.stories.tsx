import type { Meta, StoryObj } from "@storybook/react";
import { AuthorBio } from "../components/ui/AuthorBio";

const meta: Meta<typeof AuthorBio> = {
  title: "UI/AuthorBio",
  component: AuthorBio,
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
type Story = StoryObj<typeof AuthorBio>;

export const Default: Story = {};
