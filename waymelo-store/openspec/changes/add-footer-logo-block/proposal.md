# Proposal

## Why

The footer has no way to show the store's logo as a prominent, centered element, and the "Follow on shop" button only ever appears squeezed into the newsletter/social column at the edge of the footer. The store owner wants a centered logo block in the middle of the footer content area with the "Follow on shop" button grouped beside it, so the brand and the follow call-to-action read as one intentional focal point.

## What Changes

- Add a new footer block type `logo_follow` ("Logo & follow") with settings for:
  - **Logo image** — an `image_picker` for the centered store logo (optional; the block renders nothing visual without it).
  - **Logo width** — a range setting capping the rendered logo width (default 120px).
  - **Image alignment/alt behavior** — alt text falls back to the shop name when the picked image has no alt.
  - **Follow on shop toggle** — a checkbox (default on) that shows the "Follow on shop" button (`shop | login_button: action: 'follow'`) inside the block's centered row, grouped with the logo.
- Render the block, when present, as a full-width centered row inside `.footer__content-top`, before the existing blocks wrapper/newsletter columns, wrapped in a `.footer__logo-block` container that centers its contents horizontally and stacks the logo above the button.
- Exclude `logo_follow` from the `.footer__blocks-wrapper` grid loop and from the `content_blocks_size` count, following the existing `image_badges` / `trust_logos` precedent, so the block renders only in its dedicated centered row and does not skew the grid-column math.
- Add the stylesheet rules for `.footer__logo-block`, `.footer__logo-block__image-wrapper`, and `.footer__logo-block__follow` to `assets/section-footer.css` (new rules; scoped to the footer).
- No **BREAKING** changes. The block is inert until a merchant adds it; the existing edge-of-footer follow-on-shop button and all other footer content are unaffected.

## Capabilities

### New Capabilities

- `footer-logo-block`: Rendering and merchant configuration of a centered storefront footer logo block, including its logo image, sizing, and an optional "Follow on shop" button grouped with it.

### Modified Capabilities

<!-- None. openspec/specs/ contains `footer-trust-badges`, `storefront-help-button`, and `storefront-reviews`, none of whose requirements this change alters. -->

## Impact

- **Code**: `sections/footer.liquid` (add the `logo_follow` block type to the schema; render it as a centered row inside `.footer__content-top`; exclude it from `.footer__blocks-wrapper` and `content_blocks_size`); `assets/section-footer.css` (new rules for the logo-block classes).
- **Configuration**: Logo image, width, and follow-button visibility are merchant-editable in the theme editor.
- **Localization**: Literal English labels for the new block settings, matching the `image_badges` / `trust_logos` blocks and avoiding lockstep edits to the auto-generated `locales/*.schema.json`.
- **External dependencies**: None. The logo is a theme-managed image asset; the follow button is the platform `login_button` filter.
- **Out of scope**: A second follow-on-shop button elsewhere in the footer, changes to the existing edge-of-footer follow button, live follower counts, and any change to payment icons, localization selectors, newsletter, social icons, policy links, copyright, or the image badges / trust logos blocks.
