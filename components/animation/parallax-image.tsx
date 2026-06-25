import Image from 'next/image'
import { cn } from '@/lib/utils'

type ParallaxImageProps = {
  src: string
  alt: string
  className?: string
  imageClassName?: string
  priority?: boolean
  sizes?: string
  /** Kept for backwards compatibility; continuous scroll parallax is disabled. */
  intensity?: number
  /** Kept for backwards compatibility; image reveals are intentionally disabled. */
  reveal?: boolean
}

/**
 * Static image wrapper. Scroll-linked parallax was removed because continuous
 * animation work during scrolling made the interface feel less responsive.
 */
export function ParallaxImage({
  src,
  alt,
  className,
  imageClassName,
  priority = false,
  sizes = '100vw',
}: ParallaxImageProps) {
  return (
    <div className={cn('overflow-hidden', className)}>
      <Image
        src={src || '/placeholder.svg'}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn('object-cover', imageClassName)}
      />
    </div>
  )
}
