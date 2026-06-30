/* ==========================================================================
   Animal Health Center & Pet Resort — Sample 3
   animations.js — moderate & elegant motion. Gentle parallax, soft floats,
   scroll reveals, auto-scroll marquees. Loads AFTER widgets.js.
   Safety net: reduced-motion OR no-GSAP -> force [data-anim] visible.
   ========================================================================== */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  function revealAll() {
    $$("[data-anim],[data-hero-line],[data-hero-star]").forEach(function (el) {
      el.style.opacity = "1"; el.style.transform = "none";
    });
  }
  if (reduce || !window.gsap || !window.ScrollTrigger) { revealAll(); return; }

  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  /* ---- scroll reveals (soft fade-up, staggered) ----
     Use fromTo + immediateRender:false (not plain `from`) so that if a
     ScrollTrigger ever mis-measures on mobile — late images/fonts reflow, a
     racing refresh — the element is never left frozen at opacity:0. The
     animated "from" frame is only applied once the trigger actually fires. ---- */
  $$('[data-anim="up"]').forEach(function (el) {
    gsap.fromTo(el, { y: 38, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", immediateRender: false, scrollTrigger: { trigger: el, start: "top 92%", once: true } });
  });
  $$('[data-anim="cards"]').forEach(function (g) {
    gsap.fromTo(g.children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power2.out", immediateRender: false, scrollTrigger: { trigger: g, start: "top 88%", once: true } });
  });

  /* ---- HERO duo: graceful entrance + gentle parallax (no mouse chaos) ----
     Use fromTo (not from) so a frozen first frame can't leave text invisible;
     and the elements are visible in CSS by default as a hard safety net. ---- */
  var hero = $("[data-hero]");
  if (hero) {
    gsap.fromTo("[data-hero-star]", { y: 60, opacity: 0, scale: .96 }, { y: 0, opacity: 1, scale: 1, duration: 1.1, stagger: .15, ease: "power3.out", delay: .1 });
    gsap.fromTo("[data-hero-line]", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .1, ease: "power2.out", delay: .15 });

    // subtle scroll parallax — each star drifts a touch at its own rate
    $$("[data-hero-star]").forEach(function (el) {
      var rate = parseFloat(el.getAttribute("data-rate")) || 8;
      gsap.to(el, { yPercent: rate, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
    });
    // gentle idle bob on the smaller star
    $$("[data-bob]").forEach(function (el, i) {
      gsap.to(el, { y: "-=12", duration: 3 + i * .4, ease: "sine.inOut", yoyo: true, repeat: -1 });
    });
  }

  /* ---- generic float drift on decorative cutouts ---- */
  $$('[data-float]').forEach(function (el) {
    var amt = parseFloat(el.getAttribute("data-float")) || 40;
    gsap.fromTo(el, { y: -amt / 2 }, { y: amt / 2, ease: "none", scrollTrigger: { trigger: el.closest("section"), start: "top bottom", end: "bottom top", scrub: true } });
  });

  /* ---- blobs drift slowly for life ---- */
  $$('[data-blob]').forEach(function (el, i) {
    gsap.to(el, { x: (i % 2 ? 26 : -26), y: (i % 2 ? -18 : 18), duration: 9 + i * 2, ease: "sine.inOut", yoyo: true, repeat: -1 });
  });

  /* ---- ranch section: photo background parallax + rope draw ----
     The cattle-department photo drifts slower than the page so it reads as
     depth behind the copy. yPercent (not background-attachment:fixed, which
     breaks on iOS) + scrub keeps it smooth and correct on every device. ---- */
  var ranch = $("[data-ranch]");
  if (ranch) {
    var ranchBg = $("[data-ranch-parallax]", ranch);
    if (ranchBg) {
      gsap.fromTo(ranchBg, { yPercent: -14 }, { yPercent: 14, ease: "none", scrollTrigger: { trigger: ranch, start: "top bottom", end: "bottom top", scrub: 0.5 } });
    }
    gsap.from($$("[data-lasso]", ranch), { scaleX: 0, transformOrigin: "left center", duration: 1, ease: "power2.out", scrollTrigger: { trigger: ranch, start: "top 76%" } });
  }

  /* ---- Day in the Life traveler ---- */
  var dil = $("[data-timeline]");
  if (dil) {
    var icon = $("[data-timeline-icon]", dil), track = $("[data-timeline-track]", dil), stations = $$("[data-timeline-station]", dil);
    if (icon && track) {
      var mob = window.matchMedia("(max-width:767px)").matches;
      gsap.to(icon, { x: function () { return mob ? 0 : track.offsetWidth - icon.offsetWidth; }, y: function () { return mob ? track.offsetHeight - icon.offsetHeight : 0; }, ease: "none",
        scrollTrigger: { trigger: dil, start: "top 65%", end: "+=120%", scrub: .4, onUpdate: function (self) {
          var idx = Math.round(self.progress * (stations.length - 1)); stations.forEach(function (s, i) { s.classList.toggle("is-past", i <= idx); }); } } });
    }
  }

  /* ---- auto-scroll tracks (reviews + marquee) ---- */
  $$("[data-autoscroll]").forEach(function (track) {
    var dur = parseFloat(track.getAttribute("data-autoscroll")) || 36;
    var loop = gsap.to(track, { xPercent: -50, ease: "none", duration: dur, repeat: -1 });
    var host = track.closest("[data-carousel]") || track.parentElement;
    host.addEventListener("mouseenter", function () { loop.pause(); });
    host.addEventListener("mouseleave", function () { loop.resume(); });
    host.addEventListener("touchstart", function () { loop.pause(); }, { passive: true });
    host.addEventListener("touchend", function () { loop.resume(); }, { passive: true });
  });

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
