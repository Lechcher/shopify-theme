# Proposal

## Why

On the product page, a shopper can select one or more add-on rows in the **Buy More & Save** block and press **Claim Offer**, but the selected add-on products are not added to the cart — only the displayed product lands.

Investigation on the running dev theme showed the block already sends a correct cart request (both the displayed product and the selected add-on). The failure is caused by a **third-party app on the store, "Profit Pumper Bundles"** (`profit-pumper-bundles`, offer "Nursing Pillow", quantity breaks): it intercepts cart adds and collapses any *multi-item* `/cart/add.js` request to its offer's product. Verified: adding the same items **one request at a time** lands them all, even with the app active; adding them in one request does not.

## What Changes

- Make the claim action add its lines **one request at a time** (a single-item `/cart/add.js` per line, sequentially), so the third-party app does not collapse the request. Bundled cart `sections` are requested on the final add so the cart drawer/notification renders once with the complete cart.
- Keep the existing contract: the claim adds the displayed product plus every selected add-on.
- De-duplicate line items so the same variant is never sent twice.
- Surface the Cart API's own error text (for example "Cannot find variant" or a stock error) in the block's status line instead of a single generic failure message.
- Keep behavior identical for every product source (Shopify recommendations, random store products, random products under a price).

> Note: This is a theme-side workaround. The durable fix is on the app side (configure or disable the Pumper quantity-breaks/bundles so it does not drop unrelated items on multi-item adds). The workaround is needed because the block cannot otherwise add more than one line on this store.

## Capabilities

### New Capabilities
- `storefront-buy-more-save`: the product-page Buy More & Save add-ons block; this change corrects its claim-to-cart action. (The capability has in-flight deltas under `add-buy-more-save-block`, `adjust-buy-more-save-block`, and `add-buy-more-save-product-strategies`; it is not yet in `openspec/specs/`, so this is declared as an addition.)

### Modified Capabilities
<!-- None: no main spec under openspec/specs/ changes. -->

## Impact

- `sections/blocky-main-product.liquid`: the `blocky-buy-more-save` custom element — `buildClaimPayload()`, `handleClaim()`, and a new per-item add helper.
- No schema, Liquid markup, or CSS changes; no new settings.
- No changes to `assets/product-form.js`, `assets/cart-drawer.js`, other assets, or other blocks.
- Reuses the existing bundled-section cart render path so the cart drawer/notification behavior is unchanged.

## Conflict to resolve

The base change `add-buy-more-save-block` states the claim adds the displayed product and selected add-ons **"in a single request"**. That is no longer achievable on this store (the app collapses multi-item adds), so that requirement should be relaxed to "in one claim action" when that change is finalized.
