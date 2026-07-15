import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "../../../components/ui/PageHero";
import { ScrollReveal } from "../../../components/ui/ScrollReveal";
import { SectionHeader } from "../../../components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Brand",
  description:
    "Logo, wordmark, and brand assets for Davide Imola, free to use as-is in conference programs, event pages, and articles.",
  openGraph: {
    title: "Brand · Davide Imola",
    description:
      "Logo, wordmark, and brand assets for Davide Imola, free to use as-is in conference programs, event pages, and articles.",
    url: "https://davideimola.dev/brand",
    images: [
      { url: "https://davideimola.dev/og?title=Brand&category=assets", width: 1200, height: 630 },
    ],
  },
};

interface Download {
  label: string;
  href: string;
}

function DownloadRow({ downloads }: { downloads: Download[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {downloads.map((d) => (
        <a
          key={d.href}
          href={d.href}
          download
          className="font-mono text-[11px] text-text-3 hover:text-accent transition-colors duration-150"
        >
          ↓ {d.label}
        </a>
      ))}
    </div>
  );
}

export default function BrandPage() {
  return (
    <div className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-24 pb-20">
      <PageHero
        command="cat ./brand.md"
        title="Brand"
        description="The mark is the end state of this site's hero: the name has just been typed, the red cursor is still there. Use these assets as-is to refer to me in conference programs, event pages, articles."
      />

      {/* Mark */}
      <section className="mb-16">
        <ScrollReveal>
          <SectionHeader title="Mark" />
          <p className="font-sans text-[14px] text-text-2 -mt-6 mb-8">
            The primary mark: <span className="font-mono text-text-1">di</span> plus the cursor. For
            avatars, favicons, and stickers. Minimum size 16&nbsp;px.
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ScrollReveal>
            <div className="flex flex-col gap-3">
              <div className="border border-border-mid rounded-sm overflow-hidden w-[160px]">
                <Image
                  src="/brand/mark.svg"
                  alt="Davide Imola mark, dark"
                  width={160}
                  height={160}
                  unoptimized
                />
              </div>
              <DownloadRow
                downloads={[
                  { label: "SVG", href: "/brand/mark.svg" },
                  { label: "PNG 512", href: "/brand/mark-512.png" },
                  { label: "PNG 1024", href: "/brand/mark-1024.png" },
                ]}
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={60}>
            <div className="flex flex-col gap-3">
              <div className="border border-border-mid rounded-sm overflow-hidden w-[160px]">
                <Image
                  src="/brand/mark-light.svg"
                  alt="Davide Imola mark, light"
                  width={160}
                  height={160}
                  unoptimized
                />
              </div>
              <DownloadRow
                downloads={[
                  { label: "SVG", href: "/brand/mark-light.svg" },
                  { label: "PNG 512", href: "/brand/mark-light-512.png" },
                  { label: "PNG 1024", href: "/brand/mark-light-1024.png" },
                ]}
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="flex flex-col gap-3">
              <div className="border border-border-mid rounded-sm w-[160px] h-[160px] flex items-center justify-center text-text-2">
                {/* mark-mono.svg inherits currentColor — shown here in text-2 */}
                <Image
                  src="/brand/mark-mono.svg"
                  alt="Davide Imola mark, single color"
                  width={120}
                  height={120}
                  unoptimized
                />
              </div>
              <DownloadRow
                downloads={[{ label: "SVG (currentColor)", href: "/brand/mark-mono.svg" }]}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Wordmark */}
      <section className="mb-16 border-t border-border pt-10">
        <ScrollReveal>
          <SectionHeader title="Wordmark" />
          <p className="font-sans text-[14px] text-text-2 -mt-6 mb-8">
            For horizontal contexts: slide headers, covers, signatures. Minimum width ~120&nbsp;px.
          </p>
        </ScrollReveal>
        <div className="flex flex-col gap-6">
          <ScrollReveal>
            <div className="flex flex-col gap-3">
              <div className="border border-border-mid rounded-sm bg-bg px-8 py-7">
                <Image
                  src="/brand/wordmark.svg"
                  alt="davide imola wordmark, light ink"
                  width={376}
                  height={48}
                  unoptimized
                  className="w-full max-w-[376px] h-auto"
                />
              </div>
              <DownloadRow
                downloads={[
                  { label: "SVG", href: "/brand/wordmark.svg" },
                  { label: "PNG 1200", href: "/brand/wordmark-1200.png" },
                ]}
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={60}>
            <div className="flex flex-col gap-3">
              <div className="border border-border-mid rounded-sm bg-[#F0EDE9] px-8 py-7">
                <Image
                  src="/brand/wordmark-dark.svg"
                  alt="davide imola wordmark, dark ink"
                  width={376}
                  height={48}
                  unoptimized
                  className="w-full max-w-[376px] h-auto"
                />
              </div>
              <DownloadRow
                downloads={[
                  { label: "SVG", href: "/brand/wordmark-dark.svg" },
                  { label: "PNG 1200", href: "/brand/wordmark-dark-1200.png" },
                ]}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Domain lockup */}
      <section className="mb-16 border-t border-border pt-10">
        <ScrollReveal>
          <SectionHeader title="Domain lockup" />
          <p className="font-sans text-[14px] text-text-2 -mt-6 mb-8">
            The URL as a mark, for contexts where the address itself is the signature.{" "}
            <span className="font-mono text-text-2">
              davideimola<span className="text-accent">.dev</span>
            </span>
            , only the <span className="font-mono text-accent">.dev</span> is red.
          </p>
        </ScrollReveal>
        <div className="flex flex-col gap-6">
          <ScrollReveal>
            <div className="flex flex-col gap-3">
              <div className="border border-border-mid rounded-sm bg-bg px-8 py-7">
                <Image
                  src="/brand/domain.svg"
                  alt="davideimola.dev domain lockup, light ink"
                  width={454}
                  height={48}
                  unoptimized
                  className="w-full max-w-[454px] h-auto"
                />
              </div>
              <DownloadRow
                downloads={[
                  { label: "SVG", href: "/brand/domain.svg" },
                  { label: "PNG 1200", href: "/brand/domain-1200.png" },
                ]}
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={60}>
            <div className="flex flex-col gap-3">
              <div className="border border-border-mid rounded-sm bg-[#F0EDE9] px-8 py-7">
                <Image
                  src="/brand/domain-dark.svg"
                  alt="davideimola.dev domain lockup, dark ink"
                  width={454}
                  height={48}
                  unoptimized
                  className="w-full max-w-[454px] h-auto"
                />
              </div>
              <DownloadRow
                downloads={[
                  { label: "SVG", href: "/brand/domain-dark.svg" },
                  { label: "PNG 1200", href: "/brand/domain-dark-1200.png" },
                ]}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Colors */}
      <section className="mb-16 border-t border-border pt-10">
        <ScrollReveal>
          <SectionHeader title="Colors" />
        </ScrollReveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: "Akane Red", hex: "#C91F37", note: "the cursor, always" },
            { name: "Background", hex: "#080807", note: "dark surfaces" },
            { name: "Ink on dark", hex: "#EAE5DF", note: "glyphs, dark surfaces" },
            { name: "Ink on light", hex: "#1A1816", note: "glyphs, light surfaces" },
          ].map((c, i) => (
            <ScrollReveal key={c.hex} delay={i * 40}>
              <div className="border border-border rounded-sm overflow-hidden">
                <div className="h-16" style={{ background: c.hex }} />
                <div className="px-3 py-2.5 flex flex-col gap-0.5">
                  <span className="font-mono text-[12px] text-text-1">{c.hex}</span>
                  <span className="font-mono text-[10px] text-text-3 tracking-[0.04em]">
                    {c.name} · {c.note}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Usage + license */}
      <section className="border-t border-border pt-10">
        <ScrollReveal>
          <SectionHeader title="Usage & license" />
          <ul className="flex flex-col gap-2 mb-8">
            {[
              "Use the assets as-is to refer to me: conference programs, event pages, talk announcements, articles.",
              "Don't recolor them: the cursor is always Akane Red.",
              "Don't restyle or remove the cursor, don't change the typeface, don't crop the lockups.",
              "In animated contexts the cursor may blink (1.1s step-end), respecting prefers-reduced-motion.",
            ].map((rule) => (
              <li key={rule} className="font-sans text-[14px] text-text-2 flex gap-2">
                <span className="text-accent font-mono text-[10px] leading-[1.7] shrink-0">
                  {"//"}
                </span>
                {rule}
              </li>
            ))}
          </ul>
          <p className="font-sans text-[14px] text-text-2">
            All brand assets are licensed under{" "}
            <a
              href="https://creativecommons.org/licenses/by-nd/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-1 underline decoration-border-mid hover:text-accent hover:decoration-accent transition-colors duration-150"
            >
              CC BY-ND 4.0
            </a>
            {"; see the "}
            <a
              href="/brand/LICENSE.md"
              className="text-text-1 underline decoration-border-mid hover:text-accent hover:decoration-accent transition-colors duration-150"
            >
              full license
            </a>
            . Need a different format or something not covered here?{" "}
            <a
              href="/contact"
              className="text-text-1 underline decoration-border-mid hover:text-accent hover:decoration-accent transition-colors duration-150"
            >
              Get in touch
            </a>
            .
          </p>
        </ScrollReveal>
      </section>
    </div>
  );
}
