---
name: production_engineering
description: Production-grade engineering thinking, focusing on constraint-based UI, explicit state modeling, edge-case handling, and failure-first development.
---

# Production Engineering & Thinking

This skill provides a comprehensive guide to moving from "building apps" to "engineering production-grade systems". It focuses on preventing breakage through system-level reasoning.

## ðŸ§  Core Production Mindset

The difference between a hobbyist and a top-tier engineer is not just knowing how to build, but knowing **how to prevent breakage**.

### The 5-Question Antigravity Check
Before shipping *any* screen or feature, answer these:
1. **What if screen is smaller?** (Constraint-based layout)
2. **What if data is empty?** (Empty states)
3. **What if API fails?** (Error states)
4. **What if user taps twice?** (Idempotency)
5. **What if app resumes mid-flow?** (Lifecycle persistence)

If you can answer all 5, the feature is production-ready.

---

## 1ï¸âƒ£ UI: Constraint-First Layout Thinking

**Rule of Thumb:** If it *can* resize, it *WILL* resize.

**Stop thinking:** "I want this button here."
**Start thinking:** "What happens if screen = small / text = big / keyboard opens?"

### Core Concepts to Internalize
- **Flexible vs Expanded**: Know the precise difference in column/row flexing.
- **LayoutBuilder**: Build responsive logic based on available constraints.
- **MediaQuery**: Adapt to device size and orientation.
- **SafeArea**: Respect device notches and system UI.
- **Scroll-First**: almost everything should be scrollable by default to handle overflow.

---

## 2ï¸âƒ£ Logic: State & Flow Mapping

**Problem:** "Sometimes logic is missing, AI guesses wrong."
**Solution:** AI cannot guess business rules. You must **Enumerate States Explicitly**.

Before coding, write the state table:
`
STATE A â†’ user not logged in
STATE B â†’ loading
STATE C â†’ success
STATE D â†’ error
STATE E â†’ empty data
`

**Prompting Strategy:**
> "Implement UI + logic for these 5 states: [List States]"

---

## 3ï¸âƒ£ Edge-Case Thinking (Failure Modes)

Happy paths are easy. Real engineering handles the failures.

**Ask:** "How can this screen fail?"
- No internet / Slow network
- Empty API response
- Keyboard pushes UI up (overflow)
- Device rotation
- Double-tap interactions (logic duplication)
- App killed and resumed

---

## 4ï¸âƒ£ Specification Writing (AI Collaboration)

To get "Elite" results from AI, provide "System-Focussed" prompts, not "Output-Focussed" ones.

âŒ **Weak Prompt:** "Build a login screen"
âœ… **Elite Prompt:**
> "Build a login screen with:
> - loading state
> - disabled button during request
> - error handling
> - keyboard-safe layout
> - retry logic"

---

## ðŸ§© Missing Skills Checklist

### UI & Layout
- Responsive Layout Engineering
- Constraint-Based UI Design
- Overflow & Resize Handling
- Keyboard-Safe UI Design
- Scroll-First Screen Architecture

### Logic & State
- Explicit State Modeling
- State-Driven UI Rendering
- Async Flow Control
- Idempotent Action Handling

### Quality & Stability
- Happy Path vs Failure Path Separation
- User Stress Testing (Big/Small text/screens)
- Regression Awareness

---

## ðŸ·ï¸ The "One-Liner" for Excellence
**"Production-Grade UI & Logic Design (Edge-Case & State-Driven Development)"**
