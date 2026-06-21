'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { fadeIn, fadeUp, staggerContainer, viewportOnce } from '@/lib/animations'

type Element = 'div' | 'ul' | 'ol' | 'section'

type StaggerGroupProps = {
  children: ReactNode
  className?: string
  as?: Element
}

/**
 * Container that staggers the entrance of its StaggerItem children once
 * on scroll. Used only on real groups: piliers, cards, testimonials, principes.
 */
export function StaggerGroup({
  children,
  className,
  as = 'div',
}: StaggerGroupProps) {
  const MotionTag = motion[as]

  return (
    <MotionTag
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </MotionTag>
  )
}

type StaggerItemProps = {
  children: ReactNode
  className?: string
  as?: 'div' | 'li' | 'article' | 'figure'
}

export function StaggerItem({
  children,
  className,
  as = 'div',
}: StaggerItemProps) {
  const reduceMotion = useReducedMotion()
  const MotionTag = motion[as]

  return (
    <MotionTag className={className} variants={reduceMotion ? fadeIn : fadeUp}>
      {children}
    </MotionTag>
  )
}
