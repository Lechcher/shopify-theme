# Design

## Context

See `proposal.md` — Why. The `buy_more_save` block already exists in `sections/blocky-main-product.liquid`: its `{% case block.type %}` branch renders a `<blocky-buy-more-save>` shell (~line 1658), the schema declares the block at ~line 3743, and the `blocky-buy-more-save` custom element lives in the section's inline script (~line 2838). Card styling is driven by CSS custom properties on the element's inline `style`, consumed by `snippets/blocky-main-product-css.liquid` under `#blocky-featured-product-{{ section.id }} .blocky-bms ...` (`.blocky-bms-row` at ~line 3095).

Two current-state facts shape this change:

- The row border width default is `1px` (schema `row_border_width` default `1`; inline `--bms-row-border-width` fallback `1`; CSS fallback `1px`). The radius is already `12px` in all three places.
- The recommendations fetch uses `const limit = Math.min(5, Math.max(this.maxProducts, 5));`, which always evaluates to `5`, and `renderList()` slices to `Math.min(this.maxProducts, 5)`. The displayed count is therefore already capped at five, but the limit expression is misleading and fragile.

## Goals / Non-Goals

**Goals:**
- Default add-on cards to a 3px border and 12px radius, merchant-editable as today.
- Make the five-product cap explicit and correct in the fetch and render path.
- No change to any other block, the buy buttons, or the product form.

**Non-Goals:**
- No client-side randomization/shuffle of the recommendations, and no change to which products the recommendations service returns.
- No new settings, schema options, files, or dependencies.
- No change to block markup, behavior, pricing, selection, preview, or cart flow.

## Decisions

### Decision: Change the border-width default to 3px in all three layers; leave radius at 12px

Update the schema `row_border_width` default (`1` → `3`), the inline `--bms-row-border-width` fallback (`1` → `3`), and the CSS `.blocky-bms-row` fallback (`1px` → `3px`). The radius already reads `12`/`12px` in all three, so it only needs verification.

- **Why:** The rendered value comes from the inline custom property, which is itself derived from the setting with a `default: 1`; changing only one layer leaves a mismatch for pages whose saved block predates the new default. Keeping radius untouched avoids churn.
- **Alternatives:** Hardcode 3px/12px in CSS only (rejected: the inline `--bms-row-border-width` overwrites the CSS fallback, so the card would still render 1px); remove the settings (rejected: the request implies editable design values and matches the block's existing pattern).

### Decision: Express the cap as an explicit five-product limit

Replace the always-five expression with an explicit clamp and keep the render slice: fetch with `limit=5`, and render `Math.min(this.maxProducts, 5)` rows (with `maxProducts` already clamped to 1–5 on read).

- **Why:** `Math.min(5, Math.max(x, 5))` is always `5` and hides the intent; an explicit limit plus the render slice makes "at most five, default five" readable and safe if the schema range ever changes.
- **Alternatives:** Leave the expression as-is (rejected: the request asks for the cap to be explicit and it is currently a latent bug if the clamp is misread); drop the `max_products` setting and always render five (rejected: the setting lets a merchant show fewer without a schema change and already respects "at most five").

### Decision: Treat "product random show" as the recommendations-driven list, not a shuffle

The block continues to show the products Shopify's recommendations service returns (complementary, then related fallback), in the order returned, capped at five.

- **Why:** The recommendations service already rotates/selects which products it returns; the companion `add-buy-more-save-block` design listed shuffling as an open question defaulting to no shuffle, and the existing spec requires response order. Adding a shuffle would contradict that spec and change observable ordering.
- **Alternatives:** Client-side shuffle before slicing (rejected: contradicts the existing "order matches the response" behavior and the spec's ordering scenario; can be a separate change if desired).

## Risks / Trade-offs

- **Saved blocks keep old inline values** → A block instance already saved with `row_border_width: 1` will still render 1px, because the setting value overrides the default. This is expected: the new default applies to new/preset blocks. No migration is needed; a merchant can set 3px in the editor.
- **Schema `range` max for `row_border_width` is 4** → 3px is within range, so the new default is valid; no schema `range` change required.
- **Changing the fetch expression could alter the request** → The expression already yields 5; the replacement must also yield 5 so no observed behavior changes. Verified by the cap scenarios in the spec.

## Migration Plan

Additive/default-only: edit the section schema defaults and the two fallbacks, and simplify the fetch limit expression. Rollback is reverting the section and CSS snippet edits; no data migration and no impact when the block is absent.
