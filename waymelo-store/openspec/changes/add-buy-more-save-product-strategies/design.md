# Design

## Context

See `proposal.md` — Why. The `buy_more_save` block in `sections/blocky-main-product.liquid` renders a `<blocky-buy-more-save>` shell (case branch ~line 1658) whose settings live in the schema entry (~line 3743), and whose behavior is a scoped custom element in the section's inline script (~line 2838). The element currently does one thing in `fetchRecommendations()` (~line 2961): fetch `/recommendations/products.json?product_id=<current>&limit=5&intent=complementary`, fall back to `intent=related`, then `renderList(products)`.

`renderList` / `buildRow` / the preview builder consume a product object with this shape (prices in **cents**):

- `id`, `title`, `url`, `description_html` (or `description`)
- `featured_image` and `images[]` (each a URL string or an object with `src`)
- `variants[]` with `id`, `public_title` (or `title`), `price` (cents), `compare_at_price` (cents), `available`

The recommendations payload already matches this shape. Shopify's **storefront products JSON** (`/collections/all/products.json`) does **not**: it has `handle` (no `url`), `body_html` (no `description`), `image`/`images[].src`, and `variants[].price` / `compare_at_price` as **decimal strings** ("19.99"), with no `public_title`.

The Section's schema already uses `visible_if` on settings (e.g. the `countdown_deals` block), so a conditional price field fits existing conventions.

> Note: the current working copy of `sections/blocky-main-product.liquid` is missing the block (it is present in `HEAD`/the last backup). See `tasks.md` → Workflow follow-up; the block must be present before implementation.

## Goals / Non-Goals

**Goals:**
- Let a merchant switch the add-on source among recommendations, random store products, and random store products under a price ceiling.
- Reuse the existing row, pricing, selection, preview, and claim code paths unchanged.
- Default to recommendations so nothing changes for existing blocks.

**Non-Goals:**
- No server-side rendering of the random list, no new snippet/file, no new app or external service.
- No merchant-picked product list, no per-product overrides, no category/collection filter beyond "the store's products".
- No change to how prices are discounted, selected, previewed, or added to the cart.

## Decisions

### Decision: One `product_source` select setting, plus a conditional `max_price`

Add to the block schema: `product_source` (`select`, options `recommendations` / `random_all` / `random_price`, default `recommendations`) and `max_price` (`range` or `number`, default `30`, `visible_if: {{ block.settings.product_source == 'random_price' }}`). Carry the resolved values on the wrapper as `data-product-source` and `data-max-price`.

- **Why:** A single block keeps all the existing row/preview/claim code and styling; the user confirmed one setting over three block types. `visible_if` is already used in this section.
- **Alternatives:** Three block types (rejected: duplicates the shell, schema, and styling, and splits behavior); a collection picker (rejected: the request is "the store", not a chosen collection).

### Decision: Fetch store products from the storefront products JSON, with a fallback endpoint

For the random sources, fetch `/collections/all/products.json?limit=250` (same-origin storefront request, consistent with the existing recommendations fetch), and fall back to `/products.json?limit=250` if the first returns no products. Take the first page only.

- **Why:** There is no Liquid drop that returns "all store products" reliably, and the recommendations endpoint cannot produce random products. The products JSON endpoint is the standard client-fetchable source and is same-origin, so no CORS concerns. `limit=250` is the endpoint's maximum page size.
- **Alternatives:** Server-rendering `collections.all.products` into JSON (rejected: `all` is capped and paginated, adds markup to every page, and does not scale); requiring the merchant to pick a collection (rejected: out of scope); `Search & Discovery` "related" (rejected: not random).

### Decision: Normalize the store-products payload into the existing row shape

Add a normalizer that maps each store product to the internal shape: `url` = `/products/<handle>`, `description_html`/`description` = `body_html`, `featured_image` = `image?.src`, `images` = `images.map(i => i.src)`, and each variant's `price`/`compare_at_price` from decimal strings to rounded integer cents, keeping `id`, `available`, and `title`. `renderList`/`buildRow`/preview are then reused unchanged.

- **Why:** The block's renderers already handle one shape; normalizing at the fetch boundary avoids touching any rendering, pricing, or preview code — the change stays small and low-risk.
- **Alternatives:** Teach `buildRow` to handle two shapes (rejected: branches spread through the renderer and preview); a Liquid shim converting prices per product (rejected: not applicable to client-fetched data).

### Decision: Price filter is inclusive and matches any available variant

For `random_price`, include a product when at least one **available** variant's price (cents) `<=` `round(max_price * 100)`. For the row/preview, the existing `firstAvailableVariant()` picks the shown variant.

- **Why:** Matches the user's rule ("<= $30", "any available variant"). Using the existing first-available-variant selection keeps price display consistent with the other sources.
- **Alternatives:** Filter on the lowest variant price (rejected by the user's choice); filter on compare-at price (rejected: the filter is about the product's price, not the discount base).

### Decision: Shuffle per load; exclude current product and unavailable products

After fetching and filtering, remove the current product (by `id`, and `handle` when present), remove products with no available variant (for `random_all`) or none `<=` the ceiling (for `random_price`), Fisher–Yates shuffle, and slice to `Math.min(maxProducts, 5)`.

- **Why:** Gives "random each load" semantics and never shows the product the shopper is already viewing or a product that cannot be added.
- **Alternatives:** Stable random per session (rejected by the user's choice); no exclusion (rejected: the current product appearing as its own add-on is confusing).

### Decision: Branch the source in the element; hide on failure or empty results

`fetchRecommendations()` becomes a dispatcher: for `recommendations` run today's flow; for the random sources run fetch → normalize → filter → shuffle → `renderList`. Any failure or empty result hides the element, mirroring the current behavior.

- **Why:** Keeps the existing lifecycle (shell hidden until JS runs, hidden when there is nothing to show) and the no-recommendations behavior.
- **Alternatives:** Leave the element visible with a message (rejected: inconsistent with the block's current empty behavior).

## Risks / Trade-offs

- **Store-products endpoint availability** → Prefer `/collections/all/products.json`; fall back to `/products.json`; hide the block when both fail. The recommendations source is unaffected.
- **Only the first 250 products are candidates** → Accept for "random store products"; note it in the setting's `info` text so merchants with large catalogs understand the pool. A future change could paginate or add a collection filter.
- **Price string parsing** → Convert with `Math.round(parseFloat(value) * 100)` and guard non-numeric/empty values; `compare_at_price` may be `null`.
- **Extra request weight for random sources** → Only the selected source runs; rows keep `loading="lazy"`; the payload replaces (not adds to) the recommendations request.
- **Theme-editor preview** → Random sources work in the editor too; if the store is small the same few products may appear, which is expected.

## Migration Plan

Additive and default-preserving: a block left on `recommendations` renders exactly as before. Rollback is reverting the section edits; no data migration. The random sources depend on the storefront products endpoint, which requires published products in the Online Store channel.
