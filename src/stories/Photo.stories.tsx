import type { Meta, StoryObj } from "@storybook/react";
import { Photo } from "../components/ui/Photo";

const meta: Meta<typeof Photo> = {
  title: "UI/Photo",
  component: Photo,
  parameters: {
    layout: "padded",
    nextjs: { image: { unoptimized: true } },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Photo>;

// Hover to paint the colour back across it, left to right.
export const Portrait: Story = {
  args: {
    src: "/images/davide-about-profile.webp",
    alt: "Davide at a lectern giving a talk",
    sizes: "340px",
    position: "object-[50%_20%]",
  },
  render: (args) => (
    <div className="relative w-[340px] aspect-[4/5]">
      <Photo {...args} />
    </div>
  ),
};

export const Audience: Story = {
  args: {
    src: "/images/osday-audience.webp",
    alt: "The Open Source Day audience in Florence",
    sizes: "620px",
  },
  render: (args) => (
    <div className="relative w-[620px] max-w-full h-[360px]">
      <Photo {...args} />
    </div>
  ),
};
