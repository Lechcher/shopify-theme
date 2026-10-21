# Spec Delta

## Purpose

Lets shoppers select discounted add-on products in the product-page Buy More & Save block and add them, together with the displayed product, to the cart in one reliable claim action.

## ADDED Requirements

### Requirement: Claim offer adds the selected add-ons to the cart

Activating the block's claim action SHALL add the selected variant of every selected add-on row, together with the product displayed on the page, to the cart, so that the cart contains a line item for each after the action completes. Each selected variant SHALL be sent at most once.

#### Scenario: One selected add-on is added

- **WHEN** a shopper selects one add-on row and activates the claim action
- **THEN** the cart gains a line item for the displayed product and a line item for that add-on's selected variant

#### Scenario: Several selected add-ons are all added

- **WHEN** a shopper selects several add-on rows and activates the claim action
- **THEN** the cart gains a line item for each selected add-on's selected variant alongside the displayed product

#### Scenario: A repeated variant is added once

- **WHEN** the same variant would be sent for more than one part of the claim action
- **THEN** the cart gains a single line item for that variant and the action still succeeds

#### Scenario: Claim works from any product source

- **WHEN** the add-on rows are built from any product source, including a random source
- **THEN** activating the claim action adds the selected add-ons the same way as with recommended add-ons

#### Scenario: Claim survives third-party cart interception

- **WHEN** a store app intercepts cart adds and drops all but one line from a multi-item request
- **THEN** activating the claim action still adds the displayed product and every selected add-on to the cart

#### Scenario: Cart reflects the added add-ons

- **WHEN** the claim action succeeds and the theme provides a cart drawer or cart notification
- **THEN** that cart interface updates to show the newly added add-on line items

### Requirement: Claim action reports the cart service outcome

When the cart service rejects the claim action, the block SHALL show the service's own reason in its status message and SHALL return the claim control to a usable state so the shopper can retry. When the claim succeeds, the block SHALL confirm the offer was claimed.

#### Scenario: Unavailable or unknown variant

- **WHEN** the cart service rejects the claim because a variant cannot be found or is unavailable
- **THEN** the block shows the cart service's reason and does not present the claim as successful

#### Scenario: Claim control recovers after a failure

- **WHEN** the claim action fails
- **THEN** the claim control becomes usable again and the shopper can retry

#### Scenario: Successful claim is confirmed

- **WHEN** the claim action completes successfully
- **THEN** the block shows a message confirming the offer was claimed
