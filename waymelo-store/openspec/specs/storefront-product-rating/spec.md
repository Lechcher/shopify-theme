# storefront-product-rating Specification

## Purpose

Shows a compact review-rating teaser in the main product section — five stars filled to the
average rating plus the review count — that reflects the on-page reviews summary and links the
shopper to that reviews section.

## Requirements

### Requirement: Product-page rating teaser

The main product section SHALL render a `product-server-rating` block as a single link showing
five stars filled to the average rating percentage followed by the total review count in
parentheses, when the block is placed in the section.

#### Scenario: Rating block shows stars and count

- **WHEN** the block is placed in the main product section and the page has an average rating of 4.8 from 10 reviews
- **THEN** the block renders five stars filled to 96% and the text `(10)`

#### Scenario: Block omittable

- **WHEN** the merchant does not place the block in the section
- **THEN** no rating teaser renders and the rest of the product section is unchanged

### Requirement: Teaser reflects the on-page reviews summary

The teaser's star fill and review count SHALL equal the average rating and total review count of
the reviews section on the same page, and SHALL update when that summary changes (for example
after a theme-editor block change).

#### Scenario: Teaser matches the reviews section

- **WHEN** the reviews section computes an average of 4.9 from 8 reviews
- **THEN** the teaser's stars are filled to 98% and its count reads `(8)`

#### Scenario: Summary changes after an editor update

- **WHEN** a review block's rating is changed in the theme editor and the section re-renders
- **THEN** the teaser's stars and count reflect the new average and total without a full page reload

### Requirement: Teaser links to the reviews section

The teaser SHALL be a link to the on-page reviews section, and the reviews section SHALL expose a
stable anchor target so the link scrolls to the reviews.

#### Scenario: Activating the teaser scrolls to reviews

- **WHEN** a shopper activates the rating teaser
- **THEN** the page navigates to the reviews section's anchor target

#### Scenario: Anchor target present

- **WHEN** the reviews section renders on the page
- **THEN** it exposes the `trustshop-review` anchor id targeted by the teaser

### Requirement: Graceful behavior without a reviews summary

When the page has no reviews section, or the reviews section has no reviews, the teaser SHALL NOT
display a fabricated or stale rating or count.

#### Scenario: No reviews section on the page

- **WHEN** the main product section renders on a page that includes no reviews section
- **THEN** the teaser does not show a rating or count value

#### Scenario: Reviews section with zero reviews

- **WHEN** the reviews section contains no review blocks
- **THEN** the teaser does not show a rating or count value

#### Scenario: JavaScript unavailable

- **WHEN** the sync script does not run
- **THEN** the teaser remains present without displaying an incorrect rating or count

### Requirement: Accessible rating link

The teaser SHALL expose an accessible name conveying the rating out of five and the number of
reviews, SHALL be operable with a keyboard, and SHALL NOT rely on color alone to convey meaning.

#### Scenario: Accessible name conveys the rating

- **WHEN** assistive technology encounters the teaser
- **THEN** it announces the average rating out of five and the number of reviews, such as "4.8 out of 5 stars, 10 reviews"

#### Scenario: Keyboard operation

- **WHEN** a keyboard-only user focuses and activates the teaser
- **THEN** the page navigates to the reviews section

### Requirement: Star fill driven by a rating percentage

The teaser's star fill SHALL be rendered from a percentage custom property representing the
average rating, so the filled portion tracks the average continuously rather than in whole stars.

#### Scenario: Partial average fills proportionally

- **WHEN** the average rating is 4.5
- **THEN** the stars are filled to 90% rather than to four or five whole stars
