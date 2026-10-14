import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../../../components/ui/PageHero";
import { SubscribeForm } from "../../../components/ui/SubscribeForm";
import { Tape } from "../../../components/ui/Tape";
import { formatDate } from "../../../lib/dates";
import { getAllIssues } from "../../../lib/newsletter";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "One email a month: new posts, upcoming talks, and the occasional project. No spam.",
  openGraph: {
    title: "Newsletter · Davide Imola",
    description:
      "One email a month: new posts, upcoming talks, and the occasional project. No spam.",
    url: "https://davideimola.dev/newsletter",
    images: [
      {
        url: "https://davideimola.dev/og?title=Newsletter&category=newsletter",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function NewsletterPage() {
  const issues = getAllIssues();

  return (
    <div className="max-w-[1136px] mx-auto px-4 sm:px-8 pt-12 md:pt-16 pb-20">
      <PageHero
        label="Newsletter"
        title="Newsletter"
        description="A short monthly digest of what I published: new posts, upcoming talks, and the occasional project. One email a month, no spam, unsubscribe anytime."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
        {/* Archive */}
        <section>
          <Tape as="h2" tilt={0} className="mb-6">
            Past issues
          </Tape>
          {issues.length === 0 ? (
            <p className="font-sans text-[14px] text-fg-subtle">
              No issues yet. Subscribe and the first one will land in your inbox.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {issues.map((issue) => (
                <li key={issue.slug}>
                  <Link
                    href={`/newsletter/${issue.slug}`}
                    className="group block border border-border px-5 py-4 hover:border-fg transition-colors duration-150"
                  >
                    <span className="font-mono text-[11px] text-fg-subtle">
                      #{issue.issue} · {formatDate(issue.date)}
                    </span>
                    <h3 className="font-sans text-[15px] text-fg group-hover:text-accent transition-colors duration-150 mt-1 mb-1.5 font-bold tracking-[-0.02em]">
                      {issue.subject}
                    </h3>
                    <p className="font-sans text-[13px] text-fg-subtle leading-relaxed">
                      {issue.previewText}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Subscribe */}
        <aside className="lg:sticky lg:top-[88px] self-start">
          <Tape as="h2" tilt={1} className="mb-6">
            Subscribe
          </Tape>
          <SubscribeForm mode="full" />
        </aside>
      </div>
    </div>
  );
}
