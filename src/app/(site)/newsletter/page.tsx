import type { Metadata } from "next";
import { Marker } from "../../../components/ui/Marker";
import { SubscribeForm } from "../../../components/ui/SubscribeForm";
import { Tape } from "../../../components/ui/Tape";
import { formatDayMonthYear } from "../../../lib/dates";
import { getAllIssues, issueTitle, nextIssueMonth } from "../../../lib/newsletter";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Once a month, what actually happened: what I found, tried, built and killed.",
  openGraph: {
    title: "Newsletter · Davide Imola",
    description: "Once a month, what actually happened: what I found, tried, built and killed.",
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

// Daily, so the "next issue" month turns over without a deploy.
export const revalidate = 86400;

const IN_EVERY_ISSUE = ["What I found", "What I tried", "What I built", "What I killed"];

const pad = (n: number) => String(n).padStart(2, "0");

export default function NewsletterPage() {
  const issues = getAllIssues();
  const nextNumber = (issues[0]?.issue ?? 0) + 1;

  return (
    <div className="max-w-[1136px] mx-auto px-4 sm:px-8 pt-10 md:pt-14">
      <header className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-10 lg:gap-20">
        <div className="flex flex-col gap-6">
          <Tape tilt={0}>Newsletter</Tape>
          <h1 className="m-0 font-sans font-bold text-fg text-[42px] sm:text-[56px] lg:text-[68px] leading-[1] tracking-[-0.045em]">
            Once a month, what <Marker>actually</Marker> happened.
          </h1>
          <p className="m-0 font-sans text-[18px] sm:text-[21px] leading-[1.55] text-fg-muted max-w-[660px]">
            A monthly statement of account on my work and on the things I am making, not a list of
            links I liked.
          </p>
          <SubscribeForm
            mode="full"
            className="mt-3 max-w-[620px]"
            note="One email a month. Unsubscribe from any issue."
          />
        </div>
        <aside className="flex flex-col gap-[18px] lg:pt-[46px]">
          <span className="font-mono text-[13px] text-fg-subtle">In every issue</span>
          <ol className="m-0 p-0 list-none flex flex-col">
            {IN_EVERY_ISSUE.map((item, i) => (
              <li
                key={item}
                className={`grid grid-cols-[40px_minmax(0,1fr)] py-3.5 border-t ${
                  i === 0 ? "border-rule" : "border-border"
                } ${i === IN_EVERY_ISSUE.length - 1 ? "border-b border-b-border" : ""}`}
              >
                <span className="font-mono text-[13px] text-fg-subtle pt-[3px]">{pad(i + 1)}</span>
                <span className="font-sans font-semibold text-[19px] text-fg">{item}</span>
              </li>
            ))}
          </ol>
        </aside>
      </header>

      <section className="mt-16 md:mt-20 flex flex-col">
        <div className="flex items-center justify-between pb-[18px]">
          <Tape as="h2" tilt={1}>
            Issues
          </Tape>
          <span className="font-mono text-[13px] text-fg-subtle">{issues.length} so far</span>
        </div>
        {issues.map((issue, i) => (
          <a
            key={issue.slug}
            href={`/newsletter/${issue.slug}`}
            className={`group grid grid-cols-[64px_minmax(0,1fr)] md:grid-cols-[120px_minmax(0,1fr)_160px] gap-x-5 md:gap-x-8 gap-y-2 items-start py-7 border-b border-border no-underline ${
              i === 0 ? "border-t border-t-rule" : ""
            }`}
          >
            <span className="font-sans font-bold text-[40px] md:text-[56px] leading-[0.9] tracking-[-0.05em] text-fg">
              {pad(issue.issue)}
            </span>
            <span className="flex flex-col gap-2.5">
              <span className="font-sans font-bold text-[22px] md:text-[28px] leading-[1.15] tracking-[-0.03em] text-fg group-hover:text-accent transition-colors duration-150">
                {issueTitle(issue.subject)}
              </span>
              <span className="font-sans text-[17px] md:text-[18px] leading-[1.55] text-fg-muted">
                {issue.previewText}
              </span>
            </span>
            <span className="col-start-2 md:col-start-3 font-mono text-[14px] text-fg-subtle md:text-right md:pt-1.5">
              {formatDayMonthYear(issue.date)}
              <br />
              {new Date(`${issue.slug}-01`).toLocaleDateString("en-GB", { month: "long" })} issue
            </span>
          </a>
        ))}
        <div
          className={`grid grid-cols-[64px_minmax(0,1fr)] md:grid-cols-[120px_minmax(0,1fr)_160px] gap-x-5 md:gap-x-8 items-start py-6 border-b border-border ${
            issues.length === 0 ? "border-t border-t-rule" : ""
          }`}
        >
          <span className="font-sans font-bold text-[40px] md:text-[56px] leading-[0.9] tracking-[-0.05em] text-border">
            {pad(nextNumber)}
          </span>
          <span className="font-sans text-[17px] md:text-[18px] leading-[1.55] text-fg-subtle pt-2">
            Next issue in your inbox at the start of {nextIssueMonth(new Date())}.
          </span>
        </div>
      </section>
    </div>
  );
}
