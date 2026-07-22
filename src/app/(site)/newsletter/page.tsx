import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../../../components/ui/PageHero";
import { SubscribeForm } from "../../../components/ui/SubscribeForm";
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
    <div className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-24 pb-20">
      <PageHero
        command="ls ./newsletter"
        title="Newsletter"
        description="A short monthly digest of what I published: new posts, upcoming talks, and the occasional project. One email a month, no spam, unsubscribe anytime."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
        {/* Archive */}
        <section>
          <h2 className="font-mono text-[11px] text-text-3 tracking-widest uppercase mb-6">
            Past issues
          </h2>
          {issues.length === 0 ? (
            <p className="font-sans text-[14px] text-text-3">
              No issues yet. Subscribe and the first one will land in your inbox.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {issues.map((issue) => (
                <li key={issue.slug}>
                  <Link
                    href={`/newsletter/${issue.slug}`}
                    className="group block border border-border rounded-sm px-5 py-4 hover:border-border-hover transition-colors duration-150"
                  >
                    <span className="font-mono text-[11px] text-text-3">
                      #{issue.issue} · {formatDate(issue.date)}
                    </span>
                    <h3 className="font-mono text-[15px] text-text-1 group-hover:text-accent transition-colors duration-150 mt-1 mb-1.5">
                      {issue.subject}
                    </h3>
                    <p className="font-sans text-[13px] text-text-3 leading-relaxed">
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
          <h2 className="font-mono text-[11px] text-text-3 tracking-widest uppercase mb-4">
            Subscribe
          </h2>
          <SubscribeForm mode="full" />
        </aside>
      </div>
    </div>
  );
}
