# Design

## Context

See proposal.md - Why. The reviews section today is a single file, `sections/reviews-section.liquid`,
paired with `assets/reviews-section.js`. Reviews are merchant-authored `review` blocks; each block
has one `image_picker` (`image`) and the section renders, filters, paginates, and enlarges those
photos. The JS holds per-section state (`filter`, `page`) on the root element, appends nothing at
runtime, and reads pre-rendered entries via `[data-rating]`. `assets/product-server-rating.js`
mirrors the section's aggregate by reading `data-rs-total`, `data-rs-avg`, and `data-rs-avg-pct`
off the root, then falls back to the summary markup.

Constraints:
- A Shopify theme cannot store submissions or uploaded files. There is no review app installed and
  the archived `add-reviews-section` change deliberately avoided one. So the section can only POST
  to an endpoint a merchant configures.
- Shopify block schemas have no list-of-images type; a block supports a fixed set of settings only.
- The section must stay readable and its existing controls must keep working without JavaScript.

## Goals / Non-Goals

**Goals:**
- A shopper-facing form (rating, name, email, text, up to three images) with a live thumbnail
  preview, client-side validation, and an app-agnostic submission adapter.
- Optimistic, client-side insertion of a submitted review into the existing list, reusing the
  section's existing filtering, pagination, and image-viewer behavior.
- Render up to three photos per review entry, for authored and submitted reviews alike.

**Non-Goals:**
- Installing, configuring, or building any specific review app or backend.
- Server-side moderation, storage, or deduplication of reviews.
- Reading reviews from an app, metafields, or metaobjects.

## Decisions

### App-agnostic endpoint adapter instead of a specific app's API
The section exposes settings for a submission endpoint URL and the request field names. The form
POSTs a `FormData` (multipart) payload using those names. Any review app, app proxy, or custom
endpoint that accepts that shape can be wired in later. Alternative considered: hard-code a named
app's API (e.g. TrustShop) - rejected because the app is not installed, its contract is unknown
here, and hard-coding would make the section app-specific. The endpoint defaults to empty; the form
then reports that submissions are not currently accepted.

### Keep the existing `image` setting and add `image_2` / `image_3`
Shopify blocks cannot hold a variable-length image list, so a review gains up to three fixed
`image_picker` settings. Keeping the existing `image` id preserves already-authored block content;
`image_2` and `image_3` are new. The section collects each non-blank picker in order into a photos
array per review and renders them together.

### Build the new review entry from a `<template>` and insert into the DOM
The Liquid renders one hidden `<template data-rs-new-review>` shaped exactly like a real
`.reviews-section__review` (stars with `--rs-rating-pct`, meta, body, and `[data-rs-photo-open]`
images). On success the JS clones it, fills the fields, assigns each attached image an object URL as
both the thumbnail `src` and the viewer `data-rs-full`, prepends it to `[data-rs-list]`, then
re-runs the existing `applyView`, so filtering and pagination treat it like any other entry. This
reuses the existing image-viewer delegation (`[data-rs-photo-open]`), which already queries photos at
open time and therefore sees the new entry with no extra wiring. Alternative considered: build the
markup with `createElement` strings - rejected as harder to keep visually in sync with the Liquid.

### Recompute the aggregate from the DOM after insertion
The section computes average, distribution, and pill counts from the rendered entries. After
inserting a new entry the JS recomputes them from `[data-rating]` (now including the new one),
updates the summary value, star fill, distribution bars, and pill counts, and rewrites
`data-rs-total` / `data-rs-avg` / `data-rs-avg-pct`. Rewriting the attributes keeps
`product-server-rating.js` in sync without touching that file.

### Validate and preview images client-side with object URLs
On selection the JS checks each file's type and size, appends accepted files to an internal list,
and renders a thumbnail from `URL.createObjectURL`. Remove revokes the URL and drops the file. Cap
the list at three; a fourth selection is refused with a message. Assumed limits (recorded as
assumptions, not fixed by the spec): accepted types `image/jpeg`, `image/png`, `image/webp`,
`image/gif`; maximum 5 MB per image.

### Form is hidden markup revealed by JS; submission is progressive enhancement only
The form is rendered `hidden` and revealed by the affordance button. Without JavaScript the button
does nothing but the rest of the section is untouched, satisfying the degradation requirement. All
error messages use `role="status"`/`aria-live` and `aria-invalid` + `aria-describedby`, so results
and field errors are announced.

### One script, section-scoped state
The form logic is added to `assets/reviews-section.js` and bound through the existing delegated
click/keydown listeners on the root, keeping theme-editor re-renders idempotent and avoiding a
second script.

## Risks / Trade-offs

- **[Endpoint CORS or contract mismatch]** → the adapter is generic and surfaces a clear failure
  message; the exact contract is documented in the settings info text so a merchant can match it.
- **[Optimistic entry is not persisted]** → it lives only in this page's DOM; on reload the list
  reflects whatever the endpoint stored. This is inherent to a theme-only client and is accepted.
- **[Object URL leak]** → every removed or reset image revokes its object URL, and a successful
  submit revokes URLs for images now represented only in the viewer.
- **[Aggregate drift between client and endpoint]** → the recomputed summary is optimistic; on
  reload the authored blocks and endpoint data are the source of truth.
- **[Schema change to review blocks]** → adding `image_2`/`image_3` is additive and leaves existing
  `image` content intact; rollback is removing the new settings and form.
- **[Multiple reviews sections on a page]** → all state and bindings are scoped to `[data-rs]`, so
  each section behaves independently.

## Migration Plan

No data migration: new settings are additive and `image` is unchanged. Deploy by updating the two
files. Rollback removes the form markup/settings and the form logic; authored reviews keep working.

## Open Questions

- The precise submission endpoint contract (field names, response shape) is deferred to whoever
  wires a backend; the settings expose it and the specs keep it generic.
- The exact accepted image types and size limit are implementation defaults that can be tuned
  without changing the specs.
