import { SOCIAL_PROFILES } from "./social";

// Shared JSON-LD Person entity so structured data stays consistent
// between the pages that describe the site author.
export const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Davide Imola",
  url: "https://davideimola.dev",
  jobTitle: "Tech Lead",
  worksFor: { "@type": "Organization", name: "RedCarbon" },
  description:
    "Tech Lead, platform engineer, open source builder. Conference speaker on DevOps, GitOps, and Go.",
  sameAs: SOCIAL_PROFILES.map((profile) => profile.url),
};
