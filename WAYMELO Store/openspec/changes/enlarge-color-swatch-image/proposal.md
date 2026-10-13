# Proposal

## Why

In the `blocky-main-product` section, the Variant Picker renders each color option as an image-backed swatch sized at `2rem` (about 32px). At that size the product image is too small to read, so the per-color imagery added by the `add-color-swatch-images` change does not deliver its intended benefit of letting shoppers tell colors apart confidently. A larger preview makes the color choice visual and unambiguous.

## What Changes

- Increase the color swatch preview in the `blocky-main-product` section's Variant Picker from `2rem` (about 32px) to **60px**, for button-style color swatches (both the solid-color fallback swatch and the image swatch).
- Keep the swatch circular, keep the existing border and selected-border treatment, and keep the image clipped to the swatch (`object-fit: cover`).
- Keep the image request version large enough for the new display size so the enlarged swatch stays crisp on high-density (retina) displays.
- Preserve all existing paths unchanged: the `picker_type = dropdown` select, non-color options and their text labels, `show_color_swatches = false`, the solid-color fallback for colors without a variant image, and variant selection / main-media switching behavior.
- No new merchant settings or schema changes.
- No **BREAKING** changes.

## Capabilities

### New Capabilities

- `storefront-product-variant-picker`: How the product section's Variant Picker presents variant options to shoppers, including color swatch rendering, per-color imagery, and the display size of those swatches. (This capability is introduced alongside the in-flight `add-color-swatch-images` change; it is not yet present under `openspec/specs/`.)

### Modified Capabilities

<!-- None. The Variant Picker capability has no main spec under openspec/specs/ yet, so this change adds a requirement to it rather than modifying an existing main-spec requirement. -->

## Impact

- **Code**: `snippets/blocky-main-product-css.liquid` — the `label.blocky-product-color-swatch` sizing rule (and, if needed, the `__image` rule). Possibly `sections/blocky-main-product.liquid` for the swatch image `image_url` width if the current request size is too small for 2x at 60px.
- **Behavior**: Color swatch previews appear larger; no other rendering, selection, or add-to-cart behavior changes.
- **Specs**: Adds a requirement to capability `storefront-product-variant-picker` (delta at `openspec/changes/enlarge-color-swatch-image/specs/storefront-product-variant-picker/spec.md`).
- **Out of scope**: Changing swatch shape/border/selected styling, the fallback color logic, non-color options, the dropdown picker, and any media gallery or thumbnail behavior.
