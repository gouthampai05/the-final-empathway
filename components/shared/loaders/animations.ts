/**
 * Shared animation variants and constants for all loader components
 * Ensures perfect consistency across the entire application
 */

import { Variants, Transition } from 'framer-motion';

/**
 * Standard container variant with staggered children animation
 */
export const loaderContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Standard item variant that fades in from below
 */
export const loaderItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

/**
 * Item variant that fades in from left (for content lines)
 */
export const loaderItemLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

/**
 * Item variant that fades in from right (for sidebars)
 */
export const loaderItemRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0 },
};

/**
 * Standard transition timing
 */
export const loaderTransition: Transition = {
  duration: 0.4,
};

/**
 * Quick transition for smaller elements
 */
export const loaderTransitionQuick: Transition = {
  duration: 0.3,
};

/**
 * Scale in animation for images/cards
 */
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: loaderTransition,
};
