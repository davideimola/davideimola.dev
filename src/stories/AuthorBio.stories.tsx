import type { Meta, StoryObj } from "@storybook/react";
import { AuthorBio } from "../components/ui/AuthorBio";

const meta: Meta<typeof AuthorBio> = {
  title: "UI/AuthorBio",
  component: AuthorBio,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AuthorBio>;

export const Default: Story = {};
