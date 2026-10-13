# Proposal

## Why

In the `blocky-main-product` section, the Variant Picker block renders each color option as a plain colored dot. A flat color does not always match the product (multi-tone, patterned, or textured items), so shoppers cannot tell colors apart confidently and may pick the wrong variant. Showing the actual product image for each color makes the choice visual and unambiguous.

## What Changes

- When a variant option is recognized as a color option (option name contains "color"/"colour") and color swatches are enabled, each swatch SHALL display the product image for that color instead of only a solid color.
- The image for a color value SHALL be taken automatically from the product data already available: the featured image of the first variant whose value for that option equals the color value. No new merchant mapping is required.
- Fallback: when a color value has no associated variant image, that swatch SHALL fall back to the existing solid color (from the existing `color_swatch_mapping` / derived value) so no swatch is ever empty or broken.
- The swatch remains a single selectable radio option; selecting it continues to update the selected variant and switch the main product media as it does today.
- Existing behavior is preserved: the `picker_type` dropdown is unchanged, non-color options keep their text labels, and `show_color_swatches = false` keeps the current plain appearance.
- No **BREAKING** changes.

## Capabilities

### New Capabilities
- `storefront-product-variant-picker`: How the product section's Variant Picker presents variant options to shoppers, including color swatch rendering and per-color imagery, and how a selection maps to the selected variant and main media.

### Modified Capabilities
<!-- None. No existing capability (storefront-reviews, footer-trust-badges) covers the product variant picker. -->

## Impact

- **Code**: `sections/blocky-main-product.liquid` — the `variant_picker` block markup and its styles within the section's `{% style %}` block; possibly the Variant Picker block schema if a merchant-facing toggle is added. The existing product JSON (`variants[].featured_media_id`) and `updateVariant()` / `activateMedia()` logic already provide per-variant media and need no new data.
- **Behavior**: Color swatches now render an image; appearance changes only for color options when swatches are enabled. Selection and main-media switching behavior is unchanged.
- **Specs**: New capability `openspec/specs/storefront-product-variant-picker/spec.md`.
- **Out of scope**: A merchant-authored color→image mapping; image swatches for non-color options; changing variant selection, availability, or add-to-cart logic; the media gallery/thumbnail behavior.
