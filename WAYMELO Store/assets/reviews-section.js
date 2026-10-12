/*
  BKY - Reviews Section behavior.
  - Star filter pills show/hide the pre-rendered review entries by rating.
  - The gallery prev/next controls scroll the review-image strip only.
  - A dedicated pagination control below the list pages the review entries three
    at a time in the "All Reviews" view.
  Entries render visible by default, so the list stays readable without JavaScript.
*/
(function () {
  'use strict';

  // Reviews shown per page in the "All Reviews" view. Fixed by design.
  var PAGE_SIZE = 3;

  function getState(root) {
    if (!root._rsState) {
      root._rsState = { filter: 'all', page: 1 };
    }
    return root._rsState;
  }

  function getReviews(root) {
    return root.querySelectorAll('[data-rating]');
  }

  function isPagingActive(state, total) {
    return state.filter === 'all' && total > PAGE_SIZE;
  }

  function galleryStep(gallery) {
    var item = gallery.querySelector('.reviews-section__gallery-item');
    if (!item) {
      return Math.round(gallery.clientWidth * 0.8);
    }
    var styles = window.getComputedStyle(gallery);
    var gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
    return Math.round(item.getBoundingClientRect().width + gap);
  }

  function scrollGallery(root, direction) {
    var gallery = root.querySelector('[data-rs-gallery]');
    if (!gallery) {
      return;
    }
    gallery.scrollBy({ left: direction * galleryStep(gallery), behavior: 'smooth' });
  }

  function updatePagination(root, pagingActive, page, pageCount) {
    var container = root.querySelector('[data-rs-pagination]');
    var prev = root.querySelector('[data-rs-page-prev]');
    var next = root.querySelector('[data-rs-page-next]');
    var status = root.querySelector('[data-rs-page-status]');

    if (container) {
      container.hidden = !pagingActive;
    }
    if (prev) {
      prev.disabled = pagingActive && page <= 1;
    }
    if (next) {
      next.disabled = pagingActive && page >= pageCount;
    }
    if (status) {
      var label = 'Page ' + page + ' of ' + pageCount;
      if (status.textContent !== label) {
        status.textContent = label;
      }
    }

    root.setAttribute('data-rs-page', String(page));
    root.setAttribute('data-rs-pages', String(pageCount));
  }

  // Apply the current filter and page to the pre-rendered review entries.
  function applyView(root) {
    var state = getState(root);
    var reviews = getReviews(root);
    var total = reviews.length;
    var pagingActive = isPagingActive(state, total);
    var pageCount = pagingActive ? Math.ceil(total / PAGE_SIZE) : 1;

    if (state.page > pageCount) {
      state.page = pageCount;
    }
    if (state.page < 1) {
      state.page = 1;
    }

    var start = (state.page - 1) * PAGE_SIZE;

    Array.prototype.forEach.call(reviews, function (review, index) {
      var show;
      if (state.filter === 'all') {
        show = !pagingActive || (index >= start && index < start + PAGE_SIZE);
      } else {
        show = review.getAttribute('data-rating') === state.filter;
      }
      review.hidden = !show;
    });

    updatePagination(root, pagingActive, state.page, pageCount);
  }

  function handlePage(root, direction) {
    var state = getState(root);
    var total = getReviews(root).length;
    if (!isPagingActive(state, total)) {
      return;
    }
    state.page += direction;
    applyView(root);
  }

  function handleFilter(root, pill) {
    var state = getState(root);
    state.filter = pill.getAttribute('data-rs-filter');
    state.page = 1;

    var pills = root.querySelectorAll('[data-rs-filter]');
    Array.prototype.forEach.call(pills, function (other) {
      var active = other === pill;
      other.classList.toggle('is-active', active);
      other.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    applyView(root);
  }

  // One delegated listener per root survives theme-editor re-renders of the
  // controls and keeps initialization idempotent.
  function bindControls(root) {
    if (root.dataset.rsBound === 'true') {
      return;
    }
    root.dataset.rsBound = 'true';

    root.addEventListener('click', function (event) {
      var target = event.target;
      if (!target || !target.closest) {
        return;
      }

      var pill = target.closest('[data-rs-filter]');
      if (pill) {
        handleFilter(root, pill);
        return;
      }

      var pageNext = target.closest('[data-rs-page-next]');
      var pagePrev = target.closest('[data-rs-page-prev]');
      if (pageNext || pagePrev) {
        handlePage(root, pageNext ? 1 : -1);
        return;
      }

      var galleryNext = target.closest('[data-rs-gallery-next]');
      var galleryPrev = target.closest('[data-rs-gallery-prev]');
      if (galleryNext || galleryPrev) {
        scrollGallery(root, galleryNext ? 1 : -1);
      }
    });
  }

  function initSection(root) {
    getState(root);
    bindControls(root);
    applyView(root);
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

  // Re-apply the active filter and page after the theme editor re-renders blocks.
  document.addEventListener('shopify:block:select', function (event) {
    var root = event.target.closest ? event.target.closest('[data-rs]') : null;
    if (root) {
      initSection(root);
    }
  });
})();
