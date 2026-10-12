# Tasks

## 1. Create the help button section

- [x] 1.1 Create `sections/help-button.liquid` with a `{% schema %}` exposing `link` (type `text`, default `/pages/contact`), `label` (type `text`, default `Help`), and `open_in_new_tab` (type `checkbox`, default `true`). Verify the section appears in the theme editor with all three settings and readable labels.
- [x] 1.2 Add the markup: render a single `<a class="help-button">` only when `section.settings.link` is not blank, using the configured link as `href` and the configured label as its visible text (with a fallback accessible name when the label is cleared); add `target="_blank" rel="noopener"` only when `open_in_new_tab` is enabled. Verify by previewing the section: confirm the anchor's `href`, visible text, and `target`/`rel` reflect the settings, and that a blank link renders no anchor.
- [x] 1.3 Add a section-scoped `{%- style -%}` block that reproduces the requested presentation: `position: fixed` to the bottom-right with offsets, white background (`bg-white`), a `1px solid #7A5168` border (`border-[#7A5168]`), `16px` horizontal / `8px` vertical padding (`px-4`/`py-2`), `9999px` border radius (`rounded-full`), and a `z-index` above normal page content. Verify at mobile (<750px) and desktop (>=750px) widths that the button renders as a white pill with the brand-colored border.

## 2. Render the button site-wide

- [x] 2.1 Add `{% section 'help-button' %}` to `layout/theme.liquid` immediately before `</body>` so the button renders as a direct child of `<body>` on every page. Verify the tag appears exactly once in the layout and is not nested inside any ancestor with a `transform`/`filter` that would break fixed positioning.
- [x] 2.2 Verify the button renders on multiple templates (home, product, collection, cart, and a static page) and that it stays fixed to the bottom-right corner while scrolling each page.

## 3. Verify behavior, accessibility, and regressions

- [x] 3.1 Verify link behavior: with the new-tab option enabled the link opens a new tab and the anchor declares `rel="noopener"`; with it disabled the link opens in the same tab; and clearing the link setting hides the button entirely.
- [x] 3.2 Verify accessibility: tab to the button, confirm it receives keyboard focus and Enter activates the link, and confirm the accessibility tree exposes a non-empty accessible name identifying it as a help link.
- [x] 3.3 Verify no regressions: compare the header, footer, and page content before and after the change, and confirm the button does not overlap existing bottom-right UI and causes no layout shift.
- [x] 3.4 Run `shopify theme check` and confirm the new section and the layout edit introduce no new Liquid errors.

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied.
- Verify the archived result writes `openspec/specs/storefront-help-button/spec.md`.
