# Tasks

## 1. Enlarge the color swatch preview

- [x] 1.1 In `snippets/blocky-main-product-css.liquid`, change the `label.blocky-product-color-swatch` sizing rule from `width: 2rem; height: 2rem;` to `60px` by `60px`. Verify in the theme editor preview that color swatches render at approximately 60×60px.
- [x] 1.2 In `sections/blocky-main-product.liquid`, confirm the swatch image request width (`image_url: width: 120`) is at least 2× the 60px display size so it stays crisp on high-density displays, and adjust only if it is not. Verify the enlarged swatch image renders sharp (not pixelated) in preview.

## 2. Preserve existing swatch behavior

- [x] 2.1 Verify a color value with no variant image still renders the solid-color fallback swatch at 60×60px with no broken-image icon.
- [x] 2.2 Verify the circular shape, the swatch border, and the selected-border treatment are unchanged at the new size, and that swatch content stays clipped to the circle.
- [x] 2.3 Verify the unchanged paths render as before on a multi-option product: `picker_type = dropdown`, `show_color_swatches = false` (plain text labels), and non-color options (plain text labels).

## 3. Integration verification

- [x] 3.1 On a full product page, verify the enlarged color swatches render on load, selecting a swatch still updates price/availability/main media via the existing `updateVariant`/`activateMedia` logic, no JavaScript is required for the swatch images to appear, and the section loads without errors in the theme editor and storefront preview.

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied.
- Verify the archived result.
