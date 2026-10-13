# Spec Delta

## ADDED Requirements

### Requirement: Review photos open an enlarged image viewer

Clicking a review photo in the reviews section SHALL open that photo enlarged in an overlay viewer, for both photos in the "Reviews with Images" gallery and photos rendered inside review entries. Opening the viewer SHALL NOT navigate the page or change the section's other controls.

#### Scenario: Open from a gallery thumbnail

- **WHEN** a shopper activates a photo in the "Reviews with Images" gallery
- **THEN** the image viewer opens showing that photo enlarged

#### Scenario: Open from a review-entry photo

- **WHEN** a shopper activates the photo shown inside a review entry
- **THEN** the image viewer opens showing that photo enlarged

#### Scenario: Opening does not navigate or alter the section

- **WHEN** the viewer opens from a review photo
- **THEN** the page does not navigate away and the gallery, filter pills, and review list are left as they were

### Requirement: Viewer navigation between review images

The viewer SHALL provide previous and next controls that move through the section's review photos. Movement SHALL be bounded by the set of photos, disabling the control that would move past an end. When only one review photo exists, the navigation controls SHALL be hidden or disabled.

#### Scenario: Next and previous move through the photos

- **WHEN** the viewer is open on a photo that has another photo after it and the shopper activates next
- **THEN** the viewer shows the following review photo, and activating previous shows the preceding one

#### Scenario: Movement is bounded at the ends

- **WHEN** the viewer shows the first review photo
- **THEN** the previous control is disabled, and when it shows the last photo the next control is disabled

#### Scenario: A single review photo

- **WHEN** the section contains only one review photo
- **THEN** the viewer shows it with navigation controls hidden or disabled

### Requirement: Viewer shows the reviewer caption

The viewer SHALL display the reviewer name associated with the currently viewed photo as a caption, and SHALL update that caption when the viewed image changes.

#### Scenario: Caption matches the viewed photo

- **WHEN** the viewer shows a review photo
- **THEN** it displays the reviewer name for that photo

#### Scenario: Caption updates on navigation

- **WHEN** the shopper moves the viewer to a different photo
- **THEN** the caption shows the reviewer name for the newly viewed photo

### Requirement: Closing the image viewer

The viewer SHALL close when the shopper activates its close control, presses Escape, or clicks the overlay outside the enlarged image. Closing SHALL return focus to the photo that opened it.

#### Scenario: Close control closes the viewer

- **WHEN** the viewer is open and the shopper activates the close control
- **THEN** the viewer closes and focus returns to the photo that opened it

#### Scenario: Escape closes the viewer

- **WHEN** the viewer is open and the shopper presses Escape
- **THEN** the viewer closes

#### Scenario: Backdrop click closes the viewer

- **WHEN** the viewer is open and the shopper clicks the overlay outside the enlarged image
- **THEN** the viewer closes

### Requirement: Accessible image viewer

The viewer SHALL expose an accessible name, move focus into the viewer when it opens and keep focus within it while open, and provide a text alternative for the enlarged image. The open, previous, next, and close controls SHALL be operable by keyboard and expose accessible names.

#### Scenario: Keyboard operation

- **WHEN** a keyboard-only user opens the viewer
- **THEN** they can move between photos and close the viewer using the keyboard

#### Scenario: Focus is contained and restored

- **WHEN** the viewer is open
- **THEN** keyboard focus stays within the viewer, and when it closes focus returns to the photo that opened it

#### Scenario: Enlarged image text alternative

- **WHEN** assistive technology encounters the enlarged photo
- **THEN** it announces a text alternative for the photo, such as the reviewer's name

### Requirement: Image viewer degrades without JavaScript

The image viewer SHALL be progressive enhancement. When JavaScript is unavailable, review photos SHALL remain visible in the gallery and in review entries and the section SHALL remain readable.

#### Scenario: JavaScript unavailable

- **WHEN** the section renders and its script does not run
- **THEN** every review photo is still visible in the gallery and in its review entry

### Requirement: Viewer leaves existing review controls unchanged

Providing the image viewer SHALL NOT change the behavior of the section's existing controls: the gallery previous/next scrolling, the star filter pills, and the review list pagination.

#### Scenario: Existing controls behave as before

- **WHEN** the image viewer is available and the shopper activates a gallery arrow, a star filter pill, or the review pagination
- **THEN** each control behaves exactly as it did before this change
