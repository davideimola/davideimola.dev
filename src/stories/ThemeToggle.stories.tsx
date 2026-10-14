import type { Meta, StoryObj } from "@storybook/react";
import { ThemeToggle } from "../components/ui/ThemeToggle";

const meta: Meta<typeof ThemeToggle> = {
  title: "UI/ThemeToggle",
  component: ThemeToggle,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Flips between the light and dark brand themes and stores the choice per browser. The icon is picked by CSS, so it is right on the first paint.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {};
