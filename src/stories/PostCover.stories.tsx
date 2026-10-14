import type { Meta, StoryObj } from "@storybook/react";
import { PostCover } from "../components/ui/PostCover";

const meta: Meta<typeof PostCover> = {
  title: "UI/PostCover",
  component: PostCover,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PostCover>;

/** An SVG cover is served as is, without the optimiser. */
export const Svg: Story = {
  args: { src: "/brand/lockup.svg", alt: "An SVG cover" },
  render: (args) => (
    <div className="max-w-[700px]">
      <PostCover {...args} />
    </div>
  ),
};
