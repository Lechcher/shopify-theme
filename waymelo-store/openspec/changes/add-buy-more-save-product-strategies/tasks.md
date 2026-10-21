# Tasks

## 1. Schema and wrapper settings

- [x] 1.1 In the `buy_more_save` schema entry in `sections/blocky-main-product.liquid`, add a `product_source` select setting with options `recommendations` ("Shopify recommendations"), `random_all` ("Random products from the store"), and `random_price` ("Random products under a price"), default `recommendations`; verify all three options appear in the theme editor and the default is selected.
- [x] 1.2 Add a `max_price` setting (default `30`) with `"visible_if": "{{ block.settings.product_source == 'random_price' }}"`; verify the field is hidden for the other two sources and shown for the price strategy.
- [x] 1.3 Carry the resolved values on the `<blocky-buy-more-save>` wrapper as `data-product-source="{{ block.settings.product_source | default: 'recommendations' }}"` and `data-max-price="{{ block.settings.max_price | default: 30 }}"`; verify the rendered element carries both attributes.

## 2. Source dispatch and store-products fetch

- [x] 2.1 In the `blocky-buy-more-save` custom element, read `productSource` (from `data-product-source`, default `recommendations`) and `maxPrice` (from `data-max-price`, default `30`) alongside the existing dataset reads; verify the values are parsed without errors.
- [x] 2.2 Turn `fetchRecommendations()` into a dispatcher that keeps the current recommendations flow for `recommendations` and calls a new store-products flow for the random sources; verify choosing the recommendations source issues the existing `/recommendations/products.json` request and choosing a random source does not.
- [x] 2.3 Implement the store-products fetch: request `/collections/all/products.json?limit=250`, falling back to `/products.json?limit=250` when the first returns no products, and hide the element when both fail or return nothing; verify with a stubbed/blocked response that both endpoints are attempted and the block hides itself.
- [x] 2.4 Implement a normalizer that maps each store product to the internal row shape — `url` from `handle`, `description_html`/`description` from `body_html`, `featured_image` from `image.src`, `images` from `images[].src`, and `variants[].price`/`compare_at_price` from decimal strings to rounded integer cents; verify a normalized product renders a row and preview identical to a recommendations row.

## 3. Filtering, exclusion, and shuffle

- [x] 3.1 For `random_all`, drop candidate products with no available variant; verify a product whose variants are all unavailable does not render.
- [x] 3.2 Exclude the product currently being viewed (match by id, and handle when present); verify the current product never appears among its own add-on cards.
- [x] 3.3 For `random_price`, keep only products with at least one available variant priced `<= Math.round(maxPrice * 100)` (inclusive); verify a product priced exactly at the ceiling is included and one priced above it is excluded, and that changing `max_price` re-evaluates eligibility.
- [x] 3.4 Fisher–Yates shuffle the filtered candidates on each run and slice to `Math.min(this.maxProducts, 5)`; verify more than five eligible products render exactly five cards and that repeated loads can vary the set or order.

## 4. Integration verification

- [ ] 4.1 On a product page (default settings), verify the block still lists up to five recommendations and that save-percentage pricing, selection, preview, and the claim action are unchanged from before this change.
- [ ] 4.2 Switch the source to each random strategy in the theme editor and verify: the cards come from store products, the current product is excluded, unavailable products never appear, and the price strategy respects the ceiling (including the boundary).
- [ ] 4.3 Verify the block renders nothing (hidden, not an empty container) when the selected random source has no eligible products and when both products endpoints fail.
- [ ] 4.4 Verify the theme editor lifecycle: changing `product_source`/`max_price` re-renders the block, and adding/removing/reordering the block leaves every other block, the buy buttons, and the product form rendering and behaving as before.

## Workflow follow-up

- Prerequisite: restore the `buy_more_save` block into the working tree before applying, since the working copy is missing it but `HEAD`/the last backup contains it (e.g. `git checkout HEAD -- waymelo-store/sections/blocky-main-product.liquid waymelo-store/snippets/blocky-main-product-css.liquid`).
- Sync the `storefront-buy-more-save` delta into the main spec once the project's review requirements are satisfied (coordinate with the in-flight `add-buy-more-save-block` change that owns the base capability).
- Archive the change after implementation is complete.
