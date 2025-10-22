/**
 * Centralized Animation Configuration
 *
 * This file provides consistent animation variants and configurations
 * to be used throughout the application with framer-motion.
 */

import { Variants, Transition } from 'framer-motion';

// ============================================================================
// TIMING CONSTANTS
// ============================================================================

export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
} as const;

export const ANIMATION_DELAY = {
  none: 0,
  short: 0.1,
  medium: 0.2,
  long: 0.3,
} as const;

export const STAGGER_DELAY = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15,
} as const;

// ============================================================================
// EASING FUNCTIONS
// ============================================================================

export const EASING = {
  smooth: [0.25, 0.1, 0.25, 1],
  spring: [0.5, 0.75, 0.4, 1],
  ease: [0.4, 0, 0.2, 1],
} as const;

// ============================================================================
// COMMON TRANSITIONS
// ============================================================================

export const transition: Record<string, Transition> = {
  default: {
    duration: ANIMATION_DURATION.normal,
    ease: EASING.ease,
  },
  fast: {
    duration: ANIMATION_DURATION.fast,
    ease: EASING.ease,
  },
  slow: {
    duration: ANIMATION_DURATION.slow,
    ease: EASING.smooth,
  },
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 25,
  },
  springBouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 20,
  },
};

// ============================================================================
// FADE ANIMATIONS
// ============================================================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: transition.default,
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: transition.default,
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: transition.default,
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: transition.default,
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  show: {
    opacity: 1,
    x: 0,
    transition: transition.default,
  },
};

// ============================================================================
// SCALE ANIMATIONS
// ============================================================================

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: transition.spring,
  },
};

export const scaleInCenter: Variants = {
  hidden: { opacity: 0, scale: 0 },
  show: {
    opacity: 1,
    scale: 1,
    transition: transition.springBouncy,
  },
};

// ============================================================================
// CONTAINER ANIMATIONS (for staggered children)
// ============================================================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER_DELAY.normal,
      delayChildren: ANIMATION_DELAY.short,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER_DELAY.fast,
      delayChildren: ANIMATION_DELAY.none,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER_DELAY.slow,
      delayChildren: ANIMATION_DELAY.medium,
    },
  },
};

// ============================================================================
// SPECIALIZED ANIMATIONS
// ============================================================================

// For cards that lift on hover
export const cardHover = {
  rest: { y: 0 },
  hover: {
    y: -4,
    transition: transition.fast,
  },
};

// For buttons and interactive elements
export const buttonTap = {
  scale: 0.95,
  transition: transition.fast,
};

export const buttonHover = {
  scale: 1.05,
  transition: transition.fast,
};

// For loading/spinning animations
export const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

// For status indicators
export const statusPulse = {
  scale: [1, 1.2, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates a stagger delay for list items
 * @param index - The index of the item in the list
 * @param delayMultiplier - Multiplier for the delay (default: STAGGER_DELAY.normal)
 */
export const getStaggerDelay = (
  index: number,
  delayMultiplier: number = STAGGER_DELAY.normal
): number => {
  return index * delayMultiplier;
};

/**
 * Creates an initial animation prop with a custom delay
 * @param delay - Delay in seconds
 */
export const withDelay = (delay: number): Transition => ({
  ...transition.default,
  delay,
});

/**
 * Creates fade in up animation with custom delay
 * @param index - Item index for stagger effect
 * @param delayMultiplier - Multiplier for the delay
 */
export const fadeInUpWithDelay = (
  index: number,
  delayMultiplier: number = STAGGER_DELAY.normal
): { initial: any; animate: any; transition: Transition } => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    ...transition.default,
    delay: getStaggerDelay(index, delayMultiplier),
  },
});

/**
 * Creates a consistent page transition animation
 */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      ...transition.default,
      delay: ANIMATION_DELAY.short,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: transition.fast,
  },
};

// ============================================================================
// PRESET ANIMATION CONFIGURATIONS
// ============================================================================

/**
 * Common animation presets for different component types
 */
export const animationPresets = {
  // For form elements
  formField: fadeInUp,

  // For cards in a grid
  card: fadeInUp,

  // For page headers
  header: fadeInDown,

  // For modals and dialogs
  modal: scaleIn,

  // For alerts and notifications
  alert: fadeInDown,

  // For list items
  listItem: fadeInUp,

  // For empty states
  emptyState: fadeInUp,

  // For stats/metrics
  stat: fadeInUp,

  // For page containers
  page: pageTransition,
} as const;
