# Design

## Context

See `proposal.md - Why`. Relevant current state:

- `sections/footer.liquid` renders the footer. Payment icons live in `<div class="footer__column--info">`, inside the first `footer__content-bottom-wrapper` (lines ~279-292), conditionally behind `section.settings.payment_enable`.
- `assets/section-footer.css` styles the footer. `.footer__column--info` is a centered flex column on mobile and right-aligned (`align-items: flex-end`) on desktop ≥750px. `.footer__payment` gets `margin-top: 1.5rem` on desktop.
- The theme already loads third-party scripts (e.g. `https://cdn.jsdelivr.net/npm/@glidejs/glide` in several `blocky-*` sections) and uses the Shopify asset pipeline for its own scripts.
- No DMCA or trust-badge markup exists anywhere in the theme, and `openspec/specs/` is empty.

Constraints: the request targets `sections/footer.liquid` specifically, and the store owner supplied the exact DMCA badge markup (link, image, helper script) with a fixed protection ID.

## Goals / Non-Goals

**Goals:**

- Add the DMCA badge as a self-contained, isolated block in the footer's info column.
- Keep the protection ID in one place so it is easy to change.
- Match the footer's existing alignment at mobile and desktop widths.

**Non-Goals:**

- Making the badge toggleable through theme settings or a section block (may be a follow-up change).
- Supporting additional trust badges or badge vendors.
- Self-hosting or re-hosting the DMCA image/script assets.

## Decisions

**1. Inline the badge in `sections/footer.liquid` rather than a snippet.**

The badge is a single, footer-specific instance. A dedicated snippet (`snippets/dmca-badge.liquid`) was considered for reuse/encapsulation, but the request targets `footer.liquid` and there is only one call site. Inline keeps the change minimal and avoids a new file. Revisit if the badge is needed elsewhere (e.g. cart or product pages).

**2. Place the badge inside `.footer__column--info`, immediately after the payment block, and render it unconditionally.**

Grouping it with payment icons puts it alongside the other compliance signals, and the existing flex-column alignment centers it on mobile and right-aligns it on desktop for free. Gating it behind `payment_enable` was rejected: merchants can disable payment icons without losing the protection badge, and the two concerns are independent. Adding a new `section.settings` checkbox was rejected as out of scope for now.

**3. Use a Liquid variable for the protection ID.**

Rather than duplicating the raw ID in both the link and image URLs, `{%- assign dmca_protection_id = 'a4d778c3-abcf-45c9-ae83-b157c525078c' -%}` is declared once and interpolated into both URLs. This makes it obvious where to change the ID and matches the codebase's use of `assign` for local values.

**4. Place the helper `<script>` next to the badge markup and load it with `defer`.**

DMCA publishes the helper script alongside the badge snippet. Verified against the vendor script (`DMCABadgeHelper.min.js`): it registers a `DOMContentLoaded` listener, selects `a.dmca-badge`, dereferences the first match without a null check, and appends a `refurl` query parameter. So the anchor's `dmca-badge` class must be preserved, and the tag should load before `DOMContentLoaded` fires for the listener to register. The tag is kept adjacent to the anchor and loaded with `defer`, which executes it after parsing but before `DOMContentLoaded` — the listener still registers, and this matches the theme's convention of deferring scripts. `defer` also clears theme-check's `ParserBlockingScript` error (a synchronous tag produced a new error). Alternatives: synchronous loading (rejected — parser-blocking error), or moving the tag to `layout/theme.liquid` (rejected — the footer owns its own dependency).

**5. Add a scoped footer style only where the existing rules are insufficient.**

The block primarily relies on `.footer__column--info` alignment. A small `.footer__dmca-badge` rule (block display, centered, modest top margin consistent with `.footer__payment`) is added to `assets/section-footer.css` if the default flow does not align the badge with the payment list. No new stylesheet asset is introduced.

## Risks / Trade-offs

- Third-party runtime dependency (`images.dmca.com`) for both the image and the helper script → the badge emits a visitor request to a third party and is unavailable if that host is down. Mitigation: the badge container is isolated so failure collapses the badge area without disturbing adjacent footer content; the footer's own scripts remain independent of the helper.
- Loading third-party JavaScript executes external code in the storefront context → a supply-chain/security consideration. Mitigation: it is DMCA's documented helper for the requested badge; if the store later adopts a Content-Security-Policy, `images.dmca.com` must be allowed for `img-src` and `script-src`.
- Synchronous script tag would be parser-blocking and trips theme-check's `ParserBlockingScript` error → Mitigation: the helper is loaded with `defer`, so it does not block parsing and the error is cleared; the deferred tag still registers its `DOMContentLoaded` listener.
- Third-party assets trip theme-check's `RemoteAsset` warning (image + helper script) → accepted by design: the proposal and spec deliberately take the `images.dmca.com` dependency and self-hosting is a Non-Goal, so these two warnings are documented rather than suppressed. Revisit if the store later wants a clean lint or to drop third-party JS.
- The vendor helper dereferences `document.querySelectorAll('a.dmca-badge')[0]` without a null check → it throws when no badge anchor exists. Mitigation: the anchor is always rendered with the `dmca-badge` class alongside the helper, so the selector always matches.
- The native badge image is small (121x24) relative to the payment icon row → accepted for this change; explicit `width`/`height` prevent layout shift, and a larger DMCA asset can be swapped by changing the image URL later.
- Hardcoded protection ID → if the store's DMCA account changes, the badge breaks silently. Mitigation: single `assign` variable makes the update a one-line edit; documented in tasks.
- Badge may not visually match payment-icon alignment at some breakpoints → Mitigation: verify both breakpoints and rely on the scoped `.footer__dmca-badge` rule.
- Mobile tap target: the small 120px badge image is below the recommended minimum tappable size alone → the anchor wraps the image; padding can be added via the scoped rule if needed.

## Migration Plan

1. Add the badge block and script to `sections/footer.liquid`; add the scoped style to `assets/section-footer.css` if required.
2. Verify on a storefront preview at mobile and desktop widths, with the badge image reachable.
3. Rollback: revert `sections/footer.liquid` (and `section-footer.css`) to remove the badge block; there is no data migration or persisted state.

## Open Questions

- Should the badge later become toggleable through a theme setting or footer block? Deferrable; does not change the specs, approach, or tasks for this change.
