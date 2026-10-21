# Tasks

## 1. Confirm the failure

- [x] 1.1 On a product page with the block, select one or more add-on rows, activate **Claim Offer**, and capture the `cart/add.js` request and response (status code and error `description`/`message`) from the browser network panel. Verify: the captured request body shape and the response are recorded, and they confirm or correct the design's inference (form-encoded multi-item body being dropped) before any code change.

## 2. Make the claim request add the selected add-ons

- [x] 2.1 Rework `buildClaimPayload()` (in `sections/blocky-main-product.liquid`) to return a normalized array of `{ id, quantity }`, seeding the displayed product at the form quantity and merging each selected add-on at quantity 1, so a repeated variant id appears only once. Verify: reading the built payload for one, several, and a duplicated variant shows each id once with the expected quantity.
- [x] 2.2 Change `handleClaim()` to `POST` the claim as a JSON body `{ items: [...], sections, sections_url }` with `Content-Type: application/json` to `routes.cart_add_url + '.js'`, keeping the existing `getCartSections()` value. Verify: the network request body is a JSON `items` array (not `items[0][id]=...`) and the response is the added line items.
- [x] 2.3 Remove the form-urlencoded serialization and header from the claim path. Verify: searching the section for the claim request finds no `items[` string building or `application/x-www-form-urlencoded` on the claim handler.
- [x] 2.4 Keep the success path calling `renderCartForResponse(...)` unchanged so the drawer/notification updates as before. Verify: a successful claim refreshes the cart drawer/notification markup.

## 3. Report the cart service outcome

- [x] 3.1 On a non-OK response or a body carrying `status`, show `data.description || data.message` (falling back to the current generic text) in `showClaimStatus()`, and re-enable the claim control. Verify: forcing a failure (for example an invalid variant id) shows the service's own reason and leaves the button usable.
- [x] 3.2 Confirm the success branch still shows the "offer claimed" confirmation and re-enables the control. Verify: a successful claim shows the confirmation and the button is usable afterward.

## 4. Verify end to end

- [ ] 4.1 With the recommendations source, select one add-on and claim; verify the cart contains a line item for the displayed product and one for the add-on.
- [ ] 4.2 Select several add-ons (including one that matches the displayed variant) and claim; verify each selected add-on is present exactly once and the displayed product quantity is preserved.
- [ ] 4.3 Switch the block to a random product source, select an add-on, and claim; verify the add-on is added identically to the recommendations source.
- [ ] 4.4 Verify the cart drawer/notification reflects the new line items after a successful claim and that a failed claim does not appear as a success.

## Workflow follow-up

- Run `shopify theme check` and confirm no new offenses are introduced in `sections/blocky-main-product.liquid`.
- Archive the change after the project's review requirements are satisfied.
