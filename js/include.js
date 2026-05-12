/**
 * include.js — Partial Include System for DOWIN Việt Nam v2.0
 *
 * Usage:
 *   <div data-include="/partials/header.html"></div>
 *
 * Active-page highlighting:
 *   <body data-include-page="products">
 *   After header loads, nav links matching the current page get class "active".
 *
 * Events:
 *   document listens for 'includes:loaded' after all partials are resolved.
 *
 * Global:
 *   window.includesLoaded — Promise that resolves when all includes finish.
 */

(function () {
  'use strict';

  /**
   * Determine the "current page" key:
   * 1. data-include-page on <body>
   * 2. window.location.pathname as fallback
   */
  function getCurrentPage() {
    return document.body.dataset.includePage || window.location.pathname;
  }

  /**
   * After the header partial is injected into the DOM, find all <nav a[href]>
   * links and mark the one matching the current page as active.
   */
  function highlightActiveNav() {
    var currentPage = getCurrentPage();
    var currentPath = window.location.pathname;

    var nav = document.getElementById('site-nav');
    if (!nav) return;

    nav.querySelectorAll('a[href]').forEach(function (link) {
      var linkPath = link.pathname; // browser normalises this for us

      var isActive = (
        linkPath === currentPath ||
        (currentPage && linkPath.indexOf(currentPage) !== -1) ||
        (currentPage === '/' && linkPath === '/') ||
        (currentPath !== '/' && linkPath !== '/' && currentPath.indexOf(linkPath) === 0)
      );

      if (isActive) {
        link.classList.add('active');
        // Also mark the parent nav-dropdown wrapper if nested
        var dropdown = link.closest('.nav-dropdown');
        if (dropdown) dropdown.classList.add('active');
      }
    });
  }

  /**
   * Fetch a single partial and replace the placeholder element's outerHTML.
   * Returns a Promise that resolves with the URL (success or graceful failure).
   */
  function loadInclude(el) {
    var url = el.dataset.include;
    if (!url) return Promise.resolve(null);

    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + url);
        return res.text();
      })
      .then(function (html) {
        // Create a temporary container to parse the fragment
        var tmp = document.createElement('div');
        tmp.innerHTML = html;

        // Insert all child nodes before the placeholder, then remove placeholder
        var parent = el.parentNode;
        while (tmp.firstChild) {
          parent.insertBefore(tmp.firstChild, el);
        }
        parent.removeChild(el);

        // Post-load hook: active nav highlighting after header is injected
        if (url.indexOf('header') !== -1) {
          highlightActiveNav();
        }

        // Execute any <script> tags embedded in the partial
        parent.querySelectorAll('script[data-partial-script]').forEach(function (s) {
          var newScript = document.createElement('script');
          if (s.src) newScript.src = s.src;
          else newScript.textContent = s.textContent;
          newScript.removeAttribute('data-partial-script');
          document.body.appendChild(newScript);
          s.parentNode.removeChild(s);
        });

        return url;
      })
      .catch(function (err) {
        console.warn('[include.js] Failed to load partial:', url, '—', err.message);
        // Leave the placeholder in place (or hide it) so the page still renders
        el.style.display = 'none';
        return null;
      });
  }

  /**
   * Main entry point: collect all [data-include] placeholders, fetch them all
   * in parallel, then fire the 'includes:loaded' custom event.
   */
  function runIncludes() {
    var placeholders = Array.from(document.querySelectorAll('[data-include]'));

    if (placeholders.length === 0) {
      document.dispatchEvent(new CustomEvent('includes:loaded'));
      return;
    }

    var allDone = Promise.all(placeholders.map(loadInclude));

    allDone.then(function () {
      document.dispatchEvent(new CustomEvent('includes:loaded'));
    });
  }

  // Expose a stable promise that resolves when all includes finish.
  // It is set up once here and resolved via the 'includes:loaded' event,
  // so external consumers always get the same reference regardless of timing.
  var resolveLoaded;
  window.includesLoaded = new Promise(function (resolve) {
    resolveLoaded = resolve;
  });

  document.addEventListener('includes:loaded', function () {
    resolveLoaded();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runIncludes);
  } else {
    // DOM already ready (script loaded async/defer)
    runIncludes();
  }
})();
