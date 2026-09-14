"use client";

import { useMemo, useState } from "react";
import type { ShelfType, ShelfTypeCount, ShelfVolume } from "../../lib/shelf";
import { CoverTile } from "../ui/CoverTile";

interface ShelfWallProps {
  total: number;
  byType: ShelfTypeCount[];
  volumes: ShelfVolume[];
}

// The tail of the page: a dense wall of everything on the shelf, filterable by
// Type. Three columns at 400px, up to eight on a desktop, so the wall reads as a
// wall on every screen.
export function ShelfWall({ total, byType, volumes }: ShelfWallProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  // tsundoku sends every Type it knows, counts included, so a Type with nothing
  // on the shelf arrives as a zero. It gets no chip: a filter that lands on an
  // empty wall is worse than no filter at all.
  const types: ShelfType[] = useMemo(
    () => byType.filter((entry) => entry.count > 0).map((entry) => entry.type),
    [byType]
  );

  const shown = useMemo(
    // A volume with no Type is a gap in the catalogue rather than a Type of its
    // own: it belongs to "All" and to no filter.
    () => (activeSlug ? volumes.filter((volume) => volume.type?.slug === activeSlug) : volumes),
    [activeSlug, volumes]
  );

  const activeCount = activeSlug
    ? (byType.find((entry) => entry.type.slug === activeSlug)?.count ?? shown.length)
    : total;

  return (
    <div>
      {/* The wall is the Collection: what is actually in the house. It names
          the thing and argues nothing. */}
      <p className="font-mono text-[11px] text-text-3 leading-relaxed mb-6">
        <span className="text-accent mr-2">{"//"}</span>
        Books on my shelf at home, one tile per volume.
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <FilterChip active={activeSlug === null} onClick={() => setActiveSlug(null)}>
          All · {total}
        </FilterChip>
        {types.map((type) => {
          const count = byType.find((entry) => entry.type.slug === type.slug)?.count ?? 0;
          return (
            <FilterChip
              key={type.slug}
              active={activeSlug === type.slug}
              onClick={() => setActiveSlug(type.slug)}
            >
              {type.label} · {count}
            </FilterChip>
          );
        })}
      </div>

      {/* The wall is the densest block on the site, so the Type is named under
          each tile in the smallest type the page has rather than in a Badge per
          cover: sixty pills would be the loudest thing here and the tiles would
          stop being a wall. It goes away under a filter, where the chip above
          already says what every tile is and the line would only repeat itself.
          A volume with no Type says so: an uncatalogued object is a gap in the
          library, not a secret. */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 gap-2">
        {shown.map((volume) => (
          <div key={volume.id} className="flex flex-col gap-1.5">
            <CoverTile title={volume.title} cover={volume.cover} series={volume.series} />
            {activeSlug === null && (
              <p className="font-mono text-[9px] leading-none text-text-3 truncate">
                {volume.type?.label ?? "Uncatalogued"}
              </p>
            )}
          </div>
        ))}
      </div>

      <p className="font-mono text-[11px] text-text-3 mt-4">
        Showing {shown.length} of {activeCount}. The wall is the most recent sample, the count is
        the whole shelf.
      </p>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "font-mono text-[11px] rounded-[2px] px-2 py-1 cursor-pointer",
        "border transition-[color,border-color] duration-150",
        active
          ? "text-accent border-border-hover bg-accent-glow"
          : "text-text-3 border-border hover:text-text-2 hover:border-border-mid",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
