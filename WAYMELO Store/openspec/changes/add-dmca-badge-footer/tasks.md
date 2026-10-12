# Tasks

## 1. Add the DMCA badge markup

- [x] 1.1 In `sections/footer.liquid`, add `{%- assign dmca_protection_id = 'a4d778c3-abcf-45c9-ae83-b157c525078c' -%}` with a short comment, and add a badge block (`<div class="footer__dmca-badge">` containing the anchor and badge image) inside `.footer__column--info`, immediately after the existing `.footer__payment` block. Verify the toolbar/theme editor renders the anchor and image, and that both the link and image URLs interpolate the same protection ID.
- [x] 1.2 Add the DMCA.com badge helper `<script>` tag from the vendor snippet directly after the badge anchor in `sections/footer.liquid`. Verify the script tag appears in the rendered footer HTML.
- [x] 1.3 Confirm the existing footer content is unchanged: render the footer and check that payment icons, localization selectors, newsletter form, follow-on-shop button, social icons, policy links, and copyright still display as before the change (compare against the pre-change render or a fresh preview).

## 2. Align the badge with the footer

- [x] 2.1 Add a scoped `.footer__dmca-badge` rule to `assets/section-footer.css` (centered on mobile, aligned with `.footer__payment` on desktop) if the default footer flow does not already align it. Verify at mobile (<750px) and desktop (≥750px) widths that the badge sits in line with the payment list without overlap or overflow.
- [x] 2.2 Verify graceful degradation: block/deny `images.dmca.com` (e.g. browser devtools request blocking or offline) and confirm the badge area collapses and the rest of the footer renders with no layout breakage and no new console errors from the helper script.

## 3. Integration verification

- [x] 3.1 Inspect the rendered footer HTML and confirm the badge anchor links to the DMCA protection status URL and the image `alt`/anchor name identify it as "DMCA.com Protection Status" (accessible-name check).
- [x] 3.2 Run `shopify theme check` and confirm the change introduces no new Liquid errors in `sections/footer.liquid`. The two `RemoteAsset` warnings (badge image and deferred helper script) are accepted by design as inherent to the deliberate `images.dmca.com` third-party dependency.

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied.
- Verify the archived result writes `openspec/specs/footer-trust-badges/spec.md`.
