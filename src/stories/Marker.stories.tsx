import type { Meta, StoryObj } from "@storybook/react";
import { Marker } from "../components/ui/Marker";

const meta: Meta<typeof Marker> = {
  title: "UI/Marker",
  component: Marker,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Marker>;

/** The home headline: one stroke, under the word that matters most. */
export const Display: Story = {
  render: () => (
    <h1 className="font-sans font-bold text-[44px] sm:text-display leading-[0.98] tracking-[-0.045em] text-fg max-w-[16ch]">
      I build AI agents for <Marker>security</Marker>, and the tools I need along the way.
    </h1>
  ),
};

/** In running text the stroke scales with the type: thickness is in em. */
export const InProse: Story = {
  render: () => (
    <p className="font-sans text-body text-fg-body max-w-[700px]">
      The short answer: <Marker>everything</Marker>. The letters cut through the stroke with a halo
      in the ground colour, so nothing red ever sits over a glyph.
    </p>
  ),
};

/** On a card the halo has to match the card's surface, not the page ground. */
export const OnSurface: Story = {
  render: () => (
    <div className="bg-surface border border-border p-8 max-w-[480px]">
      <p className="font-sans font-bold text-h3 text-fg">
        Sessions are a <Marker className="[--marker-halo-color:var(--di-surface)]">database</Marker>
        .
      </p>
    </div>
  ),
};
