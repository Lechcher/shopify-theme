# Proposal

## Why

The product page has no native way to add related items to the cart alongside the main product, so the merchant is relying on a third-party "Get 20% Off These Add-Ons" widget that costs money, can't be styled to match the theme, and can't apply the merchant's own save percentage. The merchant wants a block in the `blocky-main-product` section that surfaces recommended add-ons with an explicit percentage off, so the shopper can inspect and add them with the main product.

## What Changes

- Add a new `buy_more_save` block type to the `blocky-main-product` section (`sections/blocky-main-product.liquid`), addable/reorderable in the theme editor like other product blocks, with a `presets` entry so it appears in the section preset.
- The block renders a merchant-editable heading (default "Get 20% Off These Add-Ons") and a scoped list of product rows.
- Products are drawn **automatically from Shopify's product recommendations API** for the current product (the same `complementary` intent / first-available-variant fallback `related` intent flow already used by the `complementary` block), capped at 5 products.
- Each row shows a selectable checkbox, feature media thumbnail, product title, a `<select>` of that product's variants, a struck-through compare-at price and a discounted price, and an optional "save" tag. At most 5 rows render, with a `max_products` setting (1-5) to show fewer.
- The save percentage is a block setting (default 20). The block computes the discounted price in Liquid from each variant's `compare_at_price` (falling back to `price` when a product has no compare-at price) and renders both values. When a merchant edits the setting, the rendered prices change without code changes. Price formatting uses the store money format.
- A large **preview popup** opened from a per-row "Preview" control (and by clicking the row's thumbnail/title) shows the full product for inspection: media gallery with its own thumbnails, title, compare-at/discounted price, variant picker, description, and an **Add to cart** button.
- The block's primary action is a `Claim Offer` button that submits the main product form **together with** every checked add-on variant via Shopify's multi-item `POST /cart/add` (`items[...][id]` / `items[...][quantity]` array body), reusing the section's existing `handleAddToCart` cart-drawer/cart-page behavior so a full cart + drawer update comes back in one response.
- Scoped CSS in `snippets/blocky-main-product-css.liquid` under `#blocky-featured-product-{{ section.id }} .blocky-bms ...`, plus a `blocky-buy-more-save` custom element in the section's script guarded by `customElements.get(...)`.

## Capabilities

### New Capabilities

- `storefront-buy-more-save`: a product-page add-ons block on the `blocky-main-product` section that lists up to 5 Shopify-recommended products, shows each with a configurable percentage-off price, lets the shopper select add-ons and add them with the main product, and provides a full-detail preview popup.

### Modified Capabilities

<!-- No existing capability's requirements change. -->

## Impact

- `sections/blocky-main-product.liquid` — new `buy_more_save` case in the `{% case block.type %}` switch, block schema entry, and `presets` entry; new `blocky-buy-more-save` custom element in the section's inline script; a `data-*` data block on the block wrapper carrying the save percent, price mode, product ids, and per-product JSON for the popup.
- `snippets/blocky-main-product-css.liquid` — scoped styles for the block, the row layout, the preview popup modal, and mobile/desktop layout.
- Reuses existing theme infrastructure: Shopify product recommendations endpoint, `shop.money_format`, the section's `addToCart`/`openCartDrawer` helpers, and the `formatMoney`/cart-update flow.
- No new external dependencies. No breaking changes to existing blocks or settings.
