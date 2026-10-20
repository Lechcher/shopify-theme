# Tasks

## 1. Card border defaults

- [x] 1.1 In the `buy_more_save` schema entry in `sections/blocky-main-product.liquid`, change `row_border_width` default from `1` to `3`; verify the theme editor shows the "Row border width" setting defaulting to 3px and that the value is within the existing `min: 0, max: 4` range.
- [x] 1.2 In the same section, change the inline `--bms-row-border-width` custom property fallback from `{{ block.settings.row_border_width | default: 1 }}px` to `default: 3`; verify a block with no saved `row_border_width` renders a 3px card border by inspecting the element's inline style.
- [x] 1.3 In `snippets/blocky-main-product-css.liquid`, change the `.blocky-bms-row` border-width fallback `var(--bms-row-border-width, 1px)` to `var(--bms-row-border-width, 3px)`; verify the fallback is used when the custom property is absent.
- [x] 1.4 Verify the radius is already 12px in all three layers (schema `row_radius` default, `--bms-row-radius` fallback, and the CSS `.blocky-bms-row` `border-radius` fallback) and leave them unchanged; verify a default card renders a 12px corner radius.

## 2. Five-product limit

- [x] 2.1 In the `blocky-buy-more-save` custom element (~line 2961 of `sections/blocky-main-product.liquid`), replace the always-five `Math.min(5, Math.max(this.maxProducts, 5))` limit expression with an explicit five-product limit; verify the recommendations request URL still contains `limit=5`.
- [x] 2.2 Verify `renderList()` still slices the rendered rows to `Math.min(this.maxProducts, 5)`; verify a response with more than five products renders exactly five cards and that the block's default setting renders five.

## 3. Integration verification

- [ ] 3.1 On a product page with the `buy_more_save` block present (default settings), verify the block shows at most five add-on cards, each with a 3px border and 12px radius, and that the save-percentage, selection, claim, and preview behaviors are unchanged.
- [ ] 3.2 Verify the theme editor lifecycle for the block: editing the row border width/radius settings updates the cards, and adding/removing/reordering the block leaves every other block, the buy buttons, and the product form rendering and behaving as before.
- [ ] 3.3 Verify the block still renders nothing visible when the recommendations service returns no products for either intent.

## Workflow follow-up

- Sync the `storefront-buy-more-save` delta into the main spec once the project's review requirements are satisfied (coordinate with the in-flight `add-buy-more-save-block` change that owns the base capability).
- Archive the change after implementation is complete.
