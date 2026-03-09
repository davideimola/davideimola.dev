import { Header } from "~/app/_components/header";
import { Footer } from "~/app/_components/footer";
import { Newsletter } from "~/app/_components/newsletter";
import { BackToTop } from "~/app/_components/back-to-top";
import { getAllBlogPosts } from "~/lib/mdx";
import { BlogList } from "./_components/blog-list";

export default async function Blog() {
  const posts = await getAllBlogPosts();

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

        <BlogList posts={posts} />

        {/* Newsletter Subscription */}
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
