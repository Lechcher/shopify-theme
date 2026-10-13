# Tasks

## 1. Detach the gallery nav

- [x] 1.1 In `sections/reviews-section.liquid`, remove the shared `rs_nav` capture and render the gallery previous/next controls inline in `.reviews-section__gallery-head` with labels derived from the images heading; verify in the rendered HTML that the gallery controls are inside the gallery head and that no controls are injected into `.reviews-section__list-head`.
- [x] 1.2 Delete the `{%- if image_count == 0 and total > 3 -%}{{ rs_nav }}{%- endif -%}` branch from the list head; verify a section with no images and more than 3 reviews no longer renders gallery controls next to the list heading.

## 2. Dedicated pagination control markup

- [x] 2.1 Add a `nav.reviews-section__pagination` after the `.reviews-section__list` container, rendered only when `total > 3`, containing a previous button (`data-rs-page-prev`), a status span (`data-rs-page-status`, `role="status"`, `aria-live="polite"`), and a next button (`data-rs-page-next`); verify the markup renders below the list entries for a section with more than 3 reviews.
- [x] 2.2 Compute `total_pages` in Liquid with ceiling division (`total | plus: 2 | divided_by: 3`) and render the indicator as "Page 1 of {{ total_pages }}"; give the `nav` and each button accessible names covering review paging; verify the server-rendered indicator text and the buttons' `aria-label`s.

## 3. Pagination behavior in `assets/reviews-section.js`

- [x] 3.1 Route clicks in the delegated listener so `data-rs-gallery-prev`/`data-rs-gallery-next` call `scrollGallery` only, while `data-rs-page-prev`/`data-rs-page-next` change `state.page` (when paging is active) and re-run `applyView`; verify clicking a gallery control does not change the visible review page and clicking a pagination control does.
- [x] 3.2 Replace `updateControls` with `updatePagination(root, ...)` that shows the `nav` only when paging is active (`filter === 'all' && total > PAGE_SIZE`), toggles `disabled` on the prev/next buttons at the page bounds, and writes the "Page X of Y" text; verify the nav is hidden for a star filter and for a single page, and the indicator reads "Page 1 of N".
- [x] 3.3 Keep `PAGE_SIZE = 3` as the single source of the page size and keep `applyView` clamping the page to the valid range; verify with 7 authored reviews that page 1 shows 3, page 2 shows 3, page 3 shows 1, and the indicator matches.
- [x] 3.4 Confirm that without JavaScript every review entry remains visible (pagination is applied only on init); verify the server HTML contains no `hidden` attribute on `.reviews-section__review` entries.

## 4. Styles

- [x] 4.1 Add section CSS for `.reviews-section__pagination` (layout of previous / indicator / next, spacing below the list) and `.reviews-section__pagination-btn`, including a visually distinct `[disabled]` state; verify the control is centered/aligned below the list and disabled buttons are visually distinct.

## 5. Integration verification

- [x] 5.1 Verify the matrix: 0–3 reviews (no pagination control, all visible), 4+ reviews with images (pagination control below the list; gallery controls scroll the strip only), 4+ reviews without images (pagination control still present below the list), and a star filter with 4+ matches (all matching visible, pagination control hidden).
- [x] 5.2 Verify keyboard and assistive-tech behavior: both pagination buttons are reachable by keyboard, activate page changes, announce their review-paging role, report disabled state at page boundaries, and the indicator conveys current and total pages.
- [x] 5.3 Confirm existing behavior is unchanged: gallery horizontal scrolling, star filtering, rating summary, and star distribution still work, and sections with 3 or fewer reviews render identically to before this change.

## Workflow follow-up

- Reconcile with `add-reviews-pagination`: archive it first, then convert this change's delta to modify/replace its shared-control requirement so the main spec does not contain both the shared-control and dedicated-control behaviors; or abandon `add-reviews-pagination` if it is superseded.
- Archive this change after reconciliation and the project's review requirements are satisfied, then verify `openspec/specs/storefront-reviews/spec.md` reflects the dedicated pagination control.
