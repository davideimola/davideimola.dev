"use client";

import { Header } from "~/app/_components/header";
import { Footer } from "~/app/_components/footer";
import { Newsletter } from "~/app/_components/newsletter";
import { BackToTop } from "~/app/_components/back-to-top";
import Link from "next/link";
import { blogPosts } from "~/content/blog-posts";
import { useState } from "react";
import Image from "next/image";

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

  const sortedPosts = [...blogPosts].sort((a, b) => {
    return (
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  });

  const featuredPosts = sortedPosts.filter((post) => post.featured);

  // Filter posts based on selected category and search query
  const filteredPosts = sortedPosts.filter((post) => {
    // Category filter
    const categoryMatch =
      selectedCategory === "All" || post.category === selectedCategory;

    return categoryMatch;
  });

  return (
    <>
      <Header />
      <BackToTop />
      <main className="bg-[#0D0D0D]">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
          <div className="absolute top-0 right-0 -z-20 h-[500px] w-[500px] rounded-full bg-[#C91F37]/20 opacity-50 mix-blend-screen blur-[120px]" />
          <div className="absolute bottom-0 left-0 -z-20 h-[500px] w-[500px] rounded-full bg-[#a39e98]/10 opacity-50 mix-blend-screen blur-[120px]" />
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-playfair text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
              Blog
            </h1>
            {/* Decorative accent line */}
            <div className="mx-auto mt-6 h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#a39e98]">
              「Thoughts on infrastructure, security, development, and building
              communities.」
            </p>

            {/* RSS Feed Link */}
            <div className="mt-6">
              <a
                href="/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#a39e98] transition-colors hover:text-[#C91F37]"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z" />
                </svg>
                Subscribe via RSS
              </a>
            </div>
          </div>
        </section>

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
                  In-depth articles on software engineering and community
                  building
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {featuredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="group relative overflow-hidden rounded-2xl border border-[#2A2725] bg-[#1A1816] transition-all duration-300 hover:border-[#C91F37]/50"
                  >
                    {/* Featured badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center rounded-full bg-[#C91F37] px-3 py-1 text-xs font-medium text-white">
                        Featured
                      </span>
                    </div>

                    {/* Hero Image */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {post.heroImage ? (
                        <Image
                          src={post.heroImage}
                          alt={post.heroImageAlt ?? post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#C91F37]/5 to-purple-950">
                          <div className="p-8 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-[#C91F37]/10 ring-1 ring-[#C91F37]/20">
                              <svg
                                className="h-8 w-8 text-[#C91F37]"
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
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1816] to-transparent opacity-60" />
                    </div>

                    <div className="p-6">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="inline-flex items-center rounded-full bg-[#2A2725] px-3 py-1 text-xs font-medium text-[#a39e98]">
                          {post.category}
                        </span>
                        <time className="text-xs text-[#726d68]">
                          {formatDate(post.publishDate)}
                        </time>
                      </div>

                      <Link href={`/blog/${post.slug}`} className="block">
                        <h3 className="mb-3 line-clamp-2 text-xl font-semibold text-gray-100 transition-colors group-hover:text-[#C91F37]">
                          {post.title}
                        </h3>
                        <p className="mb-4 line-clamp-3 text-[#a39e98]">
                          {post.excerpt}
                        </p>
                      </Link>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="inline-block rounded bg-[#C91F37]/15 px-2 py-1 text-xs text-[#E6E4E0] ring-1 ring-[#C91F37]/40"
                            >
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 2 && (
                            <span className="text-xs text-[#726d68]">
                              +{post.tags.length - 2}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#726d68]">
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
            {/* Search and Category Filter */}
            <div className="mb-12">
              {/* Category Filter */}
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
                  <article
                    key={post.id}
                    className="group overflow-hidden rounded-xl border border-[#2A2725] bg-[#1A1816] transition-all duration-300 hover:border-[#C91F37]/50 hover:shadow-lg"
                  >
                    {/* Hero Image */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {post.heroImage ? (
                        <Image
                          src={post.heroImage}
                          alt={post.heroImageAlt ?? post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1A1816] to-[#2A2725]">
                          <div className="p-6 text-center">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#2A2725]">
                              <svg
                                className="h-6 w-6 text-[#a39e98]"
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
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1816] to-transparent opacity-60" />
                    </div>

                    <div className="p-6">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="inline-flex items-center rounded-full bg-[#2A2725] px-2 py-1 text-xs font-medium text-[#a39e98]">
                          {post.category}
                        </span>
                        <time className="text-xs text-[#726d68]">
                          {formatDate(post.publishDate)}
                        </time>
                      </div>

                      <Link href={`/blog/${post.slug}`} className="block">
                        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-100 transition-colors group-hover:text-[#C91F37]">
                          {post.title}
                        </h3>
                        <p className="mb-4 line-clamp-3 text-sm text-[#a39e98]">
                          {post.excerpt}
                        </p>
                      </Link>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="inline-block rounded bg-[#C91F37]/15 px-2 py-1 text-xs text-[#E6E4E0] ring-1 ring-[#C91F37]/40"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-[#726d68]">
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </article>
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
                      onClick={() => {
                        setSelectedCategory("All");
                      }}
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

        {/* Newsletter Subscription */}
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
