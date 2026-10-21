# Design

## Context

See `proposal.md` - Why. The behavior lives in the `blocky-buy-more-save` custom element inside `sections/blocky-main-product.liquid`. Its claim path is:

- `buildClaimPayload()` collects the displayed product's variant + quantity from the section's product form (`[data-blocky-variant-id]`, `[data-blocky-form-quantity]` / `[data-blocky-quantity-input]`) and then one `{ id, quantity: 1 }` per id in `this.selectedVariantIds`.
- `handleClaim()` serializes those items into a **form-urlencoded** body (`items[0][id]=...&items[0][quantity]=1&...`), appends `sections` / `sections_url`, and `POST`s to `routes.cart_add_url + '.js'` with `Content-Type: application/x-www-form-urlencoded`.
- On success it calls `renderCartForResponse()` (the same drawer/notification path as a normal add); on any failure it shows one generic message.

Constraints that shape the fix:

- **The rest of the theme already has a proven multi-item add.** `assets/review-carousel.js` posts a **JSON body** (`{ items: [{ id, quantity }] }`) to `cart/add.js` and then refreshes the drawer; `assets/product-form.js` posts `FormData` (single `id`/`quantity`) from the product form.
- **Shopify's Cart API reference documents multiple items as a JSON body with an `items` array** (`Content-Type: application/json`). The block's hand-built `items[n][...]` form encoding is not the documented shape for `cart/add.js` and is the most likely reason the selected add-ons are dropped while the request still returns.
- The block must keep its existing contract: the claim adds the displayed product **and** the selected add-ons, and the cart drawer/notification must stay in sync. Pricing in the block is display-only (no real discount), which this change does not alter.
- `selectedVariantIds` can legitimately contain the displayed product's own variant (for example when a random source offers the current product handle differently, or the displayed variant is also selected), so the same variant id can appear twice in one payload.

## Goals / Non-Goals

**Goals:**

- A claim action that reliably adds every selected add-on variant plus the displayed product in one request.
- One request, one cart re-render, no partial-add states.
- Failure feedback that names the cart service's reason and keeps the control retryable.

**Non-Goals:**

- No schema, Liquid markup, or CSS/setting changes.
- No change to the display-only percentage pricing, the preview popup, or selection UI.
- No changes to `assets/product-form.js`, `assets/cart-drawer.js`, `assets/review-carousel.js`, or any other block.
- No discount-code or automatic-discount integration.

## Decisions

### Decision: Send the claim as a JSON `items` array, matching the theme's working pattern

Replace the hand-built form-urlencoded body with `JSON.stringify({ items: [...] })` and `Content-Type: application/json`, keeping the `sections` (comma-separated id list) and `sections_url` fields in the same JSON body.

- **Why:** It is the documented multi-item shape for `cart/add.js`, and it is already proven in this theme (`review-carousel.js`). It removes the encoding mismatch that plausibly drops the extra items.
- **Alternatives:** Keep form-urlencoded `items[n][...]` (rejected: not the documented shape and currently unreliable here); loop one request per item (rejected: N requests and N drawer renders, plus partial-failure states); reuse the section's `handleAddToCart`/`FormData` path (rejected: a `FormData` from the product form carries only the displayed product, and its section-scoped source id is tied to the main form submit).

### Decision: Normalize and de-duplicate the line items before sending

Build a keyed map of `variantId -> quantity`: seed with the displayed product at the form quantity, then merge each selected add-on at quantity 1, summing quantities for a repeated id (or keeping the displayed product's quantity when the id is the displayed variant).

- **Why:** Shipping the same variant twice can fail or split lines; de-duplicating keeps the payload a clean set and lets the request succeed in the edge cases above.
- **Alternatives:** Send raw duplicates (rejected: can trip item-count/validation errors); drop any add-on equal to the product (rejected: the shopper asked for it, so it should still be counted).

### Decision: Surface the cart service's failure reason, and always re-enable the claim control

On a non-OK response or a body carrying `status`, show `data.description || data.message` (falling back to the existing generic message), and restore the button in both success and failure branches as today.

- **Why:** A silent or vague failure is indistinguishable from "the add-on did nothing"; the service's own text ("Cannot find variant", a stock message) tells the shopper and the merchant what happened.
- **Alternatives:** Keep the single generic message (rejected: hides the cause); surface via the theme's global pub/sub error event (rejected: couples this self-contained block to global cart plumbing for no gain).

### Decision: Keep the existing success/render path untouched

Successful claims still call `renderCartForResponse(...)` (drawer → `cart:update` → fallback navigation), so drawer/notification behavior matches a normal add.

- **Why:** The bug is in building the request, not in rendering the result; leaving this path unchanged keeps the fix minimal and the cart UX consistent.

## Risks / Trade-offs

- **The displayed product itself may be unpurchasable** (sold out / not on the online store channel), which fails the whole multi-item request → Keep the displayed product in the payload per the block's contract, but now surface the service's reason so the failure is visible rather than silent; merchants can still use the preview "add" for an individual add-on.
- **Automatic discounts can split or merge lines**, so response item counts may differ from the request → Only treat an explicit error `status` / non-OK response as failure; do not assert on item counts.
- **`sections` in a JSON body** must stay a comma-separated string (or array) → Preserve the current `getCartSections()` value and only change the body encoding.
- **Root cause is inferred from code + API docs, not a live capture** → The first implementation task captures the actual network response on the store to confirm (or correct) the diagnosis before the fix is considered done.

## Migration Plan

Edit only `sections/blocky-main-product.liquid` (the claim payload builder and its request/error handling). No schema or data migration. Rollback is reverting that file; no store data is affected. Verify on a product page with the recommendations source and with a random source.

## Open Questions

- None blocking. Whether the deployed store's claim failure is exactly the encoding mismatch or a variant-specific rejection is confirmed by the capture task during implementation; the design's request shape and error surfacing cover both.
