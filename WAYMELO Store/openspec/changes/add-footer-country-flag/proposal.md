# Proposal

## Why

The storefront footer shows the selected country only as text (`Country | CUR 0.00`) inside the localization disclosure button, which makes scanning and recognizing the current country slow. A small country flag next to the country selector gives visitors an immediate visual cue for which market they are shopping in, and it is a low-risk, self-contained addition to an existing footer region.

## What Changes

- Render the currently selected country's flag inside the footer's country selector button, to the left of the existing country name and currency text.
- Source the flag as an SVG image from the flagcdn.com CDN, keyed on `localization.country.iso_code` (lower-cased), with the country name as the image `alt` text.
- Add a scoped footer style so the flag sits inline with the country label at mobile and desktop breakpoints and matches the footer's text color/size.
- Only the footer country selector is affected; the header and announcement-bar selectors remain unchanged.
- The change is purely additive and degrades safely: if the flag image cannot be loaded, the existing country name and currency text still render.
- No **BREAKING** changes.

## Capabilities

### New Capabilities
- `footer-localization`: Rendering of the footer's localization controls, including the visual treatment of the selected country (currently its country flag) in the footer country selector.

### Modified Capabilities
<!-- None. No existing spec covers footer localization rendering. -->

## Impact

- **Code**: `sections/footer.liquid` (country-selector markup); `assets/section-footer.css` (flag alignment/spacing).
- **External dependencies**: SVG flag images are loaded from `https://flagcdn.com/` at render time. This is a new external runtime (image) dependency; no third-party JavaScript is introduced.
- **Data source**: The flag URL is derived from the existing `localization.country.iso_code`; no new settings, metafields, or schema entries are added.
- **Specs**: First capability created at `openspec/specs/footer-localization/`.
- **Out of scope**: Flags on the header/announcement-bar selectors, flags inside the country dropdown list items, self-hosting flag assets, and adding a theme setting to toggle the flag (may be proposed later).
