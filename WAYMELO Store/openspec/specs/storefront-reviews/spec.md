# storefront-reviews Specification

## Purpose

Displays merchant-configured customer reviews on the storefront: an aggregate rating summary with a star distribution, a gallery of review photos, star-based filtering of the review list, and the individual review entries themselves.

## Requirements

### Requirement: Review entries render merchant content

The reviews section SHALL render one review entry for each `review` block authored by the merchant, showing the entry's star rating, reviewer name, date, body text, and photo when one is provided.

#### Scenario: Review entry shows all provided fields

- **WHEN** a review block has a rating, author, date, body, and image
- **THEN** the rendered entry shows the star rating, reviewer name, date, body text, and the review photo

#### Scenario: Review without a photo

- **WHEN** a review block has no image
- **THEN** the entry renders its rating, author, date, and body without a photo element

#### Scenario: Section with no reviews

- **WHEN** the section contains no review blocks
- **THEN** the section renders without review entries and without errors

### Requirement: Aggregate rating summary

The section SHALL compute and display an average star rating and the total number of reviews from the authored review blocks.

#### Scenario: Summary reflects authored reviews

- **WHEN** the section contains reviews with ratings
- **THEN** the displayed average equals the mean of those ratings
- **AND** the displayed total equals the number of review blocks

### Requirement: Star distribution breakdown

The section SHALL display, for each star level from 5 down to 1, a bar whose filled proportion represents that level's share of the total review count.

#### Scenario: Distribution reflects rating mix

- **WHEN** the section contains an equal number of 5-star and 4-star reviews and no others
- **THEN** the 5-star bar is half filled and the 4-star bar is half filled
- **AND** the 3-, 2-, and 1-star bars are empty

### Requirement: Filter pills with counts

The section SHALL render a filter pill for "All Reviews" and for each star level from 5 to 1, each pill showing the number of authored reviews at that level, and the "All Reviews" pill showing the total count.

#### Scenario: Pill counts match the authored reviews

- **WHEN** the section contains a mix of ratings
- **THEN** each star pill shows the count of reviews with that rating
- **AND** the "All Reviews" pill shows the total count
- **AND** star levels with no reviews show a count of zero

### Requirement: Filtering the review list by star rating

Choosing a filter pill SHALL limit the visible review entries to reviews at the selected star level, and choosing "All Reviews" SHALL make every authored review entry visible again.

#### Scenario: Filter to a single star level

- **WHEN** a shopper selects the "4 Star" pill
- **THEN** only review entries with a 4-star rating remain visible
- **AND** the selected pill is visually distinguished from the others

#### Scenario: Reset the filter

- **WHEN** a shopper selects "All Reviews"
- **THEN** every authored review entry is visible

### Requirement: Reviews-with-images gallery

The section SHALL render a gallery containing the photos of reviews that include an image, with previous and next controls that scroll the gallery horizontally.

#### Scenario: Gallery shows only reviews with photos

- **WHEN** some reviews include an image and others do not
- **THEN** the gallery contains an item for each review image and none for reviews without images

#### Scenario: Gallery controls scroll the photos

- **WHEN** a shopper activates the next or previous control
- **THEN** the gallery scrolls toward the corresponding direction

#### Scenario: No review photos

- **WHEN** no authored review includes an image
- **THEN** the gallery region renders empty or hidden and the rest of the section renders normally

### Requirement: Verified purchase label

A review marked as verified SHALL display a "Verified Purchase" label, and a review not marked verified SHALL NOT display that label.

#### Scenario: Verified review is labeled

- **WHEN** a review block is marked verified
- **THEN** its entry shows a "Verified Purchase" label

#### Scenario: Unverified review is not labeled

- **WHEN** a review block is not marked verified
- **THEN** its entry does not show the "Verified Purchase" label

### Requirement: Accessible interactive controls

Filter pills and gallery controls SHALL be operable by keyboard and expose accessible names, and each entry's star rating SHALL expose a text equivalent for assistive technology.

#### Scenario: Keyboard operation

- **WHEN** a keyboard-only user focuses the filter pills or gallery controls
- **THEN** they can activate them to change the visible reviews or the gallery position

#### Scenario: Rating text alternative

- **WHEN** assistive technology encounters a review entry's star rating
- **THEN** it announces the rating as text, such as "5 out of 5 stars"

### Requirement: Merchant styling and layout controls

The section SHALL expose merchant settings for colors, section width, and vertical padding, and SHALL apply those settings to the rendered output.

#### Scenario: Merchant settings are applied

- **WHEN** the merchant changes the section's color, width, or padding settings
- **THEN** the rendered section reflects those values

### Requirement: Existing review components are unaffected

Adding the reviews section SHALL NOT change the rendering of the existing product review blocks, the review carousel block, the review stars block, or the Testimonials section.

#### Scenario: Existing review UI renders as before

- **WHEN** the new section is available and the existing review blocks and sections are still used
- **THEN** those existing review blocks and sections render with the same content and layout as before this change

### Requirement: Review list pagination

In the "All Reviews" view, the review list SHALL display at most three review entries at a time. When more than three reviews are authored, the section SHALL present the list as multiple pages with exactly one page visible at a time.

#### Scenario: More than three reviews

- **WHEN** the section contains more than three reviews and the "All Reviews" view is active
- **THEN** only three review entries are visible and the rest are hidden until the shopper moves to another page

#### Scenario: Three or fewer reviews

- **WHEN** the section contains three or fewer reviews
- **THEN** every review entry is visible on a single page

#### Scenario: First page on load

- **WHEN** the section loads with more than three reviews
- **THEN** the first page (the first three reviews) is the visible page

### Requirement: Dedicated review pagination control

The section SHALL render a pagination control below the review list entries, separate from the gallery controls. The control SHALL be present only when the review list has more than one page in the active view.

#### Scenario: Control appears below the list

- **WHEN** the "All Reviews" view has more than three reviews
- **THEN** a pagination control is rendered below the review list entries

#### Scenario: Control hidden for a single page

- **WHEN** every review entry fits on one page
- **THEN** no review pagination control is shown

#### Scenario: Previous and next move one page

- **WHEN** the shopper activates the next control and a further page exists
- **THEN** the review list shows the next three reviews
- **AND** when the shopper activates the previous control and an earlier page exists, the review list shows the previous three reviews

#### Scenario: Controls bounded by the page range

- **WHEN** the shopper is on the first page
- **THEN** the previous control is disabled, and when on the last page the next control is disabled

### Requirement: Page position indicator

The pagination control SHALL display the current page number and the total number of pages, and SHALL update whenever the visible page changes.

#### Scenario: Indicator reflects the current page

- **WHEN** the review list has three pages and the shopper moves to the second page
- **THEN** the pagination control shows a "Page 2 of 3" style indicator

### Requirement: Pagination interaction with star filtering

Review pagination SHALL apply only to the "All Reviews" view. While a star filter pill (5 through 1 star) is active, every review matching the selected rating SHALL be visible without pagination, regardless of how many match, and the pagination control SHALL be hidden.

#### Scenario: Star filter shows all matching reviews

- **WHEN** the shopper selects a star filter pill and more than three reviews match that rating
- **THEN** all matching reviews are visible and no review pagination control limits them

#### Scenario: Returning to All Reviews restores pagination

- **WHEN** the shopper returns to the "All Reviews" view after using a star filter
- **THEN** the list is paginated again and shows the first page

### Requirement: Gallery controls do not page the review list

The gallery previous and next controls SHALL affect only the image gallery and SHALL NOT change the visible review page.

#### Scenario: Gallery control leaves the review page unchanged

- **WHEN** the review list has more than one page and the shopper activates a gallery previous or next control
- **THEN** the gallery scrolls and the visible review page does not change

### Requirement: Accessible pagination controls

The previous and next controls SHALL expose accessible names that convey their role in moving between review pages, SHALL be operable by keyboard, and SHALL communicate their disabled state when a page boundary is reached. The page indicator SHALL expose the current and total pages to assistive technology.

#### Scenario: Keyboard operation

- **WHEN** a keyboard-only user focuses the previous or next control
- **THEN** activating it changes the visible review page

#### Scenario: Disabled state is conveyed

- **WHEN** a control cannot move the list because the page boundary is reached
- **THEN** the control is marked disabled so assistive technology reports it as unavailable

#### Scenario: Indicator is announced

- **WHEN** assistive technology encounters the page indicator
- **THEN** it conveys the current page and the total number of pages

### Requirement: Review list remains readable without JavaScript

Before the section script runs, or when JavaScript is unavailable, all authored review entries SHALL be present in the document and visible; pagination SHALL be applied only as progressive enhancement.

#### Scenario: JavaScript unavailable

- **WHEN** the section renders and its script does not run
- **THEN** every authored review entry is visible and no review is hidden by pagination
