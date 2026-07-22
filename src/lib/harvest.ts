import type { BlogPost, Project, Talk } from "./content";

// Pure engine behind the monthly digest. Given a window and the content, it returns the
// structured raw material for an issue: posts published in the window, forward-looking
// talks, optional highlighted projects, and whether the month is empty enough to skip.
// No I/O: content is passed in, so windowing/selection is deterministic and fixture-testable
// (the drafting skill wires the real content loaders to it).

export interface HarvestInput {
  /** ISO date, inclusive lower bound of the reported window. */
  from: string;
  /** ISO date, inclusive upper bound (the send date / end of month). */
  to: string;
  posts: BlogPost[];
  talks: Talk[];
  projects?: Project[];
}

export interface HarvestResult {
  /** Posts published within [from, to], newest first. */
  posts: BlogPost[];
  /** Talks scheduled after the window end, soonest first ("where to catch me next"). */
  upcomingTalks: Talk[];
  /**
   * Featured active projects, passed through as an optional highlight. Projects carry no
   * publish date (only a free-text `period`), so they are NOT date-windowed.
   */
  projects: Project[];
  /** True when there are no posts AND no upcoming talks - nothing worth sending. */
  skippable: boolean;
}

const time = (iso: string): number => new Date(iso).getTime();

export function harvestWindow({
  from,
  to,
  posts,
  talks,
  projects = [],
}: HarvestInput): HarvestResult {
  const fromT = time(from);
  const toT = time(to);

  const windowPosts = posts
    .filter((p) => {
      const t = time(p.date);
      return t >= fromT && t <= toT;
    })
    .sort((a, b) => time(b.date) - time(a.date));

  const upcomingTalks = talks
    .filter((t) => time(t.date) > toT)
    .sort((a, b) => time(a.date) - time(b.date));

  const highlightedProjects = projects.filter((p) => p.featured && p.status === "active");

  return {
    posts: windowPosts,
    upcomingTalks,
    projects: highlightedProjects,
    skippable: windowPosts.length === 0 && upcomingTalks.length === 0,
  };
}
