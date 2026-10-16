# Spec Delta

## Purpose

A reusable storefront section that pairs an optional title and description with a single autoplaying video preview, giving merchants direct control over the video's width, height, and padding so they can drop a lightweight video showcase into any page.

## ADDED Requirements

### Requirement: Video showcase section availability

The theme SHALL provide a `video-showcase` section that a merchant can add, remove, duplicate, and reorder on any JSON template in the theme editor, and it SHALL appear with a preset so it can be added in one step.

#### Scenario: Merchant adds the section

- **WHEN** a merchant adds the video-showcase section from the theme editor's section list
- **THEN** the section is inserted into the template with its title, description, video, and layout settings available and a default configuration rendered in the preview

#### Scenario: Section renders on the storefront

- **WHEN** a template contains the video-showcase section
- **THEN** the storefront renders the section as a self-contained unit without console errors

### Requirement: Optional title and description

The section SHALL render a title and a description above the video when those settings contain text, and SHALL omit each element when its setting is blank, leaving no empty container or gap.

#### Scenario: Both texts provided

- **WHEN** the merchant sets a non-empty title and description
- **THEN** both render above the video, styled with the configured size, color, and alignment

#### Scenario: A text setting is blank

- **WHEN** the title or the description setting is left blank
- **THEN** that element is not rendered and the remaining content keeps its spacing

### Requirement: Single autoplaying video preview

The section SHALL render exactly one video chosen with the Shopify video setting, and SHALL start it automatically on load by outputting it muted, looping, inline-playable, and preloaded, so it autoplays under browser autoplay policies.

#### Scenario: Video autoplays on load

- **WHEN** the section renders with a video selected and the browser permits muted autoplay
- **THEN** the video begins playing automatically, muted, without a user interaction

#### Scenario: No video selected

- **WHEN** the section renders with no video selected
- **THEN** it shows a placeholder state prompting the merchant to add a video, without breaking layout

#### Scenario: Video fills its container

- **WHEN** the video is rendered in its container
- **THEN** it fills the container's width and height and crops rather than distorts when its intrinsic ratio differs

### Requirement: Play and pause control

The section SHALL provide a control that lets a visitor pause and resume the autoplaying video, and SHALL keep the control's label and pressed state in sync with the video's actual play/pause state.

#### Scenario: Visitor pauses the video

- **WHEN** a visitor activates the control while the video is playing
- **THEN** the video pauses and the control updates its text and pressed state to reflect the paused state

#### Scenario: Visitor resumes the video

- **WHEN** a visitor activates the control while the video is paused
- **THEN** the video resumes playing and the control updates its text and pressed state accordingly

#### Scenario: Control stays accessible

- **WHEN** the control is rendered
- **THEN** it is a keyboard-focusable button with an accessible name and a pressed state exposed to assistive technology

### Requirement: Adjustable video width

The section SHALL expose a width setting that sizes the video container as a percentage of the theme's content width, defaulting to the full content width, and SHALL not cause horizontal overflow at any supported width or viewport.

#### Scenario: Width setting is applied

- **WHEN** the merchant changes the section's width setting
- **THEN** the rendered video container matches that percentage of the content width

#### Scenario: Default fills content width

- **WHEN** the section renders with the default width setting
- **THEN** the video spans the full content width of the theme

#### Scenario: No horizontal overflow

- **WHEN** the section is viewed on a narrow mobile viewport or with any allowed width setting
- **THEN** the page does not overflow horizontally

### Requirement: Adjustable video height

The section SHALL expose a height control for the video container, providing an aspect-ratio choice and an optional fixed pixel height that overrides it, and SHALL apply the chosen height on both desktop and mobile.

#### Scenario: Aspect ratio drives height

- **WHEN** the merchant selects an aspect ratio and leaves the fixed height unset
- **THEN** the video container's height follows that ratio relative to its width

#### Scenario: Fixed height overrides ratio

- **WHEN** the merchant sets a fixed pixel height
- **THEN** the video container renders at that height and the video crops to fill it

#### Scenario: Height applies on mobile

- **WHEN** the section is viewed on a mobile viewport
- **THEN** the configured height behavior applies to the mobile layout as well

### Requirement: Adjustable padding and styling

The section SHALL expose section padding (top and bottom), horizontal content padding, and a corner-radius setting, and SHALL apply them to the rendered section so merchants can space and shape it without code.

#### Scenario: Padding settings are applied

- **WHEN** the merchant changes the top, bottom, or horizontal padding settings
- **THEN** the rendered section reflects the corresponding spacing

#### Scenario: Corner radius is applied

- **WHEN** the merchant changes the corner-radius setting
- **THEN** the video container's corners render with that radius

### Requirement: Renders without JavaScript

The video, title, description, and layout SHALL be present and correct in the rendered HTML before any client script runs, and the play/pause control SHALL be the only behavior that depends on JavaScript.

#### Scenario: JavaScript does not run

- **WHEN** the section renders and its script does not execute
- **THEN** the title, description, and autoplaying video still render and play, and only the play/pause control is inert

### Requirement: Existing sections are unaffected

Adding, editing, or removing the video-showcase section SHALL NOT change the rendering, behavior, or settings of any existing section, block, or snippet.

#### Scenario: Existing content renders as before

- **WHEN** the video-showcase section is added to or removed from a template
- **THEN** all other sections and blocks on that template render with the same content, layout, and behavior as before
