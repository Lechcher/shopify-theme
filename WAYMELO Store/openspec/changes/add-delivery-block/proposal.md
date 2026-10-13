# Proposal

## Why

The product page currently has separate, static "shipping checkpoints" and "delivery deadline" blocks, but neither lets shoppers see where an order ships to or understand the delivery timeline in context. Adding a single Delivery block gives shoppers a destination line, an estimated arrival range, and the detail behind those numbers — reducing pre-purchase uncertainty and support questions.

## What Changes

- Add a new `delivery` block type to the `blocky-main-product` section (`sections/blocky-main-product.liquid`), available in the theme editor like other product blocks.
- The block renders two summary lines:
  - `Deliver to: <country> ▼` — reflects the shopper's current Shopify localization country and opens the preferences modal.
  - `Order today, get it as early as: <date range> ▼` — shows an estimated arrival window and opens the delivery method popover.
- Add an **Update Your Preferences** modal opened from the country line: a shipping-country selector, a `Save & Continue` submit button, and a `Learn more about our Shipping Policy` link.
- Wire the modal to a functional Shopify `localization` form so selecting a country and submitting actually changes the storefront country/currency and persists across visits.
- Add a **Delivery Method** popover opened from the date line: shipping method label with a business-day range, an `Order Placed` / `Order Ships` / `Delivered` timeline, and editable detail bullet points (e.g. cancellation window, PO-box restrictions).
- Make the estimated dates and method detail configurable via block settings (lead-time offsets in days, date format/labels, method name, bullet text), consistent with existing block patterns.
- Style the block and popovers with the existing `snippets/blocky-main-product-css.liquid` injection and scoped custom-element JavaScript conventions used by the section.

## Capabilities

### New Capabilities
- `product-delivery-block`: shopper-facing delivery destination, estimated arrival window, country preferences modal, and delivery method detail popover on the product page.

### Modified Capabilities
<!-- No existing capability's requirements change; this introduces new storefront behavior. -->

## Impact

- `sections/blocky-main-product.liquid` — new block render case, block schema entry, and `presets`/block registration.
- `snippets/blocky-main-product-css.liquid` — scoped styles for the block, modal, and popover.
- `snippets/` (optional new snippet) — markup for the block if extracted, following the `blocky-lys-shipping-checkpoints.liquid` precedent.
- Reuses existing theme infrastructure: Shopify `{% form 'localization' %}`, `assets/component-localization-form.css`, and `assets/localization-form.js` (already loaded in `layout/theme.liquid`); the `country-localization.liquid` snippet is prior art for the country list.
- No new external dependencies. No breaking changes to existing blocks or settings.
