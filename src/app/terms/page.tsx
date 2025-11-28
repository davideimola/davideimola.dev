import { Header } from "~/app/_components/header";
import { Footer } from "~/app/_components/footer";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Davide Imola",
  description: "Terms of service for davideimola.dev website.",
};

export default function Terms() {
  return (
    <>
      <Header />
      <main className="bg-[#0D0D0D]">
        <section className="relative px-6 py-24 sm:py-32 lg:px-8">
          <div className="pattern-seigaiha absolute inset-0 -z-10 opacity-30" />
          <div className="mx-auto max-w-4xl">
            <h1 className="font-playfair mb-8 text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
              Terms of Service
            </h1>

            <div className="prose prose-lg prose-invert max-w-none">
              <p className="mb-6 text-[#a39e98]">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <h2 className="mt-8 mb-4 text-2xl font-bold text-gray-100">
                Agreement to Terms
              </h2>
              <p className="mb-4 text-[#a39e98]">
                By accessing this website, you agree to be bound by these Terms
                of Service and agree that you are responsible for compliance
                with any applicable local laws.
              </p>

              <h2 className="mt-8 mb-4 text-2xl font-bold text-gray-100">
                Use License
              </h2>
              <p className="mb-4 text-[#a39e98]">
                Permission is granted to temporarily view the materials
                (information or software) on davideimola.dev for personal,
                non-commercial transitory viewing only.
              </p>

              <h2 className="mt-8 mb-4 text-2xl font-bold text-gray-100">
                Disclaimer
              </h2>
              <p className="mb-4 text-[#a39e98]">
                The materials on davideimola.dev are provided on an &apos;as
                is&apos; basis. We make no warranties, expressed or implied, and
                hereby disclaim and negate all other warranties.
              </p>

              <h2 className="mt-8 mb-4 text-2xl font-bold text-gray-100">
                Limitations
              </h2>
              <p className="mb-4 text-[#a39e98]">
                In no event shall Davide Imola or its suppliers be liable for
                any damages arising out of the use or inability to use the
                materials on this website.
              </p>

              <h2 className="mt-8 mb-4 text-2xl font-bold text-gray-100">
                Links
              </h2>
              <p className="mb-4 text-[#a39e98]">
                This website may contain links to third-party websites. We have
                no control over and assume no responsibility for the content or
                practices of any third-party sites.
              </p>

              <h2 className="mt-8 mb-4 text-2xl font-bold text-gray-100">
                Modifications
              </h2>
              <p className="mb-4 text-[#a39e98]">
                We may revise these Terms of Service at any time without notice.
                By using this website, you agree to be bound by the current
                version of these Terms of Service.
              </p>

              <h2 className="mt-8 mb-4 text-2xl font-bold text-gray-100">
                Contact Information
              </h2>
              <p className="mb-4 text-[#a39e98]">
                If you have any questions about these Terms, please contact us
                at:{" "}
                <a
                  href="mailto:hello@davideimola.dev"
                  className="text-[#C91F37] hover:text-[#D3381C]"
                >
                  hello@davideimola.dev
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
