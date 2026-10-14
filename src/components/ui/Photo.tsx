import Image from "next/image";

// A photograph of people (docs/brand.md, "Photography"): black and white at
// rest. On hover its colour is painted back across it left to right, in the
// marker's gesture and timing, and wiped away right to left when the pointer
// leaves. The colour is a second copy of the same file (one download) under a
// clip with a slanted leading edge, like a brush stroke; the timing lives in
// globals.css (`.photo-colour`). Touch screens, print and reduced motion keep
// it plain: hover only exists on a pointer that can hover, print hides the
// colour copy, and reduced motion turns the sweep into a cut.
//
// It fills its parent, which must be `relative` and sized, like next/image's
// `fill`.

interface PhotoProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** Object position, e.g. "object-[50%_20%]" or "object-top". */
  position?: string;
}

export function Photo({ src, alt, sizes, priority = false, position = "" }: PhotoProps) {
  const fit = `object-cover ${position}`;
  return (
    <span className="group/photo absolute inset-0 block">
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`${fit} grayscale contrast-[1.05]`}
      />
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        fill
        sizes={sizes}
        priority={priority}
        className={`photo-colour ${fit} print:hidden`}
      />
    </span>
  );
}
