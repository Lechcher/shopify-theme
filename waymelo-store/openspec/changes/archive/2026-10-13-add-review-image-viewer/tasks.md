# Tasks

## 1. Review-photo markup and data hooks

- [x] 1.1 In `sections/reviews-section.liquid`, wrap each "Reviews with Images" gallery `<img>` in a `<button type="button" class="reviews-section__photo" data-rs-photo-open>` and add `data-rs-full="{{ block.settings.image | image_url: width: 1600 }}"`, `data-rs-caption="{{ block.settings.author | escape }}"`, and `data-rs-alt` to it, keeping the visible `<img>` small and `loading="lazy"`. Verify in the theme editor that a gallery photo is focusable, shows a visible focus outline on Tab, and still displays at its configured width.
- [x] 1.2 In `sections/reviews-section.liquid`, apply the same button wrapper and `data-rs-*` hooks to each review-entry photo inside `.reviews-section__review-image`. Verify each entry's photo is focusable and renders at its configured width.
- [x] 1.3 Update the leading `{%- comment -%}` in `sections/reviews-section.liquid` to document the click-to-enlarge photo viewer. Verify the comment renders as a comment (nothing visible on the storefront).

## 2. Image-viewer overlay markup and styles

- [x] 2.1 Add a single shared viewer element near the end of the section root: `role="dialog"`, `aria-modal="true"`, an accessible label, `hidden` by default, containing a close control, previous/next controls, the enlarged `<img>`, and a caption element with `data-rs-viewer-*` hooks. Verify the overlay is absent from the rendered page on load (its `hidden` attribute is set).
- [x] 2.2 Add scoped viewer styles to the section's `{% style %}` block (overlay backdrop, centered image, controls, caption) so it renders correctly at mobile and desktop widths and respects the section's existing color variables. Verify in the theme editor that a forced-visible overlay (temporarily unhide it) is centered, readable, and does not overflow the viewport.

## 3. Open, populate, and navigate

- [x] 3.1 In `assets/reviews-section.js`, extend the existing delegated `root` click listener with a branch for `[data-rs-photo-open]` that opens the shared viewer, resolves the photo's index within the section's `[data-rs-photo-open]` set, and sets the enlarged image `src`/`alt` and caption from the photo's `data-rs-*` values, falling back to the image alt text and then a generic label. Verify clicking a gallery thumbnail and a review-entry photo each open the viewer on that exact image.
- [x] 3.2 Add previous/next handling that moves the index, repopulates the viewer, and disables previous at the first photo and next at the last; when the section has a single photo, hide the previous/next controls. Verify on a section with multiple photos that navigation steps through all of them and the end controls disable.
- [x] 3.3 Update the header comment in `assets/reviews-section.js` to describe the viewer behavior. Verify no syntax errors by loading the section (no console errors).

## 4. Close, focus, and keyboard behavior

- [x] 4.1 Implement closing via the close control, `Escape`, and a click on the backdrop outside the enlarged image, restoring focus to the photo that opened the viewer. Verify each of the three close paths closes the overlay and returns focus to the invoking photo.
- [x] 4.2 Add focus containment while the viewer is open (Tab/Shift+Tab cycle only through the viewer's controls) and lock body scrolling on open, restoring the prior value on close. Verify focus cannot Tab out of the open viewer and that page scrolling is restored after closing.
- [x] 4.3 Add `ArrowLeft`/`ArrowRight` keydown handling, guarded so it only acts while the viewer is open. Verify arrow keys change the viewed image while open and do nothing after closing.

## 5. Integration verification

- [x] 5.1 In the theme editor, open the viewer and then select a different block or reload the section; verify the viewer resets closed and opening a photo still works afterward (delegation and re-init survive a section re-render).
- [x] 5.2 Place the reviews section twice on one page; verify each section's photos open only that section's viewer and navigation stays within that section's photos.
- [x] 5.3 Disable JavaScript and reload; verify every review photo is still visible in the gallery and review entries and the section remains readable.
- [x] 5.4 Verify the section's existing controls (gallery arrows, star filter pills, review pagination) behave exactly as before, and that the product section's review-video modal is unaffected.
- [x] 5.5 Run `openspec validate add-review-image-viewer --strict` and verify it passes.

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied.
- Verify the archived result.
