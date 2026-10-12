# Design

## Context

See `proposal.md` — Why for motivation and `specs/storefront-reviews/spec.md` for required behavior.

Current state relevant to the approach:

- The theme has two content-modelling patterns for sections. Most `blocky-*` sections inline their CSS in a `{% style %}` block driven by section/block settings exposed as CSS custom properties, and load a shared global stylesheet (`assets/blocky-lys.css`) plus per-section assets via `asset_url`. Core Dawn sections use `t:` translation keys; `blocky-*` sections mostly hardcode English labels and expose headings as settings.
- Existing review UI lives inside the large product section (`sections/blocky-main-product.liquid`): `product_reviews`, `product_reviews_2`, `review_carousel`, and `review-stars` blocks, plus a standalone `BKY - Testimonials` section. All render a small, fixed amount of content and none provide an aggregate rating, a star distribution, a photo gallery, or star filtering.
- No third-party reviews app and no Shopify Reviews metafields are used in this theme.
- `.blocky-page-width` and `.blocky-padding` are referenced by several `blocky-*` sections but have no definition shipped in any stylesheet (`assets/*.css`); only a footer-scoped override exists. A new section should not depend on them.
- A slider library is not available as a standalone asset (`Glide` is referenced from the product section but not vendored in `assets/`).

## Goals / Non-Goals

**Goals:**

- A self-contained, reusable section that reproduces the reference layout and works with any number of merchant-authored reviews.
- Summary, distribution, and pill counts are correct and available without JavaScript.
- Filtering and gallery navigation are instant and keyboard operable.

**Non-Goals:**

- Fetching, submitting, or moderating reviews; syncing with a reviews app.
- Pagination/load-more and photo/video upload.
- Localization of fixed labels beyond English defaults (headings remain merchant-editable settings).

## Decisions

### 1. Ship a standalone section, not a product-section block

Add `sections/reviews-section.liquid`. The reference is a full-width band, and a standalone section can be placed on product, page, or index templates without product context. This also avoids editing `blocky-main-product.liquid` (already >6000 lines) and keeps the change isolated.

- Alternative: a new block type in the product section — rejected: product-only, couples to a large file, and needs the `product` object.
- Class prefix: `reviews-section__*` to avoid colliding with existing `product-review-*` / `blocky-*` review classes.

### 2. Model each review as a repeatable `review` block

Section blocks: `review` (rating range 1–5, author text, date text, `verified` checkbox, body richtext, `image` image_picker). Section settings hold the headings ("Reviews with Images", "Top reviews"), the labels ("All Reviews", "Verified Purchase"), colors, section width, and padding.

- Alternative: a fixed three-review block like the existing `product_reviews` — rejected: cannot support a filterable list or a distribution.
- Alternative: derive from `product.metafields.reviews` or an app — rejected: no app is installed, and the required data (text + photos per review) is not present.
- Set a `limit` on the block (for example 50) to bound the render loop.

### 3. Compute summary, distribution, and counts in Liquid

While rendering, iterate `section.blocks` once and accumulate: total count, sum of ratings (for the average), and a counter per star level. Emit the per-level percentage as a CSS custom property (`--star-pct-5` … `--star-pct-1`) consumed by the distribution bars' width, and render each pill's count directly.

- Rationale: correct without JavaScript, no layout shift, and a single source of truth. Liquid lacks easy arrays, so use five explicit counters incremented in the loop.
- Alternative: compute in JS — rejected: blank/flickering summary when JS is off or slow.

### 4. Filter by toggling pre-rendered entries

Render every review entry once with a `data-rating` attribute. A small script keeps the pills' and entries' state in sync: selecting a pill shows entries whose `data-rating` matches and hides the rest; "All Reviews" shows all. The selected pill gets `aria-pressed="true"` and a selected style.

- Rationale: instant, no network round-trip, degrades gracefully — with JS disabled every entry is visible by default and the list is still readable.
- Alternative: server round-trip per filter — rejected: needless complexity and latency; content is static.

### 5. Gallery via native horizontal scroll + scroll-snap

The "Reviews with Images" strip is a `overflow-x: auto` flex row with `scroll-snap`, containing one item per review that has an image. The previous/next controls call `scrollBy` by one item's width.

- Rationale: no slider dependency (none is vendored), accessible by keyboard/touch natively, minimal JS.
- Alternative: vendor/add a slider library — rejected: new dependency and weight for a one-row strip.

### 6. Keep styles in-section and define the width container locally

Put the section's CSS in a `{% style %}` block scoped by `#reviews-section-{{ section.id }}`, consistent with sibling sections, and drive values from settings via CSS custom properties. Load behavior from a dedicated `assets/reviews-section.js` with `defer` (mirroring how sections load `blocky-video.js`). Define the max-width/padding container inside the section rather than using `.blocky-page-width`/`.blocky-padding`, which have no shipped definition.

### 7. Fixed labels are settings with English defaults

Headings and labels ("All Reviews", "Verified Purchase", "N Star") are section settings with English defaults, matching the `blocky-*` convention, so merchants can rename them without a locale change. Locale keys are deferred.

## Risks / Trade-offs

- [Large authored lists make the Liquid loop and DOM heavy] → bound with a `limit` on the `review` block and keep entries lightweight; a "visible limit" setting can be added later if needed.
- [With JavaScript disabled the filter pills are inert] → entries render visible by default, so the list is fully readable; pills degrade to a non-destructive, visually present control.
- [Distribution percentages can drift from rounding] → compute integer percentages from exact counts; a one-point mismatch with the bar is acceptable and does not change behavior.
- [Average-rating display format varies] → render with a fixed decimal setting; document the default (one decimal place).
- [Dependence on undefined `.blocky-page-width`] → define width/padding locally in the section.
- [Name confusion with existing `product_reviews` UI] → distinct section name (`BKY - Reviews Section`) and `reviews-section__` class prefix.
- [Review images cause layout shift] → render images with `image_url` at a fixed width, `loading="lazy"`, and an aspect-ratio box.

## Migration Plan

- Deploy: the section files ship with the theme, and the section is pre-placed in `templates/product.json` (seeded with five sample `review` blocks, three of which have images) so it renders on the product page immediately and the merchant can add, edit, or remove reviews in the theme editor. Additional placements can be added on any template from the editor. (The original plan required no template edits; a placement was added so the section is usable without a manual step.)
- Rollback: remove the section from the template (or revert the added files). No data migration and no changes to existing sections, so rollback has no side effects.

## Open Questions

- On narrow screens, should the rating summary sit above the review list (stacked) or collapse into a compact single line? Default assumption: stack the summary above the list on mobile; revisit during implementation if the reference implies otherwise.
