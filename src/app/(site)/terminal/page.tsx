import type { Metadata } from "next";
import { InteractiveTerminal } from "../../../components/sections";
import { PageHero } from "../../../components/ui/PageHero";
import { getAllPosts, getAllProjects, getAllTalks } from "../../../lib/content";
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

// Revalidate daily so the upcoming/past split of talks stays fresh.
export const revalidate = 86400;

function buildTerminalData(): TerminalData {
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

  return { posts, talks, projects };
}

export default function TerminalPage() {
  const data = buildTerminalData();

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
