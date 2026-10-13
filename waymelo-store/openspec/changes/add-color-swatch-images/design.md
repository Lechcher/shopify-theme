# Design

## Context

See `proposal.md` — Why. Relevant current state in `sections/blocky-main-product.liquid`:

- The `variant_picker` block (markup around the `when 'variant_picker'` branch) loops `product.options_with_values`. For each option it decides `is_color_option` by checking whether the downcased option name contains "color"/"colour".
- For button-style pickers, each value renders a radio `<input>` plus a `<label>`. Color options with `show_color_swatches` use a circular `label.blocky-product-color-swatch` filled by `--bky-swatch-color`, resolved from the value or the merchant `color_swatch_mapping` textarea. A visually clipped `<span>` holds the value text and `title` carries the value.
- Styles live in the section's single `{% style %}` block (swatch rules near the `.blocky-product-option-values` rules).
- Per-variant media already exists: the product JSON (`[data-blocky-product-json]`) includes `variants[].featured_media_id`, the custom element builds `mediaByVariant`, and `updateVariant()` calls `activateMedia(mediaId)` when a variant changes. No JS change is needed to make a swatch selection switch the main media.

## Goals / Non-Goals

**Goals:**

- Render the per-color product image on each color swatch, derived automatically from the product's variants.
- Fall back cleanly to the existing solid-color swatch when a color has no variant image.
- Change only the appearance of color swatches; leave variant selection, availability, main-media switching, and non-color rendering untouched.

**Non-Goals:**

- A merchant-authored color→image mapping or any new schema setting.
- Image swatches for non-color options or the dropdown picker.
- Changing the media gallery, thumbnails, or `activateMedia` behavior.

## Decisions

### Resolve the swatch image in Liquid from `product.variants`

Inside the existing option-value loop, when the option is a color option, iterate `product.variants` and select the first variant whose value at `option_index` equals the current value and whose `featured_media` (with a preview image) is present. Render that media's preview image inside the label.

- **Why:** the data is already on the server, the result is part of the server-rendered HTML (works without JavaScript), and no new JSON/JS plumbing or merchant input is required.
- **Alternative considered — set images in JS from `mediaByVariant`:** rejected. `mediaByVariant` is keyed by variant id, but the swatch markup is keyed by option value; mapping value→variant→media in JS would duplicate the variant-matching logic in `updateVariant()` and would not render without JavaScript.
- **Alternative considered — new merchant `color_swatch_images` mapping:** rejected per user choice; the mapping is brittle (variant names must match exactly) and unnecessary when variants carry their own images.

### Image as the swatch fill, color as the under-layer

Render an `<img>` sized to fill the swatch (`width/height: 100%`, `object-fit: cover`) as the top layer, keeping the existing `--bky-swatch-color` as the label background beneath it. The swatch keeps its circular shape, border, and selected border treatment.

- **Why:** the color remains the fallback fill with no conditional styling, and the image simply overlays it. Using an `<img>` (not a CSS `background-image`) lets us reuse the theme image pipeline (`image_url`) for responsive sizing.
- **Consequence:** the image is clipped to the swatch shape (`overflow: hidden`), so very wide product photos are cropped to the swatch, which is the intended thumbnail treatment.

### Preserve the accessible name; make the image decorative

Keep the label `title` and the visually clipped `<span>` value text as the swatch's accessible name, and mark the swatch `<img>` as decorative (`alt=""`), so screen readers announce the color name once. The swatch remains a native radio input, so keyboard operation and the selected state come from the existing input/`checked` styling.

- **Why:** the image adds no information beyond the color name already exposed; announcing it or its alt would be redundant.

## Risks / Trade-offs

- [A variant's featured media may be a video or external image] → Use the media's `preview_image` (the same source already used for the main media and thumbnails), so a usable raster image is always rendered.
- [Multiple variants share a color value with different images] → Deterministic first-match selection; documented in the spec as "shared image across variants of the same color".
- [Very light product images blend into a white background] → The existing swatch border (and the selected border color) already frames every swatch; keep it.
- [Extra variant scan per option value] → Variant counts are small and the loop is server-side Liquid; negligible.
- [Merchant expects to choose the image] → Out of scope by decision; the fallback color keeps the swatch meaningful, and a future request can add an override mapping.

## Migration Plan

Front-end only; no data or schema migration. Deploy by updating `sections/blocky-main-product.liquid`. Rollback is reverting that one file; product data and rendered catalog are unaffected. Non-color options and `show_color_swatches = false` render exactly as before.

## Open Questions

None.
