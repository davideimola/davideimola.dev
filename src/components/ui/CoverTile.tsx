import type { ShelfCover, ShelfSeries } from "../../lib/shelf";

interface CoverTileProps {
  title: string;
  cover: ShelfCover;
  series: ShelfSeries;
  className?: string;
}

// Covers are hotlinked straight from tsundoku's 128px lookups: a plain lazy
// <img>, never next/image, because this site does not pay to optimise images it
// does not own. An entry without a cover draws its Series tint instead, which is
// what tsundoku itself does, so the wall never has a hole in it.
//
// When the cover carries an `at`, the tile links to it. That is not a nicety:
// tsundoku's ADR-0013 records that the lookup provider asks for a prominent
// link back to the page the image came from, so a borrowed cover always points
// home. The owner's own scans carry no `at` and stay inert.
export function CoverTile({ title, cover, series, className = "" }: CoverTileProps) {
  // The tile names the volume twice: once for the reader who hovers or uses a
  // screen reader, and once inside the tint when there is no cover to look at.
  // Both say the title exactly as the library sent it, never the Series, which
  // is the name ten objects share: a tint reading "Slam Dunk" ten times over is
  // the wall saying nothing, where the title already spells its own number out
  // and tells volume 6 from volume 20. Nothing here composes a name: a number
  // is data in `standsAt`, never something this site glues onto a string.
  const classes = [
    "relative aspect-[2/3] w-full overflow-hidden rounded-[2px]",
    "border border-border bg-bg-card",
    className,
  ].join(" ");

  if (cover) {
    const image = (
      // biome-ignore lint/performance/noImgElement: hotlinked third-party cover, deliberately unoptimised
      <img
        src={cover.url}
        alt={title}
        title={title}
        loading="lazy"
        decoding="async"
        width={128}
        height={192}
        className="h-full w-full object-cover grayscale-[0.4] transition-[filter] duration-500 hover:grayscale-0"
      />
    );

    if (cover.at) {
      return (
        <a
          href={cover.at}
          target="_blank"
          rel="noopener noreferrer"
          title={`${title} on the source that provided this cover`}
          className={`${classes} block transition-[border-color] duration-200 hover:border-border-hover`}
        >
          {image}
        </a>
      );
    }

    return <div className={classes}>{image}</div>;
  }

  return (
    <div className={classes} title={title}>
      {/* The tint is data from the API, a ready-to-use colour string, so it
          cannot be a Tailwind class. */}
      <div className="absolute inset-0" style={{ backgroundColor: series?.tint ?? "#141311" }} />
      <div className="absolute inset-0 bg-[rgba(8,8,7,0.5)]" />
      <div className="relative z-10 flex h-full w-full items-center justify-center p-2">
        <span className="font-mono text-[9px] leading-tight text-text-1 text-center line-clamp-4">
          {title}
        </span>
      </div>
    </div>
  );
}
