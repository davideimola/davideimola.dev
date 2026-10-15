import type { Metadata } from "next";
import { ButtonLink } from "../../../components/ui/Button";
import { Marker } from "../../../components/ui/Marker";
import { Tape } from "../../../components/ui/Tape";
import { getIdentity } from "../../../lib/cv";
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

const inlineLink = "text-fg border-b border-fg no-underline hover:text-accent hover:border-accent";

export default function ContactPage() {
  const { email } = getIdentity();
  return (
    <div className="max-w-[1136px] mx-auto px-4 sm:px-8 pt-10 md:pt-16">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-12 lg:gap-24">
        <div className="flex flex-col gap-7">
          <Tape tilt={0} size="lg">
            Contact
          </Tape>
          <h1 className="m-0 font-sans font-bold text-fg text-[48px] sm:text-[64px] lg:text-[72px] leading-[1] tracking-[-0.045em]">
            Say <Marker>hello</Marker>.
          </h1>
          <p className="m-0 font-sans text-[18px] sm:text-[21px] leading-[1.55] text-fg-muted max-w-[600px]">
            Open to talks, workshops, collaborations and interesting conversations. Fill in the form
            or reach out directly.
          </p>
          <ContactForm />
        </div>

        <aside className="flex flex-col gap-9 lg:pt-[52px]">
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-[13px] text-fg-subtle">Or write directly</span>
            <a
              href={`mailto:${email}`}
              className="font-sans font-bold text-[22px] md:text-[24px] tracking-[-0.02em] text-fg no-underline hover:text-accent break-all"
            >
              {email}
            </a>
          </div>
          <div className="flex flex-col gap-2.5 border-t border-border pt-6">
            <span className="font-mono text-[13px] text-fg-subtle">Rather talk?</span>
            <ButtonLink
              variant="ghost"
              href={CAL_COM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start"
            >
              Book a call
            </ButtonLink>
            <span className="font-sans text-[14px] text-fg-subtle">
              {CAL_COM_URL.replace(/^https?:\/\//, "")}
            </span>
          </div>
          <div className="flex flex-col gap-2.5 border-t border-border pt-6">
            <span className="font-mono text-[13px] text-fg-subtle">Organising an event?</span>
            <p className="m-0 font-sans text-[17px] leading-[1.5] text-fg-body">
              Bios, headshot and topics are in the{" "}
              <a href="/sharing#speaker-kit" className={inlineLink}>
                speaker kit
              </a>
              .
            </p>
          </div>
          <div className="flex flex-wrap gap-[22px] border-t border-border pt-6 font-mono text-[14px]">
            {SOCIAL_PROFILES.map((profile) => (
              <a
                key={profile.url}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg no-underline hover:text-accent"
              >
                {profile.label}
              </a>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
