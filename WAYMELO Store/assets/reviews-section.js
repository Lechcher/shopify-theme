/*
  BKY - Reviews Section behavior.
  - Star filter pills show/hide the pre-rendered review entries by rating.
  - Gallery previous/next controls scroll the review-image strip.
  Entries render visible by default, so the list stays readable without JavaScript.
*/
(function () {
  'use strict';

  function galleryStep(gallery) {
    var item = gallery.querySelector('.reviews-section__gallery-item');
    if (!item) {
      return Math.round(gallery.clientWidth * 0.8);
    }
    var styles = window.getComputedStyle(gallery);
    var gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
    return Math.round(item.getBoundingClientRect().width + gap);
  }

  function initGallery(root) {
    var gallery = root.querySelector('[data-rs-gallery]');
    if (!gallery || gallery.dataset.rsBound === 'true') {
      return;
    }
    gallery.dataset.rsBound = 'true';

    var prev = root.querySelector('[data-rs-gallery-prev]');
    var next = root.querySelector('[data-rs-gallery-next]');

    function scrollByStep(direction) {
      gallery.scrollBy({ left: direction * galleryStep(gallery), behavior: 'smooth' });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        scrollByStep(-1);
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        scrollByStep(1);
      });
    }
  }

  function initFilter(root) {
    var pills = root.querySelectorAll('[data-rs-filter]');
    var reviews = root.querySelectorAll('[data-rating]');
    if (!pills.length) {
      return;
    }

    Array.prototype.forEach.call(pills, function (pill) {
      if (pill.dataset.rsBound === 'true') {
        return;
      }
      pill.dataset.rsBound = 'true';

      pill.addEventListener('click', function () {
        var value = pill.getAttribute('data-rs-filter');

        Array.prototype.forEach.call(pills, function (other) {
          var active = other === pill;
          other.classList.toggle('is-active', active);
          other.setAttribute('aria-pressed', active ? 'true' : 'false');
        });

        Array.prototype.forEach.call(reviews, function (review) {
          var show = value === 'all' || review.getAttribute('data-rating') === value;
          review.hidden = !show;
        });
      });
    });
  }

  function initSection(root) {
    initGallery(root);
    initFilter(root);
  }

  function initAll(scope) {
    Array.prototype.forEach.call(scope.querySelectorAll('[data-rs]'), initSection);
  }

  function onSectionLoad(event) {
    var target = event.target;
    var root = null;
    if (target.matches && target.matches('[data-rs]')) {
      root = target;
    } else if (target.querySelector) {
      root = target.querySelector('[data-rs]');
    }
    if (root) {
      initSection(root);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initAll(document);
    });
  } else {
    initAll(document);
  }

  document.addEventListener('shopify:section:load', onSectionLoad);

  // Re-apply the active filter after the theme editor re-renders blocks.
  document.addEventListener('shopify:block:select', function (event) {
    var root = event.target.closest ? event.target.closest('[data-rs]') : null;
    if (root) {
      initSection(root);
    }
  });
})();
