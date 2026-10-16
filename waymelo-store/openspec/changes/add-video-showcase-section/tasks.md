# Tasks

## 1. Section scaffolding and schema

- [ ] 1.1 Create `sections/blocky-video-showcase.liquid` with a `{% doc %}`/header comment, a placeholder `<div>`, and a `{% schema %}` defining `"name": "BKY - Video Showcase"`, a `presets` entry, and the settings groups (content, video, layout); verify the section appears in the theme editor's add-section list and renders its placeholder without errors.
- [ ] 1.2 Add the section-level `{% style %}` block scoped to `#blocky-video-showcase-{{ section.id }}` and a `.blocky-page-width` content wrapper using the `--section-page-width` custom property, following `sections/blocky-rich-text.liquid`; verify the section renders inside the theme's content width.

## 2. Title and description

- [ ] 2.1 Add an `inline_richtext` title setting (with size, color, alignment) and render it above the video only when non-blank; verify a set title renders with the configured style and a blank title renders nothing.
- [ ] 2.2 Add a `richtext` description setting (with size, color, alignment) and render it above the video only when non-blank; verify a set description renders, a blank one is omitted, and no empty container or gap remains.

## 3. Video preview

- [ ] 3.1 Add a `type: "video"` setting and render it with `video_tag: autoplay: true, loop: true, muted: true, controls: false, playsinline: true, preload: 'auto'` inside a rounded, dark-backed container with `object-fit: cover`, mirroring `blocks/ai_gen_block_a021675.liquid`; verify a selected video autoplays muted in preview and fills/crops to its container.
- [ ] 3.2 Render a merchant-facing placeholder when no video is selected; verify the placeholder appears with no video set and the layout stays intact.

## 4. Play/pause control

- [ ] 4.1 Add the floating toggle button markup and a `customElements.define`-guarded custom element (`customElements.get` check) that forces `muted`/`playsInline`, attempts `play()` while swallowing promise rejections, and toggles play/pause on click; verify clicking pauses and resumes an autoplaying video with no console errors.
- [ ] 4.2 Sync the control's text, `aria-label`, and `aria-pressed` to the video's `play`/`pause` events and expose it as a keyboard-focusable button; verify the state stays correct after clicking and after the video is paused by the browser, and that it is reachable by keyboard.

## 5. Width, height, and padding controls

- [ ] 5.1 Add a `video_width` range setting (percentage of content width, default 100%) applied to the video container with `margin-inline: auto` and `max-width: 100%`; verify the container matches the chosen percentage, defaults to the full content width, and causes no horizontal overflow at narrow viewports.
- [ ] 5.2 Add an `aspect_ratio` select (Square `1/1`, Portrait `4/5`, Landscape `16/9`, Wide `21/9`) applied to the container, plus a `fixed_height` range (px, `0` = off) that overrides it when non-zero; verify the height follows the ratio by default, the fixed height overrides it, and both apply on desktop and mobile.
- [ ] 5.3 Add `padding_top` and `padding_bottom` ranges (section spacing), a horizontal `content_padding` range, and a `corner_radius` range; verify each setting visibly changes the rendered section spacing/insets and the video container's corner radius.

## 6. Integration verification

- [ ] 6.1 In the theme editor preview, verify the full section end to end: title and description render and can be blanked, the video autoplays muted and can be paused/resumed, and every width, height, padding, and corner-radius setting updates the storefront without code changes.
- [ ] 6.2 Verify the section is responsive on desktop and a narrow mobile viewport with no horizontal overflow, and that adding, duplicating, reordering, and removing the section leaves all other sections and blocks on the template unchanged with no console errors.

## Workflow follow-up

- Sync the `storefront-video-showcase` delta into the main spec once the project's review requirements are satisfied.
- Archive the change after implementation is complete.
