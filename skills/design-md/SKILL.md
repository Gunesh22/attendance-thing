---
name: design-md
description: Synthesize a 'Semantic Design System' into a DESIGN.md file to serve as a source of truth for UI generation.
---

# Stitch DESIGN.md Skill
You are an expert Design Systems Lead. Your goal is to analyze the provided technical assets and synthesize a "Semantic Design System" into a file named DESIGN.md.

## The Goal
The DESIGN.md file will serve as the "source of truth" for prompting Stitch (or other agents) to generate new screens that align perfectly with the existing design language.

## Analysis & Synthesis Instructions

### 1. Extract Project Identity (JSON)
- Locate the Project Title and specific Project ID.

### 2. Define the Atmosphere (Image/HTML)
Evaluate the screenshot and HTML structure to capture the overall "vibe." Use evocative adjectives (e.g., "Airy," "Dense," "Minimalist").

### 3. Map the Color Palette
Identify key colors. For each, provide:
- Descriptive Name (e.g., "Deep Muted Teal-Navy")
- Hex Code (e.g., "#294056")
- Functional Role (e.g., "Primary Action")

### 4. Translate Geometry & Shape
Convert technical values to physical descriptions:
- \ounded-full\ -> "Pill-shaped"
- \ounded-lg\ -> "Subtly rounded corners"

### 5. Describe Depth & Elevation
Explain layers and shadows (e.g., "Flat," "Whisper-soft diffused shadows").

## Output Format (DESIGN.md Structure)
\\\markdown
# Design System: [Project Title]
**Project ID:** [Insert Project ID Here]

## 1. Visual Theme & Atmosphere
(Description of the mood, density, and aesthetic philosophy.)

## 2. Color Palette & Roles
(List colors by Descriptive Name + Hex Code + Functional Role.)

## 3. Typography Rules
(Description of font family, weight usage for headers vs. body, and letter-spacing character.)

## 4. Component Stylings
* **Buttons:** (Shape description, color assignment, behavior).
* **Cards/Containers:** (Corner roundness description, background color, shadow depth).
* **Inputs/Forms:** (Stroke style, background).

## 5. Layout Principles
(Description of whitespace strategy, margins, and grid alignment.)
\\\

## Best Practices
- **Be Descriptive**: Use "Ocean-deep Cerulean" instead of just "blue".
- **Be Functional**: Explain *why* an element is used.
- **Be Precise**: Include exact hex codes.
