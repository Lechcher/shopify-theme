# Spec Delta

## Purpose

Provides a site-wide, merchant-configurable help button fixed to the bottom-right of the storefront viewport, keeping a support entry point visible on every page without depending on any individual template or section.

## ADDED Requirements

### Requirement: Site-wide fixed help button

The storefront SHALL render a help button, fixed to the bottom-right corner of the viewport, on every page that uses the theme layout. The button SHALL stay in that position while the page scrolls and MUST NOT occupy space in the surrounding page flow.

#### Scenario: Button is present on every page

- **WHEN** any storefront page that uses the theme layout is loaded
- **THEN** a help button is rendered fixed to the bottom-right corner of the viewport

#### Scenario: Button stays put while scrolling

- **WHEN** a shopper scrolls the page up or down
- **THEN** the help button remains anchored to the bottom-right corner of the viewport

#### Scenario: Button does not disturb page content

- **WHEN** the help button is rendered
- **THEN** it is removed from the normal document flow and no surrounding layout or content shifts to accommodate it

### Requirement: Merchant-configurable help link

The help button SHALL expose merchant-configurable settings for its link target, its label text, and whether the link opens in a new tab.

#### Scenario: Merchant configures the button

- **WHEN** a merchant sets a link target, a label, and the new-tab option in the theme editor
- **THEN** the storefront stores those values and applies them to the rendered help button

#### Scenario: Settings are labeled

- **WHEN** a merchant views the help button section in the theme editor
- **THEN** it exposes a link setting, a label setting, and a new-tab toggle with readable labels

### Requirement: Help button renders the configured link and label

The help button SHALL be an anchor whose `href` is the configured link target and whose visible text is the configured label, and it SHALL use a sensible default label and link target before the merchant configures them.

#### Scenario: Configured target and label are applied

- **WHEN** the help button is rendered with a configured link target and label
- **THEN** the anchor's `href` is the configured link target
- **AND** the anchor's visible text is the configured label

#### Scenario: Button is usable before configuration

- **WHEN** the merchant has not changed the help button settings
- **THEN** the button still renders with its default label and a valid default link target

### Requirement: Help link opens in a new tab when configured

When the new-tab option is enabled, the help link SHALL open its target in a new browsing context and SHALL declare `rel="noopener"`.

#### Scenario: New-tab option enabled

- **WHEN** the merchant enables the new-tab option and a shopper activates the help button
- **THEN** the link target opens in a new tab
- **AND** the anchor declares `rel="noopener"`

#### Scenario: New-tab option disabled

- **WHEN** the new-tab option is disabled and a shopper activates the help button
- **THEN** the link target opens in the current browsing context

### Requirement: Help button matches the requested presentation

The help button SHALL render as a fully rounded (pill-shaped) anchor with a white background, a border in the brand color `#7A5168`, and horizontal and vertical padding.

#### Scenario: Button shows the requested styling

- **WHEN** the help button is rendered
- **THEN** the anchor has a white background, a `#7A5168` border, horizontal and vertical padding, and a fully rounded corner shape

### Requirement: Help button is accessible

The help button anchor SHALL expose a non-empty accessible name so assistive technology announces it as a help link rather than an unlabeled link, and it SHALL be operable by keyboard.

#### Scenario: Screen reader announces the button

- **WHEN** a user navigates the storefront with a screen reader and the help button is rendered
- **THEN** the help link is announced with a non-empty name identifying it as a help link

#### Scenario: Keyboard activation

- **WHEN** a keyboard user tabs to the help button and presses Enter
- **THEN** the link target is activated

### Requirement: Button is omitted when no link is configured

When the help button's link target is blank, the storefront SHALL NOT render the help button, so no anchor with an empty or dead target is presented to shoppers.

#### Scenario: Blank link target

- **WHEN** the help button's link target is empty
- **THEN** no help button anchor is rendered on the storefront

### Requirement: Existing storefront behavior is unchanged

Adding the help button SHALL NOT alter the rendering or behavior of existing storefront content, including the header, footer, and any existing sections.

#### Scenario: Existing regions render as before

- **WHEN** the help button is added or removed
- **THEN** the header, footer, and existing page content render with the same visibility and content as before
