# Tasks

## 1. Remove the DMCA badge

- [x] 1.1 In `sections/footer.liquid`, delete the DMCA comment, the `{%- assign dmca_protection_id = ... -%}` line, the `<div class="footer__dmca-badge">` anchor/image block, and the `DMCABadgeHelper.min.js` `<script>` tag (all inside `.footer__column--info`). Verify no `dmca` references remain with a case-insensitive search of `sections/footer.liquid`.
- [x] 1.2 In `assets/section-footer.css`, remove the now-unused `.footer__dmca-badge` rule and confirm the file no longer references `dmca`.

## 2. Add the image badges block type

- [x] 2.1 Add an `image_badges` entry to the footer schema's `blocks` array with `"name": "t:sections.footer.blocks.image_badges.name"`, and settings for two badge slots: for each slot an `image_picker` (`badge_1_image` / `badge_2_image`), a `url` (`badge_1_link` / `badge_2_link`), and `range` width and height in px (`badge_1_width`/`badge_1_height`, `badge_2_width`/`badge_2_height`) with sensible defaults. Verify `shopify theme check` reports no schema errors and each badge exposes image, link, width, and height fields.
- [x] 2.2 Label the block with literal English strings in `sections/footer.liquid` (block `name`, `Badge 1`/`Badge 2` headers, and per-badge image/link/width/height labels) rather than `t:` keys, matching the adjacent `image` block and avoiding edits to the auto-generated `locales/*.schema.json`. Verify the theme editor shows the labels instead of raw translation keys.

## 3. Render the block in the footer info column

- [x] 3.1 In `sections/footer.liquid`, inside `.footer__column--info`, add a loop over `section.blocks` where `block.type == 'image_badges'` that emits one `<div class="footer__images_badges">` container and, for each configured badge slot, an image rendered with `image_url`/`image_tag` at the configured width and height, wrapped in an anchor to the configured link when a link is set. Use `image.alt | default: shop.name` as the alt text, and skip a slot when its image is blank. Verify a rendered preview shows the container and both linked images when both slots are configured.
- [x] 3.2 Exclude `image_badges` from the `.footer__blocks-wrapper` block loop so it does not render as a grid item there, and account for that exclusion in the wrapper's grid-column size calculation. Verify the block renders only in the info column and not in the blocks wrapper.
- [x] 3.3 Verify conditional rendering: with only slot 1 configured, only one image renders; with no images configured, the container renders with no images and no errors; with an image but no link, the image renders without an anchor.

## 4. Style the badges

- [x] 4.1 Confirm the existing `.footer__images_badges` flex rule produces the 2-up row with `gap: 0.5rem`, and add a scoped `.footer__images_badges img { display: block; }` (plus a max-width guard only if needed) so badge images sit correctly. Verify at mobile (<750px) and desktop (≥750px) widths that the badges are inline, aligned, and do not overflow the info column.

## 5. Integration verification

- [x] 5.1 Verify existing footer content is unchanged: render the footer and confirm payment icons, localization selectors, newsletter form, follow-on-shop button, social icons, policy links, and copyright display as before, with or without the image badges block present.
- [x] 5.2 Verify safe degradation: block the badge image host (or use an invalid image) and confirm the footer still renders and layout is not broken.
- [x] 5.3 Run `shopify theme check` and confirm the change introduces no new Liquid or schema errors in `sections/footer.liquid`.

## 6. Column layout and adjustable spacing

- [x] 6.1 Change `.footer__images_badges` in `assets/section-footer.css` to a vertical layout (`flex-direction: column; justify-content: flex-end; align-items: center;`) and move the inter-badge gap out of CSS into a merchant setting. Verify the two badges stack centered and bottom-aligned.
- [x] 6.2 Add a `range` setting `badges_gap` (0–100px, step 2, default 8) with a literal label to the `image_badges` block in `sections/footer.liquid`, and apply it as an inline `gap` on the `.footer__images_badges` container. Verify `shopify theme check` reports no errors for `sections/footer.liquid` and that changing the setting changes the spacing.
- [x] 6.3 Replace the block's `t:` labels with literal English strings and remove the hand-added `image_badges` keys from all `locales/*.schema.json`, since lockstep updates to the auto-generated locale files caused upload failures. Verify `sections/footer.liquid` has no `t:sections.footer.blocks.image_badges` references and every locale file remains valid JSON.

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied.
- Verify the archived result writes `openspec/specs/footer-trust-badges/spec.md`.
- Resolve the unarchived `add-dmca-badge-footer` change (archive or withdraw) so it does not reintroduce DMCA requirements after this change lands.
