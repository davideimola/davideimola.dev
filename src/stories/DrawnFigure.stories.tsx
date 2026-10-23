import { prepareDrawSvg } from "@davideimola/brand/draw";
import type { Meta, StoryObj } from "@storybook/react";
import { DrawnFigure } from "../components/ui/DrawnFigure";

// A chart in the shape of the slides' "Same bug, two clocks" (presentations,
// securing-go): two timelines on one scale, drawn one step after the other,
// prepared the way the post page prepares a figure.
const SAMPLE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 420" width="1600" height="420">
  <g fill="none" stroke="#1C2233" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" font-size="36">
    <g data-step="0">
      <text x="40" y="70" fill="#1C2233" stroke="none">green tests</text>
      <path d="M40 130 H1560"/>
      <path d="M40 110 V150 M157 118 V142 M274 118 V142 M391 118 V142 M508 118 V142 M625 118 V142 M742 118 V142 M859 118 V142 M976 118 V142 M1093 118 V142 M1210 118 V142 M1327 118 V142 M1444 118 V142 M1560 110 V150"/>
      <text x="1560" y="210" fill="#1C2233" stroke="none" text-anchor="end">13 months</text>
    </g>
    <g data-step="1">
      <text x="40" y="300" fill="#1C2233" stroke="none">the fuzzer</text>
      <circle cx="48" cy="360" r="12" fill="#C91F37" stroke="none"/>
      <text x="90" y="372" fill="#1C2233" stroke="none">&lt; 0.1s</text>
    </g>
  </g>
</svg>`;

const prepare = (svg: string) => prepareDrawSvg(svg, ["#C91F37", "#E0475C"], "#F7F5F0");

const meta: Meta<typeof DrawnFigure> = {
  title: "UI/DrawnFigure",
  component: DrawnFigure,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DrawnFigure>;

const alt =
  "Two timelines on the same scale: thirteen months of green tests, one tick per month; under a tenth of a second for the fuzzer, a red dot at the start";

export const InSteps: Story = {
  args: { light: prepare(SAMPLE), dark: null, alt, caption: "Same bug, two clocks." },
  render: (args) => (
    <div className="max-w-[700px]">
      <DrawnFigure {...args} />
    </div>
  ),
};

export const AllAtOnce: Story = {
  args: {
    light: prepare(SAMPLE.replace(/ data-step="\d"/g, "")),
    dark: null,
    alt,
  },
  render: InSteps.render,
};
