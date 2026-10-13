# Proposal

## Why

Stores that have both the legacy Amazon Payments method and Amazon Pay enabled render the Amazon logo twice in the product-page payment badges and the footer payment list. The theme loops over `shop.enabled_payment_types` and renders one icon per entry without de-duplicating entries that resolve to the same brand, so distinct-but-equivalent payment type keys produce repeated icons.

## What Changes

- Add brand-alias normalization when rendering payment method icons, so payment type entries that resolve to the same brand are rendered only once.
- Apply the normalization to every payment icon loop in the theme:
  - `sections/footer.liquid` (`footer__payment`)
  - `sections/blocky-main-product.liquid` (`payment_badges` block)
  - `sections/main-product.liquid`
  - `blocks/ai_gen_block_bcb0398.liquid`
- Preserve existing icon order (first occurrence of a brand wins), markup, CSS classes, and the existing `icon_size` / `alignment` settings.

## Capabilities

### New Capabilities

- `storefront-payment-icons`: Rendering of the store's accepted payment method icons in the storefront, including de-duplication of payment types that resolve to the same brand.

### Modified Capabilities

<!-- None: no existing capability's requirements change. -->

## Impact

- Liquid sections/blocks: `sections/footer.liquid`, `sections/blocky-main-product.liquid`, `sections/main-product.liquid`, `blocks/ai_gen_block_bcb0398.liquid`.
- New Liquid snippet for the shared de-duplication rendering (see design.md).
- No section schema or settings changes. No new CSS or JavaScript.
- Behavior depends on Shopify's `shop.enabled_payment_types` data; the fix removes only visually duplicate brand icons and never removes a unique brand.
