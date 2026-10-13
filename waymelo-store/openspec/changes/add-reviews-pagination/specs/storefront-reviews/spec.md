# Spec Delta

## ADDED Requirements

### Requirement: Review list pagination

In the "All Reviews" view, the review list SHALL display at most three review entries at a time. When more than three reviews are authored, the section SHALL present the list as multiple pages with exactly one page visible at a time.

#### Scenario: More than three reviews

- **WHEN** the section contains more than three reviews and the "All Reviews" view is active
- **THEN** only three review entries are visible and the rest are hidden until the shopper navigates to another page

#### Scenario: Fewer than four reviews

- **WHEN** the section contains three or fewer reviews
- **THEN** every review entry is visible on a single page and no page navigation is offered

#### Scenario: First page on load

- **WHEN** the section loads with more than three reviews
- **THEN** the first page (the first three reviews) is the visible page

### Requirement: Page navigation through the shared gallery controls

The section SHALL use its existing previous and next gallery controls (`data-rs-gallery-prev` and `data-rs-gallery-next`) to move the review list forward and backward by one page in the "All Reviews" view, in addition to their existing gallery behavior. The controls SHALL be rendered whenever paging is possible, including when no review includes an image.

#### Scenario: Next control advances a page

- **WHEN** more than one page of reviews exists and the shopper activates the next control
- **THEN** the review list shows the next three reviews

#### Scenario: Previous control returns a page

- **WHEN** the shopper is past the first page and activates the previous control
- **THEN** the review list shows the previous three reviews

#### Scenario: Controls available without review photos

- **WHEN** no authored review includes an image but the list has more than three reviews
- **THEN** the previous and next controls are rendered and page the review list

#### Scenario: Controls bounded by the page range

- **WHEN** the shopper is on the first page
- **THEN** the previous control is disabled, and when on the last page the next control is disabled

### Requirement: Pagination interaction with star filtering

Pagination SHALL apply only to the "All Reviews" view. While a star filter pill (5 through 1 star) is active, every review matching the selected rating SHALL be visible without pagination, regardless of how many match.

#### Scenario: Star filter shows all matching reviews

- **WHEN** the shopper selects a star filter pill and more than three reviews match that rating
- **THEN** all matching reviews are visible and no page navigation limits them

#### Scenario: Returning to All Reviews restores pagination

- **WHEN** the shopper returns to the "All Reviews" view after using a star filter
- **THEN** the list is paginated again and shows the first page

### Requirement: Accessible pagination controls

The previous and next controls SHALL expose accessible names that convey their role in moving between review pages, SHALL be operable by keyboard, and SHALL communicate their disabled state when a page boundary is reached.

#### Scenario: Keyboard operation

- **WHEN** a keyboard-only user focuses the previous or next control
- **THEN** activating it changes the visible review page

#### Scenario: Disabled state is conveyed

- **WHEN** a control cannot move the list because the page boundary is reached
- **THEN** the control is marked disabled so assistive technology reports it as unavailable

### Requirement: Review list remains readable without JavaScript

Before the section script runs, or when JavaScript is unavailable, all authored review entries SHALL be present in the document and visible; pagination SHALL be applied only as progressive enhancement.

#### Scenario: JavaScript unavailable

- **WHEN** the section renders and its script does not run
- **THEN** every authored review entry is visible and no review is hidden by pagination
