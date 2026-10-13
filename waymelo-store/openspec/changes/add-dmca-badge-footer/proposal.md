# Proposal

## Why

The storefront footer already shows payment method icons in its bottom info column, but it carries no trust or content-protection signal. Adding a DMCA.com Protection Status badge gives visitors and the store owner a visible, verifiable signal that the store's content is protected against copyright infringement, and it is a low-risk, self-contained addition to an existing footer region.

## What Changes

- Add a DMCA protection badge to the footer: an anchor linking to the store's DMCA.com Protection Status page, containing the DMCA badge image, rendered inside a dedicated wrapper element.
- Render the badge in the footer's bottom info column (`.footer__column--info`), adjacent to the existing payment icons so it groups with the other trust/compliance signals.
- Include the DMCA.com badge helper script required by the badge snippet.
- Add or extend footer styling so the badge sits visually in line with the existing payment list at both mobile and desktop breakpoints.
- Store the DMCA protection ID in a single, clearly identified place so it can be changed without hunting through markup.
- No **BREAKING** changes. Removing or omitting the badge has no effect on payment icons, localization, newsletter, or policy links.

## Capabilities

### New Capabilities
- `footer-trust-badges`: Rendering (and later configuration) of third-party trust/protection badges in the storefront footer, including the DMCA.com Protection Status badge, its link target, image asset, and helper script.

### Modified Capabilities
<!-- None. No existing spec-level behavior changes; openspec/specs/ is empty, so this change introduces the first capability. -->

## Impact

- **Code**: `sections/footer.liquid` (markup for the badge and script); `assets/section-footer.css` or `assets/component-list-payment.css` (alignment/spacing).
- **External dependencies**: `images.dmca.com` badge image and `DMCABadgeHelper.min.js` helper script are loaded from a third-party origin at render time. This is a new external runtime dependency and a performance/security consideration documented in `design.md`.
- **Configuration**: A DMCA protection ID (`a4d778c3-abcf-45c9-ae83-b157c525078c`) is embedded in the link and image query string.
- **Specs**: First capability created at `openspec/specs/footer-trust-badges/`.
- **Out of scope**: Automated verification of DMCA.com account status, other trust badges, and footer schema/setting controls (may be proposed later if configurability is needed).
