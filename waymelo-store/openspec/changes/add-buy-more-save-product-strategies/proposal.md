# Proposal

## Why

The `buy_more_save` block currently lists add-ons only from Shopify's product recommendations service, so a merchant whose catalog is small, whose recommendations are thin, or who wants to promote specific price points has no way to fill the block. Merchants need to choose where the add-on products come from: Shopify recommendations, random products from the whole store, or random products within a price ceiling.

## What Changes

- Add a `product_source` **select** setting to the `buy_more_save` block with three strategies:
  1. `recommendations` — Shopify's recommendations service (current behavior; the default).
  2. `random_all` — random products drawn from the store's published products.
  3. `random_price` — random products drawn from the store's published products filtered to those with an available variant priced `<=` a configurable amount.
- Add a `max_price` setting (default `30`) shown only when the source is `random_price`; the block includes a product when at least one of its available variants is priced at or below this amount.
- Both random strategies re-shuffle on every page load, exclude the product currently being viewed, exclude products with no available variant, and still render at most five cards.
- The random strategies fetch the store's products client-side and normalize that payload into the same row/preview shape the block already uses for recommendations, so rows, selection, preview, save-percentage pricing, and the claim action are unchanged.

## Capabilities

### New Capabilities

- `storefront-buy-more-save`: extends the product-page add-ons block with a merchant-selectable product source — Shopify recommendations, random store products, or random store products under a price ceiling.

### Modified Capabilities

<!-- No capability under openspec/specs/ changes. The buy_more_save block is owned by the in-flight `add-buy-more-save-block` change; its capability spec is not yet synced into openspec/specs/, so this change carries the addition as an ADDED delta on the same `storefront-buy-more-save` path. -->

## Impact

- `sections/blocky-main-product.liquid` — add `product_source` and `max_price` settings to the `buy_more_save` schema entry; carry them on the `<blocky-buy-more-save>` wrapper as `data-product-source` and `data-max-price`; extend the `blocky-buy-more-save` custom element so its fetch step selects a strategy, normalizes store-products JSON into the existing row shape, filters by availability/price, excludes the current product, shuffles, and slices to five.
- `snippets/blocky-main-product-css.liquid` — no new rules expected (rows and popup markup are unchanged); confirm no change is needed.
- New dependency on the store's public storefront products JSON endpoint (`/collections/all/products.json`) for the random strategies; the recommendations strategy keeps the existing endpoint. No new apps or external services.
- No breaking changes: existing blocks and a block left on the default `recommendations` source behave exactly as before.

## Assumptions

- One block with a `product_source` select setting, not three separate block types.
- The price ceiling is merchant-configurable (default 30) and inclusive (`<=`).
- Random means "shuffled on each page load", excluding the current product and unavailable products, capped at five.
- The price filter matches a product when **any** available variant is `<=` the ceiling; that variant is used for the row.
