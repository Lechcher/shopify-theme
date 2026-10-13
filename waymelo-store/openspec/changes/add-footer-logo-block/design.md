# Design

## Context

See `proposal.md - Why`. Relevant current state (observed):

- `sections/footer.liquid` renders `<footer class="footer ...">` containing a `.footer__content-top` (page-width) and a `.footer__content-bottom`.
- Inside `.footer__content-top`, the markup renders, in order: the optional `.footer__blocks-wrapper.grid` block grid, then `.footer-block--newsletter`, which itself holds the newsletter form, the existing edge-of-footer `.footer__follow-on-shop` button (gated on `shop.features.follow_on_shop?` and `section.settings.enable_follow_on_shop`), and social icons.
- `.footer__content-top` is `display: block` (not flex), so a full-width child block can be inserted and centered independently of the grid/newsletter row.
- The footer already has two custom blocks, `image_badges` and `trust_logos`, that are: excluded from the `.footer__blocks-wrapper` loop via `unless block.type == 'image_badges' or block.type == 'trust_logos'`, skipped in the `content_blocks_size` accumulator, and rendered separately. `content_blocks_size` drives the wrapper's render condition and grid-column classes (`grid--3-col-tablet`, `grid--4-col-desktop`, etc.).
- The `image` and `image_badges` blocks use literal English labels; older blocks use `t:` keys. Newer changes deliberately avoid `t:` keys to avoid lockstep edits to auto-generated `locales/*.schema.json`.
- `assets/section-footer.css` has no rules for a centered logo block. `.footer__content-top` is page-width on desktop with a 3rem bottom padding; `.footer__follow-on-shop` already centers via `display: flex; text-align: center` and is centered on mobile by the `max-width: 749px` rules.

## Goals / Non-Goals

**Goals:**

- Add a single, merchant-configurable footer block that renders a centered store logo and, optionally, a "Follow on shop" button grouped with it.
- Place it as a centered row in the footer content top area, distinct from the existing blocks grid and newsletter/edge column.
- Keep it inert when unused and independent of the existing edge-of-footer follow button and the badges/trust blocks.

**Non-Goals:**

- Reusing or moving the existing edge-of-footer follow-on-shop button (it stays exactly as-is; the new toggle controls only the copy inside the logo block).
- Using the theme-level `brand_image` setting (the block owns its own image).
- Localizing the new labels (literal labels, consistent with `image_badges` / `trust_logos`).
- Responsive art direction beyond width capping, or animated entrances.

## Decisions

**1. One block type (`logo_follow`) holding the logo and the follow toggle.**

The request is one visual unit ("a logo block … with the button"). One block with an image picker, a width range, and a follow checkbox matches that and lets a merchant drop it in as a single piece. Alternative: two separate blocks (rejected — the logo and button are meant to read as one focal point and share one centered container).

**2. Render as a full-width centered row inside `.footer__content-top`, before the blocks grid.**

`.footer__content-top` is `display: block`, so a child rendered before `.footer__blocks-wrapper` becomes its own full-width row. The block emits a `.footer__logo-block` container with `display: flex; flex-direction: column; align-items: center`, giving horizontal centering and stacking the logo above the button. Chosen over the info-column pattern used by `image_badges` / `trust_logos` because the user asked for the center of the content area, not the bottom info column. Alternative: a grid item inside `.footer__blocks-wrapper` (rejected — the wrapper is a multi-column grid; a centered full-width logo would fight the column layout and change neighbor classes).

**3. Exclude the block from the wrapper loop and the `content_blocks_size` count.**

Extend the existing `unless block.type == 'image_badges' or block.type == 'trust_logos'` guards to also skip `logo_follow`, and extend the `content_blocks_size` accumulator's skip list. This is the exact precedent set by the two existing custom blocks, and it keeps the wrapper's grid-column math unchanged when the logo block is present.

**4. Merchant-configurable content with sensible defaults.**

Settings: `logo_image` (`image_picker`, no default), `logo_width` (range 40–300 step 10 unit px, default 120), and `enable_follow_on_shop` (checkbox, default true). The button visibility additionally requires `shop.features.follow_on_shop?`, mirroring how the existing button guards on platform capability. When `logo_image` is blank, no image element and no broken placeholder are emitted (the container can still hold the follow button if enabled).

**5. Reuse `shop | login_button: action: 'follow'` for the button.**

This is the same platform filter the existing button uses, so the new button behaves identically (correct label/behavior per locale and platform support) without new dependencies. It is rendered inside `.footer__logo-block` rather than in `.footer-block--newsletter`.

**6. Accessible image, literal labels, scoped styles.**

The logo image gets `alt` from the image's own alt, falling back to `shop.name`; `loading="lazy"`; intrinsic `width`/`height`. Labels are literal English strings (no `t:` keys, no locale edits). New CSS for `.footer__logo-block`, `.footer__logo-block__image-wrapper`, and `.footer__logo-block__follow` is added to `assets/section-footer.css`, scoped to those classes near the other footer rules, with the image max-width capped to `min(100%, <width>px)` so it shrinks on narrow viewports.

## Risks / Trade-offs

- A second "Follow on shop" button could appear (one in the logo block, one in the newsletter column) if both toggles are on → Mitigation: this is expected and explicitly in scope; merchants can disable either. Called out in the spec's "existing footer behavior unchanged" requirement so the existing button is never removed.
- Adding the block could shift the grid count and change neighbor columns → Mitigation: extended skip list keeps `content_blocks_size` and the wrapper classes unchanged.
- Logo image with no alt exposes an unlabeled image → Mitigation: `alt` falls back to `shop.name`.
- Very wide configured logo could overflow on small screens → Mitigation: wrapper caps rendered width with `max-width: min(100%, <width>px)`.
- New CSS could clash with theme utilities → Mitigation: all selectors are prefixed with `.footer__logo-block` and introduce no global element selectors.
- The block renders only when the footer content-top region renders (it is gated by the existing `content_blocks_size > 0 or newsletter or follow or social` condition) → Mitigation: include the block in that outer condition so a footer containing only the logo block still renders; verify in the integration task.

## Migration Plan

1. Add the `logo_follow` block type to the footer schema with its literal labels and settings.
2. Render the block as a full-width centered `.footer__logo-block` row inside `.footer__content-top` before the blocks wrapper; add `logo_follow` to the wrapper exclusion and the `content_blocks_size` skip, and to the outer content-top render condition.
3. Add the `.footer__logo-block*` styles to `assets/section-footer.css`.
4. Verify in the theme editor and a storefront preview: add the block, set an image and width, toggle the follow button; check mobile and desktop widths and confirm the rest of the footer is unchanged.
5. Rollback: revert `sections/footer.liquid` and `assets/section-footer.css`. No persisted data or settings migration.
