# Tasks

## 1. Block scaffolding and schema

- [x] 1.1 Add a `delivery` block entry to the `{% schema %}` `blocks` array in `sections/blocky-main-product.liquid` with `limit: 1`, grouped settings (destination label, arrival label, earliest/latest day offsets, ship start/end offsets, date format + day/month labels, method name + day range, three detail notes, policy text + URL, and text/heading colors) and defaults matching the reference copy; verify the block appears in the theme editor add-block list.
- [x] 1.2 Add a `delivery` case to the section's `{% case block.type %}` switch in the product content column that `{% render %}'s a new `snippets/blocky-lys-delivery.liquid` with `block: block`; verify the block renders in preview without errors.

## 2. Summary lines and dates

- [x] 2.1 Build the destination line in `snippets/blocky-lys-delivery.liquid` showing the configured label, `localization.country.name`, and a disclosure caret; verify the current storefront country name renders and updates after switching country in the header selector.
- [x] 2.2 Build the estimated arrival line computing a date range from the earliest/latest day offsets using `'now' | date: '%s' | plus: <seconds>` with the configured format and labels; verify the displayed range matches the offsets and that equal offsets render a single date.

## 3. Preferences modal and functional country switching

- [x] 3.1 Add the Update Your Preferences modal markup: title, country selector, `Save & Continue` submit, and a shipping policy link, wrapped in a real `{% form 'localization' %}` with a hidden `country_code` input; namespace all IDs with `block.id`; verify submitting changes the storefront country/currency and persists on reload (confirm against `assets/localization-form.js` whether the `localization-form` custom element or a plain submit is required).
- [x] 3.2 Populate the selector options from `localization.available_countries` as `Country (CURRENCY)` and preselect the current country; verify the current country is selected on load and all available countries are listed.

## 4. Delivery Method popover

- [x] 4.1 Add the Delivery Method popover markup: title, method name with business-day range, an `Order Placed` / `Order Ships` / `Delivered` timeline with dates derived from the ship and delivery offsets, and the configured detail notes; verify each non-empty note renders in order and the timeline dates follow the offsets.
- [x] 4.2 Implement the `blocky-delivery` custom element in `sections/blocky-main-product.liquid` (guarded with `customElements.get`) to toggle each popover from its summary-line button, manage `aria-expanded`, close on outside click and `Escape`, and open the modal as an overlay; verify keyboard and mouse open/close and that no console errors occur.

## 5. Styling

- [x] 5.1 Add scoped rules to `snippets/blocky-main-product-css.liquid` under `#blocky-featured-product-{{ section.id }} .blocky-delivery ...` for the summary lines, carets, modal card/overlay, selector, buttons, popover, and timeline rows, driven by the block's color settings; verify desktop and mobile layouts match the reference and are not clipped by neighboring blocks.

## 6. Integration verification

- [ ] 6.1 On a real product page (or the theme editor preview) with the Delivery block present, verify the full flow end to end: both lines render, the modal opens and switches country and currency with persistence, the popover opens and closes, and settings edits update copy and colors without code changes.
- [ ] 6.2 Verify the block respects the theme editor lifecycle: adding/removing/reordering the block and editing settings does not break existing blocks or throw errors; confirm the `delivery` block has no visual or behavioral impact when absent.

## Workflow follow-up

- Sync the `product-delivery-block` delta into the main spec once the project's review requirements are satisfied.
- Archive the change after implementation is complete.
