import { useState, useEffect } from "react";

interface BlogPostData {
  post: any;
  metadata: any;
}

interface UseBlogPostResult {
  data: BlogPostData | null;
  loading: boolean;
  error: string | null;
}

export function useBlogPost(slug: string): UseBlogPostResult {
  const [data, setData] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/blog/${slug}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Post not found");
          } else {
            setError("Failed to load post");
          }
          return;
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError("Failed to load post");
        console.error("Error fetching blog post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  return { data, loading, error };
}
