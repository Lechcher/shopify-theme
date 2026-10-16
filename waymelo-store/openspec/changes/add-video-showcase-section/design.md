# Design

## Context

See `proposal.md` — Why. The reference the merchant wants to match is the `ai-video-showcase-{{ ai_gen_id }}__item` element in `blocks/ai_gen_block_a021675.liquid`: a rounded, dark-backed container with a fixed `aspect-ratio`, an autoplaying `type: "video"` rendered through `video_object | video_tag: autoplay: true, loop: true, muted: true, controls: false, playsinline: true, preload: 'auto'`, an `object-fit: cover` video, and a floating pause/play toggle. That block is a single `blocks/` entry and offers no width/height/padding controls of its own beyond a desktop-width percentage.

The theme's section conventions differ from that block and are the ones a new section should follow:

- Sections are standalone files in `sections/`, named `blocky-*.liquid` and titled `BKY - <Name>` in the schema (e.g. `sections/blocky-rich-text.liquid`).
- Styles are section-scoped in a `{% style %}` block keyed on `#blocky-<name>-{{ section.id }}`; content sits inside a `.blocky-page-width` wrapper and the content width is driven by the `--section-page-width` custom property from a `page_width` range setting (`{{ section.settings.page_width | divided_by: 10 }}rem`).
- Layout/section padding follows the `padding_top` / `padding_bottom` range-setting pattern (see `sections/blocky-video-embedded.liquid`, `sections/blocky-rich-text.liquid`).
- Interactive behavior uses small custom elements guarded with `customElements.get`, as in `blocks/ai_gen_block_a021675.liquid` (`video-showcase-<id>`) and `sections/blocky-video-embedded.liquid`.

## Goals / Non-Goals

**Goals:**

- One standalone, addable section that shows a title, a description, and a single autoplaying video, with merchant control over the video's width, height, and the section's padding.
- Visual parity with the reference preview (rounded corners, dark loading background, `cover` video fill, floating toggle).
- Pure Liquid + built-in Shopify features; no new assets, libraries, or dependencies.
- Purely additive: no existing section, snippet, asset, or setting is touched.

**Non-Goals:**

- Not a multi-video grid, carousel, or slider — the reference block already covers the three-up case.
- No text-over-video overlay, buttons, or hero full-bleed behavior — that is `BKY - Video Embed`.
- No external video URLs or third-party embeds; Shopify-hosted video only (confirmed with the merchant).
- No changes to `blocks/ai_gen_block_a021675.liquid` or any existing section.

## Decisions

### Decision: New standalone section `sections/blocky-video-showcase.liquid`

Author one new section file named in the theme's `blocky-*` convention, titled `BKY - Video Showcase`, containing markup, scoped `{% style %}`, the toggle custom element, and `{% schema %}` with a `presets` entry.

- **Why:** The request is "a section" the merchant can drop into any page/template; a standalone section matches the theme's structure and avoids coupling to the large `blocky-main-product` section or the fixed three-slot block.
- **Alternatives:** A new `blocks/` entry (rejected: the merchant asked for a section, and blocks are only usable inside a host section's block list); extending `BKY - Video Embed` (rejected: it is a text-over-video hero with a different purpose and would risk its existing behavior).

### Decision: Shopify `type: "video"` setting rendered with `video_tag`

Use a `type: "video"` setting and render it with `video_tag: autoplay: true, loop: true, muted: true, controls: false, playsinline: true, preload: 'auto'`, exactly as the reference block does, with a dashed placeholder block when empty.

- **Why:** It is the theme's established, dependency-free way to autoplay a merchant-hosted video and satisfies browser autoplay policy through the muted + playsinline attributes. No embed parsing, CDN, or iframe handling is needed.
- **Alternatives:** External URL / YouTube-Vimeo embed (rejected by the merchant; adds iframe and provider handling).

### Decision: Custom-element toggle mirroring the reference

Reproduce the reference `__toggle` behavior in a small `customElements.define`-guarded class: on connect, force `muted`/`playsInline`, call `play()` (swallowing the promise rejection), and wire a floating button that toggles play/pause while keeping the button's text, `aria-label`, and `aria-pressed` synced to the video's `play`/`pause` events.

- **Why:** Preserves the reference interaction (visitors can pause an autoplaying video), keeps the control accessible, and matches the theme's no-framework pattern.
- **Alternatives:** Native `controls: true` (rejected: the reference hides native controls and uses a styled floating control); no control at all (rejected by the merchant).

### Decision: Width as a percentage of content width, default 100%

Expose a `video_width` range (e.g. 40–100%, the same shape as the reference block's `desktop_width_percent`), applied as the width of the video container inside the `.blocky-page-width` wrapper, centered with `margin-inline: auto`, and clamped with `max-width: 100%` so it never overflows.

- **Why:** Directly satisfies "adjust the width" and "full width of content" by default, reuses a familiar setting shape, and prevents mobile overflow.
- **Alternatives:** Full-bleed page-width mode (rejected by the merchant; the request is content width with adjustment).

### Decision: Height via aspect-ratio choice plus an optional fixed-pixel override

Expose an `aspect_ratio` select (Square `1/1`, Portrait `4/5`, Landscape `16/9`, Wide `21/9`) applied as the container's CSS `aspect-ratio` — the reference block's exact mechanism — plus a `fixed_height` range (px, `0` = off) that, when non-zero, sets an explicit container height and overrides the ratio. Both apply on desktop and mobile; the mobile branch may keep a separate ratio is optional, but the fixed height applies to both.

- **Why:** Satisfies "adjust the height" while preserving the reference's responsive, ratio-based default and `object-fit: cover` cropping; a fixed height gives a literal pixel control when needed.
- **Alternatives:** Only a ratio select (rejected: not literally "height"); only a fixed px height (rejected: loses the responsive default and can distort layout on small screens).

### Decision: Padding via section padding plus horizontal content padding

Expose `padding_top` and `padding_bottom` ranges (section spacing, theme convention) and a `content_padding` range for left/right insets on the content wrapper, plus a `corner_radius` range matching the reference item.

- **Why:** Gives the merchant the requested padding control at both the section and content level without introducing a bespoke spacing system, and keeps corner rounding consistent with the reference preview.
- **Alternatives:** A single padding setting (rejected: the request is to adjust padding, and top/bottom vs left/right are distinct concerns).

### Decision: Title/description as inline/rich text with size, color, and alignment

Expose an `inline_richtext` title and a `richtext` description with size, color, and alignment settings, rendered above the video and omitted entirely when blank.

- **Why:** Matches the theme's text-setting pattern (`BKY - Video Embed` uses `inline_richtext` + size + color) and lets the section degrade to video-only without empty gaps.

## Risks / Trade-offs

- **Muted autoplay can still be blocked** (e.g. some data-saver/battery settings) → The video element keeps its autoplay/muted/loop attributes so the browser retries, and the floating toggle lets a visitor start playback manually; the layout does not depend on playback.
- **A fixed pixel height set too large or too small distorts the composition** → `object-fit: cover` crops rather than stretches, and the range is bounded; the ratio select is the documented default path.
- **Multiple instances of the section on one page** → All CSS is keyed on `section.id` and the custom element is defined once behind a `customElements.get` guard, so repeated instances are safe.
- **Content-width dependency** → The width percentage is relative to `.blocky-page-width`/`--section-page-width`; if a template container is unusual, `max-width: 100%` still prevents overflow.
- **`{% style %}` output size** → Only one instance-scoped style block; negligible, consistent with existing sections.

## Migration Plan

Additive only. Deploy by adding `sections/blocky-video-showcase.liquid`; merchants then add the section from the theme editor. Rollback is deleting the file or removing the section from templates. No existing files, settings, data, or content are migrated.
