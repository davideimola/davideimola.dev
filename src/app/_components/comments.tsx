"use client";

import { useEffect, useRef, useState } from "react";

interface CommentsProps {
  slug: string;
}

export function Comments({ slug }: CommentsProps) {
  const commentsRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    // Wait for DOM to be ready
    const timeoutId = setTimeout(() => {
      const commentsContainer = commentsRef.current;
      if (!commentsContainer) return;

      // Clear any existing Giscus iframe
      const existingIframe = commentsContainer.querySelector(".giscus");
      if (existingIframe) {
        existingIframe.remove();
      }

      const script = document.createElement("script");
      script.src = "https://giscus.app/client.js";
      script.async = true;
      script.setAttribute("data-repo", "davideimola/davideimola.dev");
      script.setAttribute("data-repo-id", "R_kgDOKX6ZoQ");
      script.setAttribute("data-category", "General");
      script.setAttribute("data-category-id", "DIC_kwDOKX6Zoc4CaXXN");
      script.setAttribute("data-mapping", "pathname");
      script.setAttribute("data-strict", "0");
      script.setAttribute("data-reactions-enabled", "1");
      script.setAttribute("data-emit-metadata", "0");
      script.setAttribute("data-input-position", "top");
      script.setAttribute("data-theme", "dark");
      script.setAttribute("data-lang", "en");
      script.setAttribute("crossorigin", "anonymous");

      commentsContainer.appendChild(script);

      // Listen for giscus load
      const checkInterval = setInterval(() => {
        const iframe = commentsContainer.querySelector(".giscus-frame");
        if (iframe) {
          setIsLoading(false);
          clearInterval(checkInterval);
        }
      }, 100);

      // Fallback timeout
      setTimeout(() => {
        setIsLoading(false);
        clearInterval(checkInterval);
      }, 5000);
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      const commentsContainer = commentsRef.current;
      if (commentsContainer) {
        const existingIframe = commentsContainer.querySelector(".giscus");
        if (existingIframe) {
          existingIframe.remove();
        }
      }
    };
  }, [slug]);

  return (
    <section className="bg-gray-900 py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="font-playfair mb-4 text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
            Discussion
          </h2>
          <div className="mx-auto h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
          <p className="mt-4 text-gray-400">
            Join the conversation! Share your thoughts, ask questions, or
            suggest improvements.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Comments are powered by GitHub Discussions. You'll need a GitHub
            account to participate.
          </p>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="animate-pulse space-y-4">
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full bg-gray-800"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/4 rounded bg-gray-800"></div>
                <div className="h-4 w-3/4 rounded bg-gray-800"></div>
                <div className="h-4 w-1/2 rounded bg-gray-800"></div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full bg-gray-800"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/4 rounded bg-gray-800"></div>
                <div className="h-4 w-2/3 rounded bg-gray-800"></div>
              </div>
            </div>
          </div>
        )}

        {/* Utterances Comments */}
        <div
          ref={commentsRef}
          className={`min-h-[300px] transition-opacity duration-300 ${isLoading ? "absolute opacity-0" : "opacity-100"}`}
        />
      </div>
    </section>
  );
}
