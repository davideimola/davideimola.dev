import { Badge } from "./Badge";
import { ScrollReveal } from "./ScrollReveal";

export interface ExperienceRole {
  role: string;
  period: string;
  description: string;
  current: boolean;
}

export interface ExperienceEntry {
  company: string;
  period: string;
  current: boolean;
  roles: ExperienceRole[];
}

interface ExperienceTimelineProps {
  entries: ExperienceEntry[];
}

export function ExperienceTimeline({ entries }: ExperienceTimelineProps) {
  return (
    <div className="flex flex-col">
      {entries.map((entry, i) => (
        <ScrollReveal key={entry.company} delay={i * 60}>
          <div className="flex gap-4 sm:gap-6 pb-8 relative">
            {/* Timeline dot + line */}
            <div className="flex flex-col items-center">
              <div
                className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${entry.current ? "bg-accent" : "bg-border-mid"}`}
              />
              {i < entries.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 pb-2 min-w-0 w-full">
              {/* Company header */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                <span className="font-mono text-[13px] text-text-3">
                  <span className="text-accent">~/</span>
                  {entry.company}
                </span>
                <span className="font-mono text-[11px] text-text-3">{entry.period}</span>
                {entry.current && <Badge variant="coming-soon">now</Badge>}
              </div>

              {/* Roles — directory tree style */}
              <ul className="mt-2 flex flex-col gap-4 border-l border-border ml-1 pl-4">
                {entry.roles.map((r, ri) => (
                  <li key={r.role} className="flex flex-col gap-0.5 relative">
                    {/* Tree connector */}
                    <span className="absolute -left-4 top-[7px] font-mono text-[10px] text-border-mid select-none">
                      {ri === entry.roles.length - 1 ? "└" : "├"}
                    </span>
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="font-mono text-[13px] font-medium text-text-1">
                        {r.role}
                      </span>
                      {r.current && (
                        <span className="font-mono text-[10px] text-accent">← current</span>
                      )}
                      <span className="font-mono text-[11px] text-text-3">{r.period}</span>
                    </div>
                    <p className="font-sans text-[13px] text-text-2 leading-relaxed">
                      {r.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
