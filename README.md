# Animal Health Center & Pet Resort

Marketing website for **Animal Health Center & Pet Resort** in Marshall, MN — Southwest
Minnesota's one-stop shop for pets and livestock: a full retail store, a pet resort for
boarding and daycare, and on-staff grooming.

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
├── livestock.html          # Livestock supplies
├── small-animal.html       # Dog & cat supplies
├── grooming.html           # Grooming
├── services.html           # Services overview
├── promotions.html         # Promotions & loyalty rewards
├── gallery.html            # Photo gallery
├── robots.txt              # Allow-all robots file
├── css/
│   └── custom.css          # Design system + all custom components
├── js/
│   ├── chrome.js           # Shared top bar / nav / footer / sticky bar (injected)
│   ├── widgets.js          # Interactions (menu, hours badge, booking, forms, …)
│   └── animations.js       # GSAP scroll reveals & motion
└── img/                    # Site imagery (img/transparent/ holds cutout PNGs)
```

Shared chrome (top bar, nav, footer, sticky book bar) is generated in `js/chrome.js` and
injected at runtime — edit the nav or footer there once and every page picks it up.

## Run locally

Serve the folder so relative paths resolve correctly:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly in a browser also works for a quick look.

## Deploy

It is a static site: upload **only** the public files — the HTML files plus `css/`, `js/`,
`img/`, and `robots.txt` — to any static host (Netlify, Vercel, GitHub Pages, S3,
traditional shared hosting, etc.). No build or server runtime is required.

Do **not** upload `files/` (internal business documents), `README.md`, `CLAUDE.md`,
`.vscode/`, or the `.git/` directory.

## Notes

- **Booking** uses an external KennelBooker link, wired at runtime by `js/widgets.js`.
- **The grooming quote form** (`grooming.html`) is live: it POSTs to Web3Forms via
  `fetch`, which emails the submission to the address on the Web3Forms account that
  owns the access key in the form markup. Change the recipient in the Web3Forms
  dashboard, not in the code.
- **The contact form** (on `about.html`) is still front-end only and does not send
  anywhere; wire it the same way to go live.
- Page copy intentionally avoids em/en dashes; keep that style when editing content.
