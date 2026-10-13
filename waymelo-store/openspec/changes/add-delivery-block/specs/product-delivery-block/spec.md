# Spec Delta

## Purpose

Gives shoppers a delivery destination, an estimated arrival window, and the timeline behind that estimate directly on the product page, so they can judge shipping before purchase and change their shipping country when needed.

## ADDED Requirements

### Requirement: Delivery block availability
The product page SHALL offer a Delivery block type that a merchant can add, remove, reorder, and configure in the theme editor alongside other product blocks.

#### Scenario: Merchant adds the block
- **WHEN** a merchant adds the Delivery block to a product section
- **THEN** the block appears in the editor block list with its settings and renders in the storefront preview

#### Scenario: Block renders in the storefront
- **WHEN** a product page includes the Delivery block
- **THEN** the block renders its destination line and estimated arrival line inside the product content column

### Requirement: Destination summary line
The block SHALL display a line reading a configurable label followed by the shopper's current localization country name and a disclosure indicator.

#### Scenario: Current country is shown
- **WHEN** the block renders
- **THEN** the destination line shows the current storefront country name from localization

#### Scenario: Country name reflects a change
- **WHEN** the shopper's localization country changes
- **THEN** the destination line shows the updated country name on the next render

### Requirement: Estimated arrival summary line
The block SHALL display a line stating an arrival estimate and a date range computed from a configurable lead-time offset applied to the current date.

#### Scenario: Estimated range is computed
- **WHEN** the block renders with a configured earliest and latest lead-time offset
- **THEN** the line shows a date range from today plus each offset, formatted with the configured date format and labels

#### Scenario: Single-date estimate
- **WHEN** the earliest and latest lead-time offsets are equal
- **THEN** the line shows a single date instead of a range

### Requirement: Update Your Preferences modal
The destination line SHALL open a modal titled for updating preferences that contains a shipping-country selector, a submit button, and a link to the shipping policy.

#### Scenario: Modal opens and closes
- **WHEN** the shopper activates the destination line
- **THEN** the preferences modal opens, and activating its close control dismisses it

#### Scenario: Modal contents
- **WHEN** the preferences modal is open
- **THEN** it shows a country selector, a save-and-continue submit control, and a shipping policy link

### Requirement: Functional country and currency switching
Submitting the preferences modal SHALL change the storefront's country and currency through Shopify localization and persist the selection.

#### Scenario: Shopper saves a new country
- **WHEN** the shopper selects a different country in the modal and submits
- **THEN** the storefront reloads in the selected country and currency and the destination line reflects the new country

#### Scenario: Selected country is remembered
- **WHEN** the shopper returns to the store after changing country
- **THEN** the previously selected country remains in effect

### Requirement: Delivery Method detail popover
The estimated arrival line SHALL open a popover titled for the delivery method that shows the method name with its business-day range, an order-placed / order-ships / delivered timeline, and configurable detail notes.

#### Scenario: Popover opens and closes
- **WHEN** the shopper activates the estimated arrival line
- **THEN** the delivery method popover opens, and activating its close control dismisses it

#### Scenario: Timeline shows estimated stages
- **WHEN** the delivery method popover is shown
- **THEN** it lists order-placed, order-ships, and delivered entries with dates derived from the configured lead times

#### Scenario: Detail notes are configurable
- **WHEN** the merchant provides detail note text in the block settings
- **THEN** each non-empty note is listed in the popover in the configured order

### Requirement: Merchant-configurable content and styling
The block SHALL expose settings for labels, lead-time offsets, date format and labels, method name and day range, detail notes, policy link, and basic text colors so merchants can match the block to the storefront without code changes.

#### Scenario: Editor changes apply without code
- **WHEN** a merchant edits the block's text, date, or color settings
- **THEN** the storefront block reflects those changes
