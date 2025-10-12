interface BlogPostStructuredDataProps {
  title: string;
  excerpt: string;
  publishDate: string;
  heroImage?: string;
  slug: string;
  tags: string[];
}

export function BlogPostStructuredData({
  title,
  excerpt,
  publishDate,
  heroImage,
  slug,
  tags,
}: BlogPostStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    image: heroImage || "https://davideimola.dev/og-image.png",
    datePublished: publishDate,
    dateModified: publishDate,
    author: {
      "@type": "Person",
      name: "Davide Imola",
      url: "https://davideimola.dev",
      jobTitle: "Software Engineer",
      sameAs: [
        "https://github.com/davideimola",
        "https://twitter.com/davideimola",
        "https://www.linkedin.com/in/davideimola",
      ],
    },
    publisher: {
      "@type": "Person",
      name: "Davide Imola",
      url: "https://davideimola.dev",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://davideimola.dev/blog/${slug}`,
    },
    keywords: tags.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
