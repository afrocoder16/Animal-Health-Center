/* ==========================================================================
   chrome.js — shared page chrome (top bar, nav, footer, sticky bar)
   Injected synchronously so the nav appears before <main> parses.
   Footer and sticky bar are appended after DOMContentLoaded.

   Each page declares data-page on <body> (for nav highlighting) and
   data-nav-spacer if a spacer div is needed below the fixed nav (pages
   where the nav floats over a hero do not need it).
   ========================================================================== */
(function () {
  "use strict";

  var TOPBAR =
    '<div class="bg-ink text-cream/85 text-[13px]">' +
      '<div class="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between gap-4">' +
        '<span class="hidden sm:flex items-center gap-2 min-w-0">' +
          '<svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-amber2 flex-none"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"/></svg>' +
          '<span class="truncate">1300 N. Hwy 59, Marshall, MN</span>' +
        '</span>' +
        '<div class="flex items-center gap-4 ml-auto">' +
          '<span data-hours-badge class="hours-badge is-closed">Checking hours…</span>' +
          '<a href="tel:+15075325000" class="font-bold text-cream hover:text-amber2 transition-colors">(507) 532-5000</a>' +
        '</div>' +
      '</div>' +
    '</div>';

  var NAV =
    '<header data-site-header class="fixed left-1/2 -translate-x-1/2 z-40 w-[min(calc(100%-24px),1180px)] top-[50px]">' +
      '<div class="relative flex items-center justify-between gap-4 min-h-[64px] px-3 py-2 rounded-3xl bg-white/10 backdrop-blur-md shadow-[0_20px_60px_-24px_rgba(60,40,16,.45)] ring-1 ring-white/20">' +
        '<a href="index.html" class="flex items-center pl-1" aria-label="Animal Health Center home"><img src="img/logoo.webp" alt="Animal Health Center &amp; Pet Resort" class="h-14 w-auto" /></a>' +
        '<nav class="hidden lg:flex items-center gap-1 text-[15px] font-bold text-ink/70" aria-label="Primary">' +
          '<a data-nav="resort" href="resort.html" class="px-3.5 py-2.5 rounded-2xl hover:text-ink hover:bg-ink/[.06] transition-colors">Pet Resort</a>' +
          '<a data-nav="livestock" href="livestock.html" class="px-3.5 py-2.5 rounded-2xl hover:text-ink hover:bg-ink/[.06] transition-colors">Livestock</a>' +
          '<a data-nav="small-animal" href="small-animal.html" class="px-3.5 py-2.5 rounded-2xl hover:text-ink hover:bg-ink/[.06] transition-colors">Small Animal</a>' +
          '<a data-nav="about" href="about.html" class="px-3.5 py-2.5 rounded-2xl hover:text-ink hover:bg-ink/[.06] transition-colors">About Us</a>' +
        '</nav>' +
        '<div class="flex items-center gap-2">' +
          '<a data-book class="hidden sm:inline-flex btn btn--amber !py-2.5 !px-4 !text-sm">Book a Stay</a>' +
          '<button data-menu-toggle class="lg:hidden grid place-items-center w-11 h-11 rounded-2xl bg-white shadow-sm text-ink" aria-label="Open menu" aria-controls="navDropdown" aria-expanded="false">' +
            '<svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"/></svg>' +
          '</button>' +
        '</div>' +
        '<nav data-menu-drawer id="navDropdown" class="nav-dropdown lg:hidden absolute top-[calc(100%+10px)] right-0 w-[min(320px,calc(100vw-24px))] grid gap-1 p-3 rounded-3xl bg-cream/97 backdrop-blur-md shadow-[0_20px_60px_-20px_rgba(60,40,16,.5)] ring-1 ring-ink/10 text-base font-heading font-800 text-ink/80" aria-label="Mobile">' +
          '<a data-nav="resort" href="resort.html" class="px-3.5 py-3 rounded-2xl hover:bg-ink/[.06] hover:text-ink transition-colors">Pet Resort</a>' +
          '<a data-nav="livestock" href="livestock.html" class="px-3.5 py-3 rounded-2xl hover:bg-ink/[.06] hover:text-ink transition-colors">Livestock</a>' +
          '<a data-nav="small-animal" href="small-animal.html" class="px-3.5 py-3 rounded-2xl hover:bg-ink/[.06] hover:text-ink transition-colors">Small Animal</a>' +
          '<a data-nav="gallery" href="gallery.html" class="px-3.5 py-3 rounded-2xl hover:bg-ink/[.06] hover:text-ink transition-colors">Gallery</a>' +
          '<a data-nav="about" href="about.html" class="px-3.5 py-3 rounded-2xl hover:bg-ink/[.06] hover:text-ink transition-colors">About Us</a>' +
          '<a data-book class="btn btn--amber justify-center mt-2">Book the Pet Resort →</a>' +
        '</nav>' +
      '</div>' +
    '</header>';

  var FOOTER =
    '<footer class="bg-ink text-cream/70">' +
      '<div class="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">' +
        '<div>' +
          '<div><img src="img/logoo.webp" alt="Animal Health Center &amp; Pet Resort" class="h-20 w-auto brightness-0 invert" /></div>' +
          '<p class="mt-4 text-sm">Southwest Minnesota\'s one-stop shop for pets and livestock, big animals &amp; small. Locally owned in Marshall, MN.</p>' +
          '<a href="https://www.facebook.com/animalhealthcentermn/" target="_blank" rel="noopener" aria-label="Facebook" class="mt-4 inline-grid place-items-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"><svg viewBox="0 0 24 24" class="w-5 h-5 fill-cream"><path d="M13 22v-8h3l.5-3.5H13V8.3c0-1 .3-1.7 1.8-1.7H17V3.4A26 26 0 0 0 14.6 3C12 3 10 4.6 10 7.7v2.8H7V14h3v8Z"/></svg></a>' +
        '</div>' +
        '<div><h4 class="font-heading font-800 text-cream">Explore</h4><ul class="mt-3 space-y-2 text-sm">' +
          '<li><a href="about.html" class="hover:text-amber2 transition-colors">About Us</a></li>' +
          '<li><a href="resort.html" class="hover:text-amber2 transition-colors">Pet Resort</a></li>' +
          '<li><a href="grooming.html" class="hover:text-amber2 transition-colors">Grooming</a></li>' +
          '<li><a href="livestock.html" class="hover:text-amber2 transition-colors">Livestock</a></li>' +
          '<li><a href="small-animal.html" class="hover:text-amber2 transition-colors">Small Animal</a></li>' +
          '<li><a href="gift-shop.html" class="hover:text-amber2 transition-colors">Gift Shop</a></li>' +
          '<li><a href="gallery.html" class="hover:text-amber2 transition-colors">Gallery</a></li>' +
        '</ul></div>' +
        '<div><h4 class="font-heading font-800 text-cream">Hours</h4><ul class="mt-3 space-y-1.5 text-sm">' +
          '<li class="flex justify-between gap-4"><span>Mon to Fri</span><span class="text-cream">8:00am to 5:30pm</span></li>' +
          '<li class="flex justify-between gap-4"><span>Saturday</span><span class="text-cream">8:00am to 12:00pm</span></li>' +
          '<li class="flex justify-between gap-4"><span>Sunday</span><span class="text-cream/50">Closed</span></li>' +
        '</ul><span data-hours-badge class="hours-badge is-closed mt-3">Checking hours…</span></div>' +
        '<div><h4 class="font-heading font-800 text-cream">Visit / Call</h4><p class="mt-3 text-sm">1300 N. Hwy 59<br />Marshall, MN 56258</p>' +
          '<a href="tel:+15075325000" class="mt-2 inline-block font-heading font-800 text-cream text-lg hover:text-amber2 transition-colors">(507) 532-5000</a>' +
          '<a data-book class="mt-4 btn btn--amber !py-2.5 !px-4 !text-sm">Book the Pet Resort →</a>' +
        '</div>' +
      '</div>' +
      '<div class="border-t border-white/10"><div class="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap items-center justify-between gap-2 text-xs text-cream/50">' +
        '<p>© <span data-year></span> Animal Health Center &amp; Pet Resort. All rights reserved.</p>' +
        '<p>For animals big &amp; small.</p>' +
      '</div></div>' +
    '</footer>';

  var STICKYBAR =
    '<div data-booknow-bar class="booknow-bar">' +
      '<div class="bg-ink text-cream md:rounded-2xl md:shadow-2xl">' +
        '<div class="max-w-7xl md:max-w-none mx-auto px-4 py-3 flex items-center justify-between gap-3 md:gap-6">' +
          '<span class="hidden sm:block font-heading font-800 text-sm">Ready when you are.</span>' +
          '<div class="flex items-center gap-2.5 ml-auto">' +
            '<a data-book class="btn btn--amber !py-2.5 !px-4 !text-sm">Book a Stay</a>' +
            '<a href="tel:+15075325000" class="btn !py-2.5 !px-4 !text-sm bg-white/10 text-cream">Call Us</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  var SPACER = '<div class="h-[86px]" aria-hidden="true"></div>';

  var s = document.currentScript;
  var body = document.body;

  var topAndNav = TOPBAR + NAV;
  if (body.hasAttribute("data-nav-spacer")) topAndNav += SPACER;
  s.insertAdjacentHTML("afterend", topAndNav);

  document.addEventListener("DOMContentLoaded", function () {
    var main = document.querySelector("main");
    if (main) {
      main.insertAdjacentHTML("afterend", FOOTER + STICKYBAR);
    } else {
      body.insertAdjacentHTML("beforeend", FOOTER + STICKYBAR);
    }
  });
})();
