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
import { SubscribeCTA } from "../../../../components/ui/SubscribeCTA";
import { Tape } from "../../../../components/ui/Tape";
import { formatDate } from "../../../../lib/dates";
import { getAllIssues, getIssueBySlug } from "../../../../lib/newsletter";
import { OG_SIZE, ogImageUrl } from "../../../../lib/og-url";
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

  const ogImage = ogImageUrl({ title: issue.subject, category: "newsletter", path: "/newsletter" });

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
      images: [{ url: ogImage, ...OG_SIZE, alt: issue.subject }],
    },
    twitter: {
      card: "summary_large_image",
      title: issue.subject,
      description: issue.previewText,
      images: [ogImage],
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
          <header className="flex flex-col gap-5 pb-10">
            <Tape tilt={0}>Issue {String(issue.issue).padStart(2, "0")}</Tape>
            <h1 className="m-0 font-sans font-bold text-fg text-[34px] sm:text-[48px] leading-[1.05] tracking-[-0.045em]">
              {issue.subject}
            </h1>
            <p className="m-0 font-sans text-[19px] sm:text-[21px] leading-[1.5] text-fg-muted">
              {issue.previewText}
            </p>
            <p className="m-0 font-mono text-meta text-fg-subtle">{formatDate(issue.date)}</p>
          </header>

          <div className="h-px bg-rule mb-10" />

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

        <SubscribeCTA heading="Get the next issue" className="mt-16" />
      </div>
    </>
  );
}
