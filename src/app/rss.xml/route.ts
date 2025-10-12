import { blogPosts } from "~/content/blog-posts";

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const siteUrl = "https://davideimola.dev";
  const blogUrl = `${siteUrl}/blog`;

  // Sort posts by date (newest first)
  const sortedPosts = [...blogPosts].sort(
    (a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  );

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Davide Imola - Technical Blog</title>
    <link>${blogUrl}</link>
    <description>Insights on infrastructure, GitOps, Kubernetes, Go, and tech community building by Davide Imola - Software Engineer and Tech Speaker</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${siteUrl}/og-image.png</url>
      <title>Davide Imola</title>
      <link>${siteUrl}</link>
    </image>
    ${sortedPosts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.publishDate).toUTCString()}</pubDate>
      <author>hello@davideimola.dev (Davide Imola)</author>
      <category>${escapeXml(post.category)}</category>
      ${post.tags ? post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ") : ""}
      ${post.heroImage ? `<enclosure url="${escapeXml(post.heroImage)}" type="image/jpeg" />` : ""}
    </item>`,
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

