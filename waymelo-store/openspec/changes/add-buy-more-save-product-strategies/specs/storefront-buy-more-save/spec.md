# Spec Delta

## Purpose

Lets a merchant choose where the product-page add-ons block gets its products: Shopify's recommendations service, random products from the store, or random products below a price ceiling.

## ADDED Requirements

### Requirement: Merchant selects the add-on product source

The `buy_more_save` block SHALL expose a product-source setting offering Shopify recommendations, random store products, and random store products under a price ceiling, and SHALL default to Shopify recommendations.

#### Scenario: Default source

- **WHEN** a merchant adds the block without changing the product-source setting
- **THEN** the block lists add-ons from Shopify's recommendations service

#### Scenario: Recommendations source is unchanged

- **WHEN** the product source is Shopify recommendations
- **THEN** the block behaves as before: it requests recommendations for the current product, falls back to the alternative intent when empty, and renders at most five rows

#### Scenario: Switching source

- **WHEN** a merchant changes the product-source setting
- **THEN** the storefront draws the add-on list from the newly selected source

### Requirement: Random source draws from published store products

When the product source is a random strategy, the block SHALL draw its add-on products from the store's published products and SHALL display at most five of them.

#### Scenario: Random list is populated

- **WHEN** the product source is a random strategy and the store has published products
- **THEN** the block shows add-on cards built from those products, up to five

#### Scenario: No eligible products

- **WHEN** the product source is a random strategy and no product qualifies
- **THEN** the block renders nothing rather than an empty list

### Requirement: Random selection refreshes on each page load

For a random strategy, the block SHALL reshuffle its candidate products on each page load so the selection varies between loads.

#### Scenario: Variation across loads

- **WHEN** the same page using a random strategy is loaded again
- **THEN** the set or order of add-on cards may differ from the previous load

### Requirement: Random source excludes the current product and unavailable products

For a random strategy, the block SHALL exclude the product currently being viewed and any product that has no available variant.

#### Scenario: Current product excluded

- **WHEN** the product source is a random strategy
- **THEN** the product shown on the page does not appear among its own add-on cards

#### Scenario: Unavailable products excluded

- **WHEN** a candidate product has no available variant
- **THEN** that product is not shown as an add-on card

### Requirement: Price-limited random source uses an inclusive price ceiling

When the product source is the price-limited random strategy, the block SHALL include a product only when at least one of its available variants is priced at or below a merchant-configurable ceiling, whose default is 30.

#### Scenario: Product at or below the ceiling

- **WHEN** the price-limited strategy is selected and a product has an available variant priced at or below the ceiling
- **THEN** that product is eligible to appear as an add-on card

#### Scenario: Product above the ceiling

- **WHEN** every available variant of a product is priced above the ceiling
- **THEN** that product is excluded from the add-on cards

#### Scenario: Ceiling boundary is inclusive

- **WHEN** an available variant's price equals the ceiling exactly
- **THEN** the product is eligible to appear

#### Scenario: Ceiling is configurable

- **WHEN** a merchant changes the price-ceiling setting
- **THEN** the eligible products are re-evaluated against the new value

### Requirement: Product source does not change row, pricing, or cart behavior

Regardless of the selected product source, each add-on card SHALL keep the same save-percentage pricing, selection, preview, and claim behavior, and the recommendations request SHALL NOT be made for the random sources.

#### Scenario: Rows behave the same across sources

- **WHEN** the block renders cards from any product source
- **THEN** each card shows the same content and supports the same selection, preview, and claim actions

#### Scenario: Recommendations not called for random sources

- **WHEN** the product source is a random strategy
- **THEN** the block does not request Shopify's recommendations endpoint
