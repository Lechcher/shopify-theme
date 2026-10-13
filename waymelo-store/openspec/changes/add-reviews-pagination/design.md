# Design

## Context

See `proposal.md` — Why. The relevant current state:

- `sections/reviews-section.liquid` renders every `review` block twice: once as a gallery item (only when the block has an image) and once as a review entry in `.reviews-section__list` with `data-rating`.
- `assets/reviews-section.js` is progressive-enhancement only. Review entries render visible on the server; the script binds two independent behaviors — the star filter pills (toggle `hidden` on entries) and the gallery prev/next controls (smooth horizontal scroll of the image strip). Both are idempotent and re-run on `shopify:section:load` and `shopify:block:select`.
- The gallery prev/next controls live inside `.reviews-section__gallery-nav`, which is only rendered when `image_count > 0`.
- All filtering and gallery behavior is client-side; there is no server round-trip for reviews.

## Goals / Non-Goals

**Goals:**

- Page the review list to 3 entries at a time in the "All Reviews" view, client-side.
- Drive review paging from the existing gallery prev/next controls.
- Make the controls available for paging even when the section has no review images.
- Keep the existing filter and gallery behaviors working, and keep the section readable without JavaScript.

**Non-Goals:**

- Merchant-configurable page size (fixed at 3) or numbered page buttons.
- Paginating star-filtered results, or changing how filtering/gallery scrolling work.
- Server-side or Storefront-API pagination of reviews.

## Decisions

### Client-side paging of the pre-rendered entries

Keep rendering all review blocks on the server and paginate in the DOM by toggling `hidden`, exactly as the existing filter does. This preserves the progressive-enhancement guarantee (no-JS shows everything), requires no Liquid-side paging loop, and composes with the existing filter that already hides/shows the same entries.

- **Alternative considered:** Liquid-side `for limit/offset` paging. Rejected: it would need a full page reload per page, would fight the client-side filter, and would break the "readable without JavaScript" behavior because a page would render a subset.

### Shared gallery controls drive paging

The two existing buttons (`data-rs-gallery-prev` / `data-rs-gallery-next`) page the review list **and** scroll the image strip. Rationale: this is the user-selected behavior and avoids adding new controls or UI.

Introduce a single `pagingActive` flag = `currentFilter === 'all' && totalReviews > 3`. Behavior:

- When `pagingActive`, a button click pages the review list by one page and, if a gallery exists, also scrolls the strip one step (preserving today's gallery behavior).
- When not `pagingActive` (a star filter is active, or there are 3 or fewer reviews), the buttons only scroll the gallery and are never disabled by paging.

**Consequence / trade-off:** at a page boundary the corresponding button is disabled, so it also cannot scroll the gallery at that moment. This is acceptable: the gallery returns to normal control when the shopper changes filter/page, and the button being disabled correctly reflects the page bound. Documented as a trade-off below.

### Controls exist whenever paging is possible

Today `.reviews-section__gallery-nav` renders only when `image_count > 0`. Change the condition to `image_count > 0 or total > 3`:

- If `image_count > 0`: keep the current layout — "Reviews with Images" heading with the controls in `.reviews-section__gallery-head`.
- If `image_count == 0` but `total > 3`: render the same controls (same class and data attributes) grouped with the review-list heading, without the empty images heading.

The script binds by data attribute, so the control location does not matter.

### Page state and integration with the filter

Track `currentPage` (1-based) on the root element via a `data` attribute / closure variable. Derive the page from the entries currently *eligible* under the active filter:

- `All Reviews`: eligible = all entries; apply paging — hide entries outside `[(page-1)*3, page*3)`.
- Star filter: eligible = matching entries; show all of them and bypass paging.
- Switching filters resets `currentPage` to 1.
- Clamp `currentPage` to the valid range after any re-render (theme editor `shopify:block:select` / `section:load`) so a now-smaller list never lands on an empty page.

### Accessibility of the paging state

Use the native `disabled` attribute on a control when its paging bound is reached while `pagingActive`, and give each control an accessible name that mentions review paging (e.g. "Reviews: previous page" / "Reviews: next page") in addition to the gallery meaning, or set an `aria-label` that covers both roles. Keep keyboard activation via native `<button>`.

## Risks / Trade-offs

- [One click does two things] Paging also nudges the image strip → Mitigation: scroll is smooth and one step; the gallery remains independently scrollable (touch/drag/snap) regardless of the buttons.
- [Disabled button blocks gallery scroll at a page bound] → Mitigation: only while `pagingActive`; the page-bound is transient and the gallery's own overflow scrolling still works.
- [Double-paging control when there are no images] The controls sit with the list heading but still carry gallery data attributes → Mitigation: the gallery-scroll handler no-ops when no gallery element exists.
- [Editor re-render loses page/filter state] → Mitigation: keep initialization idempotent and re-apply the active filter + clamped page on `shopify:section:load` / `shopify:block:select`, matching the existing pattern.
- [Page size is fixed] A future request for configurability would touch the schema and the constant → Mitigation: isolate the page size as a single named constant.

## Migration Plan

Front-end-only, no data or schema migration. Deploy by updating `sections/reviews-section.liquid` and `assets/reviews-section.js`. Rollback is reverting those two files; rendered content is unaffected. Sections with 3 or fewer reviews are unchanged.

## Open Questions

None.
