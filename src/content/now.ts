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
  lastUpdated: "October 2025",

  // Current Role
  currentRole: {
    title: "Software Engineer",
    company: "RedCarbon", // Update with your actual company
    companyLogo: "/logos/redcarbon.png", // Path to logo in public/logos/
    location: "Remote / Verona, Italy",
    description: "Leading the development of the AI Cyber Security platform",
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

  // Optional: What you're reading
  reading: [
    {
      title: "Platform Engineering on Kubernetes",
      author: "Maurício Salatino",
      status: "reading", // or "finished"
    },
    // Add more books
  ],

  // Optional: Currently excited about
  excitedAbout: [
    "WASM in the cloud",
    "AI/ML ops workflows",
    "Developer experience tools",
  ],

  // Hobbies & Interests
  hobbies: {
    sports: {
      name: "Football/Soccer",
      emoji: "⚽",
      details: "Playing and watching calcio", // or your favorite team
    },
    cooking: {
      name: "BBQ & Grilling",
      emoji: "🍖",
      details: "Weekend BBQ master",
    },
    gaming: {
      name: "Video Gaming",
      emoji: "🎮",
      currentlyPlaying: ["Clair Obscur: Expedition 33"],
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
      currentCampaign: "2 D&D 5e campaigns", // Update with your campaign!
    },
    music: {
      name: "Music",
      emoji: "🎵",
      details: "Rock, Metal, Soundtracks, and more",
      playlistUrl:
        "https://open.spotify.com/playlist/1qLEh5nRfgkelDOQqBScxE?si=de08590bfe4f4eee", // Update with your actual playlist!
      playlistName: "Various", // Name of your playlist
    },
  },
};

export type NowInfo = typeof nowInfo;
