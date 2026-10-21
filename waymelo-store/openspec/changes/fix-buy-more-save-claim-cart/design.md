# Design

## Context

See `proposal.md` - Why. The behavior lives in the `blocky-buy-more-save` custom element inside `sections/blocky-main-product.liquid` (`buildClaimPayload()`, `handleClaim()`, plus a per-item helper added here).

**What investigation established** (measured against the running dev theme with a real session, and reproduced with raw requests):

- The claim already built a valid request. Both a JSON body `{"items":[{"id","quantity"},…]}` and the older `items[0][id]=…` form-encoded body added multiple items when no app interfered.
- On the affected product, **any multi-item `/cart/add.js` request that includes the displayed product lands only the displayed product**. Two non-main products in one request add fine. Adding the same lines **one at a time** lands them all.
- The block's request contains both the displayed product and the selected add-on, yet the server returns a single line carrying a `_pumper_v2_basic-tier` line property.

**Root cause:** the store's third-party app **Profit Pumper Bundles** (`cdn.shopify.com/extensions/…/profit-pumper-bundles…`, offer "Nursing Pillow", `quantity_breaks`) patches `window.fetch` and collapses multi-item cart adds to its offer's product. Blocking that app's scripts makes the same two-item add succeed. This is not specific to the Buy More & Save block — any multi-item add on this store is affected.

## Goals / Non-Goals

**Goals:**

- Claim adds the displayed product **and** every selected add-on even with the app active.
- One cart re-render (the drawer/notification updates once, with the complete cart).
- Failure feedback that names the cart service's reason and keeps the control retryable.

**Non-Goals:**

- No schema, Liquid markup, or CSS/setting changes.
- No change to the display-only percentage pricing, the preview popup, or the selection UI.
- No changes to other blocks or assets.
- Not fixing, disabling, or removing the third-party app from the theme (that is the merchant's/app side and is called out in the proposal).

## Decisions

### Decision: Add claim lines one request at a time (single-item `/cart/add.js` per line)

Replace the single multi-item request with a sequential loop: for each line, `POST` a one-item JSON body, awaiting each; request the bundled cart `sections` (and `sections_url`) on the **final** add so the response carries the up-to-date cart markup for one render.

- **Why:** Empirically the app does not collapse single-item adds. Verified: adding the displayed product, then an add-on, then another product sequentially leaves all three in the cart with the app active.
- **Alternatives:** one multi-item request (rejected: collapsed by the app); bypass the app with `XMLHttpRequest` or a native same-origin-iframe `fetch` (rejected: both were also collapsed); have the merchant fix/disable the app (recommended separately, but the block must keep working regardless).

### Decision: Normalize and de-duplicate the line items before sending

Build a keyed map of `variantId -> quantity`: seed with the displayed product at the form quantity, then merge each selected add-on at quantity 1, keeping a repeated variant as a single line.

- **Why:** The same variant must never be added twice; a clean set is also what the sequential loop iterates.
- **Alternatives:** send raw duplicates (rejected); drop an add-on equal to the displayed product (rejected: it should still be reflected).

### Decision: Surface the cart service's failure reason, and always re-enable the claim control

On a non-OK response or a body carrying `status`, show `description || message` (falling back to the existing generic text), and restore the control in both branches. If a line fails partway, the loop stops and reports the reason.

- **Why:** A silent or vague failure is indistinguishable from "the add-on did nothing"; the service's own text tells the shopper and the merchant what happened.

### Decision: Keep the existing render path

Successful claims call `renderCartForResponse(finalData, '')` (drawer → `cart:update` → fallback navigation), now fed the final add's response (which carries `sections`). Drawer/notification behavior is unchanged.

## Risks / Trade-offs

- **N requests instead of one** → sequential and only the last requests sections; for the block's ≤5 add-ons this is acceptable.
- **Partial failure leaves earlier lines added** (a later line rejected) → report the reason and let the shopper retry; cart adds are not transactional, so no rollback is attempted.
- **Depends on the app not collapsing single-item adds** → verified at time of writing; if the app's behavior changes, the block may need revisiting. The durable fix is on the app side.
- **Conflicts with the base change's "in a single request" wording** → recorded in `proposal.md` as a follow-up to relax that requirement.
- **`sections` on the final add** must remain a comma-separated string (or array) → preserved from `getCartSections()`.

## Migration Plan

Edit only `sections/blocky-main-product.liquid`. No schema or data migration. Rollback is reverting that file. Verify on a product page with the recommendations source and with a random source, with the Profit Pumper Bundles app active.

## Open Questions

- None blocking. If the merchant later disables/repairs the app, the sequential approach still works (just more requests); no code change needed.
