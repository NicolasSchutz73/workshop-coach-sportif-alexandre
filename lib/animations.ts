import type { Transition, Variants } from 'framer-motion'

/**
 * Shared Framer Motion design tokens for the "endurance alpine éditoriale"
 * direction: cinematic, minimal, premium. Motion stays short and restrained
 * so it confirms hierarchy without delaying reading or scroll responsiveness.
 */

// Easing inspired by editorial / cinematic reveals.
export const easing: [number, number, number, number] = [0.16, 1, 0.3, 1]

export const baseTransition: Transition = {
  duration: 0.4,
  ease: easing,
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
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
  hidden: { opacity: 0, scale: 0.99 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: easing },
  },
}

export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.02 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: easing },
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
}

/**
 * Use once so sections don't re-animate on every scroll pass. Triggering early
 * prevents content from appearing late after it has entered the viewport.
 */
export const viewportOnce = { once: true, amount: 0.08 } as const
