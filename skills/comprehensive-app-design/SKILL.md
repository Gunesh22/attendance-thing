---
name: comprehensive-app-design
description: A meta-skill that orchestrates context7, interaction-design, database-schema-designer, responsive-design, and design-md to build comprehensive applications.
---

# Comprehensive App Design Orchestrator

## Overview
This skill guides you through using a suite of specialized skills to design and build high-quality applications. It combines valid documentation retrieval, database design, visual design system creation, responsive layout implementation, and interaction design.

## Workflow

### Phase 1: Foundation & Data (database-schema-designer)
1.  **Define the Data Model**: Use database-schema-designer patterns to create a robust schema.
    -   *Prompting*: "Design a schema for [app description] dealing with [entities]."
    -   *Check*: Ensure 3NF, proper indexing, and correct data types (DECIMAL for money).

### Phase 2: Design Language (design-md)
1.  **Establish the Design System**: Use design-md complexity to create a DESIGN.md file.
    -   *Action*: Analyze existing assets or define a new system.
    -   *Output*: Create DESIGN.md with Visual Theme, Color Palette, Typography, Component Styling, and Layout Principles.
    -   *Usage*: Reference this file in all future UI generation prompts.

### Phase 3: Technical Context (context7)
1.  **Fetch Latest Docs**: Use context7 to get the most recent documentation for your chosen stack.
    -   *Action*: Search for and fetch docs for your framework (e.g., Next.js, React, Tailwind).
    -   *Example*: \curl -s "https://context7.com/api/v2/context?libraryId=..."\
    -   *Goal*: Ensure you are using valid, up-to-date syntax and features.

### Phase 4: Component Implementation (responsive-design)
1.  **Build Responsive Components**: Apply esponsive-design patterns.
    -   *Core*: Use Container Queries for components, Fluid Typography for text, and Mobile-First breakpoints.
    -   *Check*: Verify layouts work on mobile, tablet, and desktop using the defined breakpoint scale.

### Phase 5: Interaction & Polish (interaction-design)
1.  **Add Life to UI**: infuse interaction-design principles.
    -   *Action*: Add purposeful motion, loading states (skeletons), and microinteractions (hover/tap).
    -   *Tool*: Use Framer Motion or CSS transitions as per the skill guide.

## Unified Prompt
To trigger this workflow for a user request:

> "I will now proceed with the Comprehensive App Design workflow.
> 1. **Database**: I will design the schema for your data needs.
> 2. **Design System**: I will establish the DESIGN.md based on your preferences.
> 3. **Documentation**: I will fetch the latest docs for our stack using Context7 to ensure code validity.
> 4. **Implementation**: I will build responsive, mobile-first components.
> 5. **Interactions**: I will add polish with smooth interactions.
>
> **Please provide input**:
> - What is the core functionality of your app?
> - Do you have a specific design vibe in mind?
> - What is your preferred tech stack?"

If the user usage is unclear, **ask for clarification** on which specific aspect (Data, Design, or Logic) they want to focus on first.
