# Design

## Context

See `proposal.md - Why` and `specs/storefront-help-button/spec.md` for motivation and requirements. Relevant current state:

- The storefront is a Shopify Liquid theme. `layout/theme.liquid` is the single layout: it renders `{% sections 'header-group' %}`, `<main>`, and `{% sections 'footer-group' %}`, then closes `</body>`. A fixed overlay that must appear on every page therefore belongs in the layout, not in an individual template.
- The theme has **no Tailwind or utility-CSS framework**: there is no `tailwind` reference and no `bg-white` usage anywhere in `assets/`, `sections/`, or `snippets/`. The requested classes (`bg-white`, `border-[#7A5168]`, `px-4`, `py-2`, `rounded-full`) are Tailwind tokens and must be expressed as plain CSS.
- Sections use `{% schema %}` for settings and `{%- style -%}` for scoped CSS (see `sections/custom-liquid.liquid`). Section settings are editable in the theme editor even when the section is rendered statically from the layout.
- The brand color `#7A5168` is the footer background (`footer-group.json` `background_color: "#7a5168"`), so the border color already exists in the theme's palette.
- No existing help, floating, or chat widget exists in the theme.

Constraints from the request: the button must be fixed to the bottom-right, and the merchant must be able to adjust the link target.

## Goals / Non-Goals

**Goals:**

- One global help button, fixed bottom-right, visible on every storefront page.
- Merchant-editable link target, label, and new-tab behavior via a section setting.
- Reproduce the requested look (white pill, `#7A5168` border, `px-4`/`py-2` spacing, fully rounded) in plain CSS.
- Keep the change additive and isolated so it cannot disturb existing layout.

**Non-Goals:**

- Chat/messenger widget embedding, icon/image content, or animation.
- Configurable corner or offset controls.
- Per-page or per-template visibility rules.
- Introducing a CSS framework to the theme.

## Decisions

**1. A new self-contained section `sections/help-button.liquid`, rendered statically from `layout/theme.liquid`.**

A section (not a snippet) is chosen because the merchant needs editable settings, and settings require a schema. It is rendered with a static `{% section 'help-button' %}` tag added in `layout/theme.liquid` just before `</body>`, after the footer group. Alternatives considered:
- *Add it to a section group (e.g. `footer-group.json`)*: rejected because those JSON files are auto-generated and overwritten by the theme editor, and because a fixed overlay is conceptually global rather than part of the footer region. A static section include is stable and its settings remain editable in the theme editor.
- *A snippet plus a `theme.liquid` theme setting*: rejected because a section gives a cleaner settings surface and keeps markup, styles, and schema together.

**2. Use `position: fixed` with `right`/`bottom` offsets and a high `z-index`.**

This matches the request literally and guarantees the button is viewport-anchored regardless of page length. A high `z-index` keeps it above page content; the theme's drawers/popups use their own stacking contexts, so a mid-high value scoped to the button is sufficient. A fixed overlay must not be nested inside an ancestor with a `transform`/`filter` (which would create a containing block) — rendering it as a direct child of `<body>` avoids that.

**3. Translate the Tailwind utility classes to scoped plain CSS.**

| Requested class | Plain-CSS equivalent |
| --- | --- |
| `bg-white` | `background-color: #ffffff;` |
| `border-[#7A5168]` | `border: 1px solid #7A5168;` |
| `px-4` | `padding-left: 16px; padding-right: 16px;` |
| `py-2` | `padding-top: 8px; padding-bottom: 8px;` |
| `rounded-full` | `border-radius: 9999px;` |

Styles are emitted in a `{%- style -%}` block scoped to a stable class, following `custom-liquid.liquid`, so there is no new global stylesheet asset.

**4. Settings schema: `link`, `label`, and `open_in_new_tab`.**

- `link` (`text`, default `/pages/contact`) — the adjustable target the request asks for.
- `label` (`text`, default `Help`) — the visible text and the anchor's accessible name.
- `open_in_new_tab` (`checkbox`, default `true`) — when on, renders `target="_blank"` with `rel="noopener"`.
This keeps the settings surface small and matches the request ("I can adjust the link").

`link` is a `text` setting rather than `url` because Shopify's `url` setting type only accepts `/collections` and `/collections/all` as a `default`, so the intended `/pages/contact` default is not a valid `url` default. A `text` setting supports the `/pages/contact` default, keeps the button usable before configuration, and still lets the merchant enter any URL, relative path, or external messaging link. Trade-off: no Shopify resource picker — accepted, since the request is specifically to adjust the link value.

**5. Render nothing when the link is blank; rely on a non-blank default.**

A default link (`/pages/contact`) makes the button usable out of the box, while an explicit blank link hides the button so shoppers never see a dead anchor. This is the observable behavior captured in the spec.

**6. Anchor semantics and accessible name.**

The button is a real `<a>` (keyboard operable, Enter activates) whose label text is its accessible name. If the label is cleared in the editor, the markup falls back to a sensible accessible name so the link is never announced as unlabeled.

## Risks / Trade-offs

- **A fixed overlay can overlap other bottom-right UI (chat widgets, cookie banners, popups) or the footer.** → Offsets keep it clear of the viewport edge; if the store later adds another bottom-right element, the offset/spacing can be adjusted in the section's scoped CSS. No existing bottom-right widget is present today.
- **Fixed-position elements nested under a transformed ancestor silently stop being viewport-fixed.** → The section is rendered as a direct child of `<body>` (via the layout include), avoiding transformed ancestors.
- **The requested look is a visual target, not a spec guarantee at every breakpoint.** → The pill styling is deterministic CSS; verify at mobile and desktop widths. Size (`px-4`/`py-2`) is fixed by the request, so the tap target is comfortable without extra sizing rules.
- **A mid-high `z-index` could sit under the theme's modal overlays.** → Acceptable: help is a secondary affordance and should not cover modals/drawers; the value is chosen to beat normal content, not full-screen overlays.
- **Editing `layout/theme.liquid` touches every page.** → The change is a single additive line before `</body>`; it does not modify existing markup or scripts, so rollback is deleting that line and the new section file.

## Migration Plan

1. Add `sections/help-button.liquid` (markup, scoped styles, schema).
2. Add `{% section 'help-button' %}` to `layout/theme.liquid` before `</body>`.
3. Verify on a storefront preview at mobile and desktop widths: the button is fixed bottom-right, follows scroll, uses the configured link/label, and existing header/footer content is unchanged.
4. Rollback: remove the `{% section %}` line and delete `sections/help-button.liquid`; there is no data migration or persisted state.

## Open Questions

- Which destination the store ultimately wants (contact page, WhatsApp, or a live-chat provider) is a merchant decision made in the theme editor; it does not change the specs, approach, or tasks.
