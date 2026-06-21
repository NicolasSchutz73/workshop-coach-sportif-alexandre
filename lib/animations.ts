import type { Transition, Variants } from 'framer-motion'

/**
 * Shared Framer Motion design tokens for the "endurance alpine éditoriale"
 * direction: cinematic, minimal, premium. Movement stays subtle — opacity
 * and small translations only, never on text-heavy parallax.
 */

// Easing inspired by editorial / cinematic reveals.
export const easing: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const baseTransition: Transition = {
  duration: 0.6,
  ease: easing,
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: baseTransition,
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: baseTransition,
  },
}

export const scaleReveal: Variants = {
  hidden: { opacity: 0, scale: 0.985 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: easing },
  },
}

export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.04 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: easing },
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

/**
 * Use once so sections don't re-animate on every scroll pass. amount ~0.2
 * triggers when roughly a fifth of the element is visible.
 */
export const viewportOnce = { once: true, amount: 0.2 } as const
