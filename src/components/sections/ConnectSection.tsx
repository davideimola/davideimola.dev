import { ScrollReveal } from "../ui";

const LINKS = [
  { label: "GitHub", href: "https://github.com/davideimola" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/davideimola/" },
  { label: "BlueSky", href: "https://bsky.app/profile/davideimola.dev" },
];

export function ConnectSection() {
  return (
    <section className="border-t border-border py-20">
      <div className="max-w-[1024px] mx-auto px-4 sm:px-8">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center gap-6">
            <h2 className="font-mono text-[11px] font-medium text-text-3 tracking-[0.12em] uppercase">
              <span className="text-accent mr-2">{"// "}</span>connect
            </h2>
            <p className="font-sans text-[15px] text-text-2 max-w-[480px] leading-relaxed">
              Open to talks, collaborations, and interesting conversations. Find me online or send a
              message directly.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[13px] text-text-2 no-underline tracking-[0.04em] transition-colors duration-150 hover:text-accent"
                >
                  <span className="text-accent mr-1.5">→</span>
                  {link.label}
                </a>
              ))}
            </div>
            <a
              href="/contact"
              className="font-mono text-[12px] text-text-3 border border-border rounded-[3px] px-4 py-2 no-underline transition-[border-color,color] duration-150 hover:border-border-hover hover:text-text-1"
            >
              Send a message →
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
