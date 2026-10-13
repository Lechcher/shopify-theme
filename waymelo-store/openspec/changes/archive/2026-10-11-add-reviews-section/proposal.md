# Proposal

## Why

The storefront already shows customer praise in fragmented ways — a three-item "Product Reviews" block and a "Testimonials" section — but it has no single, convincing reviews surface that mirrors what shoppers expect from a mature store: an aggregate rating with a star-distribution breakdown, a gallery of real customer photos, and a filterable list of individual reviews. The reference layout ("Reviews with Images" gallery plus "Top reviews" with star filter pills) is the pattern shoppers trust most when deciding to buy, and the current theme cannot produce it.

## What Changes

- Add a new standalone, reusable storefront section, `BKY - Reviews Section` (`sections/reviews-section.liquid`), that renders the reference layout:
  - A rating summary with a 5→1 star distribution (one bar per star level, showing the percentage of reviews).
  - A "Reviews with Images" heading with a horizontally scrollable gallery of customer review photos and previous/next arrow controls.
  - A "Top reviews" heading.
  - Star filter pills (All Reviews, 5 Star, 4 Star, 3 Star, 2 Star, 1 Star), each showing its count.
  - A vertical list of review entries; each entry shows a star rating, reviewer name, a "Verified Purchase" label, a date, the review body, and an optional review photo.
- Author review content through theme-editor settings using repeatable blocks: one `review` block per review (rating, author, date, verified flag, body, optional image), plus section-level headings and styling controls.
- Derive the aggregate rating (average and total count), the per-star distribution, and each filter pill's count from the authored review blocks.
- Make the star filter pills interactive: choosing a pill filters the visible review list to that star level (client-side), and "All Reviews" restores the full list. The gallery arrows scroll the photo strip.
- Style the section to match the reference at mobile and desktop breakpoints, with configurable colors, page width, and padding consistent with sibling sections.
- No **BREAKING** changes. This is a new, independent section; the existing `product_reviews`, `product_reviews_2`, `review_carousel`, `review-stars`, and `Testimonials` blocks/sections are untouched.

## Capabilities

### New Capabilities
- `storefront-reviews`: Display of customer reviews on the storefront — the aggregate rating summary and star distribution, the reviews media gallery, star-based filtering of the review list, and the rendering of individual review entries (rating, author, verified status, date, body, photo) configured by the merchant.

### Modified Capabilities
<!-- None. openspec/specs/ is empty; this change introduces a new capability and does not alter any existing capability. -->

## Impact

- **Code**: New `sections/reviews-section.liquid` (markup, styles, and schema). If styling or behavior is not kept inline, new `assets/reviews-section.css` and `assets/reviews-section.js`, following the naming and loading conventions of sibling sections (`{{ '...' | asset_url | stylesheet_tag }}`). Possible new `locales/en.default.json` keys for filter labels ("All Reviews", "N Star"), "Verified Purchase", and the gallery heading.
- **Templates**: No template edits required; the merchant adds the section in the theme editor to any template.
- **Data**: Merchant-authored content stored in section settings (review blocks). No third-party reviews app, no Shopify Reviews metafields, and no external network requests.
- **Assumptions (recorded)**: (1) review content is merchant-authored in the theme editor rather than sourced from a reviews app; (2) the section is standalone and reusable rather than a block inside the existing product section; (3) the filter pills and gallery arrows are interactive; (4) accessibility (keyboard operability, screen-reader labels) and graceful behavior with zero reviews matter.
- **Out of scope**: Storefront review submission, moderation, pagination or "load more", photo/video upload, synchronization with a reviews app, and localization beyond English keys.
