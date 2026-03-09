"use client";

import { useState } from "react";
import { type BlogPost } from "~/lib/mdx";
import { BlogPostCard } from "./blog-post-card";

export function BlogList({ posts }: { posts: BlogPost[] }) {
  const allCategories = Array.from(new Set(posts.map((post) => post.category)));
  const categories = ["All", ...allCategories];

  const [selectedCategory, setSelectedCategory] = useState("All");

  const featuredPosts = posts.filter((post) => post.featured);

  const filteredPosts = posts.filter(
    (post) =>
      selectedCategory === "All" || post.category === selectedCategory,
  );

  return (
    <>
      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="bg-[#1A1816]/30 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-playfair mb-4 text-3xl font-bold tracking-tight text-gray-100">
                Featured Articles
              </h2>
              <div className="mx-auto mb-4 h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
              <p className="text-lg leading-8 text-[#a39e98]">
                In-depth articles on software engineering and community building
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {featuredPosts.map((post) => (
                <BlogPostCard key={post.slug} post={post} variant="featured" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex space-x-8 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-1 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? "rounded-md bg-[#2A2725]/50 text-[#C91F37]"
                      : "rounded-md text-[#a39e98] hover:bg-[#2A2725]/30 hover:text-[#d4cfc9]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="mx-auto max-w-md">
                <svg
                  className="mx-auto h-12 w-12 text-[#a39e98]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-100">
                  No articles found
                </h3>
                <p className="mt-2 text-sm text-[#a39e98]">
                  {`No articles in the "${selectedCategory}" category.`}
                </p>
                {selectedCategory !== "All" && (
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className="mt-4 text-sm text-[#C91F37] transition-colors hover:text-[#D3381C]"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
