import { CAL_COM_URL, SOCIAL_PROFILES } from "../../lib/social";
import { ButtonLink, ScrollReveal, Tape } from "../ui";

export function ConnectSection() {
  return (
    <section className="border-t border-border py-20">
      <div className="max-w-[1136px] mx-auto px-4 sm:px-8">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center gap-6">
            <Tape as="h2" tilt={0}>
              Connect
            </Tape>
            <p className="font-sans text-[18px] text-fg-muted max-w-[480px] leading-relaxed">
              Open to talks, workshops, and interesting conversations. Find me online or reach out
              directly.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {SOCIAL_PROFILES.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[14px] text-fg no-underline transition-colors duration-150 hover:text-accent"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <ButtonLink
                variant="ghost"
                href={CAL_COM_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a call
              </ButtonLink>
              <ButtonLink variant="link" href="/contact">
                Send a message
              </ButtonLink>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
