# Design

## Context

See `proposal.md` — Why, and `specs/storefront-product-rating/spec.md` for the requirements.

Relevant current state:

- The product page (`templates/product.json`) renders `blocky-main-product` as the main section and a
  separate `reviews-section` lower on the page. `blocky-main-product.liquid` renders blocks through a
  `case block.type` loop and defines each block type in its `{% schema %}`; block styles live in
  `snippets/blocky-main-product-css.liquid`, scoped under `#blocky-featured-product-{{ section.id }}`.
- `reviews-section.liquid` computes its aggregate server-side from its own `section.blocks`:
  `total`, `avg`, `avg_display` (rounded to `rating_decimals`), and `avg_pct` (`avg * 20`, one decimal).
  Its root element already carries `data-rs-total="{{ total }}"`, and when `show_summary` is on, the
  average and percentage also appear in the summary markup (`.reviews-section__average-value` text and
  `--rs-rating-pct` on `.reviews-section__stars`).
- Liquid cannot read another section's blocks or settings, so the main product section cannot compute
  or receive these numbers at render time. `section.blocks` is scoped to the current section only.
- The reviews section root is `id="reviews-section-{{ section.id }}"`; no stable `trustshop-review`
  anchor exists yet.

## Goals / Non-Goals

**Goals:**

- Render the supplied `product-server-rating` link (stars + count) in the main product section,
  embeddable as a block in any order.
- Keep the teaser's numbers identical to the reviews section without duplicating the aggregation logic.
- Reach the reviews from the buy box via a stable anchor.
- Degrade honestly: never show a fabricated or stale rating.

**Non-Goals:**

- Reading reviews from product metafields, metaobjects, or a reviews app.
- Merchant-configurable rating/count text or colors (the supplied CSS colors are used as-is).
- Changing the reviews section's summary, distribution, gallery, filtering, or pagination.
- Server-side rendering of the teaser (the reviews aggregate is only known client-side after the
  reviews section renders on the page).

## Decisions

### Bridge reviews-section data through the DOM, read by a small script

`reviews-section.liquid` already exposes `data-rs-total`; add two more data attributes to its root —
`data-rs-avg` (the `avg_display` value) and `data-rs-avg-pct` (the `avg_pct` value) — so the teaser can
read the aggregate regardless of whether `show_summary` is enabled. A new `assets/product-server-rating.js`
locates the reviews root (`[data-rs]`), reads those attributes, and fills every `[data-product-server-rating]`
on the page: sets `--rating-percent` on the stars, the `(count)` text, and the `aria-label`.

Alternatives considered:

- **Duplicate the aggregation in the main product section** — impossible; the main product section
  cannot see the reviews section's blocks.
- **Product metafields / metaobjects** — requires a writer (app or manual metafield maintenance) and a
  bigger migration; rejected for this change.
- **Merchant-entered rating/count settings** — simple, but the numbers drift from the reviews section
  and violate the "reflects the summary" requirement.

### Teaser is hidden until it has a valid value

The block renders server-side with an empty/placeholder link marked `hidden`, and the script reveals it
only when a reviews root with `total > 0` is found and its average parses. This satisfies the
"no fabricated or stale values" requirement and avoids a flash of wrong numbers. Trade-off: with
JavaScript disabled the teaser stays hidden; that is acceptable because its data only exists at runtime.

### Anchor target is a dedicated element in the reviews section

The reviews root already owns an `id`, so add a separate empty anchor (for example
`<span id="trustshop-review" ...>`) at the top of the reviews section. The teaser's `href="#trustshop-review"`
then scrolls to the reviews. A single reviews section per page is assumed (matches the current template);
duplicate ids are not a concern here.

### Styling lives with the other block styles, scoped to the section

Move the supplied `.product-server-rating*` rules into `snippets/blocky-main-product-css.liquid`, scoped
under `#blocky-featured-product-{{ section.id }}` like the sibling blocks. The star fill stays a
`linear-gradient` clipped to the text, driven by `--rating-percent`.

### Script placement and idempotency

Ship `assets/product-server-rating.js` loaded with `defer` from `blocky-main-product.liquid` (only when
the block is present). Follow the reviews-section script's pattern: init on `DOMContentLoaded`, re-init on
`shopify:section:load` and `shopify:block:select`, and guard against double-binding so theme-editor
re-renders do not accumulate listeners.

## Risks / Trade-offs

- **[Teaser data depends on script order / section presence]** → The script queries the DOM on load and on
  editor events; if the reviews root is missing or `total` is 0 it leaves the teaser hidden.
- **[`show_summary` off hides the average]** → Solved by emitting `data-rs-avg` / `data-rs-avg-pct` on the
  reviews root independently of the summary block.
- **[Duplicate `trustshop-review` ids if a merchant adds two reviews sections]** → Assumed single section
  per page; the first matching anchor is targeted. Documented as a limitation.
- **[No-JS shoppers see no teaser]** → Accepted; the teaser is a progressive enhancement whose value is
  computed client-side.
- **[Rounding mismatch]** → The teaser must use the same `avg_display` and `avg_pct` values the reviews
  section already computes, so both surfaces round identically.

## Migration Plan

Front-end only; no data or schema migration. Deploy `sections/reviews-section.liquid`,
`sections/blocky-main-product.liquid`, `snippets/blocky-main-product-css.liquid`, and the new
`assets/product-server-rating.js`. The merchant then places the `product-server-rating` block in the
product section via the theme editor. Rollback is reverting those files; the reviews section and product
data are unaffected.

## Open Questions

- None that affect the approach. Whether to expose the teaser's star/count colors as block settings can be
  decided later without changing the specs or the structure of the work.
