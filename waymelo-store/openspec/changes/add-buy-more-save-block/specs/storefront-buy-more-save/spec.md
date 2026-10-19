# Spec Delta

## Purpose

Lets shoppers discover and add discounted add-on products to their order directly on the product page, by offering a configurable list of recommended products with an automatically computed percentage-off price and a full-detail preview.

## ADDED Requirements

### Requirement: Buy More & Save block availability

The product page SHALL offer a `buy_more_save` block type that a merchant can add, remove, reorder, and configure in the theme editor alongside the other product blocks, and the block SHALL be listed in the section's default preset.

#### Scenario: Merchant adds the block

- **WHEN** a merchant adds the `buy_more_save` block to the product section
- **THEN** the block appears in the editor block list with its settings and renders in the storefront preview

#### Scenario: Block renders in the storefront

- **WHEN** a product page includes the `buy_more_save` block
- **THEN** the block renders its heading and its add-on rows inside the product content column

#### Scenario: Block is absent

- **WHEN** the `buy_more_save` block is not present in the section
- **THEN** no add-on markup, styles, or behavior from this block affect the page

### Requirement: Merchant-configurable heading and save percentage

The block SHALL expose settings for the block heading, an optional subtitle, a save percentage, and whether the save tag appears on each row, and the storefront SHALL apply the merchant's values.

#### Scenario: Heading is editable

- **WHEN** a merchant sets the block heading text
- **THEN** the storefront renders that text above the add-on rows

#### Scenario: Save percentage is editable

- **WHEN** a merchant changes the save percentage setting
- **THEN** the storefront renders the add-on rows with prices computed from the new percentage

#### Scenario: Save tag can be hidden

- **WHEN** the merchant turns off the row save tag
- **THEN** the add-on rows render without the save tag and without an empty placeholder

### Requirement: Add-on products come from Shopify product recommendations

The block SHALL request its add-on products from the product recommendations service for the product currently displayed on the page.

#### Scenario: Complementary recommendations are used

- **WHEN** the block renders on a product page and the recommendations service returns products for the current product
- **THEN** the add-on rows show products from the recommendations response for that product

#### Scenario: Fallback intent is used

- **WHEN** the complementary recommendation response returns no products for the current product
- **THEN** the block requests products using the alternative recommendation intent for that same product

#### Scenario: No recommendations available

- **WHEN** the recommendations service returns no products for either intent
- **THEN** the block renders nothing rather than an empty list

#### Scenario: No current product

- **WHEN** the section is not displaying a specific product
- **THEN** the block does not render add-on rows

### Requirement: Add-on list is capped at five products

The block SHALL display at most five add-on products, taking the first products from the recommendations response up to that cap.

#### Scenario: Fewer recommendations than the cap

- **WHEN** the recommendations response returns three products
- **THEN** three add-on rows render

#### Scenario: More recommendations than the cap

- **WHEN** the recommendations response returns more than five products
- **THEN** exactly five add-on rows render and the remaining products are not displayed

### Requirement: Add-on row renders product content

Each rendered add-on row SHALL show a selection control, the product's featured media, the product title, a selector for that product's variants, and the row's price and compare-at price, and SHALL also show an optional save tag when that tag is enabled.

#### Scenario: Row content renders

- **WHEN** an add-on row renders for a product with a single variant
- **THEN** the row shows its selection control, thumbnail, title, the variant's price and compare-at price, and the save tag when enabled

#### Scenario: Product has multiple variants

- **WHEN** an add-on product has more than one variant
- **THEN** the row shows a selector listing that product's variants instead of a single price

#### Scenario: Missing compare-at price

- **WHEN** an add-on product has no compare-at price
- **THEN** the row omits the compare-at price element and renders the remaining content without a broken placeholder

#### Scenario: Missing product media

- **WHEN** an add-on product has no featured media
- **THEN** the row renders a placeholder image instead of the thumbnail

#### Scenario: Title text renders

- **WHEN** a product title contains markup-sensitive characters, ampersands, or non-ASCII characters
- **THEN** the row renders the title text without breaking the markup

### Requirement: Add-on prices are computed from the save percentage

The block SHALL compute each add-on's displayed price by applying the configured save percentage to that variant's compare-at price, or to its price when the product has no compare-at price, and SHALL render both the undiscounted and discounted prices.

#### Scenario: Sale price is derived from compare-at price

- **WHEN** a variant has a compare-at price of 100.00 and the save percentage is 20
- **THEN** the row shows the compare-at price as the undiscounted price and 80.00 as the discounted price

#### Scenario: Sale price is derived from price when no compare-at price exists

- **WHEN** a variant has a price of 50.00 and no compare-at price, and the save percentage is 20
- **THEN** the row shows 50.00 as the undiscounted price and 40.00 as the discounted price

#### Scenario: Prices use store money formatting

- **WHEN** a row renders an undiscounted and discounted price
- **THEN** both amounts are formatted using the store's money format

#### Scenario: Save percentage of zero

- **WHEN** the save percentage is set to 0
- **THEN** the row renders the undiscounted price as the displayed price and no distinct discounted price

### Requirement: Add-on selection

Shoppers SHALL be able to select and deselect each add-on row independently, and the block SHALL expose which rows are currently selected.

#### Scenario: Selecting a row

- **WHEN** a shopper selects an unselected add-on row
- **THEN** that row shows a selected state and remains selectable for adding to the cart

#### Scenario: Deselecting a row

- **WHEN** a shopper deselects a selected add-on row
- **THEN** that row shows an unselected state and is excluded from the block's cart action

#### Scenario: Selected state is conveyed

- **WHEN** an add-on row is selected
- **THEN** its selected state is exposed to assistive technology

#### Scenario: Row selection is operable by keyboard

- **WHEN** a keyboard-only shopper focuses an add-on row's selection control
- **THEN** they can select and deselect that row without a pointing device

### Requirement: Product preview popup

The block SHALL provide a large preview popup for each add-on product that shows the product's media gallery, title, prices, variants, and description, and lets the shopper add that product to the cart.

#### Scenario: Preview opens

- **WHEN** a shopper activates an add-on row's preview control
- **THEN** a modal opens showing that product's media gallery, title, prices, variant options, and description

#### Scenario: Preview shows multiple media

- **WHEN** an add-on product has more than one media item
- **THEN** the preview shows the product's gallery with a way to view each item

#### Scenario: Preview variant selection updates the price

- **WHEN** a shopper selects a different variant inside the preview popup
- **THEN** the preview's displayed prices update to that variant's prices

#### Scenario: Preview add to cart

- **WHEN** a shopper activates the preview's add-to-cart control for an available variant
- **THEN** that product is added to the cart as its own line item

#### Scenario: Unavailable variant cannot be added

- **WHEN** the preview shows a variant that is unavailable for purchase
- **THEN** the preview's add-to-cart control does not offer adding that unavailable variant

#### Scenario: Preview closes

- **WHEN** a shopper activates the popup's close control, presses the Escape key, or clicks the overlay
- **THEN** the popup closes and focus is handled appropriately

### Requirement: Add main product and selected add-ons in one action

Activating the block's claim action SHALL add the currently displayed product together with every selected add-on's selected variant to the cart in a single request.

#### Scenario: One selected add-on

- **WHEN** a shopper selects one add-on row and activates the claim action
- **THEN** the cart gains a line item for the current product and a line item for the selected add-on variant

#### Scenario: Multiple selected add-ons

- **WHEN** a shopper selects several add-on rows and activates the claim action
- **THEN** the cart gains a line item for each selected add-on's selected variant alongside the current product

#### Scenario: No selected add-on

- **WHEN** a shopper activates the claim action with no add-on row selected
- **THEN** the cart gains only the current product

#### Scenario: Cart quantity reflects the form quantity

- **WHEN** a shopper has set the product form quantity to a value other than one and activates the claim action
- **THEN** the current product is added with that quantity and each add-on is added at quantity one

#### Scenario: Cart UI updates after the claim action

- **WHEN** the claim action succeeds and a cart drawer or cart notification is present
- **THEN** the cart UI updates to reflect the newly added line items

#### Scenario: Claim action confirm

- **WHEN** the claim action completes successfully
- **THEN** the block provides feedback that the offer was claimed

### Requirement: Add-ons render without JavaScript

Before the block script runs, or when JavaScript is unavailable, every configured add-on row SHALL be present in the document with its content visible, and selection, preview, and cart behavior SHALL be applied only as progressive enhancement.

#### Scenario: JavaScript unavailable

- **WHEN** the block renders and its script does not run
- **THEN** all configured add-on rows and their content remain visible

### Requirement: Merchant styling is applied

The block SHALL expose merchant settings for the row, heading, thumbnail, selection control, price, compare-at price, save tag, popup, and claim-button colors, sizes, and spacing, and SHALL apply them to the rendered block.

#### Scenario: Design settings are applied

- **WHEN** a merchant changes the block's color, size, or spacing settings
- **THEN** the rendered add-on rows, popup, and claim button reflect those values

### Requirement: Existing blocks and product form are unaffected

Adding the `buy_more_save` block SHALL NOT change the rendering or behavior of any other block in the `blocky-main-product` section, the add-to-cart buttons, or the product form.

#### Scenario: Existing blocks render as before

- **WHEN** the `buy_more_save` block is added or removed from the section
- **THEN** the other blocks, the buy buttons, and the product form render with the same content, layout, and behavior as before
