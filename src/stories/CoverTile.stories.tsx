import type { Meta, StoryObj } from "@storybook/react";
import { CoverTile } from "../components/ui/CoverTile";

const meta: Meta<typeof CoverTile> = {
  title: "UI/CoverTile",
  component: CoverTile,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#080807" }],
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "128px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CoverTile>;

export const WithCover: Story = {
  args: {
    title: "Berserk, Vol. 14",
    cover: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/128px-No-Image-Placeholder.svg.png",
      source: "owner",
      at: null,
    },
    series: { name: "Berserk", tint: "oklch(0.42 0.09 25)" },
  },
};

export const LinkedToSource: Story = {
  name: "Looked-up cover, links back to the source",
  args: {
    title: "Vinland Saga, Vol. 9",
    cover: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/128px-No-Image-Placeholder.svg.png",
      source: "looked-up",
      at: "https://books.example.org/volume/vinland-9",
    },
    series: { name: "Vinland Saga", tint: "oklch(0.44 0.06 245)" },
  },
};

export const SeriesTint: Story = {
  name: "No cover, Series tint",
  args: {
    title: "Dune Messiah",
    cover: null,
    series: { name: "Dune", tint: "oklch(0.52 0.10 70)" },
  },
};

export const NoCoverNoSeries: Story = {
  args: {
    title: "An Unknown Volume With A Rather Long Title",
    cover: null,
    series: null,
  },
};

// Ten volumes of one run arrive with the same series name and, often, the same
// tile. The title is what tells them apart, and the library already numbers it:
// the tile prints that string and never composes one of its own.
export const NumberedVolume: Story = {
  name: "No cover, numbered volume",
  args: {
    title: "Slam Dunk 7",
    cover: null,
    series: { name: "Slam Dunk", tint: "oklch(0.47 0.08 55)" },
  },
};

export const Omnibus: Story = {
  name: "No cover, omnibus of a range",
  args: {
    title: "Slam Dunk 1-3",
    cover: null,
    series: { name: "Slam Dunk", tint: "oklch(0.47 0.08 55)" },
  },
};
