'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { cn } from '@/lib/utils'

type ParallaxImageProps = {
  src: string
  alt: string
  className?: string
  imageClassName?: string
  priority?: boolean
  sizes?: string
  /** Parallax intensity as a fraction of element height (5–8% recommended). */
  intensity?: number
  /** Light scale reveal on first appearance. */
  reveal?: boolean
}

/**
 * Large image with a very light vertical parallax (desktop only) and an
 * optional scale reveal. Parallax and reveal are disabled when the user
 * prefers reduced motion. Text is never parallaxed.
 */
export function ParallaxImage({
  src,
  alt,
  className,
  imageClassName,
  priority = false,
  sizes = '100vw',
  intensity = 0.06,
  reveal = false,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsDesktop(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const parallaxEnabled = isDesktop && !reduceMotion
  const shift = `${intensity * 100}%`
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxEnabled ? [`-${shift}`, shift] : ['0%', '0%'],
  )

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <motion.div
        className="absolute inset-0"
        style={{ y, scale: parallaxEnabled ? 1.12 : 1 }}
        initial={reveal && !reduceMotion ? { opacity: 0 } : false}
        whileInView={reveal && !reduceMotion ? { opacity: 1 } : undefined}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={src || '/placeholder.svg'}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn('object-cover', imageClassName)}
        />
      </motion.div>
    </div>
  )
}
