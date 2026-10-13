# Design

## Context

See `proposal.md` — Why for motivation and `specs/storefront-reviews/spec.md` for required behavior.

Current state relevant to the approach:

- `sections/reviews-section.liquid` renders review photos in two places: gallery items (`<li class="reviews-section__gallery-item"><img … loading="lazy">`, requested at `image_url: width: 400`) and review-entry photos (`<div class="reviews-section__review-image"><img …>`, requested at `image_url: width: 300`). Both are plain, non-interactive `<img>` elements.
- The section keeps all of its CSS in a single `{% style %}` block scoped by `#reviews-section-{{ section.id }}`, driven by section settings exposed as CSS custom properties. Behavior lives in `assets/reviews-section.js`, loaded with `defer`, and uses one delegated click listener per section root (idempotent across theme-editor re-renders).
- The theme ships a shared `modal-dialog` custom element in `assets/global.js`. Its `connectedCallback` moves the element to `document.body`, and its constructor requires a `[id^="ModalClose-"]` child. Moving to `document.body` would remove the overlay from under `#reviews-section-{{ section.id }}`, so the section's scoped styles would not apply, and it would couple the section to `global.js` being present.
- `sections/blocky-main-product.liquid` already opens an in-place modal for review videos (`blocky-review-modal`, `data-review-modal-*`), styled by that section and driven by its own script — the established pattern for "click review media → enlarged overlay" is a section-scoped overlay, not the shared dialog.

## Goals / Non-Goals

**Goals:**

- One section-scoped overlay that reuses the section's existing styling conventions and delegated-event model.
- Fully keyboard-accessible open, navigate, and close, with focus containment and restoration.
- No change to any existing review control and no new merchant settings.

**Non-Goals:**

- Zoom/pan/rotate, download/share, or video in the viewer.
- Replacing or refactoring the section's existing gallery, filter, or pagination behavior.
- Generalizing the viewer into a theme-wide, reusable lightbox component.

## Decisions

### 1. A section-scoped overlay, not the shared `modal-dialog`

Add the overlay markup inside the section root (rendered by Liquid, `hidden` by default) with the class prefix `reviews-section__viewer__*`, and style it in the same `{% style %}` block. Drive its behavior from `assets/reviews-section.js`.

- Rationale: the overlay stays under `#reviews-section-{{ section.id }}`, so the section's scoped CSS applies; and the section stays self-contained (no dependency on `global.js` or its load order).
- Alternative: reuse `modal-dialog` (as `quick-add`/`product-modal` do) — rejected: it relocates to `document.body`, breaking `#reviews-section-*` scoping, and it expects markup/ids the section does not have.
- Alternative: a theme-wide `image-viewer` custom element — rejected as over-scoped for a single section's need; can be promoted later.

### 2. Render each photo as a button; carry the full-size URL and caption in data attributes

Wrap each review photo `<img>` in a `<button type="button" class="reviews-section__photo" data-rs-photo-open …>`. On the button, carry `data-rs-full` (a larger `image_url`, e.g. `width: 1600`), `data-rs-caption` (the reviewer name), and `data-rs-alt`. A single shared `reviews-section__viewer` element is rendered once per section.

- Rationale: a `<button>` gives free keyboard focus/activation and an accessible role; the visible `<img>` keeps its small display size and lazy loading, so no extra bytes load until the viewer sets the large URL as an `src`; the full list of photos is discoverable in DOM order by querying `[data-rs-photo-open]`.
- Alternative: click listeners on the `<img>`s and generated anchors — rejected: buttons are semantics-correct and styling-neutral; keeping attributes on one element makes index/caption lookup trivial.
- Caption fallback: when a review block has no reviewer name, fall back to the image's alt text, then to a generic label; the same value is used for the enlarged image's text alternative.

### 3. Populate one shared viewer on open, navigating by index

The delegated click listener resolves the clicked `[data-rs-photo-open]`, computes its index within the section's `[data-rs-photo-open]` list, and opens the shared viewer, setting the `<img>` `src`/`alt` and the caption from that photo's data attributes. Previous/next adjust the index, re-populate, and update control state.

- Rationale: one overlay instance per section keeps the DOM light and matches the section's existing single-listener pattern; everything is derived from live DOM, so theme-editor re-renders are handled by re-querying rather than caching.
- Bounded navigation: previous is disabled at the first photo and next at the last, consistent with the section's pagination controls; when a section has a single photo the viewer shows just the close control and hides prev/next.

### 4. Focus, keyboard, and scroll handling in the section script

On open: remember the invoking element, remove `hidden`, save and set `document.body.style.overflow = 'hidden'`, move focus to the close control, and confine `Tab`/`Shift+Tab` to the viewer's focusable controls. `Escape` closes; `ArrowLeft`/`ArrowRight` navigate. On close: restore `body` overflow, re-hide the viewer, and return focus to the invoking photo.

- Rationale: self-contained focus trap and scroll lock avoid depending on `global.js` helpers (`trapFocus`, `removeTrapFocus`) that may not be present.
- Alternative: rely on the native `<dialog>` element — considered; a plain overlay keeps styling and theme-editor behavior consistent with the section's other custom controls, and avoids `showModal()` display quirks inside the editor. The overlay is still exposed as `role="dialog"` with `aria-modal="true"`.

### 5. Keep the existing delegated-listener and re-init model

Extend the section's existing `root` click listener with branches for `[data-rs-photo-open]`, `[data-rs-viewer-close]`, `[data-rs-viewer-prev]`, and `[data-rs-viewer-next]`, and add a section-level `keydown` listener (guarded so it only acts while the viewer is open). Reuse `initSection` so the theme editor re-initializes cleanly; because the viewer is Liquid-rendered and defaults to `hidden`, a re-render resets it closed.

- Rationale: matches the section's current design (one listener per root, idempotent init), so no new lifecycle handling is introduced.

## Risks / Trade-offs

- [Overlay relocated or re-rendered by the editor leaves it inconsistent] → the viewer is static Liquid markup that defaults to `hidden`, and all state is derived from the DOM on each open; `initSection` re-runs on `shopify:section:load` / `shopify:block:select`.
- [Body scroll lock leaks if the section is removed while open] → close restores the saved prior `overflow` value; re-init and `shopify:section:load` also force the viewer closed.
- [Manual focus trap can miss focusable elements] → the viewer contains a small, fixed set of controls (prev/next/close); the trap cycles that known set, and the enlarged image is not focusable.
- [Large viewer images add payload] → the large URL lives in a `data-` attribute and is only assigned to an `src` when a photo is opened, so nothing extra downloads on page load.
- [Multiple sections each with a viewer] → each viewer is scoped to its own root and its own state; only one section's viewer is opened by a click, so cross-section interference is not a concern.
- [Alt text duplicates across photos authored without names] → the caption and enlarged image fall back to the image alt text, then a generic label, keeping the viewer's text alternatives non-empty.

## Migration Plan

- Deploy: the updated section and script ship with the theme; the viewer is inert until a photo is clicked and degrades to visible photos without JavaScript. No template, setting, or data changes.
- Rollback: revert `sections/reviews-section.liquid` and `assets/reviews-section.js`. No data migration and no side effects on other sections.

## Open Questions

- Whether `ArrowLeft`/`ArrowRight` navigation should be suppressed when focus is not inside the viewer — deferred; the keydown handler already only acts while the viewer is open and can be narrowed during implementation without affecting the specs.
