import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type React from "react";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkGithubAlerts from "remark-github-alerts";
import { newsletterMdxComponents } from "../../../../components/newsletter/mdx-components";
import { Breadcrumb } from "../../../../components/ui/Breadcrumb";
import { CodeBlock } from "../../../../components/ui/CodeBlock";
import { JsonLd } from "../../../../components/ui/JsonLd";
import { SubscribeForm } from "../../../../components/ui/SubscribeForm";
import { formatDate } from "../../../../lib/dates";
import { getAllIssues, getIssueBySlug } from "../../../../lib/newsletter";
import { rehypeCodeTitle } from "../../../../lib/rehype-code-title";

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

  const ogImageUrl = `https://davideimola.dev/og?title=${encodeURIComponent(issue.subject)}&category=newsletter&path=%2Fnewsletter`;

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
      <div className="max-w-[764px] mx-auto px-4 sm:px-8 pt-12 md:pt-16 pb-20">
        <Breadcrumb
          items={[{ label: "Newsletter", href: "/newsletter" }, { label: `Issue #${issue.issue}` }]}
          className="mb-10"
        />

        <article>
          <header className="mb-10">
            <p className="font-mono text-meta text-fg-subtle mb-4">
              Issue #{issue.issue} · {formatDate(issue.date)}
            </p>
            <h1 className="font-sans text-[36px] sm:text-[48px] font-bold text-fg tracking-[-0.045em] leading-[1.05]">
              {issue.subject}
            </h1>
          </header>

          <div className="prose max-w-none">
            <MDXRemote
              source={issue.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm, remarkGithubAlerts],
                  rehypePlugins: [
                    rehypeSlug,
                    rehypeCodeTitle,
                    [rehypePrism, { ignoreMissing: true }],
                  ],
                },
              }}
              components={{
                ...newsletterMdxComponents,
                pre: CodeBlock as React.ComponentType<object>,
              }}
            />
          </div>
        </article>

        {/* Subscribe CTA */}
        <div className="mt-14 pt-10 border-t border-border">
          <p className="font-mono text-[11px] text-fg-subtle tracking-widest uppercase mb-4">
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
