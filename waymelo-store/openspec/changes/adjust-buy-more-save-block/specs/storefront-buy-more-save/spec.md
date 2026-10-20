# Spec Delta

## Purpose

Lets shoppers discover and add discounted add-on products to their order on the product page, showing a limited list of recommended products as cards with a consistent border treatment.

## ADDED Requirements

### Requirement: Recommended add-on list is limited to five

The `buy_more_save` block SHALL request add-on products from Shopify's recommendations service with a limit of five, and SHALL display at most five add-on cards, taking the first products from the response. The default number of products shown SHALL be five.

#### Scenario: More than five recommendations

- **WHEN** the recommendations response returns more than five products
- **THEN** exactly five add-on cards render and the remaining products are not displayed

#### Scenario: Default count

- **WHEN** the block renders with no merchant change to its maximum-products setting
- **THEN** it displays five add-on cards, or all available recommendations when fewer than five are returned

#### Scenario: Fewer than five recommendations

- **WHEN** the recommendations response returns three products
- **THEN** three add-on cards render and no empty placeholder cards appear

### Requirement: Add-on card border treatment

Each add-on card in the `buy_more_save` block SHALL render with a 3px border width and a 12px border radius by default, and these values SHALL remain merchant-configurable design settings.

#### Scenario: Default card border

- **WHEN** the block renders with no merchant change to its row design settings
- **THEN** each add-on card shows a 3px border and a 12px corner radius

#### Scenario: Merchant changes the border

- **WHEN** a merchant changes the row border width or radius setting
- **THEN** the rendered add-on cards reflect the merchant's values
