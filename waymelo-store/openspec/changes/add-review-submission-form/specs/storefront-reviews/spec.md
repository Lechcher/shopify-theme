# Spec Delta

## MODIFIED Requirements

### Requirement: Review entries render merchant content

The reviews section SHALL render one review entry for each `review` block authored by the merchant, showing the entry's star rating, reviewer name, date, body text, and up to three photos when provided.

#### Scenario: Review entry shows all provided fields

- **WHEN** a review block has a rating, author, date, body, and one or more images
- **THEN** the rendered entry shows the star rating, reviewer name, date, body text, and each review photo

#### Scenario: Review entry with multiple photos

- **WHEN** a review block has more than one image, up to the maximum of three
- **THEN** the entry renders every provided photo

#### Scenario: Review without a photo

- **WHEN** a review block has no image
- **THEN** the entry renders its rating, author, date, and body without a photo element

#### Scenario: Section with no reviews

- **WHEN** the section contains no review blocks
- **THEN** the section renders without review entries and without errors

### Requirement: Reviews-with-images gallery

The section SHALL render a gallery containing each photo of every review that includes at least one image, with previous and next controls that scroll the gallery horizontally.

#### Scenario: Gallery shows only reviews with photos

- **WHEN** some reviews include an image and others do not
- **THEN** the gallery contains an item for each review image and none for reviews without images

#### Scenario: Gallery includes every photo of a multi-photo review

- **WHEN** a review includes more than one image
- **THEN** the gallery contains an item for each of that review's images

#### Scenario: Gallery controls scroll the photos

- **WHEN** a shopper activates the next or previous control
- **THEN** the gallery scrolls toward the corresponding direction

#### Scenario: No review photos

- **WHEN** no authored review includes an image
- **THEN** the gallery region renders empty or hidden and the rest of the section renders normally
