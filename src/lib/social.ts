// Single source of truth for outbound profile links. Every profile that is
// Davide's belongs in the JSON-LD `sameAs` (it says the account is his); only
// the ones he actually posts on are offered as a way to follow him, in the
// Footer, AuthorBio, the contact page and /links.
export interface SocialProfile {
  label: string;
  handle: string;
  url: string;
  /** Where he posts: shown wherever a visitor is invited to follow him. */
  active: boolean;
}

export const ALL_PROFILES: SocialProfile[] = [
  { label: "GitHub", handle: "@davideimola", url: "https://github.com/davideimola", active: true },
  {
    label: "LinkedIn",
    handle: "in/davideimola",
    url: "https://www.linkedin.com/in/davideimola/",
    active: true,
  },
  // Kept for sameAs: the account exists, but nothing is posted there.
  {
    label: "Bluesky",
    handle: "@davideimola.dev",
    url: "https://bsky.app/profile/davideimola.dev",
    active: false,
  },
];

export const SOCIAL_PROFILES = ALL_PROFILES.filter((profile) => profile.active);

export const CAL_COM_URL = "https://cal.com/davideimola";
