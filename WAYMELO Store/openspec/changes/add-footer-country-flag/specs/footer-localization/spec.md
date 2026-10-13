# Spec Delta

## Purpose

Renders and presents the storefront footer's localization controls, including a visual country flag that identifies the shopper's currently selected country in the footer country selector.

## ADDED Requirements

### Requirement: Footer country selector shows the selected country flag

The storefront footer's country selector SHALL display a country flag representing the currently selected country, positioned to the left of the country name and currency text within the selector button.

#### Scenario: Flag renders for the selected country

- **WHEN** any storefront page that renders the footer section is loaded with more than one country available
- **THEN** the footer country selector button contains a flag image before the country name text
- **AND** the flag image corresponds to the currently selected country

#### Scenario: Flag updates when the country changes

- **WHEN** the shopper selects a different country from the footer selector
- **THEN** the flag shown in the selector button reflects the newly selected country

### Requirement: Flag is accessible and non-disruptive

The flag image SHALL expose the selected country name as its accessible text and SHALL NOT introduce layout shift or obscure the existing country label.

#### Scenario: Flag has accessible text

- **WHEN** the footer country selector is rendered
- **THEN** the flag image provides an alternative text identifying the selected country

#### Scenario: Flag has intrinsic dimensions

- **WHEN** the flag image is rendered
- **THEN** the image reserves its space so surrounding footer content does not shift when the image loads

### Requirement: Footer localization degrades safely when the flag is unavailable

If the flag image cannot be loaded, the footer country selector MUST continue to render the country name and currency text without breaking the footer layout.

#### Scenario: Flag image fails to load

- **WHEN** the flag image cannot be fetched
- **THEN** the footer country selector still shows the country name and currency text
- **AND** the rest of the footer renders without layout breakage

### Requirement: Existing footer localization behavior is unchanged

Adding the flag SHALL NOT change the visibility, content, or behavior of the existing footer country and language selectors, except for the added flag.

#### Scenario: Existing selectors keep working

- **WHEN** the flag is present in the footer country selector
- **THEN** the country and language selectors open, filter, and submit country/language changes as before
- **AND** the header and announcement-bar country selectors are unaffected
