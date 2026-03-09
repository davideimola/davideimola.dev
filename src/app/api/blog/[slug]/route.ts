import { getBlogPost, getBlogPostMetadata } from "~/lib/mdx";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const [post, metadata] = await Promise.all([
      getBlogPost(slug),
      getBlogPostMetadata(slug),
    ]);

    if (!post || !metadata) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    return Response.json({ post, metadata });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
