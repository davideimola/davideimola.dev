import type { Meta, StoryObj } from "@storybook/react";
import { Button, ButtonLink } from "../components/ui/Button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
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
      options: ["primary", "ghost"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
    size: "md",
    children: "Read the blog →",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    size: "md",
    children: "View talks →",
  },
};

export const Small: Story = {
  args: {
    variant: "primary",
    size: "sm",
    children: "Small button",
  },
};

export const Large: Story = {
  args: {
    variant: "primary",
    size: "lg",
    children: "Large button",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex gap-3 items-center">
        <Button variant="primary" size="sm">
          Primary SM
        </Button>
        <Button variant="primary" size="md">
          Primary MD →
        </Button>
        <Button variant="primary" size="lg">
          Primary LG
        </Button>
      </div>
      <div className="flex gap-3 items-center">
        <Button variant="ghost" size="sm">
          Ghost SM
        </Button>
        <Button variant="ghost" size="md">
          Ghost MD →
        </Button>
        <Button variant="ghost" size="lg">
          Ghost LG
        </Button>
      </div>
      <div className="flex gap-3 items-center">
        <ButtonLink variant="primary" href="#">
          Link Primary
        </ButtonLink>
        <ButtonLink variant="ghost" href="#">
          Link Ghost
        </ButtonLink>
      </div>
    </div>
  ),
};
