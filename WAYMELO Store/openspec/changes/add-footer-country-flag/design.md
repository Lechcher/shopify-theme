# Design

## Context

See `proposal.md - Why`. Relevant current state:

- `sections/footer.liquid` renders the footer. The localization block lives in `<div class="footer__column footer__localization isolate">` (lines ~291-315). Its country selector is rendered by `{%- render 'country-localization', localPosition: 'FooterCountry' -%}` (line ~297), wrapped in a `<localization-form>` and a `form 'localization'`.
- `snippets/country-localization.liquid` builds the disclosure button. The button content is a single `<span>` holding `{{ localization.country.name }} | {{ currency.iso_code }} {{ currency.symbol }}` followed by `{% render 'icon-caret' %}` (lines ~36-41). The same snippet is also rendered by the header and the announcement bar, so edits there affect all three call sites unless made opt-in.
- `assets/section-footer.css` styles `.footer__localization` as a centered flex row (mobile) / left-aligned (desktop). `assets/component-localization-form.css` styles the disclosure button (`.disclosure__button`, flex, `height: 4rem`).
- The theme has no flag assets, and no existing flag/emoji rendering anywhere. `openspec/specs/` has no localization capability.

Constraints from the request: flags come from the flagcdn.com CDN, and only the footer should show them (header and announcement bar stay unchanged).

## Goals / Non-Goals

**Goals:**

- Show the selected country's flag to the left of the country name in the footer country selector only.
- Keep the shared `country-localization` snippet safe for its other call sites.
- Reserve space and degrade gracefully so a failed image load does not shift or break the footer.

**Non-Goals:**

- Flags on the header or announcement-bar selectors, or beside each country in the dropdown list.
- Self-hosting flag assets.
- A theme setting to toggle the flag.
- Changing how country/language selection or submission works.

## Decisions

**1. Add an opt-in `show_flag` parameter to `snippets/country-localization.liquid`, and pass it only from the footer.**

The country name text lives inside the snippet's button, so the flag must be rendered from within the snippet to sit to the left of that text. Because the snippet is shared, a new optional parameter (defaulting to off) keeps the header and announcement bar unchanged while the footer call site passes `show_flag: true`. Alternatives: duplicating the country picker into a footer-only snippet (rejected — duplicates ~130 lines and diverges from upstream), or positioning a flag with CSS outside the button (rejected — fragile, and the flag would not move with the label or dropdown state).

**2. Build the flag URL from the country ISO code on the flagcdn.com CDN.**

`localization.country.iso_code` is already available in the snippet. Lower-case it and interpolate into `https://flagcdn.com/<code>.svg`. SVG is used for crispness at all densities. Alternatives: PNG size variants (`w40`, etc.) — rejected because SVG avoids choosing a fixed raster size; self-hosted assets — rejected as out of scope per the request.

**3. Render the flag as an `<img>` with fixed dimensions, `alt` set to the country name, and `loading="lazy"`.**

A fixed width/height (approximately `2.4rem x 1.8rem`, matching the disclosure's text scale) reserves space so the button does not shift as the image loads, satisfying the no-layout-shift requirement. `alt` carries the country name so the image is not an unlabeled graphic. `loading="lazy"` avoids competing with above-the-fold resources. Note: the adjacent text already names the country, so `alt` is somewhat redundant for screen readers; this is accepted to keep the flag self-describing, and could be switched to a decorative `alt=""` later without changing behavior.

**4. Scope the styling to the footer and keep it minimal.**

The flag gets a small class (e.g. `.footer__country-flag`) and is styled from `assets/section-footer.css` with an inline alignment (vertical-align/margin) and a `flex-shrink: 0` so it keeps its size inside the flex button. A footer-scoped rule keeps the header/announcement-bar visuals untouched and matches the existing pattern of styling footer pieces in `section-footer.css` (as the DMCA badge change does).

## Risks / Trade-offs

- Third-party runtime dependency (`flagcdn.com`) for every footer page view → the footer emits a visitor request to a third party and flags are missing if that host is down. Mitigation: the image degrades to empty space with the country text intact; the flag is decorative to the selector's function.
- `RemoteAsset` theme-check warning for the CDN image → accepted by design, since the request selects the CDN and self-hosting is a Non-Goal. Documented like the DMCA badge's third-party assets.
- Partial coverage: a country whose ISO code is absent from flagcdn renders a broken/empty image → Mitigation: graceful `alt` text plus reserved dimensions; the country name is always shown. A local asset set could replace the CDN later if coverage becomes a problem.
- CDN URL shape could change → Mitigation: the URL is constructed in one place in the snippet; swapping providers is a one-line edit.
- Duplicate verbal context for screen readers (flag `alt` plus adjacent country name) → accepted; can be made decorative later without a spec change beyond the accessibility requirement.
- `flex-shrink`/alignment in the disclosure button could misalign the caret → Mitigation: verify the button at mobile (<750px) and desktop (≥750px) widths.

## Migration Plan

1. Add the opt-in flag markup to `snippets/country-localization.liquid`; pass `show_flag: true` from `sections/footer.liquid`.
2. Add the scoped `.footer__country-flag` style to `assets/section-footer.css`.
3. Verify the footer selector at mobile and desktop widths, and confirm the header and announcement-bar selectors are unchanged.
4. Rollback: revert `snippets/country-localization.liquid`, `sections/footer.liquid`, and `assets/section-footer.css`; there is no data migration or persisted state.
