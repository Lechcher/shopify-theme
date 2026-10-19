# Proposal

## Why

The reviews section currently shows only merchant-authored reviews: shoppers can read them but
cannot contribute their own. Letting shoppers write a review and attach photos is standard
ecommerce behavior that builds trust and social proof, and the section already has the list,
star, and image-viewer building blocks to display the result.

## What Changes

- Add a "Write a review" affordance to the reviews section that opens a customer submission form
  (star rating, name, optional email, review text, and up to three photos).
- Add client-side validation to the form (rating and text required, valid email when provided,
  at most three images, acceptable image types and size) with inline, accessible error messages.
- Add image upload with an in-form thumbnail preview: each selected file shows a preview thumbnail
  with a remove control, and no more than three can be attached at once.
- Submit the review through an app-agnostic adapter: the section exposes one configurable submit
  endpoint (plus the field names it expects), posts the review as multipart form data, and shows a
  success or error result. No app-specific API is assumed; a review app or app proxy can be wired
  to the documented contract later.
- On success, optimistically append the submitted review (rating, name, text, and previewed
  photos) to the top of the review list so the shopper sees it immediately, and re-apply the
  active star filter and pagination.
- Extend review entries to render up to three photos per review (previously one), so both
  merchant-authored and newly submitted reviews can show multiple images.
- Add a "Write a review" label setting and a form heading setting; keep all existing review
  controls (summary, distribution, gallery, filter pills, pagination, image viewer) unchanged.

## Capabilities

### New Capabilities
- `storefront-review-submission`: Lets shoppers write a review and attach up to three images
  through a form in the reviews section, validates the input, submits it through a configurable
  endpoint adapter, and reflects the result in the list. Owns the form, validation, image preview,
  submission contract, and success/error feedback.

### Modified Capabilities
- `storefront-reviews`: Review entries SHALL render up to three photos per review instead of a
  single photo, for both merchant-authored and customer-submitted reviews.

## Impact

- **Code**: `sections/reviews-section.liquid` (submission form markup, per-review multi-image
  rendering, new section/block settings, styles); `assets/reviews-section.js` (form open/close,
  validation, image preview/remove, submit adapter, optimistic insertion into the list and
  re-application of filter/pagination); possibly a new `snippets/` for the review photos.
- **Dependencies**: no third-party review app is installed; the submission endpoint is merchant-
  configurable and left unset by default, so the form renders but submission is inert until an
  endpoint is provided.
- **Out of scope**: installing or building a review app/backend; moderation or persistence of
  submissions beyond the configured endpoint; reading reviews from an app or metafields.
