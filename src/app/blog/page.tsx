"use client";

import { Header } from "~/app/_components/header";
import { Footer } from "~/app/_components/footer";
import Link from "next/link";
import { blogPosts } from "~/content/blog-posts";
import { useState } from "react";

// Categories extracted from blog posts
const allCategories = Array.from(
  new Set(blogPosts.map((post) => post.category)),
);
const categories = ["All", ...allCategories];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const featuredPosts = blogPosts.filter((post) => post.featured);

  // Filter posts based on selected category
  const filteredPosts = blogPosts.filter((post) => {
    if (selectedCategory === "All") return true; // Show all posts
    return post.category === selectedCategory; // Filter by category
  });

  return (
    <>
      <Header />
      <main className="bg-gray-950">
        {/* Hero Section */}
        <section className="px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
              Technical Blog
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
              Sharing insights, best practices, and lessons learned from
              building software and fostering tech communities.
            </p>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="border-b border-gray-800 py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto mb-12 max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-100">
                  Featured Articles
                </h2>
                <p className="mt-4 text-lg leading-8 text-gray-400">
                  In-depth articles on software engineering and community
                  building
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {featuredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 transition-all duration-300 hover:border-blue-500/50"
                  >
                    {/* Featured badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                        Featured
                      </span>
                    </div>

                    {/* Hero Image */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {post.heroImage ? (
                        <img
                          src={post.heroImage}
                          alt={post.heroImageAlt ?? post.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-950 to-purple-950">
                          <div className="p-8 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
                              <svg
                                className="h-8 w-8 text-blue-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
                    </div>

                    <div className="p-6">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="inline-flex items-center rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-400">
                          {post.category}
                        </span>
                        <time className="text-xs text-gray-500">
                          {formatDate(post.publishDate)}
                        </time>
                      </div>

                      <Link href={`/blog/${post.slug}`} className="block">
                        <h3 className="mb-3 line-clamp-2 text-xl font-semibold text-gray-100 transition-colors group-hover:text-blue-400">
                          {post.title}
                        </h3>
                        <p className="mb-4 line-clamp-3 text-gray-400">
                          {post.excerpt}
                        </p>
                      </Link>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="inline-block rounded bg-blue-500/10 px-2 py-1 text-xs text-blue-400"
                            >
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{post.tags.length - 2}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* Category Filter */}
            <div className="mb-12 border-b border-gray-800">
              <div className="flex space-x-8 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? "border-blue-500 text-blue-400"
                        : "border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="group overflow-hidden rounded-xl border border-gray-800 bg-gray-900 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg"
                >
                  {/* Hero Image */}
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {post.heroImage ? (
                      <img
                        src={post.heroImage}
                        alt={post.heroImageAlt ?? post.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                        <div className="p-6 text-center">
                          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800">
                            <svg
                              className="h-6 w-6 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
                  </div>

                  <div className="p-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-gray-800 px-2 py-1 text-xs font-medium text-gray-400">
                        {post.category}
                      </span>
                      <time className="text-xs text-gray-500">
                        {formatDate(post.publishDate)}
                      </time>
                    </div>

                    <Link href={`/blog/${post.slug}`} className="block">
                      <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-100 transition-colors group-hover:text-blue-400">
                        {post.title}
                      </h3>
                      <p className="mb-4 line-clamp-3 text-sm text-gray-400">
                        {post.excerpt}
                      </p>
                    </Link>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="inline-block rounded bg-blue-500/10 px-2 py-1 text-xs text-blue-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="border-t border-gray-800 bg-gray-900 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-100">
                Stay Updated
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-400">
                Get notified when I publish new articles about infrastructure,
                security, Kubernetes, Go, and tech community insights.
              </p>
              <div className="mx-auto mt-6 flex max-w-md gap-x-4">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="min-w-0 flex-auto rounded-md border-0 bg-gray-800 px-3.5 py-2 text-gray-100 shadow-sm ring-1 ring-gray-700 ring-inset placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:ring-inset sm:text-sm sm:leading-6"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  className="flex-none rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Subscribe
                </button>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-500">
                No spam, unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
