import { Header } from "~/app/_components/header";
import { Footer } from "~/app/_components/footer";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Davide Imola",
  description: "Privacy policy for davideimola.dev website.",
};

export default function Privacy() {
  return (
    <>
      <Header />
      <main className="bg-[#0D0D0D]">
        <section className="relative px-6 py-24 sm:py-32 lg:px-8">
          <div className="pattern-seigaiha absolute inset-0 -z-10 opacity-30" />
          <div className="mx-auto max-w-4xl">
            <h1 className="font-playfair mb-8 text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
              Privacy Policy
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
                Introduction
              </h2>
              <p className="mb-4 text-[#a39e98]">
                This Privacy Policy describes how davideimola.dev
                (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) collects,
                uses, and shares your personal information when you visit our
                website.
              </p>

              <h2 className="mt-8 mb-4 text-2xl font-bold text-gray-100">
                Information We Collect
              </h2>
              <p className="mb-4 text-[#a39e98]">
                We collect minimal personal information:
              </p>
              <ul className="mb-4 list-inside list-disc space-y-2 text-[#a39e98]">
                <li>Usage data (pages visited, time spent, etc.)</li>
                <li>
                  Technical information (browser type, device, IP address)
                </li>
                <li>Email address (only if you subscribe to our newsletter)</li>
              </ul>

              <h2 className="mt-8 mb-4 text-2xl font-bold text-gray-100">
                How We Use Your Information
              </h2>
              <p className="mb-4 text-[#a39e98]">
                We use the collected information to:
              </p>
              <ul className="mb-4 list-inside list-disc space-y-2 text-[#a39e98]">
                <li>Improve our website and user experience</li>
                <li>Send newsletters (if you subscribed)</li>
                <li>Analyze website traffic and usage patterns</li>
              </ul>

              <h2 className="mt-8 mb-4 text-2xl font-bold text-gray-100">
                Cookies
              </h2>
              <p className="mb-4 text-[#a39e98]">
                We may use cookies and similar tracking technologies to analyze
                website traffic. You can control cookies through your browser
                settings.
              </p>

              <h2 className="mt-8 mb-4 text-2xl font-bold text-gray-100">
                Third-Party Services
              </h2>
              <p className="mb-4 text-[#a39e98]">
                We may use third-party services such as:
              </p>
              <ul className="mb-4 list-inside list-disc space-y-2 text-[#a39e98]">
                <li>Vercel (hosting)</li>
                <li>Analytics tools for website statistics</li>
              </ul>

              <h2 className="mt-8 mb-4 text-2xl font-bold text-gray-100">
                Data Security
              </h2>
              <p className="mb-4 text-[#a39e98]">
                We implement appropriate security measures to protect your
                personal information.
              </p>

              <h2 className="mt-8 mb-4 text-2xl font-bold text-gray-100">
                Your Rights
              </h2>
              <p className="mb-4 text-[#a39e98]">You have the right to:</p>
              <ul className="mb-4 list-inside list-disc space-y-2 text-[#a39e98]">
                <li>Access your personal data</li>
                <li>Request correction or deletion of your data</li>
                <li>Opt-out of communications</li>
                <li>Object to data processing</li>
              </ul>

              <h2 className="mt-8 mb-4 text-2xl font-bold text-gray-100">
                Contact
              </h2>
              <p className="mb-4 text-[#a39e98]">
                If you have any questions about this Privacy Policy, please
                contact us at:{" "}
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
