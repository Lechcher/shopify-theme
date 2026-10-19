/*
  BKY - Reviews Section behavior.
  - Star filter pills show/hide the pre-rendered review entries by rating.
  - The gallery prev/next controls scroll the review-image strip only.
  - A dedicated pagination control below the list pages the review entries three
    at a time in the "All Reviews" view.
  - Clicking a review photo (in the gallery or a review entry) opens it enlarged
    in a section-scoped image viewer with previous/next navigation and a caption.
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

  // ---- Review submission form ---------------------------------------------

  // Assumed limits (see design.md): these image types, up to this size each.
  var MAX_IMAGES = 3;
  var MAX_IMAGE_BYTES = 5 * 1024 * 1024;
  var ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var MESSAGES = {
    submitting: 'Submitting your review\u2026',
    success: 'Thanks! Your review has been submitted.',
    error: 'Sorry, your review could not be submitted. Please try again.',
    notAccepted: 'Reviews are not being accepted right now.',
    rating: 'Please select a rating.',
    name: 'Please enter your name.',
    email: 'Please enter a valid email address.',
    body: 'Please enter your review.'
  };

  function getForm(root) {
    return root.querySelector('[data-rs-form]');
  }

  function getFormState(root) {
    if (!root._rsForm) {
      root._rsForm = { images: [], submitting: false };
    }
    return root._rsForm;
  }

  function controlFor(form, field) {
    return form.querySelector('[data-rs-control="' + field + '"]');
  }

  function setError(form, field, message) {
    var errorEl = form.querySelector('[data-rs-error="' + field + '"]');
    if (errorEl) {
      errorEl.textContent = message || '';
    }
    var control = controlFor(form, field);
    if (control) {
      if (message) {
        control.setAttribute('aria-invalid', 'true');
      } else {
        control.removeAttribute('aria-invalid');
      }
    }
  }

  function clearErrors(form) {
    Array.prototype.forEach.call(form.querySelectorAll('[data-rs-error]'), function (el) {
      el.textContent = '';
    });
    Array.prototype.forEach.call(form.querySelectorAll('[data-rs-control]'), function (el) {
      el.removeAttribute('aria-invalid');
    });
  }

  function validateForm(form) {
    var valid = true;

    if (!form.querySelector('input[name="rating"]:checked')) {
      setError(form, 'rating', MESSAGES.rating);
      valid = false;
    } else {
      setError(form, 'rating', '');
    }

    var name = controlFor(form, 'name');
    if (!name || !name.value.trim()) {
      setError(form, 'name', MESSAGES.name);
      valid = false;
    } else {
      setError(form, 'name', '');
    }

    var email = controlFor(form, 'email');
    var emailValue = email ? email.value.trim() : '';
    if (emailValue && !EMAIL_RE.test(emailValue)) {
      setError(form, 'email', MESSAGES.email);
      valid = false;
    } else {
      setError(form, 'email', '');
    }

    var body = controlFor(form, 'body');
    if (!body || !body.value.trim()) {
      setError(form, 'body', MESSAGES.body);
      valid = false;
    } else {
      setError(form, 'body', '');
    }

    return valid;
  }

  function focusFirstInvalid(form) {
    var order = ['rating', 'name', 'email', 'body'];
    for (var i = 0; i < order.length; i++) {
      var control = controlFor(form, order[i]);
      if (control && control.getAttribute('aria-invalid') === 'true') {
        if (order[i] === 'rating') {
          var radio = form.querySelector('input[name="rating"]');
          if (radio) {
            radio.focus();
            return;
          }
        }
        if (control.focus) {
          control.focus();
          return;
        }
      }
    }
  }

  function setStatus(root, message, kind) {
    var el = root.querySelector('[data-rs-status]');
    if (!el) {
      return;
    }
    el.textContent = message || '';
    if (kind) {
      el.setAttribute('data-rs-status-kind', kind);
    } else {
      el.removeAttribute('data-rs-status-kind');
    }
  }

  function renderPreviews(root) {
    var state = getFormState(root);
    var preview = root.querySelector('[data-rs-preview]');
    if (!preview) {
      return;
    }
    preview.textContent = '';

    state.images.forEach(function (item, index) {
      var wrap = document.createElement('div');
      wrap.className = 'reviews-section__preview-item';

      var img = document.createElement('img');
      img.src = item.url;
      img.alt = item.file.name;

      var remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'reviews-section__preview-remove';
      remove.setAttribute('data-rs-remove-image', String(index));
      remove.setAttribute('aria-label', 'Remove ' + item.file.name);
      remove.textContent = '\u00d7';

      wrap.appendChild(img);
      wrap.appendChild(remove);
      preview.appendChild(wrap);
    });
  }

  function handleImages(root, input) {
    var form = getForm(root);
    if (!form) {
      return;
    }
    var state = getFormState(root);
    var refused = [];
    var files = Array.prototype.slice.call(input.files || []);

    files.forEach(function (file) {
      if (state.images.length >= MAX_IMAGES) {
        refused.push(file.name + ' \u2014 at most ' + MAX_IMAGES + ' images are allowed');
        return;
      }
      if (ACCEPTED_IMAGE_TYPES.indexOf(file.type) === -1) {
        refused.push(file.name + ' \u2014 unsupported image type');
        return;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        refused.push(file.name + ' \u2014 image is too large');
        return;
      }
      state.images.push({ file: file, url: URL.createObjectURL(file) });
    });

    input.value = '';
    renderPreviews(root);
    setError(form, 'images', refused.join('; '));
  }

  function removeImage(root, index) {
    var form = getForm(root);
    var state = getFormState(root);
    var item = state.images[index];
    if (!item) {
      return;
    }
    URL.revokeObjectURL(item.url);
    state.images.splice(index, 1);
    renderPreviews(root);
    if (form) {
      setError(form, 'images', '');
    }
  }

  function discardImages(root) {
    var state = getFormState(root);
    state.images.forEach(function (item) {
      URL.revokeObjectURL(item.url);
    });
    state.images = [];
  }

  // Reset the form. When revokeImages is false the object URLs are handed off to
  // an inserted review entry and must stay alive.
  function resetForm(root, revokeImages) {
    var form = getForm(root);
    if (!form) {
      return;
    }
    if (revokeImages) {
      discardImages(root);
    } else {
      getFormState(root).images = [];
    }
    getFormState(root).submitting = false;
    form.reset();
    renderPreviews(root);
    clearErrors(form);
    setStatus(root, '', '');
    var submit = form.querySelector('[data-rs-submit]');
    if (submit) {
      submit.disabled = false;
    }
  }

  function openForm(root) {
    var form = getForm(root);
    if (!form) {
      return;
    }
    form.hidden = false;
    var opener = root.querySelector('[data-rs-form-open]');
    if (opener) {
      opener.setAttribute('aria-expanded', 'true');
    }
    var first = form.querySelector('input[name="rating"]');
    if (first) {
      first.focus();
    }
  }

  function closeForm(root) {
    var form = getForm(root);
    if (!form) {
      return;
    }
    form.hidden = true;
    resetForm(root, true);
    var opener = root.querySelector('[data-rs-form-open]');
    if (opener) {
      opener.setAttribute('aria-expanded', 'false');
      opener.focus();
    }
  }

  // Re-hide the form after a theme-editor re-render without stealing focus.
  function resetFormControl(root) {
    var form = getForm(root);
    if (form) {
      form.hidden = true;
      resetForm(root, true);
    }
    var opener = root.querySelector('[data-rs-form-open]');
    if (opener) {
      opener.setAttribute('aria-expanded', 'false');
    }
  }

  function cloneTemplate(template) {
    if (!template) {
      return null;
    }
    var source = template.content
      ? template.content.firstElementChild
      : template.firstElementChild;
    return source ? source.cloneNode(true) : null;
  }

  function roundTo(value, decimals) {
    var factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

  function recomputeAggregate(root) {
    var reviews = getReviews(root);
    var total = reviews.length;
    var counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    var sum = 0;

    Array.prototype.forEach.call(reviews, function (review) {
      var value = parseInt(review.getAttribute('data-rating'), 10) || 0;
      sum += value;
      if (counts[value] !== undefined) {
        counts[value] += 1;
      }
    });

    var avg = total > 0 ? sum / total : 0;
    var avgPct = total > 0 ? Math.round(avg * 20 * 10) / 10 : 0;
    var decimals = parseInt(root.getAttribute('data-rs-decimals'), 10);
    if (isNaN(decimals)) {
      decimals = 1;
    }
    var avgDisplay = roundTo(avg, decimals);

    root.setAttribute('data-rs-total', String(total));
    root.setAttribute('data-rs-avg', String(avgDisplay));
    root.setAttribute('data-rs-avg-pct', String(avgPct));

    var valueEl = root.querySelector('.reviews-section__summary .reviews-section__average-value');
    if (valueEl) {
      valueEl.textContent = String(avgDisplay);
    }

    var totalEl = root.querySelector('[data-rs-total-count]');
    if (totalEl) {
      totalEl.textContent = String(total);
    }

    var summaryStars = root.querySelector('.reviews-section__summary .reviews-section__stars');
    if (summaryStars) {
      summaryStars.style.setProperty('--rs-rating-pct', avgPct + '%');
      summaryStars.setAttribute('aria-label', avgDisplay + ' out of 5 stars');
    }

    for (var star = 1; star <= 5; star++) {
      var pct = total > 0 ? Math.round((counts[star] / total) * 1000) / 10 : 0;
      var fill = root.querySelector('[data-rs-dist="' + star + '"]');
      if (fill) {
        fill.style.width = pct + '%';
      }
      var pctEl = root.querySelector('[data-rs-dist-pct="' + star + '"]');
      if (pctEl) {
        pctEl.textContent = pct + '%';
      }
      var countEl = root.querySelector('[data-rs-count="' + star + '"]');
      if (countEl) {
        countEl.textContent = String(counts[star]);
      }
    }

    var allCount = root.querySelector('[data-rs-count="all"]');
    if (allCount) {
      allCount.textContent = String(total);
    }
  }

  function insertReview(root, payload) {
    var list = root.querySelector('[data-rs-list]');
    var node = cloneTemplate(root.querySelector('[data-rs-new-review]'));
    if (!list || !node) {
      return;
    }

    var rating = payload.rating || 0;
    node.setAttribute('data-rating', String(rating));

    var stars = node.querySelector('.reviews-section__review-stars');
    if (stars) {
      stars.setAttribute('aria-label', rating + ' out of 5 stars');
      stars.style.setProperty('--rs-rating-pct', (rating * 20) + '%');
    }

    var author = node.querySelector('[data-rs-new-author]');
    if (author) {
      author.textContent = payload.name;
    }

    var body = node.querySelector('[data-rs-new-body]');
    if (body) {
      body.textContent = payload.body;
    }

    var imagesWrap = node.querySelector('[data-rs-new-images]');
    var photoTemplate = root.querySelector('[data-rs-new-photo]');
    if (imagesWrap && photoTemplate) {
      payload.images.forEach(function (item) {
        var photo = cloneTemplate(photoTemplate);
        if (!photo) {
          return;
        }
        var button = photo.querySelector('[data-rs-photo-open]');
        var img = photo.querySelector('img');
        var label = payload.name || 'Review photo';
        if (button) {
          button.setAttribute('data-rs-full', item.url);
          button.setAttribute('data-rs-caption', payload.name);
          button.setAttribute('data-rs-alt', label);
          button.setAttribute('aria-label', label);
        }
        if (img) {
          img.setAttribute('src', item.url);
          img.setAttribute('alt', label);
        }
        imagesWrap.appendChild(photo);
      });
    }

    list.insertBefore(node, list.firstChild);
    applyView(root);
    recomputeAggregate(root);
  }

  function submitForm(root) {
    var form = getForm(root);
    var state = getFormState(root);
    if (!form || state.submitting) {
      return;
    }

    setStatus(root, '', '');
    if (!validateForm(form)) {
      focusFirstInvalid(form);
      return;
    }

    var endpoint = (form.getAttribute('data-rs-endpoint') || '').trim();
    if (!endpoint) {
      setStatus(root, MESSAGES.notAccepted, 'error');
      return;
    }

    var rating = form.querySelector('input[name="rating"]:checked');
    var name = controlFor(form, 'name');
    var email = controlFor(form, 'email');
    var body = controlFor(form, 'body');

    var payload = {
      rating: rating ? parseInt(rating.value, 10) : 0,
      name: name ? name.value.trim() : '',
      body: body ? body.value.trim() : '',
      images: state.images.slice()
    };

    var data = new FormData();
    data.append(form.getAttribute('data-rs-field-rating') || 'rating', rating ? rating.value : '');
    data.append(form.getAttribute('data-rs-field-name') || 'name', payload.name);
    data.append(form.getAttribute('data-rs-field-email') || 'email', email ? email.value.trim() : '');
    data.append(form.getAttribute('data-rs-field-body') || 'body', payload.body);
    var imagesField = form.getAttribute('data-rs-field-images') || 'images';
    state.images.forEach(function (item) {
      data.append(imagesField, item.file, item.file.name);
    });

    state.submitting = true;
    var submit = form.querySelector('[data-rs-submit]');
    if (submit) {
      submit.disabled = true;
    }
    setStatus(root, MESSAGES.submitting, 'pending');

    fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status);
        }
        insertReview(root, payload);
        // The object URLs now belong to the inserted entry; keep them alive.
        resetForm(root, false);
        setStatus(root, MESSAGES.success, 'success');
      })
      .catch(function () {
        state.submitting = false;
        if (submit) {
          submit.disabled = false;
        }
        setStatus(root, MESSAGES.error, 'error');
      });
  }

  // ---- Image viewer -------------------------------------------------------

  function getViewer(root) {
    return root.querySelector('[data-rs-viewer]');
  }

  function getPhotos(root) {
    return root.querySelectorAll('[data-rs-photo-open]');
  }

  function getViewerState(root) {
    if (!root._rsViewer) {
      root._rsViewer = { index: 0, opener: null, prevOverflow: '' };
    }
    return root._rsViewer;
  }

  function photoInfo(photo) {
    var img = photo.querySelector('img');
    var caption = photo.getAttribute('data-rs-caption') || '';
    var alt = photo.getAttribute('data-rs-alt') || (img ? img.getAttribute('alt') : '') || '';
    var label = caption || alt || 'Review photo';
    return {
      src: photo.getAttribute('data-rs-full') || (img ? img.getAttribute('src') : ''),
      alt: label,
      caption: label
    };
  }

  function renderViewer(root, index) {
    var viewer = getViewer(root);
    var photos = getPhotos(root);
    if (!viewer || !photos[index]) {
      return;
    }
    var info = photoInfo(photos[index]);
    var image = viewer.querySelector('[data-rs-viewer-image]');
    var caption = viewer.querySelector('[data-rs-viewer-caption]');
    var prev = viewer.querySelector('[data-rs-viewer-prev]');
    var next = viewer.querySelector('[data-rs-viewer-next]');
    var single = photos.length <= 1;

    if (image) {
      image.setAttribute('src', info.src);
      image.setAttribute('alt', info.alt);
    }
    if (caption) {
      caption.textContent = info.caption;
    }
    if (prev) {
      prev.hidden = single;
      prev.disabled = index <= 0;
    }
    if (next) {
      next.hidden = single;
      next.disabled = index >= photos.length - 1;
    }
    getViewerState(root).index = index;
  }

  function openViewer(root, photo) {
    var viewer = getViewer(root);
    if (!viewer) {
      return;
    }
    var photos = getPhotos(root);
    var index = Array.prototype.indexOf.call(photos, photo);
    var state = getViewerState(root);
    state.opener = photo;
    state.prevOverflow = document.body.style.overflow || '';
    viewer.hidden = false;
    document.body.style.overflow = 'hidden';
    renderViewer(root, index < 0 ? 0 : index);
    var close = viewer.querySelector('[data-rs-viewer-close]');
    if (close) {
      close.focus();
    }
  }

  function closeViewer(root) {
    var viewer = getViewer(root);
    var state = getViewerState(root);
    if (!viewer || viewer.hidden) {
      return;
    }
    viewer.hidden = true;
    document.body.style.overflow = state.prevOverflow || '';
    if (state.opener && state.opener.focus) {
      state.opener.focus();
    }
    state.opener = null;
  }

  // Re-hide the viewer after a theme-editor re-render even if it was open.
  function resetViewer(root) {
    var viewer = getViewer(root);
    var state = getViewerState(root);
    if (viewer && !viewer.hidden) {
      viewer.hidden = true;
      document.body.style.overflow = state.prevOverflow || '';
    }
    state.opener = null;
  }

  function stepViewer(root, direction) {
    var photos = getPhotos(root);
    var index = getViewerState(root).index + direction;
    if (index < 0) {
      index = 0;
    }
    if (index > photos.length - 1) {
      index = photos.length - 1;
    }
    renderViewer(root, index);
  }

  function isViewerOpen(root) {
    var viewer = getViewer(root);
    return !!viewer && !viewer.hidden;
  }

  // Keep Tab / Shift+Tab cycling through the viewer's controls while it is open.
  function trapViewerFocus(viewer, event) {
    var controls = viewer.querySelectorAll(
      '[data-rs-viewer-close], [data-rs-viewer-prev], [data-rs-viewer-next]'
    );
    var list = [];
    Array.prototype.forEach.call(controls, function (control) {
      if (!control.hidden && !control.disabled) {
        list.push(control);
      }
    });
    if (!list.length) {
      return;
    }
    var first = list[0];
    var last = list[list.length - 1];
    var active = document.activeElement;
    if (event.shiftKey) {
      if (active === first || !viewer.contains(active)) {
        event.preventDefault();
        last.focus();
      }
    } else if (active === last || !viewer.contains(active)) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleViewerKeydown(root, event) {
    if (!isViewerOpen(root)) {
      return;
    }
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      closeViewer(root);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      stepViewer(root, -1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      stepViewer(root, 1);
    } else if (event.key === 'Tab') {
      trapViewerFocus(getViewer(root), event);
    }
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

      if (isViewerOpen(root)) {
        var viewer = getViewer(root);
        if (target.closest('[data-rs-viewer-close]')) {
          closeViewer(root);
          return;
        }
        if (target.closest('[data-rs-viewer-prev]')) {
          stepViewer(root, -1);
          return;
        }
        if (target.closest('[data-rs-viewer-next]')) {
          stepViewer(root, 1);
          return;
        }
        // A click on the overlay outside the enlarged image closes the viewer.
        if (viewer.contains(target) && !target.closest('[data-rs-viewer-image]')) {
          closeViewer(root);
          return;
        }
      }

      var formOpen = target.closest('[data-rs-form-open]');
      if (formOpen) {
        openForm(root);
        return;
      }

      var formCancel = target.closest('[data-rs-form-cancel]');
      if (formCancel) {
        closeForm(root);
        return;
      }

      var removeImageBtn = target.closest('[data-rs-remove-image]');
      if (removeImageBtn) {
        removeImage(root, parseInt(removeImageBtn.getAttribute('data-rs-remove-image'), 10));
        return;
      }

      var photo = target.closest('[data-rs-photo-open]');
      if (photo) {
        openViewer(root, photo);
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

    root.addEventListener('keydown', function (event) {
      handleViewerKeydown(root, event);
    });

    root.addEventListener('change', function (event) {
      var target = event.target;
      if (target && target.closest && target.closest('[data-rs-images]')) {
        handleImages(root, target);
      }
    });

    root.addEventListener('submit', function (event) {
      var target = event.target;
      if (target && target.closest && target.closest('[data-rs-form]')) {
        event.preventDefault();
        submitForm(root);
      }
    });
  }

  function initSection(root) {
    getState(root);
    getViewerState(root);
    getFormState(root);
    resetViewer(root);
    resetFormControl(root);
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
