import { ScrollReveal } from "../ui/ScrollReveal";
import { SectionHeader } from "../ui/SectionHeader";
import { SubscribeForm } from "../ui/SubscribeForm";

// A full-width band: the pitch on the left, the form on the right. Left-aligned
// so it reads distinctly from the centered ConnectSection that closes the page.
export function NewsletterSection() {
  return (
    <section className="border-t border-border py-20">
      <div className="max-w-[1136px] mx-auto px-4 sm:px-8">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-8 md:gap-12 md:items-center">
            {/* Pitch */}
            <div>
              <SectionHeader title="Newsletter" tilt={0} className="mb-6" />
              <p className="font-sans text-[26px] sm:text-h2 font-bold text-fg mb-3">
                One email a month.
              </p>
              <p className="font-sans text-[16px] text-fg-muted leading-relaxed max-w-md">
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
