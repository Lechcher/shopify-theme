# Proposal

## Why

The footer can already show a configurable image-badges block, but there is no first-class way to display the common text/logo trust signals a storefront typically wants: a Trustpilot review line and a DMCA "PROTECTED" tag. Today these can only be added by editing theme code. A dedicated, merchant-configurable footer block lets the store owner turn each signal on or off, set its link, and edit its text from the theme editor.

## What Changes

- Add a new footer block type `trust_logos` ("Trust logos") with settings for:
  - **Trustpilot line** — enable toggle, link URL, label text, star-rating text, and review count (defaults match the supplied markup: `Trustpilot`, `★★★★★`, `13,578`, `https://www.trustpilot.com`).
  - **DMCA tag** — enable toggle, link URL, left tag text, and right tag text (defaults: `DMCA`, `PROTECTED`, `https://www.dmca.com`).
- Render the block, when present, in the footer's bottom info column (`.footer__column--info`), after the existing image-badges block, wrapped in a `.footer-trust-logos-simple` container that mirrors the supplied markup.
- Render the Trustpilot line as an anchor containing a star SVG, the label, mini stars, and the review count; render the DMCA tag as an anchor containing a left and right tag label. Both anchors open in a new tab with `rel="noopener"` and an accessible name.
- Add the missing stylesheet rules for `.footer-trust-logos-simple`, `.simple-trustpilot-line`, `.trustpilot-icon-star`, `.trustpilot-title-text`, `.trustpilot-stars-mini`, `.trustpilot-review-count`, `.footer-dmca-badge`, `.dmca-tag-left`, and `.dmca-tag-right` to `assets/section-footer.css` (none exist today).
- Exclude `trust_logos` from the `.footer__blocks-wrapper` loop, as is already done for `image_badges`, so it renders only in the info column.
- No **BREAKING** changes. The block is inert until a merchant adds it; existing footer content is unaffected.

## Capabilities

### New Capabilities

- `footer-trust-badges`: Rendering and merchant configuration of trust/protection signals in the storefront footer. This change adds the configurable Trustpilot + DMCA "Trust logos" block to that capability.

### Modified Capabilities

<!-- None. openspec/specs/ contains only `storefront-reviews`, which this change does not affect. -->

## Impact

- **Code**: `sections/footer.liquid` (add the `trust_logos` block type to the schema; render it in `.footer__column--info`; exclude it from `.footer__blocks-wrapper`); `assets/section-footer.css` (new rules for the trust-logo classes).
- **Configuration**: All content is merchant-editable; defaults reproduce the supplied markup.
- **Localization**: No `t:` keys are used — labels are literal English strings, matching the `image_badges` block and avoiding edits to the auto-generated `locales/*.schema.json`.
- **External dependencies**: None. The star icon is inline SVG; the Trustpilot and DMCA links are ordinary anchors.
- **Related changes**: `configurable-footer-image-badges` is complete but not archived, so `openspec/specs/footer-trust-badges/` does not exist yet; this change adds requirements to the same capability and folds into that spec on archive.
- **Out of scope**: Fetching live Trustpilot ratings or review counts (values are merchant-set text), additional trust vendors, and any change to payment icons, localization selectors, newsletter, follow-on-shop, social icons, policy links, or copyright.
