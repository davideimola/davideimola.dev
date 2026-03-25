# Design System

## Philosophy

Dark, terminal-inspired aesthetic. Not a literal terminal, but the feeling of precision and control. Influenced by Japanese minimalism (ma/間 — negative space as a design element). Akane Red is used sparingly as the single accent.

## Palette

| Name | Variable | Value | Usage |
|------|----------|-------|-------|
| Background | `--bg` | `#080807` | Page background |
| Card background | `--bg-card` | `#0F0E0D` | Cards, nav background |
| Hover background | `--bg-hover` | `#141311` | Hover state background |
| Border | `--border` | `#1C1A18` | Default borders |
| Border mid | `--border-mid` | `#252220` | Stronger borders |
| Border hover | `--border-hover` | `rgba(201,31,55,.30)` | Card hover border |
| Text primary | `--text-1` | `#EAE5DF` | Headings, primary content |
| Text secondary | `--text-2` | `#9A948E` | Body text, descriptions |
| Text muted | `--text-3` | `#4E4A46` | Labels, metadata, nav links |
| Akane Red | `--accent` | `#C91F37` | Interactive elements, `//` prefix |
| Akane hover | `--accent-hover` | `#a8192e` | Accent hover state |
| Akane glow | `--accent-glow` | `rgba(201,31,55,.12)` | Card hover overlay |

### Usage rules

- `--accent` (Akane Red) is an accent only. Never use as a large fill or background.
- Valid accent uses: `//` section prefix, active badge, cursor blink, corner decoration, button fill (small), link hover, dot separator.
- The dot grid (`body::before`) is at 35% opacity — subtle texture, not a statement.

## Typography

### Fonts

| Font | Variable | CSS var | Role |
|------|----------|---------|------|
| JetBrains Mono | `--font-jetbrains-mono` | `--font-mono` | Headings, UI labels, code, nav, buttons |
| IBM Plex Sans | `--font-ibm-plex-sans` | `--font-sans` | Body text, descriptions, prose |

### Scale

| Use case | Size | Weight | Class |
|----------|------|--------|-------|
| Hero name | `clamp(42px, 7vw, 72px)` | 700 | `text-[clamp(42px,7vw,72px)] font-bold font-mono` |
| Section title | 11px | 500 | `text-[11px] font-medium font-mono tracking-[0.12em] uppercase` |
| Card title | 16px | 600 | `text-[16px] font-semibold font-mono` |
| Nav links | 11px | 400 | `text-[11px] font-mono tracking-[0.04em] lowercase` |
| Body | 15px | 400 | `text-[15px] font-sans` |
| Small/meta | 11px | 400 | `text-[11px] font-mono` |
| Badge | 10px | 500 | `text-[10px] font-mono tracking-[0.08em] uppercase` |
| Button | 12px | 500 | `text-[12px] font-mono font-medium` |

## Spacing scale

Use Tailwind's default spacing scale. Key values in use:

- Section padding: `py-20` (80px)
- Container max-width: `max-w-[860px] mx-auto px-8`
- Card padding: `p-6`
- Hero padding: `pt-40 pb-30`
- Section header margin-bottom: `mb-12`
- Gap between grid items: `gap-3`

## Components

### Button

Two variants:
- `primary` — Akane Red fill, white text. Use for the main CTA.
- `ghost` — transparent, `--border-mid` border, `--text-2` color. Use for secondary actions.

Three sizes: `sm`, `md` (default), `lg`.

```tsx
<Button variant="primary">Read the blog →</Button>
<Button variant="ghost">View talks →</Button>
<ButtonLink variant="primary" href="/blog">Read the blog →</ButtonLink>
```

### Badge

Four variants:
- `default` / `active` — dark pill, muted text. For category labels and active state.
- `coming-soon` — Akane glow background with Akane border. For upcoming projects.
- `category` — same as default. For blog/project categories.

```tsx
<Badge variant="active">Community · Active</Badge>
<Badge variant="coming-soon">Coming soon</Badge>
<Badge variant="category">Security</Badge>
```

### Card

Base card with optional hover glow effect (Akane border + overlay on hover).

- `hoverable={true}` (default) — adds hover transition
- `href` prop — renders as an `<a>` tag

```tsx
<Card href="/projects/schrodinger-hat">
  <Badge variant="active">Active</Badge>
  <h3>Schrodinger Hat</h3>
  <p>Description…</p>
</Card>
```

### SectionHeader

`//` prefix in Akane Red + optional "see all" link aligned right.

```tsx
<SectionHeader title="Projects" seeAllHref="/projects" seeAllLabel="All projects →" />
<SectionHeader title="What I do" />
```

### NavBar

Fixed, blurred backdrop. `~/davideimola` logo (tilde in Akane), nav links, ⌘K button.
Requires `"use client"` for the search handler.

### Footer

Minimal: copyright + links (privacy, now, rss, source).

## Animation guidelines

- Transitions: `150ms` for color/border, `200ms` for background + opacity
- Hover translate: `translateX(3px)` on arrow icons
- Hero entrance: `fadeUp` animation (0.5s ease, staggered 100ms delays)
- Cursor blink: `blink` keyframe, 1.1s step-end infinite
- Scroll reveal: IntersectionObserver, `opacity 0 → 1` + `translateY(12px → 0)`

Never use `transition-all` — be explicit about which properties transition.
