# Tasks

## 1. Add the logo block type

- [x] 1.1 In `sections/footer.liquid`, add a `logo_follow` entry to the footer schema's `blocks` array with literal English labels and settings: `logo_image` (`image_picker`, no default), `logo_width` (range, min 40, max 300, step 10, unit px, default 120), and `enable_follow_on_shop` (checkbox, default true). Verify `shopify theme check` reports no schema errors for `sections/footer.liquid`.

## 2. Render the centered logo block

- [x] 2.1 In `sections/footer.liquid`, inside `.footer__content-top` before the `.footer__blocks-wrapper`, add a loop over `section.blocks` where `block.type == 'logo_follow'` that emits one `.footer__logo-block` container. When `logo_image` is set, render the image at the configured `logo_width`, wrapped in `.footer__logo-block__image-wrapper`, with `loading="lazy"`, intrinsic width/height, and `alt` falling back to `shop.name`. When `enable_follow_on_shop` is on and `shop.features.follow_on_shop?`, render the platform follow button (`shop | login_button: action: 'follow'`) inside `.footer__logo-block__follow` in the same container. Verify the container is centered, stacks the logo above the button, and omits the image element entirely when no image is set.
- [x] 2.2 Exclude `logo_follow` from the `.footer__blocks-wrapper` loop and from the `content_blocks_size` count (extend the existing guards that skip `image_badges`/`trust_logos`), and add `logo_follow` to the outer `.footer__content-top` render condition so a footer whose only block is the logo block still renders. Verify the block does not appear inside the blocks wrapper, the wrapper's grid-column classes are unchanged by its presence, and a footer containing only the logo block renders the content-top region.

## 3. Style the centered logo block

- [x] 3.1 Add rules for `.footer__logo-block`, `.footer__logo-block__image-wrapper`, and `.footer__logo-block__follow` to `assets/section-footer.css` near the other footer rules: a full-width flex column, horizontally centered, with the image wrapper capped at `min(100%, <width>px)` and sensible vertical spacing between the logo and the button. Verify at mobile (<750px) and desktop (≥750px) widths that the logo is centered, shrinks to fit instead of overflowing on narrow viewports, and the button sits directly below the logo.

## 4. Integration verification

- [x] 4.1 Verify conditional rendering: with `enable_follow_on_shop` on, the logo block shows the follow button; with it off (or when the platform lacks the follow feature), only the logo renders; with no `logo_image`, no image or placeholder renders and the block does not produce a broken image.
- [x] 4.2 Verify existing footer content is unchanged: render the footer and confirm payment icons, localization selectors, newsletter form, the existing edge-of-footer follow-on-shop button, social icons, policy links, copyright, and the image badges and trust logos blocks display as before, with or without the logo block present.
- [x] 4.3 Run `shopify theme check` and confirm the change introduces no new Liquid or schema errors in `sections/footer.liquid`.

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied.
- Verify the archived result writes/updates `openspec/specs/footer-logo-block/spec.md`.
