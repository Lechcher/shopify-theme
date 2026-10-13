# Design

## Context

See `proposal.md` — Why. The `blocky-main-product` section renders each block through a large `{% case block.type %}` switch (`sections/blocky-main-product.liquid`, content column around line 407) and declares each block type in the `{% schema %}` `blocks` array with a matching `presets` entry. There are two precedents to build on:

- `delivery_deadline` and `shipping-checkpoints` blocks already compute relative dates from day-offset settings using `'now' | date: '%s' | plus: <seconds>` and configurable formats/labels.
- The theme already ships functioning country switching: `{% form 'localization' %}` in `sections/header.liquid`, `sections/announcement-bar.liquid`, and `sections/footer.liquid`, backed by `assets/localization-form.js` and `assets/component-localization-form.css`, both loaded globally in `layout/theme.liquid`. `snippets/country-localization.liquid` renders the country list.

Styles for the section live in `snippets/blocky-main-product-css.liquid`, injected by `{% render 'blocky-main-product-css', section: section %}` and scoped with `#blocky-featured-product-{{ section.id }}`. Section behavior uses scoped custom elements (e.g. `blocky-timer`, `blocky-countdown-timer`).

## Goals / Non-Goals

**Goals:**
- One self-contained block that renders both summary lines and owns its two popovers.
- Real country/currency switching by reusing the theme's existing localization form machinery rather than a parallel implementation.
- Dates and copy driven by block settings, consistent with existing blocks.

**Non-Goals:**
- No changes to existing `delivery_deadline` or `shipping-checkpoints` blocks.
- No per-product or per-variant shipping rules; estimates are block-level settings.
- No new external asset dependency.
- No cross-sell, tracking links, or real carrier rate lookups.

## Decisions

### Decision: New block type `delivery` in the existing section, markup in a snippet
Add a `delivery` case to the section's block switch and a `delivery` entry to the schema `blocks` array. Extract the block markup into `snippets/blocky-lys-delivery.liquid` (mirroring the existing `blocky-lys-shipping-checkpoints.liquid` precedent) and `{% render %}` it, keeping the already-huge section file from growing further.

- **Why:** Matches the established block pattern and keeps the section readable.
- **Alternatives:** Inline markup in the switch (rejected: section is already ~3,400 lines); separate section (rejected: breaks the merchant's expected "add a block in the product section" workflow).

### Decision: Reuse Shopify `{% form 'localization' %}` inside the modal
The modal contains a real `{% form 'localization' %}` with a hidden `country_code` input and a country `<select>`, submitting via the existing `localization-form.js`. Selecting a value and pressing `Save & Continue` submits the form; Shopify reloads the storefront in the chosen country/currency and persists it via the localization cookie.

- **Why:** This is the only way to actually change country/currency, it reuses assets already loaded globally, and it satisfies the "functional switching" requirement without new code.
- **Alternatives:** A custom fetch to `/localization` (rejected: duplicates `localization-form.js`); visual-only selector (rejected by the user's choice).
- **UI detail:** The `select` presents options as `Country (CURRENCY)` using `localization.available_countries` and `country.currency.iso_code`, matching the image.

### Decision: Native disclosure pattern for the two popovers
Render the popovers as markup controlled by a small scoped custom element (`blocky-delivery`) that toggles open/close on the summary-line buttons, manages `aria-expanded`, closes on outside click and `Escape`, and renders the modal as an overlay dialog. On mobile the modal fills most of the viewport; on desktop it is a centered rounded card. This mirrors the image styling and keeps the interaction dependency-free.

- **Why:** Consistent with the section's existing custom-element approach; avoids introducing a library or the theme's global modal/`<details>` markup which has its own styles.
- **Alternatives:** `<details>` disclosure (rejected: cannot show a modal overlay or close-on-outside-click cleanly); reusing `product-media-modal` (rejected: coupled to media gallery).

### Decision: Estimates computed server-side from day offsets
Compute the arrival range and the `Order Placed` / `Order Ships` / `Delivered` dates in Liquid from settings (earliest/latest offset, ship offset range, format and labels), following `delivery_deadline`. The date line shows a single date when offsets are equal.

- **Why:** Deterministic, no client JS needed for dates, consistent with existing blocks and SEO-friendly.
- **Alternatives:** Client-side date computation (rejected: flicker and no benefit).

### Decision: Settings surface
Expose: destination label; arrival label with `[DATE]`-style placeholder or range; earliest/latest offset; ship-start/ship-end offset; date format + day/month labels; method name and day-range text; three detail-note fields; policy link text and URL; text/heading colors; and an optional arrival-status line. Defaults mirror the image copy ("Deliver to:", "Order today, get it as early as:", "Standard Shipping", "7 - 10 business days", the cancellation and PO-box notes).

- **Why:** Keeps content merchant-editable without code, satisfying the configurable-content requirement.

### Decision: Styling in `blocky-main-product-css.liquid`
Add scoped rules under `#blocky-featured-product-{{ section.id }} .blocky-delivery ...` for the lines, disclosure carets, modal card, overlay, selector, buttons, popover, and timeline rows, using block settings via CSS custom properties (the section's established pattern).

- **Why:** Single style source for the section, no new asset file.

## Risks / Trade-offs

- **Localization form requires the store to have multiple countries/currencies enabled** → If only one country is available, the selector shows a single option; keep `Save & Continue` harmless in that case (form still valid). Note in settings info text.
- **Two competing popovers inside a product column with `overflow` or stacking contexts** → Scope popover positioning/z-index in the block's CSS and test against adjacent blocks; use an overlay for the modal to avoid clipping.
- **Duplicate element IDs when the block is added more than once** → Namespace form, select, and popover IDs with `block.id` and set `limit: 1` in the schema like `delivery_deadline`.
- **`localization-form.js` expects specific `localization-form` custom element markup for its select flow** → If the modal's select does not need the searchable country list, submit the plain form directly on button click; verify behavior against `localization-form.js` during implementation and fall back to a plain `localization` form if the custom element is not required.
- **Date wording drift across locales** → Use configurable format/labels as existing blocks do; do not hardcode month/day names.

## Migration Plan

Additive only: no existing block or setting changes. Deploy by updating the section, snippet, and CSS snippet. Rollback is removing the block from the section or reverting the three files; no data or content migration.

## Open Questions

- Whether the modal's country control should be a plain `<select>` or the theme's searchable country list; resolve during implementation by checking `localization-form.js` behavior (does not change specs or task breakdown).
