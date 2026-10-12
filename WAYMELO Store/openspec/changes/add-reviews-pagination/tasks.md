# Tasks

## 1. Section markup and controls

- [x] 1.1 In `sections/reviews-section.liquid`, change the gallery/controls region condition from `image_count > 0` to `image_count > 0 or total > 3`, keeping the "Reviews with Images" heading only when `image_count > 0`; verify in the theme editor that a section with 0 images and more than 3 reviews renders the prev/next controls next to the review-list heading.
- [x] 1.2 Ensure review entries expose what paging needs — confirm each `.reviews-section__review` keeps `data-rating` and add a stable ordering marker/class if needed; verify the list container (`.reviews-section__list`, `data-rs-list`) holds all entries in authored order in the rendered HTML.
- [x] 1.3 Add an accessible current-page/needs-page signal to the controls (for example pin a `data-rs-page` / `data-rs-total` on the root and give the buttons accessible names covering review paging); verify both buttons render inside the section with the expected data attributes.

## 2. Pagination behavior in `assets/reviews-section.js`

- [x] 2.1 Define a single `PAGE_SIZE = 3` constant and a `currentPage` state (default 1) applied per section root; verify the constant is the only place the page size appears.
- [x] 2.2 Implement an `applyView(root)` routine that computes eligible entries from the active filter, and in the "All Reviews" view hides entries outside `[(currentPage-1)*PAGE_SIZE, currentPage*PAGE_SIZE)` while leaving all entries visible for a star filter; verify with 7 authored reviews that page 1 shows exactly 3, page 2 shows 3, and page 3 shows 1.
- [x] 2.3 Wire `data-rs-gallery-next` / `data-rs-gallery-prev` to advance/retreat `currentPage` by one when paging is active (`filter === all && total > 3`), falling back to the existing gallery scroll when it is not; verify clicking next moves the review page and, when a gallery exists, also scrolls the strip one step.
- [x] 2.4 Clamp `currentPage` to the valid page range and toggle the `disabled` attribute on each control at the first/last page while paging is active; verify the previous button is disabled on page 1 and the next button is disabled on the last page, and that disabling does not throw when no gallery element exists.
- [x] 2.5 Confirm that with JavaScript disabled every review entry remains visible (pagination is applied only on init); verify by loading the page with scripts blocked (or inspecting the server HTML) that no entry carries `hidden`.

## 3. Filter and editor integration

- [x] 3.1 Integrate pagination with the star filter: selecting a star pill shows all matching reviews unpaged, and returning to "All Reviews" resets `currentPage` to 1 and reapplies paging; verify filtering to a rating with more than 3 matches shows all of them, and returning to All shows page 1.
- [x] 3.2 Keep `initSection` idempotent and re-apply the active filter plus the clamped page on `shopify:section:load` and `shopify:block:select`; verify in the theme editor that switching a block's rating or reloading the section does not leave an empty page or lose the active filter.

## 4. Styles

- [x] 4.1 Add section CSS for paging controls — style the disabled state (reduced opacity / not-allowed cursor) for `.reviews-section__gallery-btn[disabled]` and any layout needed when the controls sit with the review-list heading and there is no gallery; verify the disabled buttons are visually distinct and the controls align in both the images and no-images layouts.

## 5. Integration verification

- [x] 5.1 Verify the full matrix in the theme editor: 0–3 reviews (no paging, all visible), 4+ reviews with images (controls page the list and scroll the gallery), 4+ reviews without images (controls still page the list), and a star filter with 4+ matches (all matching visible, no paging).
- [x] 5.2 Verify keyboard and assistive-tech behavior: both controls are reachable by keyboard, activate paging, announce their review-paging role, and report disabled state at page boundaries.
- [x] 5.3 Confirm existing behavior is unchanged: gallery scrolling, star filtering, rating summary, and star distribution still work, and sections with 3 or fewer reviews render identically to before.

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied.
- Verify the archived result and that `openspec/specs/storefront-reviews/spec.md` reflects the delta.
