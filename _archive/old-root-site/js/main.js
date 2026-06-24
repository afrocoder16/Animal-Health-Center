/* ==========================================================================
   Animal Health Center — interactions
   ========================================================================== */
(function () {
  "use strict";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Preloader ---------- */
  window.addEventListener("load", () => {
    const pre = $("#preloader");
    if (pre) setTimeout(() => pre.classList.add("is-done"), 450);
  });

  /* ---------- Year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky nav shadow ---------- */
  const nav = $("#nav");
  const onScrollNav = () => nav && nav.classList.toggle("is-stuck", window.scrollY > 12);
  onScrollNav();

  /* ---------- Mobile menu ---------- */
  const toggle = $("#navToggle");
  const links  = $("#navLinks");
  const closeMenu = () => {
    toggle.classList.remove("is-open");
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
    });
    $$("a", links).forEach(a => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
  }

  /* ---------- Scroll progress + back to top ---------- */
  const progress = $("#progress");
  const toTop = $("#toTop");
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if (progress) progress.style.width = pct + "%";
    if (toTop) toTop.classList.toggle("is-show", h.scrollTop > 600);
    onScrollNav();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" }));

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$("[data-reveal]");
  const applyDelays = el => {
    const d = el.getAttribute("data-delay");
    if (d) el.style.transitionDelay = d + "ms";
  };
  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          applyDelays(en.target);
          en.target.classList.add("is-in");
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("is-in"));
  }

  /* ---------- Animated counters ---------- */
  const counters = $$("[data-count]");
  const runCounter = el => {
    const target = parseFloat(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    const dur = 1600;
    const start = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * ease(p)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window && !prefersReduced) {
    const cio = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) { runCounter(en.target); obs.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(el => cio.observe(el));
  } else {
    counters.forEach(el => el.textContent = el.getAttribute("data-count") + (el.getAttribute("data-suffix") || ""));
  }

  /* ---------- Program bars fill on view ---------- */
  const bars = $$(".programs__bar");
  if ("IntersectionObserver" in window) {
    const bio = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("is-fill"); obs.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    bars.forEach(b => bio.observe(b));
  } else {
    bars.forEach(b => b.classList.add("is-fill"));
  }

  /* ---------- Testimonials carousel ---------- */
  const track = $("#quotesTrack");
  const dotsWrap = $("#quotesDots");
  if (track && dotsWrap) {
    const slides = $$(".quote", track);
    let idx = 0, timer = null;
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", "Show testimonial " + (i + 1));
      b.addEventListener("click", () => { go(i); restart(); });
      dotsWrap.appendChild(b);
    });
    const dots = $$("button", dotsWrap);
    const go = i => {
      idx = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, n) => d.classList.toggle("is-active", n === idx));
    };
    const next = () => go(idx + 1);
    const restart = () => { if (prefersReduced) return; clearInterval(timer); timer = setInterval(next, 6000); };
    go(0); restart();
    const sec = $("#testimonials");
    if (sec) {
      sec.addEventListener("mouseenter", () => clearInterval(timer));
      sec.addEventListener("mouseleave", restart);
    }
  }

  /* ---------- Hero parallax (subtle) ---------- */
  const heroImg = $(".hero__img");
  if (heroImg && !prefersReduced) {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 700);
        heroImg.style.transform = `scale(1.05) translateY(${y * 0.18}px)`;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Smooth-scroll for in-page links (offset for sticky nav) ---------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = (nav ? nav.offsetHeight : 0) + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
    });
  });

  /* ---------- Contact form (demo handler) ---------- */
  const form = $("#contactForm");
  const note = $("#formNote");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      note.className = "form__note";
      if (!form.checkValidity()) {
        note.textContent = "Please complete the required fields.";
        note.classList.add("is-err");
        form.reportValidity();
        return;
      }
      const btn = $(".form__submit", form);
      const label = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = "Sending…";
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = label;
        form.reset();
        note.textContent = "Thank you — we’ll be in touch within one business day.";
        note.classList.add("is-ok");
      }, 1100);
    });
  }
})();
