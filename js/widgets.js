/* ==========================================================================
   Animal Health Center & Pet Resort — Sample 3
   widgets.js — ALL shared interactive logic for every page.
   Each widget inits only if its anchor element exists on the page, so this
   one file is safe to load everywhere (guarded inits = no duplication).
   Classic IIFE (not a module) so it works from file:// too.
   ========================================================================== */
(function () {
  "use strict";

  /* ======================================================================
     CONFIG: values most likely to change. Edit here, nowhere else.
     Hours: keys are JS day numbers (0=Sun). Values are [openMins, closeMins]
     from midnight (480 = 8:00am, 1050 = 5:30pm, 720 = 12:00pm), or null for closed.
     ====================================================================== */
  var CONFIG = {
    kennelBooker: "https://www.kennelbooker.com/clientlogin.aspx?id=a0013ce4-96fa-44ef-9320-bb3de01b8c44",
    hours: {
      0: null,          // Sun closed
      1: [480, 1050],   // Mon
      2: [480, 1050],   // Tue
      3: [480, 1050],   // Wed
      4: [480, 1050],   // Thu
      5: [480, 1050],   // Fri
      6: [480, 720]     // Sat
    }
  };

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = function () { return !!window.gsap; };
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ======================================================================
     1. LIVE OPEN / CLOSED BADGE  (every page)
     ====================================================================== */
  var DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  function fmtTime(mins) {
    var h = Math.floor(mins / 60), m = mins % 60;
    var ap = h >= 12 ? "pm" : "am";
    var h12 = h % 12; if (h12 === 0) h12 = 12;
    return h12 + (m ? ":" + (m < 10 ? "0" + m : m) : "") + ap;
  }

  function nextOpenLabel(day, mins) {
    // rest of today?
    var t = CONFIG.hours[day];
    if (t && mins < t[0]) return "Opens today " + fmtTime(t[0]);
    // search the next 7 days
    for (var i = 1; i <= 7; i++) {
      var d = (day + i) % 7;
      var slot = CONFIG.hours[d];
      if (slot) {
        var when = i === 1 ? "tomorrow" : DAY_NAMES[d];
        return "Opens " + when + " " + fmtTime(slot[0]);
      }
    }
    return "Reopening soon";
  }

  function renderBadge() {
    var badges = $$("[data-hours-badge]");
    if (!badges.length) return;
    var now = new Date();
    var day = now.getDay();
    var mins = now.getHours() * 60 + now.getMinutes();
    var t = CONFIG.hours[day];
    var isOpen = !!t && mins >= t[0] && mins < t[1];
    var text, cls;
    if (isOpen) {
      text = "Open Now";
      cls = "hours-badge is-open";
    } else {
      text = "Closed · " + nextOpenLabel(day, mins);
      cls = "hours-badge is-closed";
    }
    badges.forEach(function (b) {
      b.textContent = text;
      b.className = cls + (b.dataset.hoursBadge === "inline" ? "" : "");
    });
  }

  /* ======================================================================
     TAB GROUP HELPER
     Handles the "one active, rest inactive" tab pattern shared by the pet
     filter, pricing toggle, and dept switcher. Sets is-active class and
     the given ARIA attribute on each tab, then calls onActivate(key).
     ====================================================================== */
  function initTabGroup(tabs, getKey, ariaAttr, onActivate) {
    function activate(key) {
      tabs.forEach(function (t) {
        var on = getKey(t) === key;
        t.classList.toggle("is-active", on);
        t.setAttribute(ariaAttr, on ? "true" : "false");
      });
      onActivate(key);
    }
    tabs.forEach(function (t) {
      t.addEventListener("click", function () { activate(getKey(t)); });
    });
    return activate;
  }

  /* ======================================================================
     2. PET PROFILE BUILDER  (home preview + shop.html)
     Tiles set the active category; [data-pet] items below are filtered.
     Items are scoped to the nearest [data-pet-scope] so the home preview and
     the full shop page don't fight each other.
     ====================================================================== */
  function initProfileBuilder(root) {
    var tiles = $$("[data-pet-tile]", root);
    var scope = root.closest("[data-pet-scope]") || document;
    var items = $$("[data-pet]", scope);
    if (!tiles.length) return;

    function labelFor(cat) {
      return ({ dog: "Dogs", cat: "Cats", horse: "Horses & Equine", farm: "Farm Animals" })[cat] || "All Animals";
    }

    function showFilter(cat) {
      var show = items.filter(function (i) {
        return cat === "all" || (" " + i.getAttribute("data-pet") + " ").indexOf(" " + cat + " ") > -1;
      });
      var hide = items.filter(function (i) { return show.indexOf(i) === -1; });

      if (hasGsap() && !reduce) {
        if (hide.length) {
          window.gsap.to(hide, {
            opacity: 0, y: 8, duration: 0.2, stagger: 0.02,
            onComplete: function () { hide.forEach(function (i) { i.hidden = true; }); refreshST(); }
          });
        }
        show.forEach(function (i) { i.hidden = false; });
        window.gsap.fromTo(show, { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, delay: 0.08, onComplete: refreshST });
      } else {
        items.forEach(function (i) { i.hidden = show.indexOf(i) === -1; });
        refreshST();
      }
      $$("[data-pet-label]", scope).forEach(function (el) { el.textContent = labelFor(cat); });
    }

    tiles.forEach(function (t) {
      t.setAttribute("role", "button");
      t.setAttribute("tabindex", "0");
      t.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(t.getAttribute("data-pet-tile")); }
      });
    });

    var activate = initTabGroup(tiles, function (t) { return t.getAttribute("data-pet-tile"); }, "aria-pressed", showFilter);
    activate(root.getAttribute("data-default") || "dog");
  }

  /* ======================================================================
     3. "IS MY PET READY" CHECKLIST  (resort.html)
     ====================================================================== */
  function initReadyCheck(root) {
    var boxes = $$('input[type="checkbox"][data-required]', root);
    var cta = $("[data-ready-cta]", root);
    var todo = $("[data-ready-todo]", root);
    if (!boxes.length || !cta) return;

    var link = cta.querySelector("a") || cta;
    if (link.tagName === "A") link.setAttribute("href", CONFIG.kennelBooker);

    function update() {
      var missing = boxes.filter(function (b) { return !b.checked; });
      var ready = missing.length === 0;
      cta.hidden = !ready;
      if (todo) {
        todo.hidden = ready;
        if (!ready) {
          var names = missing.map(function (b) { return b.getAttribute("data-label"); });
          todo.textContent = "Still to sort: " + names.join(", ") + ".";
        }
      }
      if (ready && hasGsap() && !reduce) {
        window.gsap.fromTo(cta, { scale: 0.96, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.7)" });
      }
      refreshST();
    }
    boxes.forEach(function (b) { b.addEventListener("change", update); });
    update();
  }

  /* ======================================================================
     4. LOYALTY PUNCH CARD  (home widget + promotions.html) — DEMO MODE
     User types email/phone; card "activates" and shows a partial demo fill.
     Tracks: grooming (5th free) and/or boarding (10th free) per markup.
     ====================================================================== */
  var DEMO_FILL = { grooming: 3, boarding: 6 };

  function initPunchCard(root) {
    var input = $("[data-punch-input]", root);
    var go = $("[data-punch-go]", root);
    if (!go) return;

    function render() {
      $$("[data-track]", root).forEach(function (track) {
        var key = track.getAttribute("data-track");
        var slots = $$("[data-slot]", track);
        var filled = Math.min(DEMO_FILL[key] || 0, slots.length);
        slots.forEach(function (s, i) { s.classList.toggle("is-stamped", i < filled); });
        var reward = $("[data-reward]", track);
        if (reward) reward.classList.toggle("is-earned", filled >= slots.length);
        var count = $("[data-count]", track);
        if (count) count.textContent = filled + " / " + slots.length;
      });
    }

    function activate() {
      if (input && !input.value.trim()) {
        input.focus();
        input.setAttribute("aria-invalid", "true");
        return;
      }
      if (input) input.removeAttribute("aria-invalid");
      root.setAttribute("data-active", "true");
      render();
      if (hasGsap() && !reduce) {
        window.gsap.from($$(".stamp.is-stamped", root),
          { scale: 0, duration: 0.4, stagger: 0.05, ease: "back.out(2)" });
      }
    }

    go.addEventListener("click", activate);
    if (input) input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); activate(); }
    });
  }

  /* ======================================================================
     5. DAYCARE PRICING TOGGLE  (services.html + resort.html)
     Half $12 (<5 hrs)  /  Full $22 (>5 hrs)
     ====================================================================== */
  function initPricingToggle(root) {
    var buttons = $$("[data-plan]", root);
    var priceEl = $("[data-price]", root);
    var subEl = $("[data-price-sub]", root);
    if (!buttons.length || !priceEl) return;

    var DATA = {
      half: { p: "$12", s: "Half day · under 5 hours" },
      full: { p: "$22", s: "Full day · 5 hours or more" }
    };

    function showPrice(plan) {
      var d = DATA[plan]; if (!d) return;
      if (hasGsap() && !reduce) {
        window.gsap.to(priceEl, {
          opacity: 0, y: -10, duration: 0.15,
          onComplete: function () {
            priceEl.textContent = d.p;
            if (subEl) subEl.textContent = d.s;
            window.gsap.fromTo(priceEl, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.2 });
          }
        });
      } else {
        priceEl.textContent = d.p;
        if (subEl) subEl.textContent = d.s;
      }
    }

    var activate = initTabGroup(buttons, function (b) { return b.getAttribute("data-plan"); }, "aria-pressed", showPrice);
    activate("half");
  }

  /* ======================================================================
     5b. RATE ESTIMATOR  (resort.html)
     Per-night/day rate, first pet full price, additional pets at the
     discounted rate. Daycare rates are flat per pet (no per-night discount).
     ====================================================================== */
  function initRateEstimator(root) {
    var serviceEl = $("#rateService", root);
    var daysEl = $("#rateDays", root);
    var petsEl = $("#ratePets", root);
    var totalEl = $("#rateTotal", root);
    if (!serviceEl || !daysEl || !petsEl || !totalEl) return;

    var RATES = {
      boarding: { first: 20, extra: 17, perDay: true },
      kitty:    { first: 20, extra: 17, perDay: true },
      full:     { first: 22, extra: 22, perDay: true },
      half:     { first: 12, extra: 12, perDay: true }
    };

    function calc() {
      var rate = RATES[serviceEl.value] || RATES.boarding;
      var days = Math.max(1, parseInt(daysEl.value, 10) || 1);
      var pets = Math.max(1, parseInt(petsEl.value, 10) || 1);
      var perDayTotal = rate.first + (pets - 1) * rate.extra;
      var total = perDayTotal * days;
      totalEl.textContent = "$" + total.toLocaleString();
    }

    [serviceEl, daysEl, petsEl].forEach(function (el) {
      el.addEventListener("input", calc);
      el.addEventListener("change", calc);
    });
    calc();
  }

  /* ======================================================================
     6. WEEKLY PROMOTIONS — auto-highlight TODAY  (promotions.html + home)
     ====================================================================== */
  function initWeeklyPromos(root) {
    var today = new Date().getDay();
    var cards = $$("[data-day]", root);
    cards.forEach(function (card) {
      var isToday = parseInt(card.getAttribute("data-day"), 10) === today;
      card.classList.toggle("is-today", isToday);
      var flag = $("[data-day-flag]", card);
      if (flag) flag.hidden = !isToday;
    });
  }

  /* ======================================================================
     7. COUNT-UP STATS  (services.html + about.html)
     <p data-countup data-to="25" data-suffix="+">25+</p> counts 0 -> 25 on view.
     Honors reduced motion / no-IO by snapping straight to the final value.
     ====================================================================== */
  function initCountUps() {
    var els = $$("[data-countup]");
    if (!els.length) return;

    function run(el) {
      var to = parseFloat(el.getAttribute("data-to")) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      if (reduce || !window.requestAnimationFrame) { el.textContent = to + suffix; return; }
      var start = null, dur = 1200;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = Math.round(eased * to) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) { els.forEach(run); return; }
    var remaining = els.length;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        run(e.target);
        io.unobserve(e.target);
        if (--remaining === 0) io.disconnect();
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ======================================================================
     8. FORM VALIDATION HELPER + CONTACT/QUOTE FORMS
     validateForm: runs Constraint Validation on all .form-input fields,
     marks invalids with aria-invalid, focuses the first bad field, shows
     an error on the status element, then calls onValid() if all pass.
     ====================================================================== */
  function validateForm(form, status, onValid) {
    $$(".form-input", form).forEach(function (i) { i.removeAttribute("aria-invalid"); });
    if (!form.checkValidity()) {
      $$(".form-input", form).forEach(function (i) {
        if (!i.checkValidity()) i.setAttribute("aria-invalid", "true");
      });
      var firstBad = form.querySelector('[aria-invalid="true"]');
      if (firstBad) firstBad.focus();
      if (status) { status.textContent = "Please fill in the highlighted fields."; status.style.color = "#c25b3a"; }
      return;
    }
    onValid();
  }

  /* Contact form (about.html) — DEMO MODE. Sends nothing. */
  function initContactForm(form) {
    var status = $("[data-form-status]", form);
    var btn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      validateForm(form, status, function () {
        if (btn) { btn.disabled = true; btn.style.opacity = ".7"; }
        if (status) { status.textContent = "Sending…"; status.style.color = "var(--ink-soft)"; }
        setTimeout(function () {
          form.reset();
          if (btn) { btn.disabled = false; btn.style.opacity = "1"; }
          if (status) { status.textContent = "Thanks! We'll be in touch soon. 🐾"; status.style.color = "#1f8a4c"; }
        }, 900);
      });
    });
  }

  /* Grooming quote request (grooming.html). Validates, then either POSTs to a
     real form endpoint or simulates success while the action is a placeholder.
     Wire action to Formspree / a Resend endpoint to go live. */
  function initQuoteForm(form) {
    var status = $("[data-form-status]", form);
    var btn = form.querySelector('button[type="submit"]');
    var action = form.getAttribute("action") || "";
    var live = action && action.indexOf("REPLACE_WITH_FORM_ID") === -1 && action.indexOf("REPLACE") === -1;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      validateForm(form, status, function () {
        if (live) {
          if (status) { status.textContent = "Sending…"; status.style.color = "var(--ink-soft)"; }
          form.submit();
          return;
        }
        if (btn) { btn.disabled = true; btn.style.opacity = ".7"; }
        if (status) { status.textContent = "Sending…"; status.style.color = "var(--ink-soft)"; }
        setTimeout(function () {
          form.reset();
          if (btn) { btn.disabled = false; btn.style.opacity = "1"; }
          if (status) { status.textContent = "Thanks! We'll be in touch with a quote soon. 🐾"; status.style.color = "#1f8a4c"; }
        }, 900);
      });
    });
  }

  /* ======================================================================
     8b. LIVESTOCK DEPARTMENT SWITCHER  (livestock.html)
     Tabs on desktop (one panel shown at a time), accordion on mobile
     (per-department headers, all collapsed by default). One markup tree;
     CSS handles which controls are visible per breakpoint. We track the
     active desktop tab and the open mobile panel independently so crossing
     the breakpoint always lands in a sane state.
     ====================================================================== */
  function initDeptSwitcher(root) {
    var tabs = $$("[data-dept-tab]", root);
    var panels = $$("[data-dept-panel]", root);
    var heads = $$("[data-dept-acc]", root);
    if (!panels.length) return;

    var mqDesktop = window.matchMedia("(min-width:1024px)");
    var active = root.getAttribute("data-default") || panels[0].getAttribute("data-dept-panel");

    function panelFor(key) {
      return panels.filter(function (p) { return p.getAttribute("data-dept-panel") === key; })[0];
    }

    /* gently reveal a panel's content when it appears (skipped under reduced
       motion / no GSAP — animations.js has already forced [data-anim] visible) */
    function reveal(panel) {
      if (!panel || !hasGsap() || reduce) { refreshST(); return; }
      var bits = $$("[data-anim]", panel);
      if (!bits.length) { refreshST(); return; }
      window.gsap.fromTo(bits, { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: "power2.out", onComplete: refreshST });
    }

    /* DESKTOP: show exactly one panel, highlight its tab */
    var activateTab = initTabGroup(
      tabs,
      function (t) { return t.getAttribute("data-dept-tab"); },
      "aria-selected",
      function (key) {
        panels.forEach(function (p) {
          p.classList.toggle("is-active", p.getAttribute("data-dept-panel") === key);
        });
        reveal(panelFor(key));
      }
    );
    function selectTab(key) { active = key; activateTab(key); }

    /* MOBILE: toggle one accordion panel open/closed (others close) */
    function toggleAcc(key) {
      var target = panelFor(key);
      if (!target) return;
      var wasOpen = target.classList.contains("is-open");
      panels.forEach(function (p) { p.classList.remove("is-open"); });
      heads.forEach(function (h) { h.classList.remove("is-open"); h.setAttribute("aria-expanded", "false"); });
      if (!wasOpen) {
        target.classList.add("is-open");
        active = key;
        heads.forEach(function (h) {
          if (h.getAttribute("data-dept-acc") === key) {
            h.classList.add("is-open"); h.setAttribute("aria-expanded", "true");
          }
        });
        reveal(target);
      } else {
        refreshST();
      }
    }

    /* keep state sane across the breakpoint: desktop always shows the active
       tab; mobile starts fully collapsed (closed by default per spec) */
    function syncLayout() {
      if (mqDesktop.matches) {
        panels.forEach(function (p) { p.classList.remove("is-open"); });
        heads.forEach(function (h) { h.classList.remove("is-open"); h.setAttribute("aria-expanded", "false"); });
        selectTab(active);
      } else {
        panels.forEach(function (p) { p.classList.remove("is-active"); p.classList.remove("is-open"); });
        heads.forEach(function (h) { h.classList.remove("is-open"); h.setAttribute("aria-expanded", "false"); });
        refreshST();
      }
    }

    heads.forEach(function (h) {
      h.addEventListener("click", function () { toggleAcc(h.getAttribute("data-dept-acc")); });
    });

    if (mqDesktop.addEventListener) mqDesktop.addEventListener("change", syncLayout);
    else if (mqDesktop.addListener) mqDesktop.addListener(syncLayout); // older Safari

    syncLayout();

    /* hero quick-jump chips: open the matching department on click, on both
       desktop (select tab) and mobile (open accordion), then scroll to it */
    $$("[data-dept-jump]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var key = chip.getAttribute("data-dept-jump");
        if (!panelFor(key)) return;
        if (mqDesktop.matches) selectTab(key);
        else toggleAcc(key);
      });
    });
  }

  /* ======================================================================
     SHARED CHROME — active nav, mobile drawer, sticky Book-Now bar
     ====================================================================== */
  function setActiveNav() {
    var page = document.body.getAttribute("data-page");
    if (!page) return;
    $$("[data-nav]").forEach(function (a) {
      var on = a.getAttribute("data-nav") === page;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "page");
    });
  }

  function initMobileMenu() {
    var toggle = $("[data-menu-toggle]");
    var drawer = $("[data-menu-drawer]");
    if (!toggle || !drawer) return;
    function close() {
      drawer.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    }
    function open() {
      drawer.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-open");
    }
    toggle.addEventListener("click", function () {
      if (drawer.classList.contains("is-open")) close(); else open();
    });
    $$("a", drawer).forEach(function (a) { a.addEventListener("click", close); });
    var closeBtn = $("[data-menu-close]", drawer);
    if (closeBtn) closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  function initStickyHeader() {
    var header = $("[data-site-header]");
    if (!header) return;
    function apply() { header.classList.toggle("is-stuck", window.scrollY > 18); }
    window.addEventListener("scroll", apply, { passive: true });
    apply();
  }

  function initStickyBookBar() {
    var bar = $("[data-booknow-bar]");
    if (!bar) return;
    var trigger = $("[data-booknow-after]") || $("header");
    function onScroll() {
      var past = trigger ? trigger.getBoundingClientRect().bottom < 0 : window.scrollY > 600;
      bar.classList.toggle("is-visible", past);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* set KennelBooker href on any element flagged for it */
  function wireBookingLinks() {
    $$("[data-book]").forEach(function (a) {
      a.setAttribute("href", CONFIG.kennelBooker);
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    });
  }

  /* footer year + dynamic footer hours line (single source of truth) */
  function initFooterBits() {
    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* crossfade photo rotator (Seasonal Spotlight) — reuses .hero-slideshow__slide CSS.
     First slide is already .is-active in markup, so non-JS / reduced motion still
     shows a photo; we only start the loop when motion is allowed. */
  function initPhotoRotate(root) {
    var slides = $$("[data-rotate-slide]", root);
    if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var i = 0;
    setInterval(function () {
      slides[i].classList.remove("is-active");
      i = (i + 1) % slides.length;
      slides[i].classList.add("is-active");
    }, 4500);
  }

  /* ScrollTrigger refresh helper (layout changed after a widget interaction) */
  function refreshST() {
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  /* ======================================================================
     BOOTSTRAP
     ====================================================================== */
  function init() {
    renderBadge();
    setInterval(renderBadge, 60000); // keep the badge live

    $$('[data-widget="profile"]').forEach(initProfileBuilder);
    $$('[data-widget="ready"]').forEach(initReadyCheck);
    $$('[data-widget="punch"]').forEach(initPunchCard);
    $$('[data-widget="pricing"]').forEach(initPricingToggle);
    $$('[data-widget="rate-estimator"]').forEach(initRateEstimator);
    $$('[data-widget="promos"]').forEach(initWeeklyPromos);
    $$('[data-widget="contact"]').forEach(initContactForm);
    $$('[data-widget="quote"]').forEach(initQuoteForm);
    $$('[data-widget="dept-switcher"]').forEach(initDeptSwitcher);
    $$('[data-photo-rotate]').forEach(initPhotoRotate);
    initGallery();
    initCountUps();

    setActiveNav();
    initMobileMenu();
    initStickyHeader();
    initStickyBookBar();
    wireBookingLinks();
    initFooterBits();
  }

  /* ======================================================================
     GALLERY — filterable masonry wall + lightbox (gallery.html)
     Photos come from window.AHC_GALLERY ([{f,c,cap,o}]). Renders tiles,
     wires category filter pills, and a keyboard-accessible lightbox with
     prev/next that respects the currently filtered set.
     ====================================================================== */
  function initGallery() {
    var wall = $("[data-gal-wall]");
    var data = window.AHC_GALLERY;
    if (!wall || !data || !data.length) return;

    var emptyMsg = $("[data-gal-empty]");
    var pills = $$("[data-gal-filter]");
    var countEl = $("[data-gal-count]");
    if (countEl) countEl.textContent = String(data.length);

    var CAT_LABEL = { dogs:"Cute dog", daycare:"Daycare", grooming:"Grooming",
                      cats:"Kitty Korral", boarding:"Boarding", store:"In store" };

    var current = "all";
    var visible = [];          // the filtered list currently shown (for lightbox nav)

    function tileFor(item, idx) {
      var a = document.createElement("button");
      a.type = "button";
      a.className = "gal-item gal-in";
      a.setAttribute("data-gal-idx", idx);
      a.style.animationDelay = Math.min(idx * 0.03, 0.4) + "s";
      var label = CAT_LABEL[item.c] || "AHC";
      a.innerHTML =
        '<span class="gal-item__tag">' + label + '</span>' +
        '<img src="' + item.f + '" alt="' + (item.cap || "") + '" loading="lazy" />' +
        '<span class="gal-item__cap">' + (item.cap || "") + '</span>';
      a.addEventListener("click", function () { openLightbox(idx); });
      return a;
    }

    function render(cat) {
      current = cat;
      visible = data.filter(function (d) { return cat === "all" || d.c === cat; });
      wall.innerHTML = "";
      visible.forEach(function (item, i) { wall.appendChild(tileFor(item, i)); });
      if (emptyMsg) emptyMsg.classList.toggle("hidden", visible.length > 0);
      if (window.ScrollTrigger) { try { window.ScrollTrigger.refresh(); } catch (e) {} }
    }

    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        if (pill.classList.contains("is-active")) return;
        pills.forEach(function (p) { p.classList.remove("is-active"); p.removeAttribute("aria-selected"); });
        pill.classList.add("is-active"); pill.setAttribute("aria-selected", "true");
        render(pill.getAttribute("data-gal-filter"));
      });
    });

    /* ---- lightbox ---- */
    var lb = $("[data-gal-lightbox]");
    var lbImg = $("[data-gal-lb-img]"), lbCap = $("[data-gal-lb-cap]"), lbCount = $("[data-gal-lb-count]");
    var lbIdx = 0;

    function showAt(i) {
      if (!visible.length) return;
      lbIdx = (i + visible.length) % visible.length;
      var item = visible[lbIdx];
      lbImg.src = item.f; lbImg.alt = item.cap || "";
      if (lbCap) lbCap.textContent = item.cap || "";
      if (lbCount) lbCount.textContent = (lbIdx + 1) + " / " + visible.length;
    }
    function openLightbox(i) {
      if (!lb) return;
      lb.hidden = false;
      showAt(i);
      requestAnimationFrame(function () { lb.classList.add("is-open"); });
      document.body.style.overflow = "hidden";
    }
    function closeLightbox() {
      if (!lb) return;
      lb.classList.remove("is-open");
      document.body.style.overflow = "";
      setTimeout(function () { lb.hidden = true; lbImg.src = ""; }, 300);
    }

    if (lb) {
      $("[data-gal-close]").addEventListener("click", closeLightbox);
      $("[data-gal-prev]").addEventListener("click", function () { showAt(lbIdx - 1); });
      $("[data-gal-next]").addEventListener("click", function () { showAt(lbIdx + 1); });
      lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
      document.addEventListener("keydown", function (e) {
        if (lb.hidden) return;
        if (e.key === "Escape") closeLightbox();
        else if (e.key === "ArrowLeft") showAt(lbIdx - 1);
        else if (e.key === "ArrowRight") showAt(lbIdx + 1);
      });
      // swipe on touch
      var sx = 0;
      lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener("touchend", function (e) {
        var dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 50) showAt(lbIdx + (dx < 0 ? 1 : -1));
      }, { passive: true });
    }

    render("all");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
