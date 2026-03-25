import { getRecentTalks } from "../../lib/content";
import { ScrollReveal, SectionHeader } from "../ui";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function TalksSection() {
  const talks = getRecentTalks(3);

  return (
    <section className="border-t border-border py-20">
      <div className="max-w-[860px] mx-auto px-4 sm:px-8">
        <ScrollReveal>
          <SectionHeader title="Recent talks" seeAllHref="/speaking" seeAllLabel="All talks →" />
        </ScrollReveal>

        <ul className="mt-8 flex flex-col divide-y divide-border">
          {talks.map((talk, i) => (
            <ScrollReveal key={talk.slug} delay={i * 80}>
              <li>
                <a
                  href={`/speaking#${talk.slug}`}
                  className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 py-4 no-underline transition-colors duration-150"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 min-w-0">
                    <span className="font-mono text-[11px] text-text-3 shrink-0">
                      {formatDate(talk.date)}
                    </span>
                    <span className="font-mono text-[11px] text-text-3 shrink-0 hidden sm:inline">
                      ·
                    </span>
                    <span className="font-mono text-[11px] text-accent shrink-0">{talk.event}</span>
                    <span className="font-sans text-[14px] text-text-1 truncate group-hover:text-text-1 transition-colors duration-150">
                      {talk.title}
                    </span>
                  </div>
                  <span className="font-mono text-[13px] text-text-3 group-hover:text-accent group-hover:translate-x-1 transition-[color,transform] duration-150 shrink-0">
                    →
                  </span>
                </a>
              </li>
            </ScrollReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
