import type { Meta, StoryObj } from "@storybook/react";
import { DrawnCover } from "../components/ui/DrawnCover";
import { prepareCoverSvg } from "../lib/cover-draw";

// A small monoline cover in the shape of the real ones (public/images/blog),
// prepared the way the post page prepares them.
const SAMPLE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
  <rect width="1600" height="900" fill="#F7F5F0"/>
  <g fill="none" stroke="#1C2233" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <path d="M500 640 H1100"/>
    <rect x="620" y="300" width="360" height="300" fill="#F7F5F0"/>
    <path d="M680 380 H920 M680 450 H860 M680 520 H900"/>
    <circle cx="1060" cy="260" r="70"/>
  </g>
  <circle cx="1060" cy="260" r="26" fill="#C91F37"/>
</svg>`;

const light = prepareCoverSvg(SAMPLE, ["#C91F37"], "#F7F5F0");

const meta: Meta<typeof DrawnCover> = {
  title: "UI/DrawnCover",
  component: DrawnCover,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DrawnCover>;

export const Default: Story = {
  args: { light, dark: null, alt: "A line drawing of a document with a red dot" },
  render: (args) => (
    <div className="max-w-[700px]">
      <DrawnCover {...args} />
    </div>
  ),
};
