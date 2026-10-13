# Tasks

## 1. Block schema

- [x] 1.1 In `sections/blocky-main-product.liquid`, add a `bundle_stack` block definition ("Bundle Stack") to the schema `blocks` array, with `"limit": 1` and settings for `options_count` (range 1–3), per-option `title_n`/`discount_badge_n`/`tag_n`/`save_text_n`/`price_n`/`compare_price_n`/`ribbon_n`/`quantity_n` (n = 1–3), `default_selected`, and row design/typography settings (selected/unselected background, border color/width, radius, title/badge/tag/sale/price/compare/ribbon colors and sizes). Verify by loading the theme editor and confirming the block appears with readable labels, defaults render, and visible_if/blank toggles behave; verify no settings collide with the existing `bundle_deals`/`bundle_packages` ids.

## 2. Liquid rendering

- [x] 2.1 Add a `{%- when 'bundle_stack' -%}` branch to the section's block render loop (alongside `bundle_deals`), emitting a `<blocky-bundle-stack class="blocky-bundle-stack" role="group" aria-label="Bundle options" style="--bs-*: ...">` element that loops `for i in (1..block.settings.options_count)`, resolves the per-option keys, skips options whose `title_n` is blank, and renders each row as `<button type="button" class="blocky-bs-row{% if default_selected == i %} is-selected{% endif %}" data-bs-quantity="{{ quantity_n }}" aria-pressed="...">` containing a decorative radio span, title, optional badge, optional tag, optional sale text, price with optional struck-through compare-at, and optional ribbon. Include `{{ block.shopify_attributes }}`. Verify in preview that setting option count to 1, 2, and 3 renders exactly that many rows, that an option with a blank title is skipped, and that each optional element only appears when set.

## 3. Selection behavior

- [x] 3.1 In the section's `<script>`, register a `blocky-bundle-stack` custom element guarded by `customElements.get`, mirroring `blocky-bundle-deals`: on `connectedCallback`, attach a delegated click listener that finds the closest `.blocky-bs-row`, toggles `is-selected`/`aria-pressed` across rows, and applies the selected row's `data-bs-quantity` via `this.closest('blocky-featured-product')` writing to `[data-blocky-quantity-input]` (dispatching an `input` event) or `[data-blocky-form-quantity]` as fallback; on load, if a `.is-selected` row exists, apply its quantity. Verify in preview: clicking a row selects only it and sets the visible quantity input to its quantity; the default-selected row is selected on load and its quantity applied; with no default selection nothing is preselected and quantity is unchanged.

## 4. Styling

- [x] 4.1 Add `.blocky-bundle-stack` / `.blocky-bs-*` rules to `snippets/blocky-main-product-css.liquid`, scoped under `#blocky-featured-product-{{ section.id }}`, near the existing `.blocky-bundle-deals` rules: a vertical flex column of full-width rows with border/radius/background and a distinct selected state from the `--bs-*` variables; the decorative radio circle (with a filled selected state), title with the inline badge and tag pills, red sale text, a right-aligned price block with compare-at, and the absolutely-positioned corner ribbon; plus `@media screen and (max-width: 749px)` rules reducing gaps/padding/font sizes. Verify at mobile (<750px) and desktop (≥750px) widths that rows stack cleanly, long/emoji titles and pill text wrap rather than overflow, the price stays right-aligned, the selected row is visually distinct, and the ribbon stays within the row.

## 5. Integration verification

- [ ] 5.1 Verify the full flow on the product template: add the `bundle_stack` block, confirm the `bundle_deals`, `bundle_packages`, buy buttons, and other blocks render unchanged, and confirm that selecting a bundle row updates the quantity used by add-to-cart. Verify keyboard-only operation (Tab to a row, Enter/Space selects it) and that the selected state is exposed to assistive technology; verify rows and their content remain visible with JavaScript disabled.

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied.
- Verify the archived result.
