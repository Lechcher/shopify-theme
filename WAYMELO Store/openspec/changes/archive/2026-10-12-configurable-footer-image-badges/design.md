# Design

## Context

See `proposal.md - Why`. Relevant current state (observed):

- `sections/footer.liquid` renders the footer. Blocks authored by the merchant render in `.footer__blocks-wrapper` via `{%- for block in section.blocks -%}` with a `{%- case block.type -%}` switch (around lines 69-82). The footer schema declares block types `@app`, `link_list`, `brand_information`, `text`, and `image`.
- The DMCA badge occupies lines ~293-312 inside `<div class="footer__column footer__column--info">`, immediately after the conditional `.footer__payment` block. `.footer__column--info` is a centered flex column on mobile and right-aligned on desktop (≥750px).
- `assets/section-footer.css` already contains `.footer__images_badges { display: flex; justify-content: flex-start; align-items: center; gap: 0.5rem; }` (lines 295-300) alongside `.footer__dmca-badge` (lines 289-293). The `.footer__images_badges` rule matches the parent styling supplied in the request, so no new container rule is required.
- The theme already uses `image_url`/`image_tag` and `"type": "url"` block settings elsewhere, so those patterns are available.
- `locales/en.default.schema.json` holds `sections.footer.*` keys, including per-block `name`/`settings` labels resolved through `t:` references.

## Goals / Non-Goals

**Goals:**

- Replace the hardcoded DMCA badge with a merchant-configurable footer block holding exactly two badge slots.
- Keep the rendering location and flex layout of the former DMCA badge.
- Keep badge assets on the Shopify CDN (no third-party origin).

**Non-Goals:**

- Arbitrary/forced number of badges beyond the two slots in the single block type.
- Merchant control over alignment or ordering beyond the existing flex defaults.
- Reordering the two badges at runtime (only two slots; order is fixed by slot).
- Migrating existing DMCA settings (the DMCA badge had no settings to migrate).

## Decisions

**1. One block type (`image_badges`) with two badge slots, not two repeatable blocks.**

The request is for "a new block with settings for 2 image badge", and the layout is a fixed 2-up flex row. A single block type with two groups of settings models exactly two badges with no ambiguity, and no empty third slot can appear. Alternatives considered: a repeatable one-badge block (more flexible but allows 3+ and requires the merchant to add two blocks) and section-level settings (not a Shopify block, not reorderable, and does not match "block").

**2. Render the block in `.footer__column--info`, not in `.footer__blocks-wrapper`.**

The request fixes the location "where you remove dmca badge". The block is therefore rendered by a dedicated loop in `.footer__column--info`, and `image_badges` must be excluded from the existing `.footer__blocks-wrapper` loop so it does not also render as a grid item there (and so it does not skew the wrapper's grid-column count). A single `footer__images_badges` container is emitted when at least one `image_badges` block exists; if a merchant somehow adds more than one, all their slots render into that same container, preserving the "single parent container" contract.

**3. Settings types: `image_picker` for the image, `url` for the link, `range` for width and height.**

`image_picker` yields a Shopify image object served from the CDN, which also carries its own `alt` text. `url` gives the theme editor's URL picker for links. Width and height are `range` sliders (px), the standard Shopify mechanism for numeric, bounded sizing; defaults are provided so the block is usable immediately. Shopify caps a range setting at 101 steps, so the sliders use min 10 / max 300 / step 5 (59 steps). Height is set as an attribute rather than a crop, so a merchant who wants an exact aspect can set both; the image is not cropped.

**4. Alt text comes from the image's own `alt`, falling back to the shop name.**

The request does not ask for a separate alt-text setting. `image.alt | default: shop.name` guarantees a non-empty accessible name for both the image and its wrapping anchor without adding settings the merchant did not request. This satisfies the spec's accessible-name requirement.

**5. A badge slot renders only when its image is set; the link is optional.**

Conditional rendering on `badge_image != blank` avoids empty placeholders and matches the spec. When a link is set, the image is wrapped in an anchor; when not, the image renders bare. `loading: "lazy"` keeps the badge out of the critical path.

**6. Badge sizing via `image_url` + `image_tag` attributes, tuned by a scoped CSS rule.**

`{{ badge_image | image_url: width: badge_width | image_tag: width: badge_width, height: badge_height, ... }}` sets intrinsic dimensions to prevent layout shift while the CDN serves an appropriately sized asset. A small `.footer__images_badges img { display: block; }` rule (and any needed max-width guard) is added only if the flex row needs it; the existing container rule is reused.

**8. Badges stack in a centered, bottom-aligned column with a merchant-set gap.**

`.footer__images_badges` uses `flex-direction: column; justify-content: flex-end; align-items: center;`, and the block exposes a `range` setting `badges_gap` (0–100px, step 2, default 8) applied as an inline `gap` on the container. Alternatives considered: keeping a fixed `gap` in CSS (rejected — the store owner asked to tune the spacing between the two badges) and keeping the original horizontal row (replaced by this request). The step of 2 keeps the range within Shopify's 101-step limit.

**7. Use literal English labels for the new block instead of `t:` keys.**

`locales/*.schema.json` are auto-generated by Shopify and can be regenerated by the admin language editor, which caused upload failures (`...badges_gap.label` not found) when the locale file was not updated in lockstep with the section. The block's `name`, header `content`, and setting `label` values are therefore literal strings, matching the adjacent `image` block (which also uses literals). Trade-off: these labels are not localizable through the locale files; revisit if translated labels are needed.

## Risks / Trade-offs

- Removing the DMCA badge is a visible loss of the protection seal → Intentional per the request; rollback restores it (see Migration Plan). Documented as **BREAKING** in the proposal.
- Blocks normally render in `.footer__blocks-wrapper`; rendering one type in the info column instead is unusual → Mitigation: exclude `image_badges` from the wrapper loop and account for it in the grid-column calculation so layout is unaffected.
- Merchant-set fixed width and height can distort a badge whose true aspect ratio differs → Mitigation: both are merchant-controlled; defaults preserve the source aspect ratio, and height can be left at the source default.
- Two `image_badges` blocks would add slots beyond two → Mitigation: slots render into one container; a theme editor hint can state the block is intended for two badges. The spec does not forbid additional slots.
- `image_url` accepts only `width`, so height is applied as an attribute → Accepted; an attribute is sufficient for the requested size control. CSS `height: auto` was rejected because the merchant explicitly wants to set height.
- Long labels in other locales could overflow the slider/label UI → Low; standard theme-editor behavior, labels kept short.
- Existing footer configurations have no `image_badges` block → Mitigation: with no block, the info column renders exactly as today minus the DMCA badge; no configuration migration needed.

## Migration Plan

1. Remove the DMCA badge markup, comment, `dmca_protection_id` assignment, and helper `<script>` from `sections/footer.liquid`.
2. Add the `image_badges` block type to the footer schema and render it in `.footer__column--info`; exclude it from `.footer__blocks-wrapper`.
3. Add locale labels; add any scoped `.footer__images_badges img` CSS and remove the now-unused `.footer__dmca-badge` rule.
4. Verify in the theme editor and on a storefront preview at mobile and desktop widths: add the block, set images/links/sizes, confirm both badges render and the rest of the footer is unchanged.
5. Rollback: revert `sections/footer.liquid`, `assets/section-footer.css`, and the locale changes (git revert). There is no persisted data or setting migration.
