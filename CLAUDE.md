# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A marketing website for **Animal Health Center**, a real local store in Marshall, MN — a "one stop shop" for both pets and livestock (retail store + pet resort boarding/daycare + on-staff grooming). Despite the git history mentioning a "cattle & livestock veterinary site," the live content is the broader pets-and-livestock store; treat the current HTML copy as the source of truth, not the commit messages or the root `README.md` (which is stale boilerplate from an earlier concept).

Plain **HTML + CSS + JavaScript**. No framework, no build step, no package manager, no tests.

## Running it

Static site — open `index.html` directly, or serve the folder to get correct relative-path behavior:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

There is nothing to build, lint, or test. "Deploy" = copy the files to any static host.

## Architecture

The production site is the **root** folder. It is a multi-page static site where every page shares one stylesheet and one script:

- `index.html` — the long single-scroll homepage (hero, trust stats, about, services, programs accordion, approach timeline, testimonials carousel, team, CTA, contact form, footer).
- `boarding.html`, `daycare.html`, `grooming.html`, `livestock.html`, `pets.html` — service detail pages. Each is a standalone full page that **reuses the same `css/styles.css` and `js/main.js`** and repeats the shared top bar / nav / preloader / footer markup. There is no templating or include mechanism — shared chrome is duplicated in each file, so a change to the nav or footer must be applied to all six HTML files.
- `css/styles.css` — the entire design system and every component, in one file (~37 KB). Design tokens live in `:root` at the top (palette, radii, shadows, easings, fonts, `--container`). Sections are organized top-to-bottom roughly in page order. Edit tokens here to re-theme globally.
- `js/main.js` — one IIFE (`"use strict"`) wiring all interactions: preloader, footer year, sticky-nav shadow, mobile menu, scroll progress + back-to-top, `IntersectionObserver`-driven reveals/counters/metric-bars, testimonials carousel, hero parallax, in-page smooth-scroll with sticky-nav offset, and the contact form handler.

### Conventions that matter

- **Scroll reveals**: add `data-reveal` to any element to fade/slide it in on scroll; add `data-delay="120"` (milliseconds) to stagger. `main.js` reads these attributes and toggles the `is-in` class. No reveal fires under `prefers-reduced-motion` — elements are shown immediately instead.
- **Animated counters**: an element with `data-count="25"` (optional `data-suffix="+"`) counts up from 0 when scrolled into view.
- **`prefers-reduced-motion` is honored throughout** both CSS and JS (carousel autoplay, parallax, smooth scroll, and all reveals are disabled). Keep new animations behind the same guard.
- **BEM-ish class naming**: `block__element--modifier` (e.g. `hero__title--accent`, `btn--gold`, `section--dark`). Follow it for new components.
- **The contact form is a demo** — `main.js` validates with the native Constraint Validation API and simulates a successful submit with a `setTimeout`; nothing is sent anywhere. To make it real, wire the `#contactForm` submit handler to a backend or form service.
- **Pet Resort booking** is an external KennelBooker link (the `kennelbooker.com/clientlogin.aspx?id=...` URL repeated across pages), not an in-house feature.

### Images (important gotcha)

Images live in `images/` and are referenced **only from `css/styles.css`** via `url("../images/<file>")` as `background-image`s (the `<img>`-free, CSS-background approach). Two things to know:

- `images/README.md` documents an *intended* filename scheme (`hero.jpg`, `about-main.jpg`, `team-1.jpg`, `cta.jpg`, …). The CSS does **not** all match that scheme — it currently points at the actual delivered files (`hero.png`, `dog_cat.png`, `Theresa.png`, `Dr. Scott.png`, `store.png`, `team.png`). If you swap imagery, update the `url(...)` paths in `styles.css` to match real filenames rather than trusting the README table.
- A few references still point at files that aren't present yet (e.g. `team-4.jpg`, `cta.jpg`); those slots fall back to a solid color until the file is added. This is expected, not a bug to "fix" by inventing assets.

## `sample_two/` and `sample_three/`

These are **alternate design concepts**, not part of the production site and not linked from it:

- `sample_two/` — a complete, self-contained second design (bold navy/`Bricolage Grotesque + Inter` look) with its **own** `css/styles.css`, `js/main.js`, and image folders (`assets/`, `pics/`). It does not share anything with the root site; edit it in isolation.
- `sample_three/` — currently just an empty `img/` folder (a placeholder concept).

When asked to change "the site," default to the **root** files unless the user names a sample. Don't let edits leak between the root site and `sample_two/`.
