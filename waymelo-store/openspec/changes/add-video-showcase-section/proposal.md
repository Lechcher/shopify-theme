# Proposal

## Why

The theme has video building blocks (the `ai_gen_block_a021675` "Video showcase" block renders three autoplaying videos, and `BKY - Video Embed` overlays text on a full-screen video), but there is no simple, reusable section that pairs an intro title and description with a single autoplaying video sized to the theme's content width. Merchants currently have to reach for a heavy hero section or a block with three slots to show one video, and neither gives direct control over the video's width, height, and padding as one cohesive unit.

## What Changes

- Add a new standalone section (`sections/`) that renders a single video preview with an optional title and description above it.
- The video auto-runs: autoplay, muted, looping, `playsinline`, with `preload: auto`, so it satisfies browser autoplay rules on load.
- Add a play/pause toggle overlay on the video (mirroring the reference block's `ai-video-showcase-{{ ai_gen_id }}__item` treatment), so visitors can pause the autoplaying preview; it stays usable and labeled for assistive technology.
- Style the video container like the reference item: rounded corners, dark background while loading, and a fixed aspect ratio with `object-fit: cover`, but spanning the theme's content width by default.
- Give the merchant layout controls: video width (as a percentage of content width), video height or aspect ratio, corner radius, video spacing/gap, and section padding (top/bottom and horizontal content padding).
- Make title and description optional and richly editable (inline/rich text, size, color, alignment) so the section can render as video-only when text is blank.
- Wire the section into the theme editor with a preset so it can be added and previewed from the editor.
- Styling lives in the section's own scoped `{% style %}` block keyed on `section.id`, following the `ai_gen_block_a021675` pattern; behavior uses a small guarded custom element for the toggle.

## Capabilities

### New Capabilities
- `storefront-video-showcase`: a reusable storefront section that shows a title, description, and a single autoplaying video with a play/pause control, whose width, height, and padding are merchant-configurable.

### Modified Capabilities
<!-- No existing capability's requirements change; this introduces a new section and new storefront behavior. -->

## Impact

- New file `sections/` entry (e.g. `sections/blocky-video-showcase.liquid` or `sections/video-showcase.liquid`) containing markup, scoped styles, the toggle custom element script, and `{% schema %}` (settings + preset).
- No existing sections, snippets, assets, or settings are modified; the change is purely additive, so it cannot affect current pages or blocks.
- Uses only built-in Shopify Liquid (`type: "video"` setting + `video_tag` filter) and theme primitives; no new external assets, libraries, or dependencies.
- Rollback is removing the section from templates; no data or content migration.
