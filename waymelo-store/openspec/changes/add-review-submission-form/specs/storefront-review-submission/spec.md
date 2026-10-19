# Spec Delta

## Purpose

Lets shoppers write a review and attach up to three images from within the reviews section,
validating their input and submitting it through a merchant-configurable endpoint, then reflecting
the submitted review in the review list.

## ADDED Requirements

### Requirement: Submitting a review is offered from the reviews section

The reviews section SHALL present a "Write a review" affordance that reveals a review submission
form when activated, and the form SHALL be hidden until then.

#### Scenario: Opening the form

- **WHEN** a shopper activates the "Write a review" affordance
- **THEN** the review submission form is revealed

#### Scenario: A form control can close the form

- **WHEN** the form is open and the shopper activates its cancel or close control
- **THEN** the form is hidden again and the section's other content is unchanged

### Requirement: Review submission form fields

The form SHALL provide a required star rating, a required reviewer name, an optional email field,
a required review text field, and an image attachment control that accepts up to three images.

#### Scenario: All fields are present

- **WHEN** the form is open
- **THEN** it shows a star rating control, a name field, an email field, a review text field, and an image attachment control

#### Scenario: Email is optional

- **WHEN** the shopper submits a review with rating, name, and text but no email
- **THEN** the submission is accepted without an email validation error

### Requirement: Client-side validation of required fields

The form SHALL reject submission and show inline, accessible error messages when the star rating is
missing or the review text is empty or contains only whitespace.

#### Scenario: Missing rating

- **WHEN** the shopper submits the form with no star rating selected
- **THEN** submission is blocked and an error is shown identifying the rating as required

#### Scenario: Empty review text

- **WHEN** the shopper submits the form with review text that is empty or only whitespace
- **THEN** submission is blocked and an error is shown identifying the review text as required

### Requirement: Client-side validation of the email field

When an email is provided, the form SHALL reject submission and show an inline error when the value
is not a valid email address.

#### Scenario: Invalid email is rejected

- **WHEN** the shopper submits the form with a non-empty email that is not a valid email address
- **THEN** submission is blocked and an error is shown identifying the email as invalid

### Requirement: Attaching up to three images

The image attachment control SHALL allow the shopper to attach at most three images. Attempting to
attach a fourth image SHALL NOT add it, and the form SHALL tell the shopper the limit is three.

#### Scenario: Three images allowed

- **WHEN** the shopper attaches three images
- **THEN** all three are attached to the review

#### Scenario: A fourth image is refused

- **WHEN** three images are already attached and the shopper selects another image
- **THEN** the fourth image is not attached and the shopper is told at most three images are allowed

### Requirement: Image thumbnail preview with removal

For each attached image, the form SHALL show a thumbnail preview of the selected file and a control
to remove it, and removing an image SHALL remove its preview and detach the file from the review.

#### Scenario: Preview appears for each attachment

- **WHEN** the shopper attaches an image
- **THEN** a thumbnail preview of that image is shown in the form

#### Scenario: Removing an attachment

- **WHEN** the shopper activates the remove control for an attached image
- **THEN** that image's preview is removed and the image is no longer part of the review

### Requirement: Image type and size validation

The form SHALL refuse images that are not of an accepted image type or that exceed the accepted size
limit, and SHALL show an inline error naming the offending file.

#### Scenario: Unsupported file type

- **WHEN** the shopper selects a file that is not an accepted image type
- **THEN** the file is not attached and an error is shown naming that file

#### Scenario: Oversized image

- **WHEN** the shopper selects an image larger than the accepted size limit
- **THEN** the file is not attached and an error is shown naming that file

### Requirement: Configurable submission endpoint adapter

The section SHALL expose a merchant-configurable submission endpoint and field-name settings, and
SHALL submit the review to that endpoint using the configured field names. The adapter SHALL NOT
depend on any specific review app, so any app or app proxy that honors the same contract can be used.

#### Scenario: Submission targets the configured endpoint

- **WHEN** a merchant sets a submission endpoint and the shopper submits a valid review
- **THEN** the review's rating, name, email, text, and images are sent to that endpoint

#### Scenario: No endpoint configured

- **WHEN** no submission endpoint is configured and the shopper submits a valid review
- **THEN** the form does not send the review and the shopper is told submissions are not currently accepted

### Requirement: Submission payload includes the review and its images

The submission SHALL send the review's rating, name, email, text, and each attached image as
multipart form data using the configured field names.

#### Scenario: Images travel with the review

- **WHEN** the shopper submits a valid review with attached images
- **THEN** the request body includes each attached image alongside the review's text fields

### Requirement: Submission success feedback

On a successful submission, the form SHALL show a confirmation message and reset, and the section
SHALL prevent an accidental duplicate submission while a submission is in progress.

#### Scenario: Success confirmation

- **WHEN** the endpoint accepts the submission
- **THEN** the form shows a success message and its fields and attachments are cleared

#### Scenario: Duplicate submissions are prevented

- **WHEN** the shopper submits and the request is still in progress
- **THEN** activating the submit control again does not send the review a second time

### Requirement: Submission error feedback

When the submission fails, the form SHALL show an error message that the review could not be
submitted and SHALL keep the shopper's entered content and attachments so they can retry.

#### Scenario: Endpoint failure

- **WHEN** the submission request fails or the endpoint returns an error
- **THEN** the form shows an error message and the entered review text and attached images remain

### Requirement: Submitted review appears in the list immediately

On a successful submission, the section SHALL optimistically append the submitted review to the top
of the review list, showing its star rating, reviewer name, review text, and a preview of each
attached image, without reloading the page.

#### Scenario: New review appears at the top

- **WHEN** the shopper submits a valid review successfully
- **THEN** a new review entry showing the submitted rating, name, text, and images appears at the top of the review list

#### Scenario: New review images open in the viewer

- **WHEN** the newly appended review shows an attached image and the shopper activates it
- **THEN** the section's image viewer opens showing that image

### Requirement: Filter and pagination stay correct after a submission

After a submitted review is appended, the section SHALL re-apply the active star filter and
pagination, so the list remains consistent with its current filter and page.

#### Scenario: Summary and pill counts update

- **WHEN** a submitted review is appended
- **THEN** the rating summary and the filter pill counts include the new review

#### Scenario: Active filter is respected

- **WHEN** a star filter is active and a submitted review has a different rating
- **THEN** the appended review is hidden by the filter, matching the existing filtering behavior

### Requirement: Accessible review submission form

The form SHALL associate every field with a label, mark invalid fields programmatically, associate
error messages with their fields, convey the submission result to assistive technology, and be fully
operable by keyboard.

#### Scenario: Errors are associated with fields

- **WHEN** a field fails validation
- **THEN** the field is marked invalid and its error message is programmatically associated with it

#### Scenario: Result is announced

- **WHEN** a submission succeeds or fails
- **THEN** the result message is exposed to assistive technology as a status update

#### Scenario: Keyboard operation

- **WHEN** a keyboard-only user opens the form
- **THEN** they can complete every field, attach and remove images, and submit using the keyboard

### Requirement: Review submission degrades without JavaScript

The section SHALL remain fully readable and its existing controls SHALL continue to work when
JavaScript is unavailable; the submission form SHALL NOT prevent the rest of the section from
rendering.

#### Scenario: JavaScript unavailable

- **WHEN** the section renders and its script does not run
- **THEN** the existing review summary, gallery, filters, list, and pagination remain rendered and readable
