import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type React from "react";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkGithubAlerts from "remark-github-alerts";
import { Breadcrumb } from "../../../../components/ui/Breadcrumb";
import { CodeBlock } from "../../../../components/ui/CodeBlock";
import { JsonLd } from "../../../../components/ui/JsonLd";
import { SubscribeForm } from "../../../../components/ui/SubscribeForm";
import { formatDate } from "../../../../lib/dates";
import { getAllIssues, getIssueBySlug } from "../../../../lib/newsletter";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllIssues().map((issue) => ({ slug: issue.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const issue = getIssueBySlug(slug);
  if (!issue) return {};

  const ogImageUrl = `https://davideimola.dev/og?title=${encodeURIComponent(issue.subject)}&category=newsletter`;

  return {
    title: issue.subject,
    description: issue.previewText,
    alternates: { canonical: `https://davideimola.dev/newsletter/${slug}` },
    openGraph: {
      title: issue.subject,
      description: issue.previewText,
      url: `https://davideimola.dev/newsletter/${slug}`,
      type: "article",
      publishedTime: issue.date,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: issue.subject }],
    },
    twitter: {
      card: "summary_large_image",
      title: issue.subject,
      description: issue.previewText,
      images: [ogImageUrl],
    },
  };
}

export default async function NewsletterIssuePage({ params }: Props) {
  const { slug } = await params;
  const issue = getIssueBySlug(slug);
  if (!issue) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: issue.subject,
    description: issue.previewText,
    datePublished: issue.date,
    url: `https://davideimola.dev/newsletter/${slug}`,
    author: { "@type": "Person", name: "Davide Imola", url: "https://davideimola.dev" },
  };

  return (
    <>
      <JsonLd data={schema} />
      <div className="max-w-[768px] mx-auto px-4 sm:px-8 pt-24 pb-20">
        <Breadcrumb
          command="cat"
          items={[{ label: "newsletter", href: "/newsletter" }, { label: `${slug}.mdx` }]}
          className="mb-10"
        />

        <article>
          <header className="mb-10">
            <p className="font-mono text-[12px] text-text-3 mb-3">
              Issue #{issue.issue} · {formatDate(issue.date)}
            </p>
            <h1 className="font-mono text-[26px] sm:text-[32px] font-bold text-text-1 tracking-[-0.03em] leading-tight">
              {issue.subject}
            </h1>
          </header>

          <div className="prose prose-lg max-w-none">
            <MDXRemote
              source={issue.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm, remarkGithubAlerts],
                  rehypePlugins: [rehypeSlug, [rehypePrism, { ignoreMissing: true }]],
                },
              }}
              components={{ pre: CodeBlock as React.ComponentType<object> }}
            />
          </div>
        </article>

        {/* Subscribe CTA */}
        <div className="mt-14 pt-10 border-t border-border">
          <p className="font-mono text-[11px] text-text-3 tracking-widest uppercase mb-4">
            Get the next issue
          </p>
          <div className="max-w-md">
            <SubscribeForm mode="compact" />
          </div>
        </div>
      </div>
    </>
  );
}
