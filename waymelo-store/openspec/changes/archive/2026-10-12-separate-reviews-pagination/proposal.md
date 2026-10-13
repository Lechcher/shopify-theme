# Proposal

## Why

The review-list pagination added earlier is wired to the image gallery's previous/next buttons (`reviews-section__gallery-nav`), so a single click both pages the reviews and scrolls the photo strip, and a page-bound button is disabled for gallery scrolling too. That coupling is confusing. The reviews list deserves its own dedicated pagination control, separate from the gallery nav.

## What Changes

- Add a dedicated pagination control for the review list, rendered **below the review list entries**.
- The control contains a previous button, a **"Page X of Y" indicator**, and a next button.
- Detach review paging from `reviews-section__gallery-nav`: those controls return to scrolling the image gallery only, with no disabled/paging behavior.
- Keep the existing paging semantics: 3 reviews per page (fixed), pagination applies only to the "All Reviews" view, a star filter shows all matching reviews unpaged, and returning to "All Reviews" starts at page 1.
- Show the pagination control only when there is more than one page; hide it when all reviews fit on one page.
- Keep the section readable without JavaScript: all reviews remain visible until the script applies paging.
- No **BREAKING** changes to the gallery, filters, summary, or distribution.

## Capabilities

### New Capabilities
<!-- None. This revises behavior within the existing storefront-reviews capability. -->

### Modified Capabilities
- `storefront-reviews`: Review-list pagination gains a dedicated control (prev / "Page X of Y" / next) below the list; the gallery previous/next controls no longer page the review list and revert to gallery-only behavior.

## Impact

- **Code**: `sections/reviews-section.liquid` (add the pagination control markup below the list; restore the gallery nav to gallery-only markup and labels); `assets/reviews-section.js` (bind the new pagination controls, stop paging from the gallery buttons, update the "Page X of Y" indicator and disabled/bound states); section CSS for the new pagination control.
- **Relationship to prior change**: This supersedes the shared-control approach in `add-reviews-pagination` (implemented but not yet archived). Because that change's delta has not reached `openspec/specs/storefront-reviews/spec.md`, this change is written as additions against the current main spec; its `design.md` records the recommended archival order and the resulting requirement to reconcile. Reverting the gallery controls aligns with the existing "Reviews-with-images gallery" requirement, which already specifies gallery-only scrolling.
- **Specs**: Delta for `openspec/specs/storefront-reviews/spec.md`.
- **Out of scope**: Merchant-configurable page size; numbered page buttons; paginating star-filtered results; any change to the gallery's horizontal scrolling behavior itself.
