# Tasks

## 1. Reviews-section bridge

- [x] 1.1 In `sections/reviews-section.liquid`, add `data-rs-avg="{{ avg_display }}"` and `data-rs-avg-pct="{{ avg_pct }}"` to the section root element (alongside the existing `data-rs-total`). Verify by rendering a product page and confirming the three attributes appear on the `[data-rs]` element with the same values the summary shows.
- [x] 1.2 In `sections/reviews-section.liquid`, add a stable anchor element with `id="trustshop-review"` near the top of the section (for example an empty `<span id="trustshop-review" aria-hidden="true"></span>` before `.reviews-section__inner`), since the root `id` is already used for section scoping. Verify the rendered page contains exactly one `#trustshop-review` and that `window.location.hash = 'trustshop-review'` scrolls to the section.
- [x] 1.3 Confirm the bridge attributes are emitted independently of the `show_summary` setting by rendering the section with `show_summary` off and confirming `data-rs-avg` / `data-rs-avg-pct` are still present and correct.

## 2. Main product rating block

- [x] 2.1 In `sections/blocky-main-product.liquid`, add a `{%- when 'product-server-rating' -%}` branch to the block render loop (near the existing `review-stars` / `rating_text_icon` cases). Render a wrapper marked `data-product-server-rating` and `hidden`, containing `<a class="product-server-rating" href="#trustshop-review">` with a `.product-server-rating__stars` span (`aria-hidden="true"`) and a `.product-server-rating__count` span. Include `{{ block.shopify_attributes }}` for theme-editor selection. Verify no Liquid errors and the block renders in the editor.
- [x] 2.2 Add a `product-server-rating` block type to the section `{% schema %}` `blocks` array with literal English name "Product Server Rating" and a `limit` of 1, following the existing block definition style. Verify `shopify theme check` reports no schema errors for `sections/blocky-main-product.liquid`.
- [x] 2.3 Load the sync script only when the block is present — add a `<script src="{{ 'product-server-rating.js' | asset_url }}" defer></script>` guarded by a `section.blocks | where: 'type', 'product-server-rating'` check near the other conditional scripts. Verify the tag is absent when the block is not placed and present when it is.

## 3. Styling

- [x] 3.1 Add scoped `.product-server-rating`, `.product-server-rating__stars`, and `.product-server-rating__count` rules to `snippets/blocky-main-product-css.liquid`, scoped under `#blocky-featured-product-{{ section.id }}`, using the supplied properties (flex row, 20px line height, gradient-clipped stars driven by `--rating-percent`, count text color/size). Verify at desktop and mobile widths that the stars and count sit inline on one row without wrapping.
- [x] 3.2 Verify the gradient fill tracks `--rating-percent`: with `--rating-percent: 90%` the stars are 90% amber (`#f59e0b`) and 10% grey (`#d1d5db`); confirm by toggling the custom property in devtools.

## 4. Rating sync script

- [x] 4.1 Create `assets/product-server-rating.js` with an idempotent init: on `DOMContentLoaded` (and `shopify:section:load` / `shopify:block:select`), find the reviews root `[data-rs]`, read `data-rs-avg`, `data-rs-avg-pct`, and `data-rs-total`, and for each `[data-product-server-rating]` set `--rating-percent` on the stars, set the count text to `(total)`, set an `aria-label` of the form "`<avg>` out of 5 stars, `<total>` reviews", and remove `hidden`. Verify on the product page that the teaser appears and matches the reviews summary.
- [x] 4.2 Make the script degrade honestly: if there is no `[data-rs]` root, `data-rs-total` is absent/0, or the average does not parse, leave every teaser `hidden`. Verify by previewing the product section on a page/template without the reviews section and confirming the teaser stays hidden.
- [x] 4.3 Guard against double-binding and re-run on editor events so theme-editor re-renders update the teaser. Verify in the theme editor that changing a review block's rating updates the teaser's stars and count without a full reload, and that repeated section reloads do not stack listeners (no duplicate DOM writes / no growing handler count).

## 5. Integration verification

- [x] 5.1 On the product page (`templates/product.json`), confirm the teaser's stars and `(count)` exactly match the reviews section's average and total (for the current 8 reviews: ~98% fill and `(8)`), and that activating the teaser scrolls to the reviews section.
- [x] 5.2 Confirm accessibility: the stars are `aria-hidden`, the link exposes the rating/count accessible name, and the teaser is keyboard-focusable and activates with Enter.
- [x] 5.3 Confirm no regressions: the reviews section's summary, distribution, gallery, star filtering, and pagination behave as before, and other main-product blocks render unchanged. Run `shopify theme check` and confirm the change introduces no new Liquid or schema errors.

## Workflow follow-up

- Archive the change after review requirements are satisfied.
- Verify the archived result.
