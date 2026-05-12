/**
 * nav.js — Navigation Behavior for DOWIN Việt Nam v2.0
 *
 * Handles:
 *  - Hamburger menu toggle (.nav-toggle ↔ .site-nav + .nav-overlay)
 *  - Overlay click closes mobile menu
 *  - Escape key closes menu and dropdowns
 *  - Dropdown toggle on mobile (.nav-dropdown__btn)
 *  - Header scroll effect: .header--scrolled after 50px
 *  - Scroll-to-top button: show after 600px, smooth scroll on click
 *
 * Works both when the header is in the static DOM and when it is injected
 * via include.js (listens for 'includes:loaded' event).
 */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Helpers                                                              */
  /* ------------------------------------------------------------------ */

  function getHeader()  { return document.getElementById('site-header'); }
  function getNav()     { return document.getElementById('site-nav'); }
  function getToggle()  { return document.getElementById('nav-toggle'); }
  function getOverlay() { return document.getElementById('nav-overlay'); }

  /** Close the mobile nav and all dropdowns. */
  function closeMobileNav() {
    var nav     = getNav();
    var toggle  = getToggle();
    var overlay = getOverlay();

    if (nav)     nav.classList.remove('is-open');
    if (toggle)  toggle.setAttribute('aria-expanded', 'false');
    if (overlay) {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
    }

    // Close all dropdowns too
    document.querySelectorAll('.nav-dropdown.is-open').forEach(function (dd) {
      dd.classList.remove('is-open');
      var btn = dd.querySelector('.nav-dropdown__btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  /** Toggle a single dropdown (used on mobile). */
  function toggleDropdown(ddEl) {
    var isOpen = ddEl.classList.contains('is-open');
    var btn    = ddEl.querySelector('.nav-dropdown__btn');

    // Close all other dropdowns first
    document.querySelectorAll('.nav-dropdown.is-open').forEach(function (other) {
      if (other !== ddEl) {
        other.classList.remove('is-open');
        var otherBtn = other.querySelector('.nav-dropdown__btn');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      }
    });

    ddEl.classList.toggle('is-open', !isOpen);
    if (btn) btn.setAttribute('aria-expanded', String(!isOpen));
  }

  /* ------------------------------------------------------------------ */
  /* Mobile hamburger + overlay                                           */
  /* ------------------------------------------------------------------ */

  function bindHamburger() {
    var toggle  = getToggle();
    var nav     = getNav();
    var overlay = getOverlay();

    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var willOpen = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));

      if (overlay) {
        overlay.classList.toggle('is-open', willOpen);
        overlay.setAttribute('aria-hidden', String(!willOpen));
      }
    });

    if (overlay) {
      overlay.addEventListener('click', closeMobileNav);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Dropdown buttons (desktop hover handled via CSS; JS for mobile)     */
  /* ------------------------------------------------------------------ */

  function bindDropdowns() {
    document.querySelectorAll('.nav-dropdown__btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        // On desktop the dropdowns open via CSS :hover / :focus-within.
        // Only handle click-to-toggle behaviour on narrower viewports.
        var isMobile = window.matchMedia('(max-width: 900px)').matches;
        if (!isMobile) return;

        e.preventDefault();
        var dd = btn.closest('.nav-dropdown');
        if (dd) toggleDropdown(dd);
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Keyboard: Escape closes nav + dropdowns                              */
  /* ------------------------------------------------------------------ */

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMobileNav();
    }
  });

  /* ------------------------------------------------------------------ */
  /* Close mobile menu when media query switches to desktop               */
  /* ------------------------------------------------------------------ */

  var mq = window.matchMedia('(max-width: 900px)');

  function onMqChange() {
    if (!mq.matches) closeMobileNav();
  }

  if (mq.addEventListener) {
    mq.addEventListener('change', onMqChange);
  } else {
    // Legacy Safari
    mq.addListener(onMqChange);
  }

  /* ------------------------------------------------------------------ */
  /* Header scroll effect                                                 */
  /* ------------------------------------------------------------------ */

  function bindScrollEffect() {
    var header = getHeader();
    if (!header) return;

    function onScroll() {
      header.classList.toggle('header--scrolled', window.scrollY > 50);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on bind so the class is correct on page load
  }

  /* ------------------------------------------------------------------ */
  /* Scroll-to-top button                                                 */
  /* ------------------------------------------------------------------ */

  function bindScrollToTop() {
    var btn = document.getElementById('scrollToTop');
    if (!btn) return;

    function updateVisibility() {
      btn.classList.toggle('is-visible', window.scrollY > 600);
    }

    window.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility();

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Language switcher                                                    */
  /* ------------------------------------------------------------------ */

  function bindLangSwitcher() {
    var enMeta  = document.querySelector('link[hreflang="en"]');
    var viMeta  = document.querySelector('link[hreflang="vi"]');
    var pageLang = document.documentElement.lang || 'vi';

    // Correct active state (header partial always defaults to VI active)
    document.querySelectorAll('[data-lang]').forEach(function (el) {
      el.classList.toggle('active', el.dataset.lang === pageLang);
    });

    document.querySelectorAll('[data-lang]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var lang = el.dataset.lang;
        var meta = lang === 'en' ? enMeta : viMeta;
        if (meta && meta.getAttribute('href')) {
          var href = meta.getAttribute('href');
          try {
            // Use pathname only so the switcher works on any origin (local dev + production)
            var url = new URL(href);
            window.location.href = url.pathname + url.search + url.hash;
          } catch (err) {
            window.location.href = href;
          }
        }
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Init: run immediately if the header is already in the DOM,           */
  /* otherwise wait for include.js to finish injecting partials.          */
  /* ------------------------------------------------------------------ */

  function init() {
    bindHamburger();
    bindDropdowns();
    bindScrollEffect();
    bindScrollToTop();
    bindLangSwitcher();
  }

  function onDOMReady() {
    if (getHeader()) {
      // Header already present (static page, no partial includes)
      init();
    }

    // Also listen for include.js finishing — safe to call init() again
    // because the binding functions guard against missing elements.
    document.addEventListener('includes:loaded', init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDOMReady);
  } else {
    onDOMReady();
  }
})();
