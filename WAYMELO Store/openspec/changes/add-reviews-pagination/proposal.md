# Proposal

## Why

The reviews section currently renders every authored review block in a single, ever-growing list. Sections that accumulate many reviews become long and hard to browse, pushing other page content far down. Limiting the list to a few reviews at a time, with navigation between pages, keeps the section compact and scannable as review volume grows.

## What Changes

- Paginate the review list: show at most **3 reviews at a time** (fixed; not merchant-configurable) in the default "All Reviews" view.
- When the list holds more than 3 reviews, let shoppers move between pages using prev/next controls. The existing `reviews-section__gallery-nav` prev/next buttons (`data-rs-gallery-prev` / `data-rs-gallery-next`) drive this paging in addition to their current image-gallery scrolling.
- Ensure the navigation controls are present whenever paging is possible, including when no review photos exist and the image-gallery region would otherwise not render.
- While a star filter pill (5–1 star) is active, show all matching reviews without pagination; pagination applies only to the "All Reviews" view. Returning to "All Reviews" restores the paginated view.
- Keep the section readable without JavaScript: before scripts run, all authored reviews remain visible (progressive enhancement), and pagination is applied by the existing section script.
- No **BREAKING** changes. Sections with 3 or fewer reviews render exactly as before, with no visible paging.

## Capabilities

### New Capabilities
<!-- None. This adds behavior to the existing storefront-reviews capability. -->

### Modified Capabilities
- `storefront-reviews`: The review list is now paginated in the "All Reviews" view (3 per page) and reuses the gallery prev/next controls for page navigation, while star-filtered views continue to show all matching reviews at once.

## Impact

- **Code**: `sections/reviews-section.liquid` (render paging state and ensure the nav controls exist when paging is possible); `assets/reviews-section.js` (page the pre-rendered review entries, integrate with the existing gallery and filter logic, handle the editor re-render path); section CSS for disabled/at-bounds control states and current-page feedback.
- **Behavior**: The gallery prev/next buttons now affect two regions (image gallery and review-list paging) in the "All Reviews" view; this interaction is captured in `design.md`.
- **Specs**: Delta for `openspec/specs/storefront-reviews/spec.md`.
- **Out of scope**: Making page size merchant-configurable; numbered page buttons; pagination of star-filtered results; server-side/collection-level review pagination.
