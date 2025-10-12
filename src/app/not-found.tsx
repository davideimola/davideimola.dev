import Link from "next/link";
import { Header } from "~/app/_components/header";
import { Footer } from "~/app/_components/footer";
import { Icon } from "~/app/_components/icon";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="bg-[#0A0A0A]">
        {/* 404 Hero Section */}
        <section className="relative px-6 py-24 sm:py-32 lg:px-8">
          <div className="pattern-seigaiha absolute inset-0 -z-10 opacity-6" />
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,#C91F37,transparent)] opacity-2" />

          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8">
              <div className="float relative mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-gray-700 to-gray-800">
                <span className="text-6xl text-gray-400">?</span>
              </div>
            </div>

            <h1 className="font-playfair text-6xl font-bold tracking-tight text-gray-100 sm:text-8xl">
              404
            </h1>

            <h2 className="font-playfair mt-4 text-2xl font-bold text-gray-100 sm:text-3xl">
              Page Not Found
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
              Oops! The page you&apos;re looking for seems to have wandered off
              like a lost traveler. Let&apos;s get you back on the right path.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/"
                className="button-press rounded-md bg-[#C91F37] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#D3381C] hover:shadow-lg hover:shadow-[#C91F37]/25"
              >
                Return Home
              </Link>
              <Link
                href="/about"
                className="button-press rounded-md border border-gray-600 px-6 py-3 text-sm font-semibold text-gray-300 transition-all duration-300 hover:border-gray-500 hover:text-gray-200"
              >
                About Me
              </Link>
            </div>

            {/* Quick Navigation */}
            <div className="mt-16">
              <h3 className="mb-6 text-lg font-semibold text-gray-100">
                Popular Pages
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Link
                  href="/blog"
                  className="group rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-center transition-all duration-300 hover:border-[#C91F37]/50 hover:bg-gray-900"
                >
                  <div className="mb-2 text-2xl">📝</div>
                  <div className="text-sm font-medium text-gray-100 group-hover:text-[#C91F37]">
                    Blog
                  </div>
                </Link>
                <Link
                  href="/projects"
                  className="group rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-center transition-all duration-300 hover:border-[#C91F37]/50 hover:bg-gray-900"
                >
                  <div className="mb-2">
                    <Icon name="🚀" type="lucide" size="sm" variant="accent" />
                  </div>
                  <div className="text-sm font-medium text-gray-100 group-hover:text-[#C91F37]">
                    Projects
                  </div>
                </Link>
                <Link
                  href="/speaking"
                  className="group rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-center transition-all duration-300 hover:border-[#C91F37]/50 hover:bg-gray-900"
                >
                  <div className="mb-2 text-2xl">🎤</div>
                  <div className="text-sm font-medium text-gray-100 group-hover:text-[#C91F37]">
                    Speaking
                  </div>
                </Link>
                <Link
                  href="/experience"
                  className="group rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-center transition-all duration-300 hover:border-[#C91F37]/50 hover:bg-gray-900"
                >
                  <div className="mb-2 text-2xl">💼</div>
                  <div className="text-sm font-medium text-gray-100 group-hover:text-[#C91F37]">
                    Experience
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
