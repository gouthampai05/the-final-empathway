# Design System Documentation

## Overview

This document defines the design patterns, animation principles, and UI guidelines for the Empathway application. The design system ensures a cohesive, smooth, and professional user experience across all pages.

## Design Principles

### 1. Smooth & Delightful
- **Micro-interactions**: Every user action has subtle feedback (hover states, scale transforms, etc.)
- **Fluid animations**: Use framer-motion for sophisticated animations with spring physics
- **Progressive disclosure**: Information reveals gracefully as users scroll or interact

### 2. Minimal & Clean
- **Whitespace**: Generous spacing between elements
- **Typography hierarchy**: Clear distinction between heading levels
- **Color restraint**: Primary color used sparingly for emphasis

### 3. Performance-First
- **Optimized animations**: Use transform and opacity for GPU-accelerated animations
- **Lazy loading**: Content animates in view for better performance
- **Reduced motion**: Respect user preferences (to be implemented)

## Animation Patterns

### Page Transitions

**Stagger Animation Pattern**:
```tsx
// For lists and grids
{items.map((item, index) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
  >
    {item}
  </motion.div>
))}
```

**Fade In Pattern**:
```tsx
// For page headers
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <h1>Page Title</h1>
</motion.div>
```

**Scroll-Based Animations**:
```tsx
// For blog content
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ['start end', 'end start']
});

const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5]);
```

### Interactive Elements

**Hover Effects**:
- **Cards**: `hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1`
- **Buttons**: `whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}`
- **Sidebar items**: `whileHover={{ x: 4 }}` for subtle slide

**Button Interactions**:
```tsx
<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
  <Button>Click me</Button>
</motion.div>
```

**Dropdown/Accordion**:
```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      {content}
    </motion.div>
  )}
</AnimatePresence>
```

## Component Patterns

### Dashboard Cards (StatCard)

**Features**:
- Staggered entrance animations with delays
- Hover state with shadow and lift effect
- Trend indicators with animated arrows
- Colored icons for visual hierarchy

**Usage**:
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: index * 0.1 }}
>
  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    {/* Card content */}
  </Card>
</motion.div>
```

### Data Tables

**Features**:
- Row-by-row stagger animation on load
- Hover state for entire row
- Smooth transitions between states
- Elevated appearance with shadow

**Pattern**:
```tsx
{data.map((row, index) => (
  <motion.tr
    key={row.id}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
    className="hover:bg-muted/50 transition-colors duration-200"
  >
    {/* Row cells */}
  </motion.tr>
))}
```

### Navigation Sidebar

**Features**:
- Spring-based drawer animation
- Animated chevrons for dropdowns
- Slide-in effect for submenu items
- Profile dropdown with scale animation

**Sidebar Animation**:
```tsx
<motion.aside
  initial={false}
  animate={{ x: sidebarOpen ? 0 : -256 }}
  transition={{ type: "spring", damping: 30, stiffness: 300 }}
>
  {/* Sidebar content */}
</motion.aside>
```

### Blog View Page

**Features**:
- Parallax header that fades as you scroll
- Content sections animate in as they enter viewport
- Smooth scroll progress indicator
- Gradient overlays for depth

**Scroll Animations**:
```tsx
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ['start start', 'end start']
});

const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
```

## Color System

### Semantic Colors

**From globals.css**:
- `--primary`: Main brand color (HSL: 214 84% 56%)
- `--primary-gradient`: Gradient for special elements
- `--muted`: Subtle background tints
- `--accent`: Interactive element backgrounds

### Color Usage

1. **Primary Color**: Use sparingly for CTAs, active states, and key UI elements
2. **Muted Backgrounds**: Layer pages with `bg-muted/10` to `bg-muted/20` gradients
3. **Semantic Icons**: Color-code icon backgrounds (blue for blogs, purple for email, etc.)

## Typography Scale

**Headings**:
- H1: `text-4xl font-bold tracking-tight`
- H2: `text-3xl font-bold tracking-tight`
- H3: `text-2xl font-semibold`
- H4: `text-xl font-semibold`

**Body Text**:
- Regular: `text-base`
- Small: `text-sm`
- Muted: `text-muted-foreground`

**Prose (Blog Content)**:
- Uses `prose-lg` with custom prose utilities
- Line height: `leading-[1.8]` for readability
- Enhanced link styles with underline offset

## Shadow System

From `globals.css`:
- `--shadow-sm`: Subtle lift for cards
- `--shadow-md`: Default card shadow
- `--shadow-lg`: Elevated modals/dropdowns
- `--shadow-elegant`: Special primary-colored shadow for emphasis

## Spacing Scale

**Consistent spacing using Tailwind's scale**:
- Page padding: `p-6` (24px)
- Card padding: `p-4` to `p-6`
- Element gaps: `gap-4` to `gap-6`
- Section spacing: `space-y-6` to `space-y-8`

## Responsive Design

### Breakpoints
- Mobile: Default (< 768px)
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)

### Mobile-First Patterns
- Sidebar: Hidden on mobile, drawer with overlay
- Tables: Full-width scrollable on mobile
- Grid layouts: Stack on mobile, multi-column on desktop

## Accessibility

### Current Implementation
- Semantic HTML structure
- Focus states on interactive elements
- ARIA labels for icon buttons
- Color contrast meeting WCAG AA standards

### To Be Implemented
- Keyboard navigation for sidebar
- Reduced motion preferences
- Screen reader announcements for dynamic content

## Best Practices

### DO's
✅ Use framer-motion for complex animations
✅ Stagger list/grid item animations
✅ Add hover states to all interactive elements
✅ Use spring transitions for natural feel
✅ Layer subtle gradients for depth
✅ Maintain consistent spacing rhythm

### DON'Ts
❌ Don't animate layout properties (width, height) without motion layout
❌ Don't use delays longer than 0.8s
❌ Don't stack multiple shadows
❌ Don't animate on every scroll event (use transforms)
❌ Don't forget to use `whileTap` for mobile feedback

## Component Checklist

When creating a new page or component:

- [ ] Add page entrance animation
- [ ] Implement hover states for interactive elements
- [ ] Use consistent spacing (gap-4, space-y-6)
- [ ] Add loading skeleton states
- [ ] Implement error states with animations
- [ ] Ensure mobile responsiveness
- [ ] Add proper TypeScript types
- [ ] Follow barrel export pattern from feature index

## Future Enhancements

1. **Theme System**: Dark mode with smooth transitions
2. **Motion Preferences**: Respect `prefers-reduced-motion`
3. **Loading States**: Skeleton screens for all async content
4. **Toast Animations**: Slide-in notifications with exit animations
5. **Page Transitions**: Shared element transitions between routes
6. **Accessibility**: Full keyboard navigation support

---

**Last Updated**: 2025-10-05
**Version**: 1.0.0
