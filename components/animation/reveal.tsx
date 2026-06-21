'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import {
  baseTransition,
  fadeIn,
  fadeUp,
  scaleReveal,
  viewportOnce,
} from '@/lib/animations'

const variantMap = {
  fadeUp,
  fadeIn,
  scaleReveal,
} as const

type RevealProps = {
  children: ReactNode
  className?: string
  /** Which entrance variant to use. */
  variant?: keyof typeof variantMap
  /** Optional delay in seconds, useful for hand-tuned sequencing. */
  delay?: number
  /** Semantic element to render. */
  as?: 'div' | 'section' | 'li' | 'article' | 'figure' | 'header' | 'aside'
}

/**
 * Reveals its children once on scroll with a subtle opacity + small
 * translation. Honors prefers-reduced-motion by fading in place only.
 */
export function Reveal({
  children,
  className,
  variant = 'fadeUp',
  delay = 0,
  as = 'div',
}: RevealProps) {
  const reduceMotion = useReducedMotion()
  const MotionTag = motion[as]

  const variants = reduceMotion ? fadeIn : variantMap[variant]

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ ...baseTransition, delay }}
    >
      {children}
    </MotionTag>
  )
}
