# Spec Delta

## Purpose

Presents a product's variant options in the product section's Variant Picker, so shoppers can see and choose a variant — including color options shown as image-backed swatches at a readable preview size — and have the selected variant and main product media update accordingly.

## ADDED Requirements

### Requirement: Color swatch preview size

In the `blocky-main-product` section's Variant Picker, each color swatch SHALL render at a preview size of 60 pixels by 60 pixels, for both image-backed swatches and solid-color fallback swatches, while remaining circular and clipping its content to the swatch shape.

#### Scenario: Image swatch renders at 60px

- **WHEN** the picker uses button style, color swatches are enabled, and a color option value has an associated variant image
- **THEN** the swatch and its image render at 60 by 60 pixels

#### Scenario: Fallback swatch renders at 60px

- **WHEN** a color option value has no associated variant image, so the swatch shows its solid color
- **THEN** the solid-color swatch also renders at 60 by 60 pixels

#### Scenario: Circular shape and border are preserved

- **WHEN** a color swatch renders at the enlarged size
- **THEN** it remains circular with its content clipped to the swatch, and keeps the existing border and selected-border treatment

#### Scenario: Enlarged image swatch stays crisp

- **WHEN** an image-backed swatch renders at the 60px preview size on a high-density display
- **THEN** the image is requested at a version large enough to display sharply at that size
