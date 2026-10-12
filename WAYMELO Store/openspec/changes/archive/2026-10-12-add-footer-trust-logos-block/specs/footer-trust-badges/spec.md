# Spec Delta

## Purpose

Merchant-configurable trust and protection signals in the storefront footer, including image badges and the Trustpilot + DMCA "Trust logos" block rendered in the footer's bottom info column.

## ADDED Requirements

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
