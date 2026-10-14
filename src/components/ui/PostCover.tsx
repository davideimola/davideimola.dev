import Image from "next/image";

interface PostCoverProps {
  src: string;
  alt: string;
  /** Responsive sizes hint for raster covers. */
  sizes?: string;
  priority?: boolean;
  className?: string;
}

// A post's cover (16:9), shown as it is: covers are monoline ink illustrations on
// paper (CLAUDE.md, "Blog covers"), so no filter and no hover reveal. SVG
// covers skip the image optimiser, which does not rasterise vectors.
export function PostCover({
  src,
  alt,
  sizes = "(min-width: 1024px) 700px, 100vw",
  priority = false,
  className = "",
}: PostCoverProps) {
  const isSvg = src.split("?")[0].toLowerCase().endsWith(".svg");
  return (
    <div
      className={`relative w-full aspect-video overflow-hidden border border-border bg-[var(--di-color-paper)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={isSvg}
        className="object-cover"
      />
    </div>
  );
}
