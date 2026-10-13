# Design

## Context

See proposal.md - Why.

Four locations render accepted payment icons by looping `shop.enabled_payment_types` and emitting one icon per entry:

- `sections/footer.liquid` - `<ul class="list list-payment">` with `<li class="list-payment__item">` items.
- `sections/blocky-main-product.liquid` - `payment_badges` block, `<div class="list-payment">` with `<div class="list-payment__item">` items, plus inline size/alignment style.
- `sections/main-product.liquid` - `payment_badges` block, `<div class="list-payment">` with `<div class="list-payment__item">` items.
- `blocks/ai_gen_block_bcb0398.liquid` - `<div class="ai-payment-panel-...__methods">` with `<span class="...__tile" aria-label="...">` items and no SVG class.

The duplicate Amazon icon occurs because the store reports more than one Amazon-branded payment type (e.g. `amazon_pay` plus the legacy Amazon Payments entry), and each entry maps to a visually identical SVG. Liquid has no dictionary literal, but an alias map can be expressed with `case`/`when`, and de-duplication with a delimiter-guarded `unless ... contains`.

## Goals / Non-Goals

**Goals:**
- Render at most one icon per distinct brand everywhere payment icons appear.
- Keep the alias map in one place so future brand aliases are added once.
- Preserve each location's existing wrapper markup, classes, order, and settings.

**Non-Goals:**
- Changing section/block schemas or settings.
- Adding, reordering, or redesigning icons, or changing icon styling.
- Filtering by a hand-authored allow/deny list of brands; only equivalent/alias entries are collapsed.

## Decisions

**Decision 1: Extract rendering into a shared snippet `snippets/payment-icon-list.liquid`.**
The snippet receives the payment types and the per-location item markup parameters (`item_tag`, `item_class`, `svg_class`, and an optional `aria_label_from_type`), performs alias normalization and de-duplication, and emits only the item elements. Each call site keeps its own wrapper and settings. Alternative considered: duplicate a ~12-line normalization loop inline in all four files. Rejected because it invites divergence and four copies to update per alias; the project already centralizes reusable product markup in `snippets/blocky-lys-*.liquid`, so a snippet matches existing conventions.

**Decision 2: Normalize via an alias `case` map, default brand = original type.**
Each type is stripped and mapped to a canonical brand; known aliases (at minimum `amazon_payments` and `amazon` → `amazon_pay`) collapse together, and every other type maps to itself. Icons are rendered from the canonical brand so a legacy alias that `payment_type_svg_tag` may not recognize still resolves to a supported key. Alternative considered: hardcode `unless type == 'amazon_payments'`. Rejected as it only fixes Amazon and silently breaks if the store's duplicate key differs.

**Decision 3: De-duplicate with a comma-delimited "seen brands" accumulator.**
A running string tracks canonical brands as `,brand,` and each candidate is tested with `unless seen contains ',brand,'`. Delimiters avoid substring false positives (e.g. `visa` matching `visa_electron`). First occurrence wins, preserving the store's enabled order. Alternative considered: Liquid's `uniq` filter. Rejected because it compares raw values and cannot collapse aliases.

## Risks / Trade-offs

- **Unknown alias pair** → The store's two Amazon keys may not be exactly `amazon_payments`/`amazon`. Mitigation: the normalization defaults unknown types to themselves, so no unique brand is lost; verify the actual keys against the storefront and extend the alias map if needed during apply.
- **Snippet output escaping/whitespace changes** → Moving icon markup into a snippet could alter whitespace or attributes. Mitigation: keep the snippet output structurally identical to each current call site and verify rendered markup after the change.
- **`payment_type_svg_tag` with a canonical key** → Rendering a canonical brand instead of the raw alias relies on the canonical key being renderable. Mitigation: canonical values are chosen to be keys the tag already supports (`amazon_pay`).
