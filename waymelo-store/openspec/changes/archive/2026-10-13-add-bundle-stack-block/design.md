# Design

## Context

See `proposal.md` — Why. The BKY - Main Product section (`sections/blocky-main-product.liquid`) renders each block type in a `<case>` loop. Two sibling blocks already follow an established pattern:

- `bundle_deals` renders `<blocky-bundle-deals>` holding up to three `<button class="blocky-bd-card" data-bd-quantity>` children. Its custom element (defined in the same file, guarded by `customElements.get`) listens for clicks, toggles `.is-selected`, reads `data-bd-quantity`, and writes the value into the section's quantity plumbing: `root.querySelector('[data-blocky-quantity-input]')` (dispatching an `input` event) or `root.querySelector('[data-blocky-form-quantity]')` as fallback.
- `bundle_packages` reuses that same interaction via `blocky-bundle-packages`.

Block styles live in `snippets/blocky-main-product-css.liquid`, scoped under `#blocky-featured-product-{{ section.id }}`, with per-block colors/sizes passed as inline CSS custom properties on the custom element. Schema settings are literal English labels (no `locales/*.schema.json` lockstep).

## Goals / Non-Goals

**Goals:**

- Add a vertical stacked bundle selector matching the reference design, with up to three selectable rows.
- Reuse the existing quantity-driven selection interaction and progressive-enhancement posture verbatim.
- Expose merchant settings for all visible text and colors.

**Non-Goals:**

- Reworking, sharing markup with, or restyling `bundle_deals`/`bundle_packages`.
- Any discount/pricing math in the cart or checkout; badge, tag, and sale text are merchant-entered literals.
- Product images in rows (the reference design is text-only).

## Decisions

### New `blocky-bundle-stack` custom element rather than extending `bundle_deals`

Selection logic is copied from `blocky-bundle-deals`: on `connectedCallback`, attach a delegated click listener that finds the closest `.blocky-bs-row`, toggles `is-selected` across rows, and applies the row's `data-bs-quantity` through the shared plumbing; on load, apply the preselected row's quantity.

Rationale: the reference layout and content differ enough that rebuilding `bundle_deals` in place would change live templates (a BREAKING change). A separate element keeps each block independently editable. Alternative considered: parameterizing `bundle_deals` with a layout mode — rejected because it entangles two dissimilar designs and risks regressions in the live block.

### Rows are `<button>` elements with `aria-pressed`, not native radios

Each row is `<button type="button" class="blocky-bs-row" data-bs-quantity aria-pressed>`; the visible radio circle is a decorative `<span aria-hidden="true">`. This matches `blocky-bundle-packages` (keyboard-operable, selected state exposed via `aria-pressed`), and keeps server-rendered markup simple. Alternative considered: native `<input type="radio">` inside a form — rejected because the block is not a form control and the existing blocks already establish the button + `aria-pressed` convention. The wrapper carries `role="group"` with an `aria-label`.

### Merchant-entered literals for badge, tag, and sale text

`discount_badge_n`, `tag_n`, and `save_text_n` are plain text settings (e.g. `15% OFF`, `Free Shipping`, `Save $69.10`), rendered as-is. Prices (`price_n`, `compare_price_n`) are display-only text too, consistent with the sibling blocks. Rationale: bundle quantity pricing is not a single product price, and prices ship as formatted currency strings, so computing a percentage or savings figure server-side would be unreliable and locale-dependent. Alternative considered: numeric prices with computed discount — rejected for the reasons above.

### Styling via `--bs-*` custom properties, scoped CSS

The element sets inline `--bs-*` variables from block settings (selected/unselected background, border color/width, radius, title/badge/tag/sale/price/compare/ribbon colors and sizes). New `.blocky-bundle-stack` / `.blocky-bs-*` rules are added to `snippets/blocky-main-product-css.liquid` next to the existing bundle rules, all scoped to `#blocky-featured-product-{{ section.id }}`.

### Ribbon as an optional absolutely-positioned overlay

The corner ribbon (e.g. `Most Popular`, `Best Value`, `YOURS FREE`) is an optional `<span class="blocky-bs-ribbon">` positioned at the row's top edge and omitted entirely when blank; the tag pill is an inline element in the row body.

## Risks / Trade-offs

- [Long or emoji titles, badges, tags, and sale text can overflow narrow rows] → Row uses flex layout with `min-width: 0`, wrapping text, and mobile media-query reductions, mirroring the existing bundle rules.
- [Ribbon or badge may collide with content at small widths] → Ribbon is absolutely positioned and the mobile media query reduces its size/offset; the tag/badge are inline and wrap.
- [Duplicate custom-element registration if the block script runs twice] → Guard with `if (!customElements.get('blocky-bundle-stack'))`, as the sibling elements do.
- [Settings drift between the three bundle blocks] → Accepted; each block is independently editable by design. Shared plumbing is limited to the quantity application path.

## Migration Plan

None required. The block is inert until a merchant adds it to a product template. Rollback is removing the block from the template (or reverting the two code files); existing blocks and the product form are unaffected either way.

## Open Questions

None.
