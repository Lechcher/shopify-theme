# Spec Delta

## ADDED Requirements

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
