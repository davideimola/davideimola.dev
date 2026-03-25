import type { Metadata } from "next";
import { PageHero } from "../../components/ui/PageHero";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy for davideimola.dev.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-24 pb-20">
      <PageHero
        command="cat ./privacy.md"
        title="Privacy"
        description="How this site handles your data — short version: as little as possible."
      />

      <div className="max-w-2xl flex flex-col gap-10 font-sans text-[14px] text-text-2 leading-relaxed">

        <section className="flex flex-col gap-3">
          <h2 className="font-mono text-[11px] text-text-3 tracking-widest uppercase">
            // Data collected
          </h2>
          <p>
            This site does not collect personal data directly. No account, no login, no tracking
            pixel.
          </p>
          <p>
            The contact form sends your name, email address, and message to me via{" "}
            <a
              href="https://resend.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-1 hover:text-accent transition-colors duration-150"
            >
              Resend
            </a>
            . This data is used solely to reply to your message and is not stored beyond what email
            providers retain by default.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-mono text-[11px] text-text-3 tracking-widest uppercase">
            // Comments
          </h2>
          <p>
            Blog post comments are powered by{" "}
            <a
              href="https://giscus.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-1 hover:text-accent transition-colors duration-150"
            >
              Giscus
            </a>
            , which uses GitHub Discussions. Commenting requires a GitHub account. Refer to{" "}
            <a
              href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-1 hover:text-accent transition-colors duration-150"
            >
              GitHub's privacy policy
            </a>{" "}
            for details on how your data is handled.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-mono text-[11px] text-text-3 tracking-widest uppercase">
            // Hosting
          </h2>
          <p>
            This site is hosted on{" "}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-1 hover:text-accent transition-colors duration-150"
            >
              Vercel
            </a>
            . Vercel may collect standard server logs (IP address, browser, request time) as part
            of normal infrastructure operation. See{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-1 hover:text-accent transition-colors duration-150"
            >
              Vercel's privacy policy
            </a>
            .
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-mono text-[11px] text-text-3 tracking-widest uppercase">
            // Cookies
          </h2>
          <p>
            This site sets no first-party cookies. Third-party services (Giscus/GitHub) may set
            their own cookies when you interact with them.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-mono text-[11px] text-text-3 tracking-widest uppercase">
            // Contact
          </h2>
          <p>
            For any privacy-related questions, reach me at{" "}
            <a
              href="mailto:hello@davideimola.dev"
              className="text-text-1 hover:text-accent transition-colors duration-150"
            >
              hello@davideimola.dev
            </a>
            .
          </p>
        </section>

        <p className="font-mono text-[11px] text-text-3">
          Last updated: March 2026
        </p>
      </div>
    </div>
  );
}
