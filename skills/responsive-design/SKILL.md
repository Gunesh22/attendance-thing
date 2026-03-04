---
name: responsive-design
description: Master modern responsive design techniques (Container Queries, Fluid Typography, Grid/Flexbox) for all screen sizes.
---

# Responsive Design
Master modern responsive design techniques to create interfaces that adapt seamlessly across all screen sizes and device contexts.

## Core Capabilities

### 1. Container Queries
- Component-level responsiveness independent of viewport
- Container query units (cqi, cqw, cqh)
- Style queries for conditional styling

### 2. Fluid Typography & Spacing
- CSS clamp() for fluid scaling
- Viewport-relative units (vw, vh, dvh)
- Fluid type scales with min/max bounds

### 3. Layout Patterns
- CSS Grid for 2D layouts
- Flexbox for 1D distribution
- Intrinsic layouts (content-based sizing)

### 4. Breakpoint Strategy
- Mobile-first media queries
- Content-based breakpoints

## Modern Breakpoint Scale
\\\css
/* Mobile-first breakpoints */
/* Base: Mobile (< 640px) */
@media (min-width: 640px) { /* sm: Landscape phones, small tablets */ }
@media (min-width: 768px) { /* md: Tablets */ }
@media (min-width: 1024px) { /* lg: Laptops, small desktops */ }
@media (min-width: 1280px) { /* xl: Desktops */ }
@media (min-width: 1536px) { /* 2xl: Large desktops */ }
\\\

## Key Patterns

### Pattern 1: Container Queries
\\\css
.card-container { container-type: inline-size; container-name: card; }
@container card (min-width: 400px) {
  .card { display: grid; grid-template-columns: 200px 1fr; gap: 1rem; }
}
.card-title { font-size: clamp(1rem, 5cqi, 2rem); }
\\\

### Pattern 2: Fluid Typography
\\\css
:root {
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-xl: clamp(1.25rem, 1rem + 1.25vw, 1.5rem);
  --space-md: clamp(1rem, 0.8rem + 1vw, 1.5rem);
}
\\\

### Pattern 3: CSS Grid Responsive Layout
\\\css
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: 1.5rem;
}
\\\

### Pattern 5: Responsive Images
\\\jsx
function ResponsiveHero() {
  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet="/hero-wide.webp" type="image/webp" />
      <source media="(min-width: 768px)" srcSet="/hero-medium.webp" type="image/webp" />
      <img src="/hero-mobile.jpg" alt="Hero" className="w-full h-auto" />
    </picture>
  );
}
\\\

## Best Practices
1. **Mobile-First**: Start with mobile styles, enhance for larger screens.
2. **Content Breakpoints**: Set breakpoints based on content, not devices.
3. **Fluid Over Fixed**: Use fluid values for typography and spacing.
4. **Container Queries**: Use for component-level responsiveness.
5. **Touch Targets**: Maintain 44x44px minimum on mobile.
