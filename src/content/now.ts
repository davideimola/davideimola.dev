/**
 * "Now" Page Content
 *
 * Inspired by Derek Sivers' /now page movement: https://nownownow.com/about
 *
 * Update this file regularly (monthly or when things change) to reflect
 * what you're currently focused on.
 */

export const nowInfo = {
  // Update this date when you update the content
  lastUpdated: "December 2025",

  // Current Role
  currentRole: {
    title: "Software Engineer",
    company: "RedCarbon",
    companyLogo: "/logos/redcarbon-logo.webp",
    location: "Remote / Verona, Italy",
    description:
      "Leading backend and frontend development for the AI-powered cybersecurity platform",
  },

  // Location
  location: {
    city: "Verona",
    country: "Italy",
    flag: "🇮🇹",
    timezone: "CET/CEST (UTC+1/+2)",
    remote: true,
    availableFor: [
      "Remote work",
      "International speaking",
      "Conference organization",
    ],
  },

  // Currently Learning
  learning: [
    "Security and Artificial Intelligence",
    "People management",
    "Communication",
  ],

  // Working On
  workingOn: ["RedCarbon", "SH Branches: bringing events all over the world"],

  // Hobbies & Interests
  hobbies: {
    sports: {
      name: "Football/Soccer",
      emoji: "⚽",
      details: "Playing and watching calcio",
    },
    cooking: {
      name: "BBQ & Grilling",
      emoji: "🍖",
      details: "Weekend BBQ master",
    },
    gaming: {
      name: "Video Gaming",
      emoji: "🎮",
      currentlyPlaying: ["Ghost of Tsushima"],
    },
    boardGaming: {
      name: "Board Gaming",
      emoji: "🎲",
      details: "Modern board games enthusiast",
      currentlyPlaying: ["The Witcher: Path of Destiny"],
    },
    roleplay: {
      name: "Tabletop RPG",
      emoji: "🐉",
      details: "D&D 5e player & occasional DM",
      currentCampaign: "An ongoing D&D 5e campaign",
    },
    music: {
      name: "Music",
      emoji: "🎵",
      details: "Rock, Metal, Soundtracks, and more",
      playlistUrl:
        "https://open.spotify.com/playlist/1qLEh5nRfgkelDOQqBScxE?si=de08590bfe4f4eee",
      playlistName: "Various",
    },
  },
};

export type NowInfo = typeof nowInfo;
