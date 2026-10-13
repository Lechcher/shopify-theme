/*
  BKY - Product Server Rating teaser.
  Mirrors the on-page reviews section's aggregate (average rating and total
  review count) into every [data-product-server-rating] block, so the product
  page's rating teaser always matches the reviews section.
  The reviews section is the single source of truth: this script only reads the
  data attributes it exposes on its root ([data-rs]). The teaser ships hidden
  and is revealed only when a valid aggregate is found, so no fabricated or
  stale value is ever shown.
*/
(function () {
  'use strict';

  function parseNumber(value) {
    var n = parseFloat(value);
    return isFinite(n) ? n : null;
  }

  function getTeasers() {
    return document.querySelectorAll('[data-product-server-rating]');
  }

  function hideAll(teasers) {
    Array.prototype.forEach.call(teasers, function (teaser) {
      teaser.hidden = true;
    });
  }

  function syncTeaser(teaser, avg, avgPct, total) {
    var stars = teaser.querySelector('.product-server-rating__stars');
    var count = teaser.querySelector('.product-server-rating__count');
    var link = teaser.querySelector('.product-server-rating');

    if (stars) {
      stars.style.setProperty('--rating-percent', avgPct + '%');
    }
    if (count) {
      count.textContent = '(' + total + ')';
    }
    if (link) {
      link.setAttribute('aria-label', avg + ' out of 5 stars, ' + total + ' reviews');
    }

    teaser.hidden = false;
  }

  function syncAll() {
    var teasers = getTeasers();
    if (!teasers.length) {
      return;
    }

    var root = document.querySelector('[data-rs]');
    if (!root) {
      return;
    }

    var total = parseNumber(root.getAttribute('data-rs-total'));
    var avg = parseNumber(root.getAttribute('data-rs-avg'));
    var avgPct = parseNumber(root.getAttribute('data-rs-avg-pct'));

    if (avgPct === null && avg !== null) {
      avgPct = Math.round(avg * 20 * 10) / 10;
    }

    // Degrade honestly: without a valid aggregate, leave every teaser hidden.
    if (total === null || total <= 0 || avg === null || avgPct === null) {
      hideAll(teasers);
      return;
    }

    Array.prototype.forEach.call(teasers, function (teaser) {
      syncTeaser(teaser, avg, avgPct, total);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncAll);
  } else {
    syncAll();
  }

  // Re-sync when the theme editor re-renders a section or a block. syncAll reads
  // the current DOM each time and binds no per-element listeners, so repeated
  // calls are idempotent and cannot stack handlers.
  document.addEventListener('shopify:section:load', syncAll);
  document.addEventListener('shopify:block:select', syncAll);
})();
