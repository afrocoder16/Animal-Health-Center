# Animal Health Center & Pet Resort

Marketing website for **Animal Health Center & Pet Resort** in Marshall, MN — Southwest
Minnesota's one-stop shop for pets and livestock: a full retail store, a pet resort for
boarding and daycare, on-staff grooming, and an in-store gift shop.

A fast, static, multi-page site. No build step, no framework, no dependencies to install.

## Tech

- **HTML + CSS + JavaScript** (vanilla)
- **Tailwind** via CDN for utility classes
- **GSAP + ScrollTrigger** via CDN for scroll animations
- **Nunito** (headings) + **Inter** (body) via Google Fonts

## Project structure

```
.
├── index.html              # Homepage
├── about.html              # About + team + contact form
├── resort.html             # Pet Resort (boarding & daycare)
├── shop.html               # Gift Shop
├── livestock.html          # Livestock supplies
├── small-animal.html       # Dog & cat supplies
├── grooming.html           # Grooming
├── services.html           # Services overview
├── promotions.html         # Promotions
├── css/
│   └── custom.css          # Design system + all custom components
├── js/
│   ├── widgets.js          # Interactions (menu, hours badge, booking, forms, …)
│   └── animations.js       # GSAP scroll reveals & motion
├── img/                    # Site imagery (img/transparent/ holds cutout PNGs)
└── _archive/               # Previous designs & source material (not part of the site)
```

Shared chrome (top bar, nav, footer, sticky book bar) is duplicated inline in each page —
there is no templating, so nav/footer edits must be applied across all pages.

## Run locally

Serve the folder so relative paths resolve correctly:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly in a browser also works for a quick look.

## Deploy

It is a static site: upload the repository root (the HTML files plus `css/`, `js/`, `img/`)
to any static host (Netlify, Vercel, GitHub Pages, S3, traditional shared hosting, etc.).
No build or server runtime is required. The `_archive/` folder does not need to be deployed.

## Notes

- **Booking** uses an external KennelBooker link, wired at runtime by `js/widgets.js`.
- **The contact form** (on `about.html`) is currently a front-end demo and does not send
  anywhere; connect it to a backend or form service to go live.
- Page copy intentionally avoids em/en dashes; keep that style when editing content.
