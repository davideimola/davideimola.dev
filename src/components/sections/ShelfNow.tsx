import Link from "next/link";
import { getShowcase, groupPassesByVerb } from "../../lib/shelf";
import { CoverTile } from "../ui/CoverTile";

/**
 * The open passes out of the personal library, as the reading strip on /now.
 * It reads the same seam /shelf reads, so the two can never disagree, and it is
 * deliberately not a second /shelf: covers and titles only, no verdicts, no pile.
 *
 * Grouped by the Type's bare verb, never the slug; a verb with nothing open gets
 * no strip, and with nothing open anywhere this renders nothing at all.
 */
export async function ShelfNow({ limit = 4 }: { limit?: number }) {
  const { document: showcase } = await getShowcase();
  const groups = groupPassesByVerb(showcase.now);

  if (groups.length === 0) return null;

  return (
    <div className="flex flex-col gap-3.5">
      {groups.map((group) => (
        <div key={group.verbBase} className="flex flex-col gap-3.5">
          <span className="font-mono text-[12px] text-fg-subtle">{group.label}</span>
          <ul className="m-0 p-0 list-none grid grid-cols-3 sm:grid-cols-4 gap-3.5 max-w-[440px]">
            {group.passes.slice(0, limit).map((pass) => (
              <li key={pass.id} className="flex flex-col gap-1.5">
                <CoverTile title={pass.title} cover={pass.cover} series={pass.series} />
                <span className="font-sans text-[13px] font-semibold leading-[1.3] text-fg">
                  {pass.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <Link
        href="/shelf"
        className="self-start font-mono text-[14px] text-fg border-b border-fg no-underline hover:text-accent hover:border-accent"
      >
        The whole shelf
      </Link>
    </div>
  );
}
