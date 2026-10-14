import type { Metadata } from "next";
import { PageHero } from "../../../components/ui/PageHero";
import { CAL_COM_URL, SOCIAL_PROFILES } from "../../../lib/social";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch for talks, workshops, collaborations, or just to say hello.",
  openGraph: {
    title: "Contact · Davide Imola",
    description: "Get in touch for talks, workshops, collaborations, or just to say hello.",
    url: "https://davideimola.dev/contact",
    images: [
      {
        url: "https://davideimola.dev/og?title=Contact&category=contact",
        width: 1200,
        height: 630,
      },
    ],
  },
};

const LINKS = [
  ...SOCIAL_PROFILES.map((profile) => ({
    label: profile.label,
    handle: profile.handle,
    href: profile.url,
  })),
  { label: "Cal.com", handle: "book a call", href: CAL_COM_URL },
];

export default function ContactPage() {
  return (
    <div className="max-w-[1136px] mx-auto px-4 sm:px-8 pt-12 md:pt-16 pb-20">
      <PageHero
        label="Contact"
        title="Contact"
        description="Open to talks, workshops, collaborations, and interesting conversations. Fill in the form or reach out directly."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
        {/* Form */}
        <ContactForm />

        {/* Sidebar */}
        <aside className="flex flex-col gap-8">
          {/* Direct links */}
          <div>
            <p className="font-mono text-[10px] text-fg-subtle tracking-widest uppercase mb-4">
              Or find me at
            </p>
            <ul className="flex flex-col gap-3">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 group no-underline"
                  >
                    <span className="text-fg text-[10px]">→</span>
                    <span className="font-mono text-[12px] text-fg-subtle group-hover:text-fg transition-colors duration-150">
                      {link.label}
                    </span>
                    <span className="font-mono text-[11px] text-fg-subtle opacity-60">
                      {link.handle}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Speaking note */}
          <div className="border-l-2 border-fg pl-4 flex flex-col gap-1.5">
            <span className="font-mono text-[11px] font-medium text-fg">Speaking & workshops</span>
            <p className="font-sans text-[12px] text-fg-subtle leading-relaxed">
              I'm open to talks and workshops on AI, security, Go, GitOps, and open source. Check
              the{" "}
              <a
                href="/sharing"
                className="text-fg-muted hover:text-accent transition-colors duration-150"
              >
                sharing page
              </a>{" "}
              for past events.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
