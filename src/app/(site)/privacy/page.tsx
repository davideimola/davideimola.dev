import type { Metadata } from "next";
import { PageHero } from "../../../components/ui/PageHero";
import { Tape } from "../../../components/ui/Tape";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy for davideimola.dev.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-[1136px] mx-auto px-4 sm:px-8 pt-12 md:pt-16 pb-20">
      <PageHero
        label="Privacy"
        title="Privacy"
        description="How this site handles your data. Short version: as little as possible."
      />

      <div className="max-w-2xl flex flex-col gap-10 font-sans text-[14px] text-fg-muted leading-relaxed">
        <section className="flex flex-col gap-3">
          <Tape as="h2" tilt={0} className="mb-6">
            Data collected
          </Tape>
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
              className="text-fg hover:text-accent transition-colors duration-150"
            >
              Resend
            </a>
            . This data is used solely to reply to your message and is not stored beyond what email
            providers retain by default.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <Tape as="h2" tilt={1} className="mb-6">
            Comments
          </Tape>
          <p>
            Blog post comments are powered by{" "}
            <a
              href="https://giscus.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg hover:text-accent transition-colors duration-150"
            >
              Giscus
            </a>
            , which uses GitHub Discussions. Commenting requires a GitHub account. Refer to{" "}
            <a
              href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg hover:text-accent transition-colors duration-150"
            >
              GitHub's privacy policy
            </a>{" "}
            for details on how your data is handled.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <Tape as="h2" tilt={2} className="mb-6">
            Hosting
          </Tape>
          <p>
            This site is hosted on{" "}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg hover:text-accent transition-colors duration-150"
            >
              Vercel
            </a>
            . Vercel may collect standard server logs (IP address, browser, request time) as part of
            normal infrastructure operation. See{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg hover:text-accent transition-colors duration-150"
            >
              Vercel's privacy policy
            </a>
            .
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <Tape as="h2" tilt={0} className="mb-6">
            Analytics
          </Tape>
          <p>
            This site uses{" "}
            <a
              href="https://umami.is"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg hover:text-accent transition-colors duration-150"
            >
              Umami
            </a>{" "}
            to understand which pages get read, in aggregate. Umami is cookieless and privacy-first:
            it sets no cookies, does not follow you across sites, and collects no personally
            identifiable information. It records anonymous, aggregated data such as page views,
            referrer, and approximate country, browser, and device type. The tracker is served
            first-party from this domain. See{" "}
            <a
              href="https://umami.is/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg hover:text-accent transition-colors duration-150"
            >
              Umami's privacy policy
            </a>{" "}
            for details.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <Tape as="h2" tilt={1} className="mb-6">
            Cookies
          </Tape>
          <p>
            This site sets no first-party cookies. Third-party services (Giscus/GitHub) may set
            their own cookies when you interact with them.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <Tape as="h2" tilt={2} className="mb-6">
            Contact
          </Tape>
          <p>
            For any privacy-related questions, reach me at{" "}
            <a
              href="mailto:hello@davideimola.dev"
              className="text-fg hover:text-accent transition-colors duration-150"
            >
              hello@davideimola.dev
            </a>
            .
          </p>
        </section>

        <p className="font-mono text-[11px] text-fg-subtle">Last updated: July 2026</p>
      </div>
    </div>
  );
}
