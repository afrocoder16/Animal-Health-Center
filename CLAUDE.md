# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The production marketing website for **Animal Health Center & Pet Resort**, a real local
store in Marshall, MN — a "one stop shop" for both pets and livestock (retail store + pet
resort boarding/daycare + on-staff grooming). Treat the current HTML copy as the source
of truth.

Plain **HTML + CSS + JavaScript** using the **Tailwind CDN** for utility classes and
**GSAP + ScrollTrigger** (CDN) for scroll animations. No build step, no package manager,
no tests, no framework.

## Running it

Static site — open `index.html` directly, or serve the folder for correct relative paths:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

There is nothing to build, lint, or test. "Deploy" = copy the public files (HTML +
`css/`, `js/`, `img/`, `robots.txt`) to any static host. Do **not** deploy `files/`
(internal business docs), `README.md`, `CLAUDE.md`, `.vscode/`, or `.git/`.

## Architecture

A multi-page static site at the repo **root** (9 HTML files). Every page shares one
stylesheet and the same three scripts. The shared page chrome (top bar / floating nav /
footer / sticky book bar) is **not inline** — it is generated once in `js/chrome.js`
and injected at runtime, so edit the nav or footer **there**, not per page.

Pages (all linked from the homepage; the injected nav shows four links + logo/home, with
Gallery added in the mobile drawer):

- `index.html` — homepage (diagonal-slice hero, routing tiles, weekly deals + loyalty
  teaser, Pet Resort highlight, livestock section, reviews, KennelBooker app, about, CTA).
- `about.html` — about + team + the demo contact form (`data-widget="contact"`).
- `resort.html` — Pet Resort (boarding + daycare).
- `gallery.html` — photo gallery.
- `livestock.html`, `small-animal.html`, `grooming.html` — service detail pages.
- `services.html`, `promotions.html` — supporting pages linked from the homepage.

> The former Gift Shop pages (`gift-shop.html`, `gift-shop-store.html`) were removed
> before launch (July 2026), along with their CSS blocks and imagery. Don't reintroduce
> links to them.

- `css/custom.css` — plain CSS holding the design system and every custom component
  (Tailwind CDN can't process `@apply`/`@layer` from a `.css` file, so components are
  hand-written here). Design tokens live in `:root` at the top (palette, easings, shadows).
  Per-page Tailwind color/font aliases (`cream`, `ink`, `teal`, `amber`, `forest`, …,
  `heading`/`body` fonts) are configured inline in each HTML `<head>` via `tailwind.config`.
- `js/chrome.js` — one IIFE that holds the shared chrome markup as strings (TOPBAR, NAV,
  FOOTER, STICKYBAR) and injects it: top bar + nav synchronously right after the script tag
  (so nav paints before `<main>`), footer + sticky bar after `DOMContentLoaded`. Loaded
  **synchronously in `<head>`**, before the deferred scripts. Each page's `<body>` sets
  `data-page="…"` (drives nav highlighting) and, when the nav doesn't float over a hero,
  `data-nav-spacer` (adds a spacer below the fixed nav).
- `js/widgets.js` — one IIFE (`"use strict"`) wiring all non-animation interactions:
  live open/closed hours badge, mobile menu, sticky floating header, sticky "Book a Stay"
  bar, booking links, contact-form demo, the hero photo rotator (`data-photo-rotate`),
  and other per-page widgets (`data-widget="…"`). Deferred.
- `js/animations.js` — GSAP/ScrollTrigger reveals and motion. Deferred, after `widgets.js`.

### Conventions that matter

- **Scroll reveals**: add `data-anim="up"` to fade/slide an element in on scroll, or
  `data-anim="cards"` on a container to stagger its children. `animations.js` drives these.
  Hero text uses `data-hero-line` (staggered entrance). Decorative drift uses `data-blob` /
  `data-float`.
- **Reduced motion is a hard safety net**: if `prefers-reduced-motion` is set OR GSAP fails
  to load, `animations.js` calls `revealAll()` and forces every `[data-anim]`/`[data-hero-line]`
  visible immediately. Keep any new animation behind this guard, and make content readable
  without JS.
- **The homepage marquee strip** ("Dogs · Cats · … All under one roof") is a pure-CSS
  animation. Its layout rules are duplicated in `custom.css` (`.marquee-track`/`.marquee-set`)
  so it paints correctly before the Tailwind CDN runs, and it holds **six identical sets**
  so the `-50%` keyframe loop never shows a blank gap on wide screens. Keep all six in sync
  if the word list changes.
- **Design language**: warm palette (cream, ink, teal, amber, forest, rust), **Nunito** for
  headings (`font-heading`, `.display`) and **Inter** for body. Buttons use `.btn` +
  `.btn--amber|--teal|--ink|--ghost|--ghost-light`. Reusable bits: `.card`/`.card-lift`,
  `.service-kicker`, `.feature-li`, `.pet-tile`, `.paw-divider`, `.deal-card`, `.route-tag`.
- **Copy style**: no em dashes or en dashes anywhere in page copy — use "to", commas, or
  plain words. Keep this when editing or adding content.
- **Booking** is an external KennelBooker link, applied at runtime by `widgets.js` to every
  `[data-book]` element (`CONFIG.kennelBooker` at the top of the file). It is not an
  in-house feature.
- **The contact form is a demo** (`about.html`) — `widgets.js` validates with the native
  Constraint Validation API and simulates success; nothing is sent. The grooming quote form
  (`grooming.html`) behaves the same until its `action` placeholder is replaced with a real
  form-service endpoint. Wire these up to make them real.
- **Loyalty punch cards** (`resort.html`, `promotions.html`) are static sample displays:
  markup sets `data-active="true"` and `widgets.js` renders a fixed sample fill, labeled
  as a sample in the page copy. There is no account lookup.

### Images

All images live in `img/` (mostly `.webp` now, plus some `.png`; cutout PNGs under
`img/transparent/`, with a few grouping subfolders) and are referenced by relative path
from the HTML (`img/<file>`), either as `<img src>` or inline
`style="background-image:url('img/…')"`. Filenames are lowercase kebab-case
(`about-dog-cat.webp`, `boarding-kennel-row.webp`, `transparent/wall-pic2.png`).
`img/` is kept lean — only files actually referenced by the site are present. If you
remove a section, delete the images that are no longer referenced anywhere (they remain
in git history).

## Non-public files

`files/` holds internal Midvora business documents (proposal, hosting brief, tech
standards). They are not part of the site and must never be uploaded to the web host or
linked from any page.
