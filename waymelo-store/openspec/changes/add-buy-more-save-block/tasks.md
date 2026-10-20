# Tasks

## 1. Block scaffolding and schema

- [x] 1.1 Add a `buy_more_save` entry to the `{% schema %}` `blocks` array in `sections/blocky-main-product.liquid` with `limit: 5`, settings for heading, optional subtitle, save percentage (min 0, max 100, default 20), max products (min 1, max 5, default 5), a show-save-tag checkbox, and a design group (row/heading/thumbnail/select, price/compare colors + sizes, popup, claim button, spacing); verify the block appears in the theme editor add-block list with every setting labeled and its defaults applied.
- [x] 1.2 Add a `buy_more_save` entry to the `{% schema %}` `presets` blocks list so the block ships in the default section preset; verify it renders in the editor preview when the preset is applied.
- [x] 1.3 Add a `buy_more_save` case to the section's `{% case block.type %}` switch (content column, switch begins ~line 407) that renders the block shell: heading, an `#blocky-bms-{{ block.id }}` list container, and the claim button wrapper, all namespaced with `block.id`; verify the switch renders without Liquid errors in the editor preview and no other block case is affected.

## 2. Recommendations fetch and row rendering

- [x] 2.1 Define a `BlockyBuyMoreSave` custom element registered as `blocky-buy-more-save` in the section's inline script, guarded with `customElements.get('blocky-buy-more-save')`, reading `data-save-percent`, `data-max-products`, and `data-product-id` from its wrapper; verify it runs only once per element and produces no console errors.
- [x] 2.2 Implement the recommendations fetch in the custom element: `GET /recommendations/products.json?product_id=<current>&limit=5&intent=complementary`, falling back to `intent=related` when the first response returns no products, reusing the escaping and image-sizing helpers from `initComplementary()` (~line 1937); verify with a blocked/empty endpoint response that both intents are attempted and the block hides itself when both return nothing.
- [x] 2.3 Slice the fetched product list to `Math.min(max_products, 5)` and build one row per product; verify that a 6-product response renders exactly 5 rows, a 3-product response renders 3 rows, and each row's order matches the response order.
- [x] 2.4 Render each row's content: selection checkbox with `aria-checked`, lazy-loaded featured media (placeholder image when the product has none), escaped product title, a variant `<select>` when the product has multiple variants, and the row's price markup with `data-variant-id`, `data-variant-price`, `data-variant-compare-at`, and `data-product-id`; verify a product with a single variant renders a fixed price, one with multiple variants renders a populated `<select>`, and a product with no image renders the placeholder.

## 3. Save-percentage pricing

- [x] 3.1 Compute each add-on row's displayed price from the variant's `compare_at_price` (or `price` when there is no compare-at price) applying `base * (100 - save_percent) / 100`, rounded to whole cents, in the custom element that renders the rows (the recommendations payload is client-side only, so Liquid cannot compute these prices); verify 100.00 at 20% renders as an 80.00 sale price with the original struck through, 50.00 with no compare-at price at 20% renders 40.00 with no struck-through original, and a 0% setting renders a single undiscounted price with no separate sale price.
- [x] 3.2 Format both prices through the section's `formatMoney`/`this.moneyFormat` and render the save tag text from the configured percentage when the tag is enabled; verify changing the save-percentage setting updates prices and tag text with no code changes, and that turning the tag off removes the tag without leaving a gap.

## 4. Selection state

- [x] 4.1 Add selection handling to the custom element so each row can be selected and deselected independently, keeping `aria-checked` in sync and supporting keyboard operation on the selection control; verify clicking, keyboard activation, and programmatic state toggles all update the selected state and that deselecting a row excludes it from the collected payload.
- [x] 4.2 Expose the current selection to the custom element's payload builder as an ordered list of `{ variantId, quantity }` entries; verify with none/one/multiple rows selected that the collected payload matches the visible selection exactly.

## 5. Claim action adding main product and add-ons

- [x] 5.1 Wire the claim button to build a multi-item `items[]` payload: the section's currently selected variant at the product form's quantity, plus one entry per selected add-on row's selected variant at quantity 1, posted to `/cart/add.js`; verify in the browser network tab that one request carries all line items and that the cart gains the current product plus each selected add-on.
- [x] 5.2 Handle the response through the section's existing cart-render path (`cart-notification` → `cart-drawer` → `cart-drawer-component` → redirect to `routes.cart_url`), mirroring `openCartDrawer` (~line 2287); verify with a cart drawer present the drawer and icon badge update in one step, and with no drawer that navigation to the cart occurs.
- [x] 5.3 Verify the button is disabled or a no-op while a request is in flight and that the form's `addButton.disabled` state is not left stuck after a failed request; verify a failing add surfaces an error and does not silently drop the main product.
- [x] 5.4 Verify the current product's quantity from the form is respected on the main line item while add-ons stay at quantity 1; verify that with no add-on selected the claim action adds only the current product.

## 6. Product preview popup

- [x] 6.1 Add a per-row preview control and a scoped overlay dialog markup (`role="dialog"`, `aria-modal="true"`) rendered by the custom element, containing the product's media gallery with a way to switch media, escaped title, price and compare-at price for the displayed variant, a variant picker, and the product description; verify opening a row with multiple media shows the gallery and that each non-empty field renders.
- [x] 6.2 Wire the popup's variant picker to update the shown prices for the selected variant; verify selecting a different variant replaces the displayed prices and that selecting an unavailable variant disables the popup's add-to-cart control.
- [x] 6.3 Wire the popup's add-to-cart button to POST that single variant to `/cart/add.js` and run the section's cart-render path; verify the product is added as its own line item and the cart UI updates.
- [x] 6.4 Implement popup open/close behavior: close button, overlay click, and `Escape` close it, focus moves into the dialog on open and returns to the invoking control on close; verify keyboard-only users can open, read, and dismiss the popup and focus does not stay trapped after closing.

## 7. No-JS and accessibility fallback

- [x] 7.1 Verify with JavaScript disabled that the block shell renders without errors, every row produced by the server-rendered shell is visible, and the page does not throw Liquid/parse errors; verify that the recommendations-driven rows do not appear as an empty visible container.
- [x] 7.2 Verify each selection control, row preview control, and the claim button has an accessible name and that selected rows expose their selected state to assistive technology; verify keyboard-only navigation (Tab, Enter/Space, Escape) reaches and operates every control.

## 8. Styling

- [x] 8.1 Add scoped rules to `snippets/blocky-main-product-css.liquid` under `#blocky-featured-product-{{ section.id }} .blocky-bms ...` for the heading, row grid, thumbnail, selection control, title, variant select, prices, compare-at price, save tag, claim button, and the preview overlay, driven by the block's custom properties; verify desktop layout matches the reference markup and mobile stacks without clipping or horizontal overflow.
- [x] 8.2 Verify the preview overlay is not clipped by neighboring blocks, sits above the section's other overlays, and scrolls or centers correctly on small viewports; verify the block has no visual effect on other blocks when it is the only block on the page.

## 9. Integration verification

- [ ] 9.1 On a real product page with the `buy_more_save` block present, verify the full flow end to end: recommendations populate, select one add-on, submit the claim action, and confirm the cart contains the current product plus the add-on with the correct prices shown in the block; then deselect all and confirm only the current product is added.
- [ ] 9.2 Verify the preview popup for a multi-variant product: gallery switching, price update on variant change, add-to-cart from the popup, and close via button/overlay/Escape; verify a single-variant product's popup shows no variant picker.
- [ ] 9.3 Verify the theme editor lifecycle: adding, removing, and reordering the block, and editing heading/save percentage/max products/color settings, produces no errors and leaves every other block, the buy buttons, and the product form rendering and behaving exactly as before; verify the block renders nothing visible when recommendations return no products.

## Workflow follow-up

- Sync the `storefront-buy-more-save` delta into the main spec once the project's review requirements are satisfied.
- Archive the change after implementation is complete.
