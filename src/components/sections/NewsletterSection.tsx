import { ScrollReveal } from "../ui/ScrollReveal";
import { SubscribeCTA } from "../ui/SubscribeCTA";

export function NewsletterSection() {
  return (
    <section className="border-t border-border py-20">
      <div className="max-w-[1024px] mx-auto px-4 sm:px-8">
        <ScrollReveal>
          <div className="max-w-[520px] mx-auto">
            <SubscribeCTA />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
