# Design

## Context

See `proposal.md - Why`. Relevant current state (observed):

- `sections/footer.liquid` already includes a custom `image_badges` block. It is rendered by a dedicated loop inside `<div class="footer__column footer__column--info">` and excluded from the standard `.footer__blocks-wrapper` loop via `{%- unless block.type == 'image_badges' -%}`. A computed `content_blocks_size` (which counts non-`image_badges` blocks) drives the wrapper's grid-column classes and its render condition.
- The footer schema declares block types `@app`, `link_list`, `brand_information`, `text`, `image`, and `image_badges`. The `image` and `image_badges` blocks use literal English labels; older blocks use `t:` keys.
- No CSS exists for any of the supplied class names (`.footer-trust-logos-simple`, `.simple-trustpilot-line`, `.trustpilot-icon-star`, `.trustpilot-title-text`, `.trustpilot-stars-mini`, `.trustpilot-review-count`, `.footer-dmca-badge`, `.dmca-tag-left`, `.dmca-tag-right`). New rules are required in `assets/section-footer.css`.
- The supplied markup uses an inline SVG star with `fill="#00b67a"` and a darker variant `#005128`.

## Goals / Non-Goals

**Goals:**

- Add a single, merchant-configurable footer block that renders the Trustpilot line and DMCA protected tag.
- Match the supplied markup and class names so the block is easy to style and recognize.
- Render it in the same info column as the image badges, after them.
- Keep it inert when unused and independent of the image badges.

**Non-Goals:**

- Fetching live Trustpilot ratings/counts (values are merchant text).
- Supporting vendors other than Trustpilot and DMCA.
- Localizing the new labels (literal labels, consistent with `image_badges`).
- Automatic ordering controls beyond the fixed Trustpilot-then-DMCA sequence.

## Decisions

**1. One block type (`trust_logos`) holding both signals, not two separate blocks.**

The supplied markup is a single `.footer-trust-logos-simple` container with two children, and the request is "this badge block". One block with an enable toggle per signal matches the markup and keeps the trust area cohesive; a merchant can still hide either signal.

**2. Content is merchant-configurable, defaulting to the supplied values.**

Per-signal settings: Trustpilot (`trustpilot_enable`, `trustpilot_url`, `trustpilot_label`, `trustpilot_rating`, `trustpilot_count`) and DMCA (`dmca_enable`, `dmca_url`, `dmca_left`, `dmca_right`). `url` settings use Shopify's URL picker; text settings use `text`. Defaults reproduce the supplied markup so the block looks correct when dropped in unchanged. Alternatives: hardcoded markup (rejected — the merchant asked to configure links/text) and one block per signal (rejected — breaks the single-container markup).

**3. Reuse the supplied class names and mirror the markup structure.**

The block renders the exact container/anchor/span structure supplied, so the provided selectors apply. The star SVG is emitted inline (decorative, `aria-hidden="true"`), with a visible primary star and a small accent path as in the source.

**4. Render in `.footer__column--info` after the image badges; exclude from the blocks wrapper.**

Following the `image_badges` precedent, the block gets its own loop in the info column and is added to the wrapper exclusion so it neither renders as a grid item nor skews `content_blocks_size`. The `unless` guard becomes `unless block.type == 'image_badges' or block.type == 'trust_logos'`, and the `content_blocks_size` accumulator skips both types.

**5. Accessible, safe links.**

Both anchors set `target="_blank"` and `rel="noopener"`, and expose an accessible name (`aria-label` from the configured label/tag or a sensible default). The star SVG is `aria-hidden` so the accessible name is not polluted.

**6. Literal English labels, no `t:` keys and no locale-file edits.**

Consistent with the `image_badges` block and the earlier lesson that lockstep edits to the auto-generated `locales/*.schema.json` caused upload failures. The block `name`, headers, and setting labels are literal strings.

**7. Add the styles to `assets/section-footer.css`.**

Because no rules exist, a compact block of styles for the nine classes is added near the existing `.footer__images_badges` rules. These define the row/column arrangement of the container, the inline layout of the Trustpilot line and its colored star, and the split "DMCA | PROTECTED" tag. Values are chosen to look correct with the defaults and degrade to the surrounding footer typography.

## Risks / Trade-offs

- Fixed 5-star text and a static review count can go stale → Mitigation: both are editable text settings; live data is explicitly out of scope.
- New CSS could clash with theme utility classes → Mitigation: all selectors are prefixed and scoped to the footer trust area; no global element selectors.
- The block renders in the info column rather than the standard blocks area → Mitigation: same deliberate pattern as `image_badges`; the info column is centered/right-aligned by existing rules.
- Inline SVG increases markup size slightly → Negligible; no external icon dependency.
- Two custom blocks excluded from the wrapper could confuse the grid count → Mitigation: `content_blocks_size` skips both types so the wrapper's column math is unchanged.

## Migration Plan

1. Add the `trust_logos` block type to the footer schema with its settings and literal labels.
2. Render the block in `.footer__column--info` after the image badges; add it to the wrapper exclusion and the `content_blocks_size` skip.
3. Add the class styles to `assets/section-footer.css`.
4. Verify in the theme editor and on a storefront preview: add the block, toggle each signal, change links/text; confirm rendering at mobile and desktop widths and that the rest of the footer is unchanged.
5. Rollback: revert `sections/footer.liquid` and `assets/section-footer.css`. No persisted data or settings migration.
