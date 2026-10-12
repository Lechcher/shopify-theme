# Tasks

## 1. Add the trust logos block type

- [x] 1.1 In `sections/footer.liquid`, add a `trust_logos` entry to the footer schema's `blocks` array with literal labels and settings: `trustpilot_enable` (checkbox, default true), `trustpilot_url` (url, default `https://www.trustpilot.com`), `trustpilot_label` (text, default `Trustpilot`), `trustpilot_rating` (text, default `★★★★★`), `trustpilot_count` (text, default `13,578`), and `dmca_enable` (checkbox, default true), `dmca_url` (url, default `https://www.dmca.com`), `dmca_left` (text, default `DMCA`), `dmca_right` (text, default `PROTECTED`). Verify `shopify theme check` reports no schema errors for `sections/footer.liquid`.

## 2. Render the block in the footer info column

- [x] 2.1 In `sections/footer.liquid`, inside `.footer__column--info` after the image badges loop, add a loop over `section.blocks` where `block.type == 'trust_logos'` that emits a single `.footer-trust-logos-simple` container. When `trustpilot_enable` is on, render the Trustpilot anchor (`.simple-trustpilot-line`, `target="_blank"`, `rel="noopener"`, accessible label) containing the inline star SVG (`.trustpilot-icon-star`, `aria-hidden="true"`), the label (`.trustpilot-title-text`), the rating (`.trustpilot-stars-mini`), and the count (`.trustpilot-review-count`). When `dmca_enable` is on, render the DMCA anchor (`.footer-dmca-badge`) with `.dmca-tag-left` and `.dmca-tag-right`. Verify the rendered container holds the enabled signals in Trustpilot-then-DMCA order and that both links include `rel="noopener"`.
- [x] 2.2 Exclude `trust_logos` from the `.footer__blocks-wrapper` loop and from the `content_blocks_size` count (extend the existing guards that skip `image_badges`). Verify the block renders only in the info column, not in the blocks wrapper, and that the wrapper's grid-column classes are unchanged by its presence.

## 3. Style the trust logos

- [x] 3.1 Add rules for `.footer-trust-logos-simple`, `.simple-trustpilot-line`, `.trustpilot-icon-star`, `.trustpilot-title-text`, `.trustpilot-stars-mini`, `.trustpilot-review-count`, `.footer-dmca-badge`, `.dmca-tag-left`, and `.dmca-tag-right` to `assets/section-footer.css`, near the `.footer__images_badges` rules. Verify at mobile (<750px) and desktop (≥750px) widths that both signals are legible, aligned, and do not overflow the info column.

## 4. Integration verification

- [x] 4.1 Verify conditional rendering: with `trustpilot_enable` off only the DMCA tag renders (and vice versa); with both off the container renders empty without errors; with no trust logos block the footer is unchanged.
- [x] 4.2 Verify existing footer content is unchanged: render the footer and confirm payment icons, localization selectors, newsletter form, follow-on-shop button, social icons, policy links, copyright, and the image badges block display as before, with or without the trust logos block present.
- [x] 4.3 Run `shopify theme check` and confirm the change introduces no new Liquid or schema errors in `sections/footer.liquid`.

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied.
- Verify the archived result writes/updates `openspec/specs/footer-trust-badges/spec.md`, coordinating with the unarchived `configurable-footer-image-badges` change that targets the same capability.
