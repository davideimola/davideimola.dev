import type { Metadata } from "next";
import { InteractiveTerminal } from "../../../components/sections";
import { PageHero } from "../../../components/ui/PageHero";
import {
  getAllPosts,
  getAllProjects,
  getAllTalks,
  getFeedbackOpenTalks,
} from "../../../lib/content";
import { getShowcase } from "../../../lib/shelf";
import { feedbackHost } from "../../../lib/talk-feedback";
import type { TerminalData } from "../../../lib/terminal";

export const metadata: Metadata = {
  title: "Terminal",
  description:
    "An interactive shell for davideimola.dev. Type 'help' to get started. A few commands are undocumented.",
  openGraph: {
    title: "Terminal · Davide Imola",
    description:
      "An interactive shell for davideimola.dev. Type 'help' to get started. A few commands are undocumented.",
    url: "https://davideimola.dev/terminal",
    images: [
      { url: "https://davideimola.dev/og?title=Terminal&category=shell", width: 1200, height: 630 },
    ],
  },
};

// Revalidate hourly: the talks only need a daily split, but the library moves
// faster than that and the shell reads it through the same seam /shelf does.
export const revalidate = 3600;

async function buildTerminalData(): Promise<TerminalData> {
  const posts = getAllPosts().map(({ slug, title, date, category }) => ({
    slug,
    title,
    date,
    category,
  }));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const allTalks = getAllTalks()
    .filter((t) => !!t.session)
    .map((t) => ({
      event: t.event,
      title: t.session?.title ?? t.event,
      date: t.date,
      location: t.location,
      upcoming: new Date(t.date) >= today,
    }));
  // Upcoming first (soonest on top), then the most recent past talks.
  const upcoming = allTalks.filter((t) => t.upcoming).reverse();
  const past = allTalks.filter((t) => !t.upcoming).slice(0, 6);
  const talks = [...upcoming, ...past];

  const projects = getAllProjects().map((p) => ({
    title: p.title,
    description: p.description,
    status: p.status,
    href: p.caseStudy ?? p.url ?? p.github ?? "/projects",
  }));

  // One seam over the library, the same one /shelf and /now read. The document
  // always arrives (getShowcase degrades to the committed snapshot), so the
  // shell only drops the shelf commands if there is nothing behind them at all.
  const { document: showcase } = await getShowcase();
  const hasLibrary = showcase.now.length > 0 || showcase.shelf.total > 0;
  const shelf = hasLibrary
    ? {
        now: showcase.now.map((pass) => ({
          title: pass.title,
          type: pass.type.label,
          medium: pass.medium.label,
          verbBase: pass.type.verbBase,
        })),
        pile: showcase.pile.count,
        volumes: showcase.shelf.total,
      }
    : undefined;

  // `rate` only exists while a talk's rating window is open. Hourly ISR is
  // what makes it appear on the conference morning without a deploy.
  const open = getFeedbackOpenTalks();
  const ratings =
    open.length > 0
      ? open.map((talk) => ({
          event: talk.event,
          title: talk.session?.title ?? talk.event,
          url: talk.feedback?.url ?? "",
          host: feedbackHost(talk.feedback?.url ?? ""),
        }))
      : undefined;

  return { posts, talks, projects, shelf, ratings };
}

export default async function TerminalPage() {
  const data = await buildTerminalData();

  return (
    <div className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-24 pb-20">
      <PageHero
        command="ssh guest@davideimola.dev"
        title="Terminal"
        description="Every page on this site pretends to be a terminal. This one actually answers. Type 'help' to get started. A few commands are undocumented."
        className="mb-10"
      />
      <InteractiveTerminal data={data} />
    </div>
  );
}
