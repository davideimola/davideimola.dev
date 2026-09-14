import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ShelfType, ShelfVolume } from "../../lib/shelf";
import { ShelfWall } from "./ShelfWall";

const manga: ShelfType = { slug: "manga", label: "Manga", verb: "read", verbBase: "read" };
const videogame: ShelfType = {
  slug: "videogame",
  label: "Videogame",
  verb: "played",
  verbBase: "play",
};

const volumes: ShelfVolume[] = [
  { id: "v1", title: "Berserk, Vol. 14", standsAt: null, type: manga, cover: null, series: null },
];

const slamDunk = { name: "Slam Dunk", tint: "oklch(0.47 0.08 55)" };

describe("ShelfWall", () => {
  it("gives no chip to a Type counting no volumes", () => {
    render(
      <ShelfWall
        total={248}
        byType={[
          { type: manga, count: 248 },
          { type: videogame, count: 0 },
        ]}
        volumes={volumes}
      />
    );

    expect(screen.getByRole("button", { name: /Manga/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Videogame/ })).toBeNull();
  });

  it("names what the wall is", () => {
    render(<ShelfWall total={0} byType={[]} volumes={[]} />);
    expect(screen.getByText(/books on my shelf/i)).toBeInTheDocument();
  });

  it("names the Type under every tile, and stops once a filter says it", () => {
    render(<ShelfWall total={248} byType={[{ type: manga, count: 248 }]} volumes={volumes} />);

    expect(screen.getAllByText("Manga").length).toBe(1);

    fireEvent.click(screen.getByRole("button", { name: /Manga/ }));
    // The chip above the wall now says it for every tile, so the per-tile line
    // would only repeat itself.
    expect(screen.queryByText("Manga")).toBeNull();
  });

  it("says so when a volume has no Type at all", () => {
    render(
      <ShelfWall
        total={1}
        byType={[]}
        volumes={[
          {
            id: "v9",
            title: "Unlabelled box",
            standsAt: null,
            type: null,
            cover: null,
            series: null,
          },
        ]}
      />
    );
    expect(screen.getByText("Uncatalogued")).toBeInTheDocument();
  });

  it("tells two volumes of one run apart by the titles the library sent", () => {
    // The library numbers its own titles, so the wall never composes a name:
    // it prints what it was sent, and `standsAt` stays data beside it.
    render(
      <ShelfWall
        total={2}
        byType={[{ type: manga, count: 2 }]}
        volumes={[
          {
            id: "sd7",
            title: "Slam Dunk 7",
            standsAt: { from: 7, to: 7, unit: "instalments" },
            type: manga,
            cover: null,
            series: slamDunk,
          },
          {
            id: "sd-omnibus",
            title: "Slam Dunk 1-3",
            standsAt: { from: 1, to: 3, unit: "instalments" },
            type: manga,
            cover: null,
            series: slamDunk,
          },
        ]}
      />
    );

    expect(screen.getByText("Slam Dunk 7")).toBeInTheDocument();
    expect(screen.getByText("Slam Dunk 1-3")).toBeInTheDocument();
  });

  it("names a cover-less tile by its title, never by the Series ten of them share", () => {
    render(
      <ShelfWall
        total={1}
        byType={[{ type: manga, count: 1 }]}
        volumes={[
          {
            id: "b14",
            title: "Berserk, Vol. 14",
            standsAt: null,
            type: manga,
            cover: null,
            series: { name: "Berserk", tint: "oklch(0.42 0.09 25)" },
          },
        ]}
      />
    );
    expect(screen.getByText("Berserk, Vol. 14")).toBeInTheDocument();
    expect(screen.queryByText("Berserk")).not.toBeInTheDocument();
  });
});
