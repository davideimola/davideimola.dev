import { ScrollReveal } from "../ui/ScrollReveal";
import { SubscribeForm } from "../ui/SubscribeForm";

// A full-width band that speaks the site's terminal language: the "❯ subscribe --monthly"
// prompt echoes the per-page command heroes, tying the newsletter to the site's core motif.
// Left-aligned so it reads distinctly from the centered ConnectSection that closes the page.
export function NewsletterSection() {
  return (
    <section className="border-t border-border py-20">
      <div className="max-w-[1024px] mx-auto px-4 sm:px-8">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-8 md:gap-12 md:items-center">
            {/* Pitch */}
            <div>
              <h2 className="font-mono text-[11px] font-medium text-text-3 tracking-[0.12em] uppercase mb-4">
                <span className="text-accent mr-2">{"//"}</span>newsletter
              </h2>
              <p className="font-mono text-[20px] sm:text-[24px] text-text-1 tracking-[-0.02em] mb-3">
                <span className="text-accent mr-2">❯</span>subscribe --monthly
              </p>
              <p className="font-sans text-[14px] text-text-2 leading-relaxed max-w-md">
                A short digest of what I published: new posts, upcoming talks, and the occasional
                project. One email a month, no spam.
              </p>
            </div>
            {/* Form */}
            <div>
              <SubscribeForm mode="compact" />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
