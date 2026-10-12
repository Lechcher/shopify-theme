# footer-trust-badges Specification

## Purpose

Merchant-configurable trust and protection image badges in the storefront footer: a footer block that renders up to two linked badge images whose image, link, width, and height are set by the merchant.

## Requirements

### Requirement: Configurable image badges block

The footer section SHALL provide a block type that holds settings for two image badges, and each badge SHALL expose a merchant-configurable image, link, width, and height.

#### Scenario: Merchant configures both badges

- **WHEN** a merchant adds the image badges block and sets an image, link, width, and height for each of the two badges
- **THEN** the block stores those values and the storefront applies them to the rendered badges

#### Scenario: Block settings are labeled

- **WHEN** a merchant views the image badges block in the theme editor
- **THEN** the block lists two badges and each exposes an image picker, a link setting, a width setting, and a height setting with readable labels

### Requirement: Badges render in the footer info column

The footer SHALL render the image badges block inside the footer's bottom info column, wrapped by a single parent container using the `footer__images_badges` class.

#### Scenario: Block is present

- **WHEN** the footer section contains the image badges block
- **THEN** the footer's bottom info column contains a `footer__images_badges` container
- **AND** the container holds a linked image element for each configured badge

#### Scenario: Block is absent

- **WHEN** the footer section contains no image badges block
- **THEN** the footer renders no `footer__images_badges` container and the rest of the footer is unchanged

### Requirement: Vertical badge layout with adjustable spacing

The image badges container SHALL lay the badges out in a vertical column, centered horizontally and aligned to the bottom, and SHALL apply a merchant-configurable spacing between the badges.

#### Scenario: Badges stack vertically and centered

- **WHEN** two badges are configured
- **THEN** they render stacked vertically in a single column, horizontally centered within the container, and aligned to its bottom edge

#### Scenario: Merchant adjusts spacing

- **WHEN** the merchant changes the badge spacing setting
- **THEN** the vertical gap between the rendered badges reflects the configured value

### Requirement: Each badge renders a linked image at configured size

Each configured badge SHALL render its image at the merchant-set width and height, and SHALL wrap the image in an anchor pointing at the merchant-set link.

#### Scenario: Configured size and link are applied

- **WHEN** a badge has an image, a link, a width, and a height set
- **THEN** the image is rendered at the configured width and height
- **AND** the image is wrapped in an anchor whose href is the configured link

#### Scenario: Badge without a link

- **WHEN** a badge has an image but no link
- **THEN** the badge image is still rendered at the configured size without an anchor

### Requirement: Empty badge slots are omitted

A badge slot with no image SHALL NOT render an image, an anchor, or an empty placeholder in the footer.

#### Scenario: Only one badge configured

- **WHEN** the first badge has an image and the second badge has no image
- **THEN** only the first badge is rendered inside the container and no element is rendered for the second

#### Scenario: No badge images configured

- **WHEN** neither badge slot has an image
- **THEN** the container renders without badge images and without errors

### Requirement: Badge images expose an accessible name

Each rendered badge image SHALL provide a non-empty text alternative so assistive technology does not encounter an unlabeled image or link.

#### Scenario: Screen reader announces a badge

- **WHEN** a user navigates the footer with a screen reader and a badge is rendered
- **THEN** the badge image exposes a non-empty alt text and its link is announced with an accessible name

### Requirement: Footer degrades safely when a badge image fails to load

If a badge image cannot be fetched, the footer MUST continue to render its remaining content without errors and without breaking the footer layout.

#### Scenario: Badge image fails to load

- **WHEN** a configured badge image cannot be fetched
- **THEN** the rest of the footer still renders and the other elements of the footer are not disrupted

### Requirement: Configurable trust logos block

The footer section SHALL provide a block type that renders a Trustpilot line and a DMCA protected tag, and each signal SHALL expose a merchant-configurable enable toggle, link URL, and text content.

#### Scenario: Merchant configures both signals

- **WHEN** a merchant adds the trust logos block and sets the Trustpilot link, label, rating text, and review count, and the DMCA link and tag text
- **THEN** the block stores those values and the storefront renders the Trustpilot line and DMCA tag with them

#### Scenario: Block settings are labeled

- **WHEN** a merchant views the trust logos block in the theme editor
- **THEN** the block lists the Trustpilot and DMCA signals and each exposes its link and text settings with readable labels

### Requirement: Trustpilot line renders its configured content

When enabled, the Trustpilot signal SHALL render an anchor containing a star icon, the configured label, the configured rating text, and the configured review count, linking to the configured Trustpilot URL.

#### Scenario: Trustpilot line shows all configured fields

- **WHEN** the Trustpilot signal is enabled with a URL, label, rating, and review count
- **THEN** the rendered line contains a star icon, the label, the rating text, and the review count
- **AND** the line is an anchor whose href is the configured URL

#### Scenario: Trustpilot signal disabled

- **WHEN** the Trustpilot signal is disabled
- **THEN** the Trustpilot line is not rendered and the DMCA tag is unaffected

### Requirement: DMCA tag renders its configured content

When enabled, the DMCA signal SHALL render an anchor containing the configured left and right tag labels, linking to the configured DMCA URL, visually presented as a single protected tag.

#### Scenario: DMCA tag shows configured labels

- **WHEN** the DMCA signal is enabled with a URL and left and right tag labels
- **THEN** the rendered tag contains the left and right labels and is an anchor whose href is the configured URL

#### Scenario: DMCA signal disabled

- **WHEN** the DMCA signal is disabled
- **THEN** the DMCA tag is not rendered and the Trustpilot line is unaffected

### Requirement: Trust logos render in the footer info column

The footer SHALL render the trust logos block inside the footer's bottom info column, after the image badges, wrapped by a container using the `footer-trust-logos-simple` class.

#### Scenario: Block is present

- **WHEN** the footer section contains the trust logos block
- **THEN** the footer's bottom info column contains a `footer-trust-logos-simple` container positioned after any image badges
- **AND** the container holds the enabled trust signals

#### Scenario: Block is absent

- **WHEN** the footer section contains no trust logos block
- **THEN** the footer renders no `footer-trust-logos-simple` container and the rest of the footer is unchanged

### Requirement: Trust links are safe and accessible

Each rendered trust link SHALL open in a new tab with `rel="noopener"` and SHALL expose a non-empty accessible name.

#### Scenario: Link opens safely

- **WHEN** a shopper activates the Trustpilot line or the DMCA tag
- **THEN** the link opens in a new tab
- **AND** the anchor declares `rel="noopener"`

#### Scenario: Assistive technology announces the link

- **WHEN** a user navigates the footer with a screen reader
- **THEN** each trust link is announced with a non-empty name identifying it

### Requirement: Existing footer behavior is unchanged

Adding the trust logos block SHALL NOT alter the rendering of existing footer content: payment icons, localization selectors, newsletter form, follow-on-shop button, social icons, policy links, copyright, and the image badges block.

#### Scenario: Existing footer regions render as before

- **WHEN** the trust logos block is added or removed
- **THEN** the payment icon list, localization selectors, newsletter form, follow-on-shop button, social icons, policy links, copyright, and image badges render with the same visibility and content as before
