# Proposal

## Why

The storefront has no persistent way for a shopper to reach support from anywhere on the site. A small help button fixed to the bottom-right corner keeps a support entry point always visible on every page, and letting the merchant set its link from the theme editor means the destination can be changed (contact page, WhatsApp, live chat, FAQ, etc.) without a code change.

## What Changes

- Add a new storefront section that renders a single, site-wide floating help button anchored to the bottom-right corner of the viewport.
- Position the button with fixed positioning so it stays visible while scrolling and is unaffected by the surrounding page flow, on every template that renders the layout.
- Expose merchant-configurable settings for the button's link target, link label text, and an option to open the link in a new tab.
- Style the button to match the supplied design: a white pill with a brand-colored (`#7A5168`) border, horizontal padding, vertical padding, and a fully rounded shape. The requested utility classes (`bg-white`, `border-[#7A5168]`, `px-4`, `py-2`, `rounded-full`) are Tailwind-style tokens the theme does not use, so they are expressed as scoped plain CSS.
- Render the button globally by including the section from `layout/theme.liquid`, so it appears on every storefront page.
- No **BREAKING** changes. The button is additive; disabling or removing the section leaves the rest of the storefront untouched.

## Capabilities

### New Capabilities

- `storefront-help-button`: A site-wide, merchant-configurable floating help button fixed to the bottom-right of the storefront, placing a support link within reach on every page.

### Modified Capabilities

<!-- None. No existing spec-level behavior changes; the existing capabilities are `footer-trust-badges` and `storefront-reviews`, neither of which covers a global support entry point. -->

## Impact

- **Code**: New `sections/help-button.liquid` (markup, scoped styles, and settings schema); an include in `layout/theme.liquid` so it renders on every page. Possibly a small addition to `assets/` if styles are not kept inline to the section — see `design.md`.
- **Configuration**: Section settings for the link target (`url`), label text, and open-in-new-tab toggle. Defaults keep the button usable before the merchant sets a link.
- **Specs**: New capability created at `openspec/specs/storefront-help-button/`.
- **Out of scope**: Chat/messenger widget integration, icon or image content, drag-to-reposition or alternate corner placement, per-page visibility rules, and animation beyond the base button presentation. These may be proposed later if needed.
