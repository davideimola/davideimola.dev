import Link from "next/link";
import { getShowcase, groupPassesByVerb } from "../../lib/shelf";
import { ScrollReveal } from "../ui/ScrollReveal";
import { SectionHeader } from "../ui/SectionHeader";

/**
 * The open passes out of the personal library, as a supporting block on /now.
 * It reads the same seam /shelf reads, so the two can never disagree, and it is
 * deliberately not a second /shelf: no covers, no verdicts, no pile.
 *
 * Two things it must survive. The library going quiet: getShowcase degrades to
 * the committed snapshot and, with nothing open in it either, this renders
 * nothing at all rather than an empty shell. And a half that does not exist:
 * grouping is by the Type's bare verb, and a verb with no pass gets no block, so
 * a month with five books and no game reads as deliberate instead of broken.
 */
export async function ShelfNow() {
  const { document: showcase } = await getShowcase();
  const groups = groupPassesByVerb(showcase.now);

  if (groups.length === 0) return null;

  return (
    <section className="mb-14 border-t border-border pt-10">
      <ScrollReveal>
        <SectionHeader title="On the shelf" className="mb-3" />
      </ScrollReveal>

      <ScrollReveal>
        <p className="font-sans text-[14px] text-text-3 mb-6 max-w-2xl">
          Not written by hand: this is whatever my library says I have open today.
        </p>
      </ScrollReveal>

      <div className="flex flex-col gap-6">
        {groups.map((group, i) => (
          <ScrollReveal key={group.verbBase} delay={i * 60}>
            <div>
              <p className="font-mono text-[10px] text-text-3 tracking-widest uppercase mb-3">
                {group.label}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2">
                {group.passes.map((pass) => (
                  <li key={pass.id} className="font-sans text-[13px] text-text-2">
                    <span className="font-mono text-[13px] text-text-1">{pass.title}</span>
                    {/* The Medium arrives as a label tsundoku chose: printing the
                        slug back would give us "Playstation 5". */}
                    <span className="text-text-3">
                      {" "}
                      · {pass.type.label} · {pass.medium.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal>
        <p className="font-mono text-[11px] text-text-3 mt-6">
          <Link href="/shelf" className="text-text-2 hover:text-accent transition-colors">
            /shelf
          </Link>{" "}
          for what I finished, what I put down, and what I take on next
        </p>
      </ScrollReveal>
    </section>
  );
}
