import type { ShelfDocument } from "../lib/shelf";

// Invented data. Nothing here belongs to the owner's real library: it is a
// showcase document shaped to exercise every branch the /shelf Rendering has
// (two verbs, an abandonment with a score, an abandonment without one, a
// cover-less entry, a Type counting zero volumes, an uncatalogued volume, a
// pass with no dates at either end, a volume standing at one instalment, an
// omnibus standing at a range, and a standalone object standing nowhere).
//
// It lives on the test side of the repo on purpose. The production fallback,
// src/content/shelf.fallback.json, is a real snapshot taken from tsundoku with
// `pnpm shelf:snapshot`, and the page must never be able to publish these rows
// under the owner's name: readContentJson only reaches src/content, so a module
// here cannot be rendered by anything the site serves.
//
// Typed as ShelfDocument rather than parsed at runtime, so a drift between this
// fixture and the contract in src/lib/shelf.ts is a type error.
export const shelfFixture: ShelfDocument = {
  generatedAt: "2026-09-12T18:00:00.000Z",
  now: [
    {
      id: "pass-berserk-14",
      title: "Berserk, Vol. 14",
      type: {
        slug: "manga",
        label: "Manga",
        verb: "read",
        verbBase: "read",
      },
      medium: {
        slug: "paper",
        label: "Paper",
      },
      startedAt: "2026-09-02",
      standsAt: { from: 14, to: 14, unit: "instalments" },
      progress: {
        reached: 7,
        total: 20,
        unit: "instalments",
      },
      cover: {
        url: "https://covers.example.org/berserk-14.jpg",
        source: "looked-up",
        at: "https://books.example.org/volume/berserk-14",
      },
      series: {
        name: "Berserk",
        tint: "oklch(0.42 0.09 25)",
      },
    },
    {
      id: "pass-pillars",
      title: "The Pillars of the Earth",
      type: {
        slug: "novel",
        label: "Novel",
        verb: "read",
        verbBase: "read",
      },
      medium: {
        slug: "e-reader",
        label: "E-reader",
      },
      startedAt: null,
      standsAt: null,
      progress: null,
      cover: {
        url: "https://covers.example.org/pillars.jpg",
        source: "owner",
        at: null,
      },
      series: null,
    },
    {
      id: "pass-crimson-desert",
      title: "Crimson Desert",
      type: {
        slug: "videogame",
        label: "Videogame",
        verb: "played",
        verbBase: "play",
      },
      medium: {
        slug: "playstation-5",
        label: "PlayStation 5",
      },
      startedAt: "2026-07-28",
      standsAt: null,
      progress: {
        reached: 22,
        total: 40,
        unit: "instalments",
      },
      cover: {
        url: "https://covers.example.org/crimson-desert.jpg",
        source: "looked-up",
        at: "https://books.example.org/volume/crimson-desert",
      },
      series: null,
    },
  ],
  finished: {
    count: 41,
    recent: [
      {
        id: "pass-ghost-of-tsushima",
        title: "Ghost of Tsushima",
        type: {
          slug: "videogame",
          label: "Videogame",
          verb: "played",
          verbBase: "play",
        },
        medium: {
          slug: "playstation-5",
          label: "PlayStation 5",
        },
        startedAt: "2026-05-04",
        standsAt: null,
        endedAt: "2026-08-30",
        outcome: "finished",
        rating: {
          score: 9,
        },
        progress: {
          reached: 40,
          total: 40,
          unit: "instalments",
        },
        cover: {
          url: "https://covers.example.org/ghost-of-tsushima.jpg",
          source: "looked-up",
          at: "https://books.example.org/volume/ghost-of-tsushima",
        },
        series: null,
      },
      {
        id: "pass-the-witcher-tower",
        title: "The Tower of the Swallow",
        type: {
          slug: "novel",
          label: "Novel",
          verb: "read",
          verbBase: "read",
        },
        medium: {
          slug: "paper",
          label: "Paper",
        },
        startedAt: "2026-06-19",
        standsAt: null,
        endedAt: "2026-08-14",
        outcome: "given-up",
        rating: {
          score: 4,
        },
        progress: {
          reached: 3,
          total: 8,
          unit: "instalments",
        },
        cover: null,
        series: {
          name: "The Witcher",
          tint: "oklch(0.45 0.05 145)",
        },
      },
      {
        id: "pass-vinland-saga-9",
        title: "Vinland Saga, Vol. 9",
        type: {
          slug: "manga",
          label: "Manga",
          verb: "read",
          verbBase: "read",
        },
        medium: {
          slug: "paper",
          label: "Paper",
        },
        startedAt: null,
        standsAt: { from: 9, to: 9, unit: "instalments" },
        endedAt: null,
        outcome: "given-up",
        rating: null,
        progress: null,
        cover: {
          url: "https://covers.example.org/vinland-9.jpg",
          source: "looked-up",
          at: "https://books.example.org/volume/vinland-9",
        },
        series: {
          name: "Vinland Saga",
          tint: "oklch(0.44 0.06 245)",
        },
      },
    ],
  },
  pile: {
    count: 31,
    byType: [
      {
        type: {
          slug: "manga",
          label: "Manga",
          verb: "read",
          verbBase: "read",
        },
        count: 18,
      },
      {
        type: {
          slug: "novel",
          label: "Novel",
          verb: "read",
          verbBase: "read",
        },
        count: 9,
      },
      {
        type: {
          slug: "videogame",
          label: "Videogame",
          verb: "played",
          verbBase: "play",
        },
        count: 4,
      },
    ],
    recent: [
      {
        id: "vol-monster-3",
        title: "Monster, Vol. 3",
        standsAt: { from: 3, to: 3, unit: "instalments" },
        type: {
          slug: "manga",
          label: "Manga",
          verb: "read",
          verbBase: "read",
        },
        cover: {
          url: "https://covers.example.org/monster-3.jpg",
          source: "looked-up",
          at: "https://books.example.org/volume/monster-3",
        },
        series: {
          name: "Monster",
          tint: "oklch(0.43 0.07 315)",
        },
      },
      {
        id: "vol-dune-messiah",
        title: "Dune Messiah",
        standsAt: null,
        type: {
          slug: "novel",
          label: "Novel",
          verb: "read",
          verbBase: "read",
        },
        cover: null,
        series: {
          name: "Dune",
          tint: "oklch(0.52 0.10 70)",
        },
      },
      {
        id: "vol-elden-ring",
        title: "Elden Ring",
        standsAt: null,
        type: {
          slug: "videogame",
          label: "Videogame",
          verb: "played",
          verbBase: "play",
        },
        cover: {
          url: "https://covers.example.org/elden-ring.jpg",
          source: "owner",
          at: null,
        },
        series: null,
      },
    ],
  },
  shelf: {
    total: 372,
    byType: [
      {
        type: {
          slug: "manga",
          label: "Manga",
          verb: "read",
          verbBase: "read",
        },
        count: 248,
      },
      {
        type: {
          slug: "novel",
          label: "Novel",
          verb: "read",
          verbBase: "read",
        },
        count: 121,
      },
      {
        type: {
          slug: "videogame",
          label: "Videogame",
          verb: "played",
          verbBase: "play",
        },
        count: 0,
      },
    ],
    volumes: [
      {
        id: "vol-berserk-14",
        title: "Berserk, Vol. 14",
        standsAt: null,
        type: {
          slug: "manga",
          label: "Manga",
          verb: "read",
          verbBase: "read",
        },
        cover: {
          url: "https://covers.example.org/berserk-14.jpg",
          source: "looked-up",
          at: "https://books.example.org/volume/berserk-14",
        },
        series: {
          name: "Berserk",
          tint: "oklch(0.42 0.09 25)",
        },
      },
      {
        id: "vol-vinland-9",
        title: "Vinland Saga, Vol. 9",
        standsAt: null,
        type: {
          slug: "manga",
          label: "Manga",
          verb: "read",
          verbBase: "read",
        },
        cover: {
          url: "https://covers.example.org/vinland-9.jpg",
          source: "looked-up",
          at: "https://books.example.org/volume/vinland-9",
        },
        series: {
          name: "Vinland Saga",
          tint: "oklch(0.44 0.06 245)",
        },
      },
      {
        id: "vol-monster-3",
        title: "Monster, Vol. 3",
        standsAt: { from: 3, to: 3, unit: "instalments" },
        type: {
          slug: "manga",
          label: "Manga",
          verb: "read",
          verbBase: "read",
        },
        cover: {
          url: "https://covers.example.org/monster-3.jpg",
          source: "looked-up",
          at: "https://books.example.org/volume/monster-3",
        },
        series: {
          name: "Monster",
          tint: "oklch(0.43 0.07 315)",
        },
      },
      {
        id: "vol-pillars",
        title: "The Pillars of the Earth",
        standsAt: null,
        type: {
          slug: "novel",
          label: "Novel",
          verb: "read",
          verbBase: "read",
        },
        cover: {
          url: "https://covers.example.org/pillars.jpg",
          source: "owner",
          at: null,
        },
        series: null,
      },
      {
        id: "vol-dune-messiah",
        title: "Dune Messiah",
        standsAt: null,
        type: {
          slug: "novel",
          label: "Novel",
          verb: "read",
          verbBase: "read",
        },
        cover: null,
        series: {
          name: "Dune",
          tint: "oklch(0.52 0.10 70)",
        },
      },
      {
        id: "vol-tower-swallow",
        title: "The Tower of the Swallow",
        standsAt: null,
        type: {
          slug: "novel",
          label: "Novel",
          verb: "read",
          verbBase: "read",
        },
        cover: null,
        series: {
          name: "The Witcher",
          tint: "oklch(0.45 0.05 145)",
        },
      },
      {
        id: "vol-slam-dunk-7",
        title: "Slam Dunk 7",
        standsAt: { from: 7, to: 7, unit: "instalments" },
        type: {
          slug: "manga",
          label: "Manga",
          verb: "read",
          verbBase: "read",
        },
        cover: null,
        series: {
          name: "Slam Dunk",
          tint: "oklch(0.47 0.08 55)",
        },
      },
      {
        id: "vol-slam-dunk-omnibus",
        title: "Slam Dunk 1-3",
        standsAt: { from: 1, to: 3, unit: "instalments" },
        type: {
          slug: "manga",
          label: "Manga",
          verb: "read",
          verbBase: "read",
        },
        cover: null,
        series: {
          name: "Slam Dunk",
          tint: "oklch(0.47 0.08 55)",
        },
      },
      {
        id: "vol-uncatalogued-box",
        title: "Unlabelled box, bought at Lucca",
        standsAt: null,
        type: null,
        cover: null,
        series: null,
      },
    ],
  },
};
