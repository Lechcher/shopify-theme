# Tasks

## 1. Resolve and render the per-color swatch image

- [x] 1.1 In the `variant_picker` block's option-value loop in `sections/blocky-main-product.liquid`, when the option is a color option and swatches are enabled, resolve a swatch image by scanning `product.variants` for the first variant whose value at the current `option_index` equals the option value and whose `featured_media.preview_image` is present. Verify by previewing a product with color variants that carry images and confirming the resolved media id/image is available for each color value.
- [x] 1.2 Render an `<img>` inside the color swatch `label` using the resolved media's preview image (`image_url` at swatch size), clipped to the swatch, and leave the swatch fill as the existing solid color when no image resolves. Verify no `<img>` is emitted for a color value with no variant image.

## 2. Style image swatches

- [x] 2.1 Update the swatch rules in the section's `{% style %}` block so the swatch clips its content and the image fills it (`width/height: 100%`, `object-fit: cover`), while keeping the circular shape, border, and selected border treatment. Verify swatches render as circular image thumbnails with a visible border, and the selected swatch shows the active border, in the theme editor preview.

## 3. Preserve existing rendering paths

- [x] 3.1 Verify that a color value with no variant image falls back to the solid color with no broken-image icon or empty swatch.
- [x] 3.2 Verify the unchanged paths still render as before: `picker_type = dropdown`, `show_color_swatches = false` (plain text labels), and a non-color option (plain text labels), on a product with multiple options.

## 4. Accessibility and selection integration

- [x] 4.1 Verify each image swatch exposes the color value as its accessible name (label text/`title`), the swatch `<img>` is decorative (`alt=""`), the control is keyboard-operable as a native radio, and the selected state is both visually and programmatically indicated.
- [x] 4.2 Verify selecting an image swatch selects the matching variant and switches the main product media to the variant's featured media (via the existing `updateVariant`/`activateMedia`), and that selecting a swatch whose variant has no featured media updates the variant without changing the main media.

## 5. Integration verification

- [ ] 5.1 On a full product page, verify color swatch images render on load, selection updates price/availability/media, and no JavaScript is required for the swatch images to appear. Confirm the section loads without errors in the theme editor (`shopify:section:load`) and in the storefront preview.

## Workflow follow-up

- Archive the change after review requirements are satisfied and verify the archived result.
