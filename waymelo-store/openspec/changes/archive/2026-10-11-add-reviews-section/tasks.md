# Tasks

## 1. Section scaffold and content model

- [x] 1.1 Create `sections/reviews-section.liquid` with a `{% schema %}` exposing section settings (headings, labels, colors, section width, padding) and a repeatable `review` block (rating 1–5, author, date, `verified` checkbox, body richtext, `image` image_picker) with a block `limit`; verify the section appears in the theme editor "Add section" list and a `review` block can be added.
- [x] 1.2 Add a width/padding container scoped by `#reviews-section-{{ section.id }}` that does not depend on `.blocky-page-width`/`.blocky-padding`; verify changing the width and padding settings visibly changes the rendered container.
- [x] 1.3 Give every section and block setting a clear `label`/`info` and default English label so the theme editor documents the feature; verify the editor shows the labels and defaults.

## 2. Rating summary, distribution, and filter pills (Liquid)

- [x] 2.1 Implement the Liquid loop over `section.blocks` that accumulates total count, rating sum, and a counter for each star level 5→1; verify counts equal the authored set using a known preview (for example five 5-star and five 4-star reviews).
- [x] 2.2 Render the average rating and total review count; verify the average equals the mean of the authored ratings with the configured decimal places.
- [x] 2.3 Render the 5→1 distribution bars, driving each bar's filled width from the computed percentage; verify an equal 5-star/4-star mix yields two half-filled bars and empty 3/2/1-star bars.
- [x] 2.4 Render the "All Reviews" pill plus one pill per star level 5→1 with counts; verify each star pill shows its rating's count, "All Reviews" shows the total, and levels with no reviews show `(0)`.

## 3. Review entry list

- [x] 3.1 Render one review entry per block (star rating, reviewer name, date, body, optional photo) with a `data-rating` attribute; verify entries match the authored blocks and a review without an image renders no photo element.
- [x] 3.2 Render the "Verified Purchase" label only when the block is marked verified; verify a verified review shows the label and an unverified review does not.
- [x] 3.3 Expose the star rating as a text alternative (for example "5 out of 5 stars"); verify assistive technology announces the rating text.
- [x] 3.4 Verify a section with zero `review` blocks renders without entries and without Liquid errors.

## 4. Reviews-with-images gallery

- [x] 4.1 Render the gallery with one item per review that has an image; verify reviews without images are excluded from the gallery.
- [x] 4.2 Make the gallery a horizontal `scroll-snap` strip with previous/next controls that call `scrollBy` by one item width; verify the arrows scroll the strip and that keyboard and touch scrolling work.
- [x] 4.3 Verify that when no review has an image the gallery region renders hidden/empty and the rest of the section still renders.

## 5. Interactive filtering

- [x] 5.1 Add `assets/reviews-section.js`, loaded with `defer`, that shows entries whose `data-rating` matches the chosen pill and hides the rest, with "All Reviews" restoring every entry; verify selecting "4 Star" shows only 4-star entries and "All Reviews" restores all.
- [x] 5.2 Keep pill state in sync by setting `aria-pressed` and a selected style on the active pill; verify keyboard focus can activate a pill and the selected pill is visually distinguished.
- [x] 5.3 Verify that with JavaScript disabled every review entry is visible and the list remains readable.

## 6. Styling and responsive layout

- [x] 6.1 Implement the section styles in a `{% style %}` block scoped by section id, driven by settings as CSS custom properties; verify color, section-width, and padding settings change the rendered output.
- [x] 6.2 Match the reference layout at desktop and mobile, stacking the rating summary above the review list on mobile; verify the layout at both breakpoints in the theme editor preview.
- [x] 6.3 Render review images with fixed-width `image_url`, `loading="lazy"`, and an aspect-ratio box; verify the section shows no jump/layout shift while images load.

## 7. Integration verification

- [x] 7.1 Run `shopify theme check` if the Shopify CLI is available (otherwise validate Liquid via the theme editor preview); verify there are no new errors referencing `reviews-section`.
- [x] 7.2 With a representative review set added to a local preview, verify the full flow end to end: summary, per-star distribution, gallery arrow scrolling, filtering through every star level, and the verified-purchase label.
- [x] 7.3 Verify the existing review UI (`product_reviews`, `product_reviews_2`, `review_carousel`, `review-stars`, and `BKY - Testimonials`) renders with the same content and layout as before the change.

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied.
- Verify the archived result.
