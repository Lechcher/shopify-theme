# Proposal

## Why

On the product page, the reviews live far down in a separate `reviews-section`, but the buy box near the price shows no rating signal. Shoppers deciding at the top of the page cannot see the product's average rating or how many reviews it has, so they miss the social proof that would help them buy. Surfacing a compact star rating and review count next to the product info, linked to the reviews, closes that gap.

## What Changes

- Add a new `product-server-rating` block to the `BKY - Main Product` section (`sections/blocky-main-product.liquid`). It renders a single accessible link: five stars filled to the average rating percentage, followed by the review count in parentheses (for example `★★★★★ (10)`).
- The rating values SHALL reflect the on-page `reviews-section` aggregate (average rating and total review count) rather than separate merchant input, so the product-page teaser and the reviews section always agree.
- Because Liquid cannot read another section's blocks or settings, the block renders its stars/count from `reviews-section` data and is kept in sync by a small client-side script that reads the reviews-section DOM on load (and after theme-editor section re-renders). Before the script runs, the block must degrade gracefully.
- The link SHALL point to the on-page reviews: add a stable `id="trustshop-review"` anchor to the `reviews-section` root so `href="#trustshop-review"` scrolls to the reviews.
- Apply the supplied scoped styling for `.product-server-rating`, `.product-server-rating__stars`, and `.product-server-rating__count` (star gradient driven by a `--rating-percent` custom property).
- The block is embeddable/orderable like other main-product blocks and is safe to omit. When no reviews-section exists on the page, or it has no reviews, the block SHALL NOT show stale or broken values.
- No **BREAKING** changes. Existing blocks, the reviews section's own rendering, and all other product-page content are unchanged.

## Capabilities

### New Capabilities

- `storefront-product-rating`: The product-page rating teaser — a compact, accessible star-rating + review-count link in the main product section that reflects the on-page reviews summary and navigates to the reviews section.

### Modified Capabilities

<!-- None. The reviews section keeps all of its existing requirements; the anchor id and the
     product-page teaser are owned by the new storefront-product-rating capability. -->

## Impact

- **Code**: `sections/blocky-main-product.liquid` (new `product-server-rating` block type in the block render loop and in the section schema; markup for the link); `snippets/blocky-main-product-css.liquid` (scoped `.product-server-rating*` rules); a small script (inline in the section or a new `assets/` file) to sync the stars/count from the reviews-section DOM and re-run on `shopify:section:load` / `shopify:block:select`; `sections/reviews-section.liquid` (add `id="trustshop-review"` to the section root).
- **Behavior**: The block's displayed rating and count are derived from the reviews section at runtime; when the reviews section is absent or empty the block shows nothing (or a neutral fallback) instead of fabricated numbers.
- **Specs**: New delta at `openspec/specs/storefront-product-rating/spec.md`.
- **Out of scope**: Changing how reviews are authored or stored; reading reviews from product metafields, a reviews app, or a global data source; making the star fill or count merchant-entered text; changing the reviews section's own summary, distribution, gallery, filtering, or pagination.
