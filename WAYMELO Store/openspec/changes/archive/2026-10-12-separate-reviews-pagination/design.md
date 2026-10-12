# Design

## Context

See `proposal.md` — Why. Current state after the earlier pagination work:

- `sections/reviews-section.liquid` renders one shared `rs_nav` capture in two places: the gallery head (when images exist) and the review-list head (when no images and >3 reviews). Its buttons carry `data-rs-gallery-prev` / `data-rs-gallery-next` and page the review list.
- `assets/reviews-section.js` keeps per-root state (`{ filter, page }`), `PAGE_SIZE = 3`, and an `applyView(root)` that slices the pre-rendered entries. Both the gallery scroll and the review paging are triggered from the same `data-rs-gallery-*` buttons via one delegated click listener.
- The main spec `openspec/specs/storefront-reviews/spec.md` still describes the gallery controls as gallery-only; the pagination delta lives in the unarchived change `add-reviews-pagination`.

## Goals / Non-Goals

**Goals:**

- Give the review list its own pagination control below the entries, with previous / "Page X of Y" / next.
- Return the gallery controls to gallery-only scrolling.
- Preserve existing pagination semantics (3 per page, "All Reviews" only, disabled at bounds, no-JS visible).

**Non-Goals:**

- Changing the gallery's scrolling behavior, the star filters, the rating summary, or the distribution.
- Merchant-configurable page size or numbered page buttons.

## Decisions

### Dedicated pagination markup below the list

Add a `nav.reviews-section__pagination` after the `.reviews-section__list` container, rendered only when `total > 3`:

- `button[data-rs-page-prev]` and `button[data-rs-page-next]` — reuse the existing `.reviews-section__gallery-btn` shape via a new `.reviews-section__pagination-btn` class.
- `span[data-rs-page-status]` — the "Page X of Y" indicator, with `role="status"` and `aria-live="polite"` so page changes are announced.
- The `nav` carries an accessible name (e.g. "Review pagination"); each button gets a review-paging `aria-label`.

Liquid computes `total_pages` with `total | plus: 2 | divided_by: 3` (ceiling division) so the server-rendered indicator starts at "Page 1 of N".

- **Alternative considered:** numbered page buttons. Rejected by the user in favor of arrows + indicator.

### Restore the gallery nav to gallery-only

Drop the shared `rs_nav` capture. Render the gallery controls inline in the gallery head as they were originally, with labels derived from the images heading, bound only to `scrollGallery`. This also removes the `image_count == 0` branch that injected the shared controls into the list head. This aligns with the existing "Reviews-with-images gallery" requirement, so no gallery requirement changes.

### Split the JS control roles

One delegated click listener per root (guarded by `root.dataset.rsBound`) routes by data attribute:

- `data-rs-gallery-prev` / `data-rs-gallery-next` → `scrollGallery(root, ±1)` only.
- `data-rs-page-prev` / `data-rs-page-next` → change `state.page` when paging is active, then `applyView`.
- `data-rs-filter` → `handleFilter` (unchanged: sets filter, resets page to 1).

`applyView` keeps the existing slice logic and calls a new `updatePagination(root, …)` instead of the old `updateControls`, which:

- hides the pagination `nav` when paging is not active (filter is a star level, or the list fits on one page);
- toggles `disabled` on the prev/next buttons at the page bounds;
- writes the "Page X of Y" text and mirrors `data-rs-page` / `data-rs-pages` on the root.

`PAGE_SIZE` stays a single module constant.

### Idempotent re-init

Keep `initSection` re-runnable: `bindControls` binds once per root, and `applyView` recomputes from the current DOM, so `shopify:section:load` and `shopify:block:select` re-apply the active filter and clamp the page without leaving an empty page.

## Risks / Trade-offs

- [Supersession with the unarchived `add-reviews-pagination`] Its delta defines pagination through the shared gallery controls and is not yet in the main spec → Mitigation: this change is written as additions against the current main spec. Recommended sequence: **archive `add-reviews-pagination` first**, then, before archiving this change, convert its delta to modify/replace the shared-control requirement (the two cannot both hold once both are archived). If `add-reviews-pagination` is instead abandoned, this change's additions stand on their own. This is a planning/archival concern, not a runtime one.
- [Inert control without JavaScript] The pagination `nav` renders whenever `total > 3` but does nothing if the script does not run → Mitigation: entries remain visible without JS per the no-JS requirement; the control is layered on as progressive enhancement.
- [Indicator announcing on every render] `aria-live="polite"` re-announces on filter changes → Mitigation: updates only when the text actually changes; page changes are the meaningful events.
- [Editor re-render loses state] → Mitigation: keep initialization idempotent and re-apply filter + clamped page on editor events, matching the existing pattern.

## Migration Plan

Front-end-only; no data or migration. Deploy by updating `sections/reviews-section.liquid` and `assets/reviews-section.js`. Rollback reverts those two files. Sections with three or fewer reviews keep rendering exactly as they do now (no pagination control).

## Open Questions

None.
