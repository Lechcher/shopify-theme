# Proposal

## Why

The `buy_more_save` block in the `blocky-main-product` section renders recommended add-on cards, but its card styling defaults (a 1px border) do not match the merchant's reference design, and the number of recommended products shown must be explicitly capped at five. The merchant wants the add-on cards to use a 3px border with a 12px radius, and the recommended product list limited to five items, without touching any other block.

## What Changes

- Set the add-on card (row) **border width default to 3px** and the **border radius default to 12px** in the `buy_more_save` block schema in `sections/blocky-main-product.liquid`, and mirror the 3px fallback in the scoped CSS variable consumers in `snippets/blocky-main-product-css.liquid`. Both remain merchant-editable design settings.
- Guarantee the block requests and renders **at most five recommended products, defaulting to five**, regardless of the `max_products` setting: the recommendations request uses `limit=5`, and the rendered row list is sliced to `Math.min(max_products, 5)`.
- Record the interpretation of "product random show" as Shopify's recommendations-driven add-on list (the recommendation service chooses and rotates the products); no client-side shuffle is added.

## Capabilities

### New Capabilities

- `storefront-buy-more-save`: refines the product-page add-ons block so its card border defaults are 3px width / 12px radius and its recommended product list is limited to five items.

### Modified Capabilities

<!-- No existing capability under openspec/specs/ changes. The buy_more_save block is owned by the in-flight `add-buy-more-save-block` change; its capability spec is not yet synced into openspec/specs/, so this change carries the refinement as an ADDED delta on the same `storefront-buy-more-save` path. -->

## Impact

- `sections/blocky-main-product.liquid` — `buy_more_save` block schema defaults for `row_border_width` (1 → 3) and `row_radius` (already 12); the `--bms-row-border-width` inline custom property fallback (1 → 3); and the `blocky-buy-more-save` custom element's recommendations `limit` / row slicing so the displayed count never exceeds five.
- `snippets/blocky-main-product-css.liquid` — the `.blocky-bms-row` border-width fallback in the `--bms-row-border-width` consumer (1px → 3px); the radius fallback already reads 12px.
- No new dependencies, no new files, no changes to other blocks, the buy buttons, or the product form.

## Assumptions

- "Limit the product random show is 5" means the block displays at most five recommended add-on products (default five). The recommendations service picks the products; the theme does not shuffle them. This matches the companion `add-buy-more-save-block` design's default.
- The border values are applied as the card's default settings (3px width, 12px radius) and stay merchant-editable, following the block's existing design-settings pattern.
