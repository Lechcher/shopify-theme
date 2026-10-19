# Tasks

## 1. Multi-photo review rendering

- [x] 1.1 In `sections/reviews-section.liquid`, add `image_2` and `image_3` `image_picker` settings to the `review` block schema (keep the existing `image` as the first photo) and verify the theme editor shows three photo pickers per review block with no schema errors.
- [x] 1.2 Collect each non-blank picker into a per-review photos list and render every photo in the review entry (keep the existing `.reviews-section__review-image` / `[data-rs-photo-open]` markup so the image viewer keeps working); verify a block with three images renders three photos and a block with none renders no photo element.
- [x] 1.3 Update the "Reviews with Images" gallery loop to emit one gallery item per review photo; verify a review with three images contributes three gallery items and reviews without images contribute none.
- [x] 1.4 Add scoped CSS for multiple review-entry photos (a small responsive grid/row using `--rs-review-image-w`); verify the photos stay square, wrap on narrow screens, and do not overflow the entry.

## 2. Submission form markup and settings

- [x] 2.1 Add section settings for the endpoint adapter and labels: a "Write a review" label, a form heading, a submission endpoint URL, and field-name settings (defaults `rating`, `name`, `email`, `body`, `images`), each with info text documenting the contract; verify the settings appear in the editor and default sensibly.
- [x] 2.2 In the list head, add a keyboard-operable "Write a review" button (`data-rs-form-open`) and render a `hidden` `<form data-rs-form>` below the pills with a star-rating control, name field, email field, review textarea, an image input (`accept="image/*" multiple`), a `data-rs-preview` region, a live status region (`role="status"`), and submit/cancel controls; verify the section renders and the form is hidden until the button is activated.
- [x] 2.3 Add the hidden `<template data-rs-new-review>` shaped exactly like a real review entry (stars with `--rs-rating-pct`, meta author, body, `[data-rs-photo-open]` image) and add scoped CSS for the form and the thumbnail previews; verify the template exists in the DOM and the form/preview styles apply.
- [x] 2.4 Associate every form field with a label and add a `data-rs-error` slot plus `aria-describedby` targets per field; verify labels and error slots are present and each field references its error element.

## 3. Form behavior: open/close, validation, image preview

- [x] 3.1 In `assets/reviews-section.js`, implement form open/close through the existing delegated listeners and reset state on close; verify the button reveals the form, cancel hides it, and the theme editor re-render leaves it hidden.
- [x] 3.2 Implement required-field validation (rating selected, review text non-empty after trim) and email validation when an email is provided, writing messages into the field error slots and setting `aria-invalid`; verify each invalid case blocks submission, shows its message, and a valid case clears the earlier errors.
- [x] 3.3 Implement image selection with a cap of three and per-file type/size checks (assumed: jpeg/png/webp/gif, max 5 MB), showing an error naming any refused file; verify a fourth image is refused, a bad type/size is refused with a named error, and three valid images are accepted.
- [x] 3.4 Render a thumbnail preview per accepted image from `URL.createObjectURL` with a remove control, revoking the object URL on remove and on cancel/reset; verify previews appear, removing one drops it from the review, and no object URLs leak across a reset.

## 4. Submission adapter and optimistic insertion

- [x] 4.1 Implement submission as `fetch` with a multipart `FormData` built from the configured field names, disabled while in progress to prevent duplicates, and sending the review text fields plus each attached image; verify (with a test endpoint) the request method, content type, and field names match the contract.
- [x] 4.2 Handle results: on success show the confirmation in the status region and reset the form; on failure show an error in the status region and keep the entered text and attachments; when no endpoint is configured, block submission with a "not currently accepted" message; verify each branch leaves the form in the specified state.
- [x] 4.3 On success, clone `[data-rs-new-review]`, fill rating/name/text and one `[data-rs-photo-open]` per attached image (object URL as both `src` and `data-rs-full`, reviewer name as caption/alt), prepend it to `[data-rs-list]`, then re-run `applyView`; verify the new entry appears at the top, respects the active star filter and pagination, and its image opens in the existing viewer.
- [x] 4.4 Recompute the aggregate from `[data-rating]` including the new entry: update the summary average, star fill, distribution bars, pill counts, and the root `data-rs-total` / `data-rs-avg` / `data-rs-avg-pct`; verify the summary and pill counts change and the product rating teaser (`assets/product-server-rating.js`) reflects the new average without editing that file.

## 5. Integration and regression verification

- [x] 5.1 Verify keyboard-only operation end to end: open the form, complete fields, attach/remove images, submit, and confirm the status is announced and the new review is reachable; confirm `aria-invalid`/`aria-describedby` and the `role="status"` result.
- [x] 5.2 Verify the section without JavaScript: authored reviews, summary, gallery, filter pills, pagination, and image viewer still render and work, with the submission form inert and no JS errors in the console.
- [x] 5.3 Verify existing behavior is unchanged when no form is used: a review with a single image renders as before, filter pills/pagination/image viewer behave as before, and no schema or Liquid errors appear; check the theme editor load, `shopify:section:load`, and `shopify:block:select` paths.

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied.
- Verify the archived specs under `openspec/specs/` match the merged `storefront-reviews` and new `storefront-review-submission` behavior.
