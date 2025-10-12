/**
 * Speaking Events Data
 *
 * Auto-generated from JSON files in /speaking directory
 * Last updated: 2025-10-12T18:53:53.385Z
 */

export type SpeakingEvent = {
  id: number;
  title: string;
  role:
    | "Speaker"
    | "Organizer"
    | "MC"
    | "Guest"
    | "Organizer & Speaker"
    | "Organizer & MC";
  talkTitle: string;
  location: string;
  date: string; // Format: YYYY-MM-DD
  type: "Conference" | "Meetup" | "Podcast/Stream" | "Workshop";
  description?: string;
  coSpeaker?: string;
  videoUrl?: string;
  slidesUrl?: string;
  website?: string;
};

export const speakingEvents: SpeakingEvent[] = [
  {
    id: 17,
    title: "Open Source Day 2025",
    role: "Organizer",
    talkTitle: "Open Source Day with Schrodinger Hat",
    location: "Florence, Italy",
    date: "2025-03-21",
    type: "Conference",
  },
  {
    id: 16,
    title: "Open Source Day 2024",
    role: "Organizer & MC",
    talkTitle: "Open Source Day with Schrodinger Hat",
    location: "Florence, Italy",
    date: "2024-03-07",
    type: "Conference",
  },
  {
    id: 15,
    title: "Open Source Day 2023",
    role: "Organizer",
    talkTitle: "Open Source Day with Schrodinger Hat",
    location: "Florence, Italy",
    date: "2023-03-28",
    type: "Conference",
  },
  {
    id: 12,
    title: "GOLab",
    role: "Speaker",
    talkTitle: "Gophers Gone Domain-Driven: a tale of Go and DDD",
    location: "Florence, Italy",
    date: "2024-11-13",
    type: "Conference",
    description:
      "Advanced Go programming techniques, performance optimization, and modern development practices.",
    videoUrl: "https://golab.io/talks/gophers-gone-domain-driven",
  },
  {
    id: 14,
    title: "WeAreDevelopers World Congress",
    role: "Speaker",
    talkTitle: "GreenOps: Bridging the Gap Between DevOps and Sustainability",
    location: "Remote",
    date: "2024-07-18",
    type: "Conference",
    description:
      "Bridging the gap between DevOps practices and environmental sustainability in technology.",
  },
  {
    id: 13,
    title: "KCD Italy",
    role: "Speaker",
    talkTitle: "How to GitOps your cluster with Flux",
    location: "Bologna, Italy",
    date: "2024-06-20",
    type: "Conference",
    description:
      "Exploring GitOps methodologies and tools for modern infrastructure management and deployment automation.",
  },
  {
    id: 11,
    title: "DevOps Time by UGIdotNET",
    role: "Speaker",
    talkTitle: "Come funziona l'incident response",
    location: "Remote",
    date: "2024-04-23",
    type: "Podcast/Stream",
    description:
      "Technical talk covering modern software development and infrastructure practices.",
    videoUrl: "https://www.youtube.com/live/5DRDDGYCvjk?si=B9XQjmmqphoW8-yk",
  },
  {
    id: 10,
    title: "DevOps Day",
    role: "Speaker",
    talkTitle: "Securing Secrets in the GitOps Era",
    location: "Remote",
    date: "2024-02-7",
    type: "Conference",
    description:
      "Exploring GitOps methodologies and tools for modern infrastructure management and deployment automation.",
    videoUrl:
      "https://www.wearedevelopers.com/en/videos/852/securing-secrets-in-the-gitops-era-1707725810",
    slidesUrl:
      "https://www.slideshare.net/DavideImola/how-to-gitops-your-cluster-with-flux",
  },
  {
    id: 7,
    title: "GOLab",
    role: "Speaker",
    talkTitle: "Level UP your RDBMS Productivity with GO",
    location: "Florence, Italy",
    date: "2023-11-21",
    type: "Conference",
    description:
      "Advanced Go programming techniques, performance optimization, and modern development practices.",
    coSpeaker: "Ludovico Russo",
    videoUrl: "https://youtu.be/kS5LpcmB3O4?si=6MQK0h5DhHGQMKDK",
    slidesUrl:
      "https://www.slideshare.net/DavideImola/level-up-your-rdbms-productivity-in-go",
  },
  {
    id: 3,
    title: "DevOps Time by UGIdotNET",
    role: "Speaker",
    talkTitle: "Securing Secrets in the GitOps Era",
    location: "Remote",
    date: "2023-11-14",
    type: "Podcast/Stream",
    description:
      "Exploring GitOps methodologies and tools for modern infrastructure management and deployment automation.",
    videoUrl: "https://www.youtube.com/live/npPrIEamz8U?si=gb7v4Hs0nDFPA_xt",
  },
  {
    id: 4,
    title: "DevSecOps Day",
    role: "Speaker",
    talkTitle: "Securing Secrets in the GitOps Era",
    location: "Bologna, Italy",
    date: "2023-10-13",
    type: "Conference",
    description:
      "Exploring GitOps methodologies and tools for modern infrastructure management and deployment automation.",
    videoUrl:
      "https://www.youtube.com/watch?v=HYVaSSqGyyE&list=PLWK9j6ps_unmhH5KbPWc7NXwJJ46fnXFq&index=2",
    slidesUrl:
      "https://www.slideshare.net/DavideImola/securing-secrets-in-the-gitops-era",
  },
  {
    id: 6,
    title: "Giuseppe Funicello",
    role: "Speaker",
    talkTitle: "Cos'è e cosa fa un DevOps?",
    location: "Remote",
    date: "2023-10-3",
    type: "Podcast/Stream",
    description:
      "Technical talk covering modern software development and infrastructure practices.",
    videoUrl: "https://www.youtube.com/watch?v=ojpQwOQOse4",
  },
  {
    id: 5,
    title: "Giuseppe Funicello",
    role: "Speaker",
    talkTitle:
      "Come funziona l'OPEN SOURCE? Con Davide Imola di @SchrodingerHat",
    location: "Remote",
    date: "2023-3-15",
    type: "Podcast/Stream",
    description:
      "Technical talk covering modern software development and infrastructure practices.",
    videoUrl: "https://www.youtube.com/watch?v=lzTho3gamn4",
  },
  {
    id: 8,
    title: "Incontro DevOps Italia",
    role: "Speaker",
    talkTitle: "How to GitOps your Kubernetes cluster with Flux",
    location: "Bologna, Italy",
    date: "2023-03-10",
    type: "Conference",
    description:
      "Exploring GitOps methodologies and tools for modern infrastructure management and deployment automation.",
    videoUrl:
      "https://www.youtube.com/watch?v=56JnkdoClPQ&list=PLWK9j6ps_unkOGNPvoDhrnoGSmtFo9Pyr&index=2",
    slidesUrl:
      "https://www.slideshare.net/DavideImola/how-to-gitops-your-cluster-with-flux",
  },
  {
    id: 9,
    title: "TomorrowDevs",
    role: "Speaker",
    talkTitle: "Open Source Day with Schrodinger Hat",
    location: "Remote",
    date: "2023-3-8",
    type: "Podcast/Stream",
    description:
      "Technical talk covering modern software development and infrastructure practices.",
    videoUrl: "https://www.youtube.com/watch?v=epcqaeVcp8c",
  },
  {
    id: 2,
    title: "DevOps Day",
    role: "Speaker",
    talkTitle: "How to GitOps your Kubernetes cluster with Flux",
    location: "Remote",
    date: "2023-02-15",
    type: "Conference",
    description:
      "Exploring GitOps methodologies and tools for modern infrastructure management and deployment automation.",
    videoUrl:
      "https://www.wearedevelopers.com/en/videos/547/how-to-gitops-your-cluster-with-flux",
    slidesUrl:
      "https://www.slideshare.net/DavideImola/how-to-gitops-your-cluster-with-flux",
  },
  {
    id: 1,
    title: "The Developers' Bakery",
    role: "Speaker",
    talkTitle: "Open Source Day with Schrodinger Hat",
    location: "Remote",
    date: "2023-1-17",
    type: "Podcast/Stream",
    description:
      "Technical talk covering modern software development and infrastructure practices.",
    videoUrl: "https://thebakery.dev/50/",
  },
];
