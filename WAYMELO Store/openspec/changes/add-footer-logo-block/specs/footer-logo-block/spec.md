# Spec Delta

## Purpose

A merchant-configurable storefront footer block that renders the store logo as a centered focal point and, optionally, groups the "Follow on shop" button with it.

## ADDED Requirements

### Requirement: Configurable logo block

The footer section SHALL provide a block type that holds a merchant-configurable logo image, a logo width, and an enable toggle for a "Follow on shop" button.

#### Scenario: Merchant configures the block

- **WHEN** a merchant adds the logo block and sets a logo image, a logo width, and enables the follow button
- **THEN** the block stores those values and the storefront applies them to the rendered logo block

#### Scenario: Block settings are labeled

- **WHEN** a merchant views the logo block in the theme editor
- **THEN** the block exposes an image picker, a width setting, and a follow-button checkbox, each with a readable label

### Requirement: Logo block renders in a centered content-area row

The footer SHALL render the logo block, when present, as a full-width centered row inside the footer's content top area, before the existing blocks wrapper and newsletter column.

#### Scenario: Block is present

- **WHEN** the footer section contains the logo block
- **THEN** the footer content top area contains a `footer__logo-block` container rendered before the blocks wrapper and newsletter column
- **AND** the container's contents are horizontally centered

#### Scenario: Block is absent

- **WHEN** the footer section contains no logo block
- **THEN** the footer renders no `footer__logo-block` container and the rest of the footer is unchanged

### Requirement: Logo renders at the configured width

The logo block SHALL render the configured logo image at no more than the merchant-set width, capped to the available container width on small screens.

#### Scenario: Configured width is applied

- **WHEN** a logo image and a width are set
- **THEN** the rendered logo image does not exceed the configured width
- **AND** on a narrow viewport the logo shrinks to fit instead of overflowing the container

#### Scenario: No logo image configured

- **WHEN** the block has no logo image set
- **THEN** the block does not render an image element and does not render a broken-image placeholder

### Requirement: Logo image exposes an accessible name

Each rendered logo image SHALL provide a non-empty text alternative so assistive technology does not encounter an unlabeled image.

#### Scenario: Screen reader announces the logo

- **WHEN** a user navigates the footer with a screen reader and the logo block renders an image
- **THEN** the logo image exposes a non-empty alt text, falling back to the shop name when the picked image has no alt text

### Requirement: Optional follow-on-shop button grouped with the logo

When the block's follow toggle is on and the platform exposes the follow feature, the logo block SHALL render the "Follow on shop" button within the same centered row as the logo.

#### Scenario: Follow toggle is on

- **WHEN** the block's follow toggle is on and the platform exposes the follow feature
- **THEN** the logo block renders a "Follow on shop" button in the same container as the logo

#### Scenario: Follow toggle is off

- **WHEN** the block's follow toggle is off
- **THEN** the logo block does not render a "Follow on shop" button and the logo is unaffected

### Requirement: Centered logo block does not disturb the footer grid

The logo block SHALL be excluded from the footer's standard blocks grid and from the count that drives its column layout, so adding the block does not change the grid-column classes of the other blocks.

#### Scenario: Other blocks keep their layout

- **WHEN** the logo block is added to or removed from the footer alongside other blocks
- **THEN** the footer blocks wrapper renders with the same grid-column classes as before
- **AND** the logo block does not appear as a grid item inside the blocks wrapper

### Requirement: Existing footer behavior is unchanged

Adding the logo block SHALL NOT alter the rendering of existing footer content: payment icons, localization selectors, newsletter form, the existing edge-of-footer follow-on-shop button, social icons, policy links, copyright, and the image badges and trust logos blocks.

#### Scenario: Existing footer regions render as before

- **WHEN** the logo block is added or removed
- **THEN** the payment icon list, localization selectors, newsletter form, existing follow-on-shop button, social icons, policy links, copyright, image badges, and trust logos render with the same visibility and content as before
