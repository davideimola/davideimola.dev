import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";
import { PageHero } from "../../components/ui/PageHero";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch for talks, workshops, collaborations, or just to say hello.",
  openGraph: {
    title: "Contact — Davide Imola",
    description: "Get in touch for talks, workshops, collaborations, or just to say hello.",
    url: "https://davideimola.dev/contact",
  },
};

const LINKS = [
  { label: "GitHub", handle: "@davideimola", href: "https://github.com/davideimola" },
  { label: "LinkedIn", handle: "in/davideimola", href: "https://www.linkedin.com/in/davideimola/" },
  { label: "BlueSky", handle: "@davideimola.dev", href: "https://bsky.app/profile/davideimola.dev" },
];

export default function ContactPage() {
  return (
    <div className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-24 pb-20">
      <PageHero
        command="ping davideimola.dev"
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
            <p className="font-mono text-[10px] text-text-3 tracking-widest uppercase mb-4">
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
                    <span className="text-accent text-[10px]">→</span>
                    <span className="font-mono text-[12px] text-text-3 group-hover:text-text-1 transition-colors duration-150">
                      {link.label}
                    </span>
                    <span className="font-mono text-[11px] text-text-3 opacity-60">
                      {link.handle}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Speaking note */}
          <div className="border-l-2 border-accent pl-4 flex flex-col gap-1.5">
            <span className="font-mono text-[11px] font-medium text-text-1">
              Speaking & workshops
            </span>
            <p className="font-sans text-[12px] text-text-3 leading-relaxed">
              I'm open to talks and workshops on Go, platform engineering, GitOps, security, and
              open source. Check the{" "}
              <a href="/speaking" className="text-text-2 hover:text-accent transition-colors duration-150">
                speaking page
              </a>{" "}
              for past events.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
