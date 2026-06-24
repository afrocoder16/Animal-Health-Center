# Animal Health Center

A modern, fully responsive marketing site for a cattle &amp; livestock veterinary
practice — built with **plain HTML, CSS, and JavaScript** (no frameworks, no build step).

> Healthier herds. Stronger future.

## ✨ Highlights

- **Premium design system** — pasture-green + prairie-gold palette, `Fraunces`
  display serif paired with `Manrope`, consistent spacing, radii, and shadows.
- **Cinematic hero** with layered gradient veil, grain texture, animated zoom,
  and subtle scroll parallax.
- **Scroll-reveal animations** via `IntersectionObserver` with staggered delays.
- **Animated stat counters** and metric bars that fill on view.
- **Sticky, blurred navigation** with an accessible slide-in mobile menu.
- **Auto-playing testimonial carousel** with dots and pause-on-hover.
- **Programs accordion**, four-step approach timeline, services & team grids.
- **Floating-label contact form** with inline validation and a demo submit flow.
- **Scroll-progress bar**, back-to-top button, and a brand preloader.
- **Accessible &amp; performant** — semantic markup, keyboard support,
  `prefers-reduced-motion` honored, fully responsive down to small phones.

## 📁 Structure

```
index.html        # All page sections (semantic markup)
css/styles.css    # Design system + components + responsive rules
js/main.js        # Nav, reveals, counters, carousel, parallax, form
```

## 🚀 Run it

It's a static site — just open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## 🛠 Customize

- **Colors / type** — edit the CSS custom properties in `:root` (`css/styles.css`).
- **Content** — section copy lives directly in `index.html`.
- **Photography** — image URLs are referenced in `css/styles.css`; swap them for
  your own ranch/herd photography. Each image has a solid color fallback.
- **Contact form** — `js/main.js` currently simulates submission; wire the
  `submit` handler to your backend or a form service.
