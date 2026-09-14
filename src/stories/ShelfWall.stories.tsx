import type { Meta, StoryObj } from "@storybook/react";
import { ShelfWall } from "../components/sections/ShelfWall";
import type { ShelfVolume } from "../lib/shelf";
import { shelfFixture } from "../test/shelf-fixture";

// The wall is shown against the invented fixture, never against the committed
// snapshot: src/content/shelf.fallback.json is the owner's real library and
// belongs to the page alone. The fixture already carries what the wall has to
// prove it handles (a cover-less tile, an uncatalogued volume, a Type counting
// zero).
const { total, byType, volumes: fixtureVolumes } = shelfFixture.shelf;

// The fixture's cover URLs point at a host that does not exist, which is right
// for a test and useless in a browser, so the stories swap in one image that
// loads. Everything else about a volume is the fixture's.
const PLACEHOLDER =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/128px-No-Image-Placeholder.svg.png";

const volumes: ShelfVolume[] = fixtureVolumes.map((volume) => ({
  ...volume,
  cover: volume.cover ? { ...volume.cover, url: PLACEHOLDER } : null,
}));

const meta: Meta<typeof ShelfWall> = {
  title: "Sections/ShelfWall",
  component: ShelfWall,
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
type Story = StoryObj<typeof ShelfWall>;

export const Default: Story = {
  args: {
    total,
    // tsundoku sends every Type it knows, so a Type with nothing on the shelf
    // arrives as a zero. It must not get a chip: the filter would land on an
    // empty wall.
    byType,
    volumes,
  },
};

export const SingleType: Story = {
  args: {
    total: byType.find((entry) => entry.type.slug === "manga")?.count ?? 0,
    byType: byType.filter((entry) => entry.type.slug === "manga"),
    volumes: volumes.filter((volume) => volume.type?.slug === "manga"),
  },
};

export const Empty: Story = {
  args: {
    total: 0,
    byType: [],
    volumes: [],
  },
};
