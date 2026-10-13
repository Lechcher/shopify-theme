# Proposal

## Why

The storefront footer currently hardcodes a single DMCA.com protection badge: a fixed third-party image and link with a protection ID embedded in `sections/footer.liquid`. Merchants cannot change the badge or its link without editing theme code, and the fixed DMCA asset is an external runtime dependency. Replacing it with merchant-configurable image badges lets the store owner swap badges (trust seals, certifications, press logos) and their links from the theme editor.

## What Changes

- **BREAKING** Remove the DMCA.com protection badge from the footer: the explanatory comment, the `dmca_protection_id` assignment, the `.footer__dmca-badge` container and anchor/image, and the deferred `DMCABadgeHelper.min.js` script tag are deleted from `sections/footer.liquid`. The external `images.dmca.com` dependency goes away.
- Add a new footer block type (`image_badges`, name "Image badges") with settings for **two** image badges. Each badge exposes: an image (`image_picker`), a link (`url`), a width, and a height.
- Render the block, when present, in the footer's bottom info column at the former DMCA location, wrapped in a `<div class="footer__images_badges">` parent so the two badges lay out in a flex row.
- Render each badge as a linked image; a badge only renders when its image is set, and the link is omitted when no link is set.
- Keep the existing `.footer__images_badges` styling (`display: flex; justify-content: flex-start; align-items: center; gap: 0.5rem;`) as the block's layout.
- Add merchant-facing labels for the new block and its settings so the theme editor presents readable field names.
- No change to payment icons, localization selectors, newsletter, follow-on-shop, social icons, policy links, or copyright.

## Capabilities

### New Capabilities

- `footer-trust-badges`: Merchant-configurable trust/protection image badges in the storefront footer — the configurable image badges block, its two badge slots (image, link, width, height), how each badge renders, and safe behavior when a badge has no image or fails to load.

### Modified Capabilities

<!-- None. openspec/specs/ currently contains only `storefront-reviews`, which this change does not affect. -->

## Impact

- **Code**: `sections/footer.liquid` (remove DMCA block/script, add the `image_badges` block type, render it in `.footer__column--info`); `assets/section-footer.css` (`.footer__images_badges` already exists; add per-badge image sizing rules if needed).
- **Localization**: `locales/en.default.schema.json` for the new block name and setting labels; other locale schema files may need the same keys to avoid fallback gaps.
- **External dependencies**: Removes the `images.dmca.com` image and helper-script runtime dependency. Badge images are served from the Shopify CDN via `image_picker`, so no third-party origin is required.
- **Theme schema**: Adds a block type to the footer section schema. Existing footer configurations are unaffected until a merchant adds the block; with no block present the info column renders exactly as it does today minus the DMCA badge.
- **Related change**: `add-dmca-badge-footer` is complete but not yet archived, so `openspec/specs/footer-trust-badges/` does not exist yet. This change introduces that capability and supersedes the DMCA-specific requirements of that unarchived change; the DMCA change should be archived or withdrawn rather than archived after this one.
