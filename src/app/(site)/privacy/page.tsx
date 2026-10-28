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
            This site collects as little personal data as it can. No account, no login, no tracking
            pixel on its pages. The only personal data it takes is what you type into the contact
            form or the newsletter form.
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
            Newsletter
          </Tape>
          <p>
            If you subscribe to the newsletter, your email address is stored on a server I run
            myself, in Germany, together with when you asked to subscribe and when you confirmed.
            The issues are sent from that same server, and no other service sees the list. It is
            used only to send you the newsletter. Subscribing takes two steps: you only start
            receiving issues after clicking the link in the confirmation email, and an address that
            never confirms is deleted after 30 days. The form is protected from bots by{" "}
            <a
              href="https://www.cloudflare.com/products/turnstile/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg hover:text-accent transition-colors duration-150"
            >
              Cloudflare Turnstile
            </a>
            .
          </p>
          <p>
            The issues carry no tracking pixel and no tracked links: I do not know whether you open
            an issue or what you click in it. Until October 2026 the newsletter was sent by{" "}
            <a
              href="https://kit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg hover:text-accent transition-colors duration-150"
            >
              Kit
            </a>
            , whose emails do count opens and clicks and offer no way to switch it off. If you
            subscribed before then, your address is moving to my server, and Kit's copy will be
            deleted.
          </p>
          <p>
            Every issue has an unsubscribe link, and mail apps that support it show an Unsubscribe
            button too: either removes you at once. After that I keep your address only so that
            nothing reaches you again. Write to me and I will delete it entirely.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <Tape as="h2" tilt={2} className="mb-6">
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
          <Tape as="h2" tilt={0} className="mb-6">
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
          <Tape as="h2" tilt={1} className="mb-6">
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
          <Tape as="h2" tilt={2} className="mb-6">
            Cookies
          </Tape>
          <p>
            This site sets no first-party cookies. Third-party services (Giscus/GitHub) may set
            their own cookies when you interact with them.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <Tape as="h2" tilt={0} className="mb-6">
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

        <p className="font-mono text-[11px] text-fg-subtle">Last updated: October 2026</p>
      </div>
    </div>
  );
}
