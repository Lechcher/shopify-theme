# Spec Delta

## Purpose

A product-page stacked bundle-selector block that renders merchant-configured option rows (title, percentage-off badge, tag pill, sale text, price, and ribbon) as a selectable list whose selection drives the product add-to-cart quantity.

## ADDED Requirements

### Requirement: Configurable bundle-stack block

The BKY - Main Product section SHALL provide a `bundle_stack` block type with settings for the number of options, per-option content, a default selection, and row design/typography.

#### Scenario: Merchant configures the block

- **WHEN** a merchant adds the `bundle_stack` block and sets the option count and per-option content
- **THEN** the block stores those values and the storefront applies them to the rendered option rows

#### Scenario: Block settings are labeled

- **WHEN** a merchant views the `bundle_stack` block in the theme editor
- **THEN** the block exposes readable labels for the option count, per-option content fields, default selection, and design settings

### Requirement: Option count controls rendered rows

The block SHALL render one option row for each enabled option from 1 up to the configured option count, and SHALL NOT render rows beyond that count.

#### Scenario: Fewer than the maximum count

- **WHEN** the option count is set to 2 on a block whose schema supports up to 3
- **THEN** exactly two option rows render

#### Scenario: Option with no title

- **WHEN** an option within the configured count has no title set
- **THEN** that option does not render a row

### Requirement: Option row renders configured content

Each rendered option row SHALL show a selection indicator, its configured title, and its configured price, and SHALL additionally show an optional percentage-off badge, tag pill, sale text, struck-through compare-at price, and corner ribbon when those are set.

#### Scenario: Full option content

- **WHEN** an option has a title, badge, tag, sale text, price, compare-at price, and ribbon
- **THEN** the row renders the selection indicator and all of those elements

#### Scenario: Optional elements omitted

- **WHEN** an option has no badge, no tag, no sale text, no compare-at price, or no ribbon
- **THEN** the row omits each corresponding element and renders the remaining content without gaps or broken placeholders

#### Scenario: Title supports emoji

- **WHEN** an option title includes emoji or other Unicode characters
- **THEN** the row renders the title text and emoji as entered

### Requirement: Selecting an option drives the add-to-cart quantity

Activating an option row SHALL mark it selected, deselect the other rows, and set the product's add-to-cart quantity to that option's configured quantity.

#### Scenario: Selecting an option

- **WHEN** a shopper activates an option row
- **THEN** that row becomes visually selected and the other rows are deselected
- **AND** the product's add-to-cart quantity becomes that option's configured quantity

#### Scenario: Quantity is applied to the product form

- **WHEN** an option is selected and the product form exposes a quantity input
- **THEN** the quantity input's value is set to the option quantity and a change is propagated so dependent UI updates

### Requirement: Preselected option

The block SHALL preselect the option named by the default-selection setting and apply its quantity when the block loads.

#### Scenario: Default selection on load

- **WHEN** the block loads with a default selection set
- **THEN** that option row is selected and its quantity is applied to the product form

#### Scenario: Default selection falls back safely

- **WHEN** the configured default selection points to an option that does not render, or no default is set
- **THEN** no option is preselected and the product quantity is left unchanged

### Requirement: Accessible option rows

Each option row SHALL be operable by keyboard and expose an accessible name and selected state.

#### Scenario: Keyboard operation

- **WHEN** a keyboard-only user focuses an option row
- **THEN** they can activate it to select that option

#### Scenario: Selected state is conveyed

- **WHEN** an option row is selected
- **THEN** its selected state is exposed to assistive technology

### Requirement: Merchant styling is applied

The block SHALL expose merchant settings for selected and unselected row background, border color and width, corner radius, title, badge, tag, sale text, price, compare-at, and ribbon colors and sizes, and SHALL apply them to the rendered rows.

#### Scenario: Design settings are applied

- **WHEN** the merchant changes the block's row, badge, tag, sale text, price, or ribbon settings
- **THEN** the rendered option rows reflect those values

### Requirement: Rows remain usable without JavaScript

Before the block script runs, or when JavaScript is unavailable, every configured option row SHALL be present in the document and its content visible; selection behavior SHALL be applied only as progressive enhancement.

#### Scenario: JavaScript unavailable

- **WHEN** the block renders and its script does not run
- **THEN** all configured option rows and their content are visible

### Requirement: Existing blocks and product form are unaffected

Adding the `bundle_stack` block SHALL NOT change the rendering or behavior of the existing `bundle_deals` or `bundle_packages` blocks, the add-to-cart buttons, or any other block in the BKY - Main Product section.

#### Scenario: Existing blocks render as before

- **WHEN** the `bundle_stack` block is added or removed
- **THEN** the existing `bundle_deals` and `bundle_packages` blocks, buy buttons, and other blocks render with the same content, layout, and behavior as before
