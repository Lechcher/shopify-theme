# Proposal

## Why

On the product page, a shopper can select one or more add-on rows in the **Buy More & Save** block and press **Claim Offer**, but the selected add-on product is not added to the cart. The claim action assembles a multi-item `/cart/add.js` request, and that request does not reliably add the selected add-on line items, so the block's primary call to action silently fails for shoppers. This blocks the block's core purpose (offer discounted add-ons and add them in one action) on the live store.

## What Changes

- Make the **Claim Offer** action reliably add every selected add-on's selected variant (plus the displayed product, per the block's existing contract) to the cart in a single request.
- Send the cart-add request using the multi-item format the rest of the theme already uses successfully (JSON body with an `items` array), instead of the block's hand-built form-encoded `items[n][...]` body.
- De-duplicate line items so the same variant is never sent twice in one request (for example when an add-on happens to be the displayed product).
- Surface the Cart API's own error text (for example "Cannot find variant" or a stock error) in the block's status line instead of a single generic failure message, and keep the cart drawer/notification in sync on success.
- Keep behavior identical for every product source (Shopify recommendations, random store products, random products under a price).

## Capabilities

### New Capabilities
- `storefront-buy-more-save`: the product-page Buy More & Save add-ons block; this change corrects its claim-to-cart action. (The capability has in-flight deltas under `add-buy-more-save-block`, `adjust-buy-more-save-block`, and `add-buy-more-save-product-strategies`; it is not yet in `openspec/specs/`, so this is declared as an addition.)

### Modified Capabilities
<!-- None: no main spec under openspec/specs/ changes. -->

## Impact

- `sections/blocky-main-product.liquid`: the `blocky-buy-more-save` custom element — `buildClaimPayload()`, `handleClaim()`, and the status/feedback path.
- No schema, Liquid markup, or CSS changes; no new settings.
- No changes to `assets/product-form.js`, `assets/cart-drawer.js`, or other blocks.
- Reuses the existing bundled-section cart render path so the cart drawer/notification behavior is unchanged.
