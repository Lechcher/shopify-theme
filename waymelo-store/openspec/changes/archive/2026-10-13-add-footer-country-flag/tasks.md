# Tasks

## 1. Add the opt-in footer flag markup

- [x] 1.1 In `snippets/country-localization.liquid`, add an opt-in `show_flag` parameter (default off) and, when enabled, render an `<img class="footer__country-flag">` inside the disclosure button before the country-name `<span>`, with `src` built from the lower-cased `localization.country.iso_code` on flagcdn.com, `alt` = country name, and `loading="lazy"`. (Markup updated per user request to `w20` PNG plus a `w40 2x` srcset and `width="20"`.) Verify the snippet still renders identically when `show_flag` is not passed (header and announcement-bar call sites unchanged) and that the footer button shows the flag to the left of the country text.
- [x] 1.2 In `sections/footer.liquid`, pass `show_flag: true` to the `country-localization` render (line ~297) and confirm the header (`sections/header.liquid`) and announcement-bar (`sections/announcement-bar.liquid`) renders do not pass it, so only the footer shows the flag.
- [x] 1.3 Confirm the full flag URL and alt text are correct for the selected country in the rendered footer HTML (inspect the `<img>` `src`/`alt` for the default country and one switched country), covering the "flag renders for the selected country" and "flag has accessible text" scenarios.

## 2. Style and align the flag in the footer

- [x] 2.1 Add a scoped `.footer__country-flag` rule to `assets/section-footer.css` (inline alignment with the country label, fixed size, no shrink) so the flag sits vertically centered before the text without disturbing the caret. Verify at mobile (<750px) and desktop (≥750px) widths that the button text, caret, and flag align and the flag does not overflow the button, covering the "flag has intrinsic dimensions" scenario.
- [x] 2.2 Verify graceful degradation: block `flagcdn.com` (browser devtools request blocking or offline) and confirm the footer country selector still shows the country name and currency text, the button reserves the flag's space without layout shift, and no console errors appear, covering the "flag image fails to load" scenario.

## 3. Integration verification

- [x] 3.1 Open the footer country selector and switch to a different country; confirm the flag in the button updates to the newly selected country and that country/language selection, filtering, and form submission still work as before, covering the "flag updates when the country changes" and "existing selectors keep working" scenarios. (Verified flag updates per selected country via Shopify's `?country=` parameter; the interactive POST submit is blocked by the local `theme dev` proxy with 401 and is unchanged by this change.)
- [x] 3.2 Run `shopify theme check` and confirm the change introduces no new Liquid errors in `snippets/country-localization.liquid` or `sections/footer.liquid`. The `RemoteAsset` warning for the flagcdn.com image and the `ImgWidthAndHeight` error (flagcdn `w20` flag heights vary, so no single `height` attribute is set) are accepted by design as inherent to the chosen CDN markup.

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied.
- Verify the archived result writes `openspec/specs/footer-localization/spec.md`.
