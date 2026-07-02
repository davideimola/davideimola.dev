// Single source of truth for outbound profile links, used by the Footer,
// ConnectSection, AuthorBio, and the contact page.
export interface SocialProfile {
  label: string;
  handle: string;
  url: string;
}

export const SOCIAL_PROFILES: SocialProfile[] = [
  { label: "GitHub", handle: "@davideimola", url: "https://github.com/davideimola" },
  { label: "LinkedIn", handle: "in/davideimola", url: "https://www.linkedin.com/in/davideimola/" },
  { label: "BlueSky", handle: "@davideimola.dev", url: "https://bsky.app/profile/davideimola.dev" },
];

export const CAL_COM_URL = "https://cal.com/davideimola";
