# Proposal

## Why

The reviews section (`sections/reviews-section.liquid`) renders customer photos at small, fixed sizes — `--rs-gallery-item-w` (default 180px) in the "Reviews with Images" strip and `--rs-review-image-w` (default 96px) inside each review entry. At those sizes a shopper cannot inspect the detail of a customer photo, so the photos add little to the buying decision. Clicking a photo does nothing today, though the theme already establishes that clicking review media opens an enlarged view (the review-video modal in `blocky-main-product`), so the current behavior is inconsistent as well as limiting.

## What Changes

- Add an **image viewer (lightbox)** to the reviews section: clicking a review photo opens the image enlarged in an overlay.
- Make **both** photo surfaces open the viewer: the "Reviews with Images" gallery thumbnails and the photo rendered inside each review entry.
- Support **navigation between images** in the viewer: previous/next controls move through the section's review photos, wrapping or bounding at the ends (decided in design).
- Show the **reviewer name as a caption** for the currently viewed image, with a close control.
- Provide **accessible behavior**: open by click or keyboard, `Escape` closes, clicking the backdrop closes, focus moves into the viewer and is trapped while open, focus returns to the invoking photo on close, and the enlarged image carries a text alternative.
- Close the viewer with a close button, `Escape`, or a backdrop click; opening the viewer must not navigate away or trigger the underlying photo's default behavior.
- Preserve all existing behavior: gallery scrolling, star filtering, pagination, the star summary, and the video-modal behavior in the product section are untouched.
- No new merchant settings or schema changes; reuse the existing review-photo data (image + author) already available from `review` blocks.
- No **BREAKING** changes.

## Capabilities

### New Capabilities

<!-- None. The viewer is a behavior of the existing reviews section, not a new capability. -->

### Modified Capabilities

- `storefront-reviews`: Adds a requirement that review photos open an enlarged, navigable image viewer, including its accessible open/close/navigation behavior, without changing any existing review requirement.

## Impact

- **Code**: `sections/reviews-section.liquid` (markup for the viewer overlay, `data-*` hooks on the gallery items and review-entry photos, and the viewer's scoped styles) and `assets/reviews-section.js` (open/close, prev/next, focus handling, and keyboard events, reusing the section's existing delegated-listener and theme-editor re-init patterns).
- **Behavior**: Review photos become interactive and open an enlarged overlay; the section's existing controls (gallery scroll, filter pills, pagination) are unchanged. The viewer is progressive enhancement — photos remain visible and the section remains readable when JavaScript is unavailable.
- **Data**: Reuses the image and reviewer name already rendered per review block; no new settings, metafields, or app data.
- **Specs**: Adds requirements to capability `storefront-reviews` (delta at `openspec/changes/add-review-image-viewer/specs/storefront-reviews/spec.md`).
- **Out of scope**: Pinch/scroll zoom, panning, image rotation, download/share actions, video playback in the viewer, changes to the product section's review-video modal, and any change to how review photos are authored or sized in the section settings.
