# storefront-payment-icons Specification

## Purpose

Defines how the storefront renders the store's accepted payment method icons, ensuring each distinct payment brand appears once regardless of how many equivalent or legacy payment type entries the store reports.

## Requirements

### Requirement: Payment method icons are de-duplicated by brand

When rendering the store's accepted payment methods, the storefront SHALL render at most one icon per distinct payment brand. Payment type entries that resolve to the same brand SHALL collapse into a single icon, retaining the first occurrence in the store's enabled payment type order.

#### Scenario: Duplicate Amazon entries collapse to one icon

- **WHEN** a store reports both `amazon_pay` and the legacy Amazon Payments payment type as enabled
- **THEN** exactly one Amazon icon is rendered

#### Scenario: Distinct brands are unaffected

- **WHEN** the enabled payment types resolve to different brands
- **THEN** one icon is rendered per brand, preserving the store's enabled payment type order

#### Scenario: Retained icon keeps first-occurrence order

- **WHEN** two enabled payment types resolve to the same brand
- **THEN** the single rendered icon keeps the position of the first occurrence and later duplicates are omitted

### Requirement: Payment icons render consistently across storefront locations

Every storefront location that lists accepted payment methods SHALL apply the same brand de-duplication, so the rendered set of icons is identical wherever payment icons appear.

#### Scenario: Footer and product payment areas match

- **WHEN** a page renders payment icons in the footer and in a product payment area
- **THEN** both locations show the same de-duplicated set of brand icons

#### Scenario: No location renders a duplicate brand

- **WHEN** the store reports duplicate or equivalent entries for one brand
- **THEN** none of the storefront payment icon locations render that brand more than once
