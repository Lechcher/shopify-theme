# Tasks

## 1. Confirm the failure

- [x] 1.1 Determine why the claim does not add the selected add-ons by capturing the `cart/add.js` request/response and probing the store endpoint directly. Result: the block already sends a correct request (displayed product + selected add-on); the store's **Profit Pumper Bundles** app collapses any multi-item cart add that includes the displayed product to a single line, while single-item adds work. (Recorded in `design.md`.)

## 2. Make the claim request add the selected add-ons

- [x] 2.1 Rework `buildClaimPayload()` (in `sections/blocky-main-product.liquid`) to return a normalized array of `{ id, quantity }`, seeding the displayed product at the form quantity and merging each selected add-on at quantity 1, so a repeated variant id appears only once. Verify: reading the built payload for one, several, and a duplicated variant shows each id once with the expected quantity.
- [x] 2.2 Change `handleClaim()` to add the claim lines **one request at a time** (a single-item JSON `/cart/add.js` per line, sequentially), requesting the bundled cart `sections` on the final add, so the Profit Pumper Bundles app does not collapse the request. Verify: with the app active, a claim that selects one add-on leaves both the displayed product and the add-on in the cart.
- [x] 2.3 Remove the form-urlencoded serialization and header from the claim path. Verify: searching the section finds no `items[` string building in the claim.
- [x] 2.4 Keep the success path calling `renderCartForResponse(...)`, fed the final add's response, so the drawer/notification updates as before. Verify: a successful claim refreshes the cart drawer/notification markup.

## 3. Report the cart service outcome

- [x] 3.1 On a non-OK response or a body carrying `status`, show `description || message` (falling back to the current generic text) in `showClaimStatus()`, and re-enable the claim control; a failed line stops the sequence. Verify: forcing a failure (for example an invalid variant id) shows the service's own reason and leaves the button usable.
- [x] 3.2 Confirm the success branch still shows the "offer claimed" confirmation and re-enables the control. Verify: a successful claim shows the confirmation and the button is usable afterward.

## 4. Verify end to end

- [x] 4.1 With the recommendations source and the Profit Pumper Bundles app active, select one add-on and claim; verify the cart contains the displayed product and the add-on.
- [x] 4.2 Select several add-ons and claim; verify each selected add-on is present exactly once and the displayed product quantity is preserved.
- [x] 4.3 Switch the block to a random product source, select an add-on, and claim; verify the add-on is added identically to the recommendations source.
- [x] 4.4 Verify the cart drawer/notification reflects the new line items after a successful claim and that a failed claim does not appear as a success.

## Workflow follow-up

- Relax the base change's `add-buy-more-save-block` requirement wording from "in a single request" to "in one claim action" (recorded in `proposal.md`).
- Run `shopify theme check` and confirm no new offenses are introduced in `sections/blocky-main-product.liquid`.
- Archive the change after the project's review requirements are satisfied.
