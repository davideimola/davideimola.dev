import type { Meta, StoryObj } from "@storybook/react";
import { BackToTop } from "../components/ui/BackToTop";

const meta: Meta<typeof BackToTop> = {
  title: "UI/BackToTop",
  component: BackToTop,
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
type Story = StoryObj<typeof BackToTop>;

// Note: the button only appears after scrolling 400px.
// In Storybook it is rendered inline for preview purposes.
export const Default: Story = {};
