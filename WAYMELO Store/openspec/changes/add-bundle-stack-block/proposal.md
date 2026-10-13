# Proposal

## Why

The storefront product page only offers the existing `bundle_deals` block, whose cards present option text in a horizontal, badge-on-top layout. The store owner wants a different, stacked bundle selector matching the supplied reference design — a vertical radio list of compact rows where each option shows an emoji-capable title, a percentage-off badge, an optional tag pill (e.g. "Free Shipping"), red "Save $x" sale text, and a right-aligned price with struck-through compare-at, with an optional corner ribbon ("Most Popular", "Best Value", "YOURS FREE"). The existing blocks cannot express this without changing live product templates.

## What Changes

- Add a new block type `bundle_stack` ("Bundle Stack") to the `BKY - Main Product` section (`sections/blocky-main-product.liquid`), alongside the existing `bundle_deals` and `bundle_packages` blocks. The existing blocks are left untouched.
- Each row renders, when configured: a radio indicator, an emoji-capable title, an optional percentage-off badge (e.g. `15% OFF`), an optional tag pill (e.g. `Free Shipping`), an optional red sale line (e.g. `Save $69.10`), a right-aligned price with an optional struck-through compare-at price, and an optional corner ribbon overlay (e.g. `Most Popular`, `Best Value`, `YOURS FREE`).
- Support up to 3 bundle options, controlled by a count setting; options with no title are not rendered.
- Rows are selectable: clicking a row marks it selected (radio filled, selected background/border) and applies that option's configured add-to-cart quantity to the product form, reusing the existing `blocky-bundle-deals` quantity-driven behavior pattern. A `default_selected` setting chooses the preselected option.
- Add merchant styling settings (selected/unselected background, border color and width, radius, title/badge/tag/sale/price/compare colors and sizes, badge and tag backgrounds, ribbon colors) wired through CSS custom properties, mirroring the existing bundle block design settings.
- Add scoped CSS for `.blocky-bundle-stack` / `.blocky-bs-*` classes to `snippets/blocky-main-product-css.liquid`, scoped to the section id like the other block styles.
- No **BREAKING** changes. The new block is inert until a merchant adds it; `bundle_deals`, `bundle_packages`, the add-to-cart form, and the existing product template are unaffected.

## Capabilities

### New Capabilities

- `storefront-bundle-stack`: Rendering and merchant configuration of a product-page stacked bundle-selector block — a vertical list of selectable option rows with title, percentage-off badge, tag pill, sale text, pricing, and ribbon, whose selection drives the add-to-cart quantity.

### Modified Capabilities

<!-- None. openspec/specs/ contains `footer-trust-badges`, `storefront-help-button`, and `storefront-reviews`, none of whose requirements this change alters. No spec covers the existing `bundle_deals` or `bundle_packages` blocks, so there is nothing to amend. -->

## Impact

- **Code**: `sections/blocky-main-product.liquid` (add the `bundle_stack` block type to the block render loop, the `blocky-bundle-stack` custom element, and the schema block definition); `snippets/blocky-main-product-css.liquid` (new scoped rules for `.blocky-bundle-stack` and its children).
- **Configuration**: Option count, per-option title/badge/tag/save text/price/compare-at/ribbon/quantity, default selection, and row design/typography colors are merchant-editable in the theme editor.
- **Localization**: Literal English labels for the new block settings, matching the neighboring bundle blocks and the theme's existing literal-label convention, avoiding lockstep edits to auto-generated `locales/*.schema.json`.
- **External dependencies**: None. Selection reuses the section's existing quantity-input plumbing.
- **Out of scope**: Changing, restyling, or removing the existing `bundle_deals` or `bundle_packages` blocks; changes to the product buy buttons, quantity selector markup, or any other block; bundle discount logic in the cart/checkout (selection only sets quantity); any computed/automatic discount math (badge, tag, and sale text are merchant-entered literals).
