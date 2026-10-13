# Spec Delta

## Purpose

Presents a product's variant options in the product section's Variant Picker, so shoppers can see and choose a variant — including color options shown as image-backed swatches — and have the selected variant and main product media update accordingly.

## ADDED Requirements

### Requirement: Color options render as swatches

When the Variant Picker uses button style and a variant option is recognized as a color option (its name contains "color" or "colour"), the section SHALL render one selectable swatch per option value instead of a plain text label.

#### Scenario: Color option rendered as swatches

- **WHEN** the product has an option named "Color" with values and the picker type is buttons and swatches are enabled
- **THEN** each option value is rendered as a selectable swatch rather than a text label

#### Scenario: Swatches disabled

- **WHEN** the merchant disables color swatches for the Variant Picker
- **THEN** color option values are rendered as plain text labels and no swatch styling is applied

#### Scenario: Non-color option

- **WHEN** a variant option is not recognized as a color option
- **THEN** its values are rendered as plain text labels regardless of the swatch setting

### Requirement: Color swatch shows the per-color product image

Each color swatch SHALL show the product image associated with that color value, taken automatically from the product's variants — the featured image of a variant whose value for that option equals the color value — without requiring a merchant-authored image mapping.

#### Scenario: Color value has a variant image

- **WHEN** a color option value matches a variant that has a featured image
- **THEN** that swatch displays the variant's featured image

#### Scenario: Shared image across variants of the same color

- **WHEN** more than one variant has the same color value and the first such variant has a featured image
- **THEN** the color's swatch displays that variant's featured image

### Requirement: Swatch image falls back to a solid color

When a color option value has no associated variant featured image, the swatch SHALL fall back to the solid color already configured for that value, so every swatch renders with a visible fill.

#### Scenario: Color value without an image

- **WHEN** a color option value matches no variant with a featured image
- **THEN** the swatch displays the solid color for that value and no broken image

#### Scenario: No custom color mapping

- **WHEN** a color value has neither a variant featured image nor a custom color mapping entry
- **THEN** the swatch still renders a visible fill derived from the value rather than being empty

### Requirement: Image swatches remain selectable and switch the main media

Selecting an image swatch SHALL select the corresponding variant and update the main product media to the variant's featured media when that media exists, exactly as other variant selections do.

#### Scenario: Selecting an image swatch updates media

- **WHEN** a shopper selects a color swatch whose variant has featured media
- **THEN** the variant and the main product media both update to reflect that selection

#### Scenario: Selecting a swatch without variant media

- **WHEN** a shopper selects a color swatch whose variant has no featured media
- **THEN** the variant updates and the main product media is left unchanged

### Requirement: Color swatches are accessible

Each color swatch SHALL expose an accessible name for its color value, SHALL be operable by keyboard as a native radio control, and SHALL convey its selected state. An image swatch's image SHALL be decorative so it is not announced redundantly.

#### Scenario: Accessible name and keyboard operation

- **WHEN** a keyboard user focuses the color swatches and moves between them
- **THEN** each swatch exposes its color name and can be focused and selected with the keyboard

#### Scenario: Selected state is conveyed

- **WHEN** a color swatch is the selected option
- **THEN** the selected state is visually indicated and programmatically available to assistive technology

#### Scenario: Swatch image is not announced redundantly

- **WHEN** a color swatch displays a product image
- **THEN** the image is marked decorative so assistive technology announces only the color name
