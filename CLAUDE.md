# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The production marketing website for **Animal Health Center & Pet Resort**, a real local
store in Marshall, MN — a "one stop shop" for both pets and livestock (retail store + pet
resort boarding/daycare + on-staff grooming + an in-store gift shop). Treat the current
HTML copy as the source of truth.

Plain **HTML + CSS + JavaScript** using the **Tailwind CDN** for utility classes and
**GSAP + ScrollTrigger** (CDN) for scroll animations. No build step, no package manager,
no tests, no framework.

> Earlier exploratory designs and the previous site live under `_archive/` and are **not**
> part of the production site. Don't edit or link to anything in `_archive/`.

## Running it

Static site — open `index.html` directly, or serve the folder for correct relative paths:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

There is nothing to build, lint, or test. "Deploy" = copy the root files (HTML + `css/`,
`js/`, `img/`) to any static host.

## Architecture

A multi-page static site at the repo **root** (11 HTML files). Every page shares one
stylesheet and the same three scripts. The shared page chrome (top bar / floating nav /
footer / sticky book bar) is **no longer inline** — it is generated once in `js/chrome.js`
and injected at runtime, so edit the nav or footer **there**, not per page.

> Exception: `gift-shop-store.html` still carries its own inline chrome and does not load
> `chrome.js`. If you touch shared chrome, remember this page won't pick it up automatically.

Pages (all linked from the homepage; the injected nav shows four links + logo/home, with
Gallery added in the mobile drawer):

- `index.html` — homepage (hero slideshow, about, "who are you caring for" routing tiles,
  services, team, contact form).
- `about.html` — about + team + the demo contact form (`data-widget="contact"`).
- `resort.html` — Pet Resort (boarding + daycare).
- `gift-shop.html` — the Gift Shop (seasonal spotlight, Town & Country, the gallery-wall
  routing section, visit info). `gift-shop-store.html` is the standalone store/product page.
- `gallery.html` — photo gallery.
- `livestock.html`, `small-animal.html`, `grooming.html` — service detail pages.
- `services.html`, `promotions.html` — supporting pages linked from the homepage.

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
  bar, booking links, contact-form demo, the shop's seasonal photo rotator
  (`data-photo-rotate`), and other per-page widgets (`data-widget="…"`). Deferred.
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
- **Design language**: warm palette (cream, ink, teal, amber, forest, rust), **Nunito** for
  headings (`font-heading`, `.display`) and **Inter** for body. Buttons use `.btn` +
  `.btn--amber|--teal|--ink|--ghost|--ghost-light`. Reusable bits: `.card`/`.card-lift`,
  `.service-kicker`, `.feature-li`, `.pet-tile`, `.paw-divider`, `.hang-tag` (shop).
- **Copy style**: no em dashes or en dashes anywhere in page copy — use "to", commas, or
  plain words. Keep this when editing or adding content.
- **Booking** is an external KennelBooker link, applied at runtime by `widgets.js` to every
  `[data-book]` element (`KENNELBOOKER` constant at the top of the file). It is not an
  in-house feature.
- **The contact form is a demo** (`about.html`) — `widgets.js` validates with the native
  Constraint Validation API and simulates success; nothing is sent. Wire the handler to a
  backend or form service to make it real.

### Images

All images live in `img/` (mostly `.webp` now, plus some `.png`; cutout PNGs under
`img/transparent/`, with a few grouping subfolders) and are referenced by relative path
from the HTML (`img/<file>`), either as `<img src>` or inline
`style="background-image:url('img/…')"`. Filenames are lowercase kebab-case
(`about-dog-cat.webp`, `boarding-kennel-row.webp`, `transparent/wall-pic2.png`).
`img/` is kept lean — only files actually referenced by the site are present; surplus
source photos were moved to `_archive/unused-images/`.

## `_archive/`

Not part of the site. Holds the previous root site (`old-root-site/`), the earlier
alternate design (`sample_two/`), surplus source imagery (`unused-images/`), business docs
(`business-docs/`), and a copy of the old per-design git history
(`sample_three-nested-git/`). Safe to ignore; do not link to it from production pages.
