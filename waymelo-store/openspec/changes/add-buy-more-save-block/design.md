# Design

## Context

See `proposal.md` — Why. The `blocky-main-product` section renders each block through a large `{% case block.type %}` switch in the content column (`sections/blocky-main-product.liquid`, switch starts around line 407), declares block types in the `{% schema %}` `blocks` array, and lists a default set in `presets`. Two precedents matter here:

- The `complementary` block already builds an add-on product list **entirely in JavaScript** by fetching `/recommendations/products.json?product_id=...&limit=...&intent=complementary` with a `related` fallback and rendering cards into a `data-blocky-complementary-mount` mount (its `initComplementary()` lives in the section's `blocky-featured-product` custom element, ~line 1937).
- The `bundle_deals` / `bundle_stack` blocks are **server-rendered** selection rows whose state is driven by a small scoped custom element (`blocky-bundle-deals`, `blocky-bundle-stack`, ~line 2619) that reaches into the section's product form to mutate quantity.

The section's cart flow is `handleAddToCart(event)` → `openCartDrawer(formData, sourceId)` → `addToCart(formData)`, which POSTs `FormData` to `/cart/add.js` and renders the cart drawer from the returned `sections`. `formatMoney(cents)` uses `this.moneyFormat` (from `{{ shop.money_format | json }}`).

Styles live in `snippets/blocky-main-product-css.liquid`, injected by `{% render 'blocky-main-product-css', section: section %}` and scoped with `#blocky-featured-product-{{ section.id }}`. Behavior lives in scoped custom elements inside the section's inline `<script>`, guarded by `customElements.get(...)`.

Constraints the design must respect: the section file is already ~3,825 lines; add-on prices need `compare_at_price`/`price` per variant; and the preview popup needs variant/description data that the section's existing `[data-blocky-product-json]` script tag does not carry (it only holds the current product).

## Goals / Non-Goals

**Goals:**
- One self-contained `buy_more_save` block whose content is data-driven from Shopify recommendations, not hand-picked by the merchant.
- A single cart action that adds the current product plus every checked add-on in one response, so the cart drawer stays consistent.
- Full-detail preview popup without loading the theme's global modal stack, which carries its own styles.
- Server-rendered rows so the list is visible before JS runs and no-JS users still see content.

**Non-Goals:**
- No changes to the `complementary`, `bundle_deals`, `bundle_stack`, or any other existing block.
- No new external asset dependency, and no changes to `assets/product-form.js`, `assets/cart-drawer.js`, or the layout.
- No discount codes or automatic-discount integration — the percentage only changes the *displayed* price; the merchant keeps managing any real discount in Shopify.
- No merchant-picked product list, no per-product pricing overrides, no quantity per add-on, no bundle pricing rules.
- No changes to the existing `[data-blocky-product-json]` contract.

## Decisions

### Decision: Render rows server-side; fetch recommendations with a Storefront-JS fetch into a server-rendered shell

The block renders its heading, the `Claim Offer` button, and an empty (or skeleton) list container in Liquid, then a `blocky-buy-more-save` custom element fetches the recommendations and builds each row, reusing the exact `fetch('/recommendations/products.json?product_id=...&limit=5&intent=complementary')` → `related` fallback pattern from `initComplementary()`.

- **Why:** The recommendations endpoint is only available as JSON; there is no Liquid drop to call it. Rendering the shell server-side satisfies the no-JS requirement and the section's rendering conventions, while the row-building JS can reuse code the section already contains.
- **Alternatives:** `{% form 'cart' %}`-level `product recommendations` tag (rejected: not available in that context); merchant-picked `product_list` (rejected: the user chose automatic recommendations); duplicating the whole complementary card renderer (rejected: different markup — rows with checkboxes, variant selects, and prices, not cards).

### Decision: `limit: 5` in the schema block entry, plus a `max_products` setting

The schema block entry declares `"limit": 5` so a merchant can add at most five blocks, and the block exposes a `max_products` setting (min 1, max 5, default 5) that caps how many recommendation rows render. The JS slices the fetched list to `Math.min(max_products, 5)`.

- **Why:** "Limit the product random show is 5" reads as a display cap; making it a block setting lets a merchant show 3 without another schema change, while the schema cap enforces the hard limit in the editor.
- **Alternatives:** Hardcoding 5 in Liquid (rejected: not adjustable); a schema `range` max above 5 (rejected: violates the stated cap).

> Note: Shopify's recommendations response is not random-shuffled by the theme; "random" in the request is satisfied by the recommendations service returning a rotating/limited set. Where a merchant wants true shuffling, the block can shuffle before slicing — see Open Questions.

### Decision: Prices computed in Liquid from `compare_at_price`, with the JS fetch carrying variant data

Each row's prices are computed from the variant's `compare_at_price` when present, else `price`:
`discounted = base * (100 - save_percent) / 100`, rounded to the nearest cent (same rounding Shopify uses for display) and emitted as cents/money.

- **Why:** Computing on the server from the saved percentage avoids shipping a price engine to the client and guarantees the same rounding the theme already uses; the setting is a single source of truth.
- **Alternatives:** Compute in JS from the JSON (rejected: the JSON already carries only final prices, so the compare-at discount would be double-applied); use `compare_at_price * (100 - save)` always (rejected: breaks the "no compare-at price" case, which is common on promotional storefronts).

### Decision: Custom element owns a single product-form submit with an `items[]` payload

The block custom element intercepts the `Claim Offer` click, gathers the current variant id + quantity from the section's product form (`root.querySelector('[data-blocky-form-quantity]')` / quantity input, or the section's `getSelectedVariant()` state) plus each checked add-on's selected variant id, then POSTs to `/cart/add.js` with an `items` array body (`items[0][id]`, `items[0][quantity]`, …). On success it dispatches the same cart-render path as `openCartDrawer` (either `cart.renderContents(data)` or the `cart:update` event) so the drawer and notification behave identically to a normal add.

- **Why:** Multi-item adds in one network request means one re-render, no race conditions between separate `/cart/add` calls, and an accurate "N items added" toast. It also reuses the drawer machinery rather than inventing a new one.
- **Alternatives:** Chaining separate `/cart/add` calls per item (rejected: N requests, N drawer renders, partial-failure states); using `/cart/change.js` after a single add (rejected: the same request count problem). The section's `handleAddToCart` is left untouched — the block handles its own button and falls back to `routes.cart_add_url` + `routes.cart_url` when no drawer element exists.

### Decision: Preview popup as a self-contained scoped overlay

Each row's preview control opens a modal rendered by the same custom element, containing the product's gallery (from the variant's `featured_media` plus the product's other media, or just the featured image when only one exists), title, prices, a variant picker, description, and an add-to-cart button that POSTs that single variant to `/cart/add.js` and runs the same cart-render path.

- **Why:** The theme's global `product-modal.js`/`quick-add` components are built around the main product form with its own `product-info` element and require a dedicated section context that does not exist inside this block. A self-contained overlay avoids coupling, keeps the markup scoped to `#blocky-featured-product-{{ section.id }} .blocky-bms ...`, and reuses the section's money formatting and cart rendering.
- **Alternatives:** Reuse `assets/quick-add.js` (rejected: it expects a full `product-info` context and section-scoped `product-id` inputs tied to the main product); use the theme's `details-modal.js` (rejected: tied to header/announcement markup); an inline expanding gallery instead of a modal (rejected by the requirement for a "large preview popup").
- **Accessibility detail:** overlay click + `Escape` + a close button dismiss; `aria-modal="true"`, a labelled dialog element, focus moves into the dialog on open and returns to the invoking control on close, matching the existing `blocky-popup-modal` pattern in this section (~line 1666).

### Decision: Per-row data carried in Liquid-rendered `data-*` attributes + one `<script type="application/json">` per block

The block wrapper carries `data-save-percent`, `data-max-products`, and a JSON payload of the *current* block configuration; each row is rendered with `data-variant-id`, `data-variant-price`, `data-variant-compare-at`, and `data-product-id` so the JS never has to re-derive what Liquid already knows. Preview contents are built from that per-row dataset plus the variant's `title`/`available` fields.

- **Why:** Keeps Liquid as the single source of rendered strings (money formatting, escaping, variant ordering) and the JS as the behavior layer, consistent with `blocky-bundle-stack`'s `data-bs-quantity` pattern. Avoids a second JSON blob like `[data-blocky-product-json]` that would need to stay in sync.
- **Alternatives:** A second JSON script block per add-on product (rejected: more markup, sync risk, and it duplicates what the row already renders).

### Decision: Styling in `blocky-main-product-css.liquid`

All new rules are scoped `#blocky-featured-product-{{ section.id }} .blocky-bms ...`, driven by block settings via CSS custom properties (the established pattern for `--bd-*` / `--bs-*` variables).

- **Why:** Single style source for the section and no new asset file.
- **Alternatives:** A new CSS asset (rejected: breaks the section's convention and adds a load to every page with this section).

## Risks / Trade-offs

- **Recommendations require Search & Discovery / a recommendations response** → If the endpoint returns 404 or an empty list, both intents fail and the block hides itself (`hidden` on the wrapper, mirroring `initComplementary`'s `block.hidden = true`); the heading and claim button are not rendered, so no dead UI remains.
- **Perf: a client fetch adds a request to the critical render path of the product page** → Limit to 5, no images loaded until rows render (rows carry `loading="lazy"`), and the fetch starts after DOM-ready via the custom element's `connectedCallback`.
- **Duplicate element IDs if several `buy_more_save` blocks are added** → Namespace every id and `for`/`aria-*` reference with `block.id`, and set `"limit": 5` in the schema entry like other blocks (`price`, `title`, `variant_picker` all use `limit: 1`).
- **Checkboxes inside a product form may submit unintended inputs** → The block's rows live outside the product `<form>` element; the claim action builds its own `items` payload rather than relying on form inputs, so nothing leaks into the main form's submit.
- **Cart drawer / notification element differences across layouts** → The claim action mirrors `openCartDrawer`'s exact fallback chain (`cart-notification` → `cart-drawer` → `cart-drawer-component` → navigate to `routes.cart_url`), so behavior matches a normal add regardless of layout.
- **Popover stacking context** → Product columns can create `overflow`/stacking contexts; the popup gets a high `z-index` and its own overlay, and the block's CSS is tested against adjacent blocks.
- **`formatMoney` depends on `window.Shopify.formatMoney`** → Reuse the section's own `formatMoney`/`moneyFormat` on the root element rather than re-implementing, so currency symbol placement matches the rest of the theme.
- **Price rounding for odd percentages** → Round half-up to whole cents in Liquid; document the rule in the schema's `info` text for the save-percentage setting so merchants understand e.g. 33% on 100.00 → 67.00.

## Migration Plan

Additive only: no existing block or setting changes. Implement by editing the section (case + schema + presets + custom element), the CSS snippet, and no other files. Rollback is removing the block from the section or reverting those two files; no data migration.

## Open Questions

- **Shuffling:** Does "random show" require the block to shuffle the recommendation response and take 5, or is the recommendations service's own rotation enough? (Affects only the row-ordering implementation, not specs or tasks; default is no shuffle.)
- **Subtitle/heading placement above vs. below the price block** — cosmetic, resolved during implementation from the reference markup.
