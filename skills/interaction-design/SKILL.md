---
name: interaction-design
description: Create engaging, intuitive interactions through motion, feedback, and thoughtful state transitions that enhance usability.
---

# Interaction Design
Create engaging, intuitive interactions through motion, feedback, and thoughtful state transitions that enhance usability and delight users.

## When to Use This Skill
- Adding microinteractions to enhance user feedback
- Implementing smooth page and component transitions
- Designing loading states and skeleton screens
- Creating gesture-based interactions
- Building notification and toast systems
- Implementing drag-and-drop interfaces
- Adding scroll-triggered animations
- Designing hover and focus states

## Core Principles

### 1. Purposeful Motion
Motion should communicate, not decorate:
- Feedback: Confirm user actions occurred
- Orientation: Show where elements come from/go to
- Focus: Direct attention to important changes
- Continuity: Maintain context during transitions

### 3. Easing Functions
\\\css
/* Common easings */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1); /* Decelerate - entering */
--ease-in: cubic-bezier(0.55, 0, 1, 0.45); /* Accelerate - exiting */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1); /* Both - moving between */
--spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Overshoot - playful */
\\\

## Quick Start: Button Microinteraction
\\\jsx
import { motion } from "framer-motion";

export function InteractiveButton({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
    >
      {children}
    </motion.button>
  );
}
\\\

## Interaction Patterns

### 1. Loading States
Skeleton Screens: Preserve layout while loading
\\\jsx
function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 rounded-lg" />
      <div className="mt-4 h-4 bg-gray-200 rounded w-3/4" />
      <div className="mt-2 h-4 bg-gray-200 rounded w-1/2" />
    </div>
  );
}
\\\

### 2. State Transitions
Toggle with smooth transition:
\\\jsx
function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={\ relative w-12 h-6 rounded-full transition-colors duration-200 \ \}
    >
      <motion.span
        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow"
        animate={{ x: checked ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}
\\\

### 3. Page Transitions
Framer Motion layout animations:
\\\jsx
import { AnimatePresence, motion } from "framer-motion";

function PageTransition({ children, key }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
\\\

## Best Practices
1. Performance First: Use transform and opacity for smooth 60fps
2. Reduce Motion Support: Always respect prefers-reduced-motion
3. Consistent Timing: Use a timing scale across the app
4. Natural Physics: Prefer spring animations over linear
5. Interruptible: Allow users to cancel long animations
6. Progressive Enhancement: Work without JS animations
7. Test on Devices: Performance varies significantly
