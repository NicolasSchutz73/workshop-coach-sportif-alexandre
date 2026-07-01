import Image from 'next/image'
import { cn } from '@/lib/utils'

type ParallaxImageProps = {
  src: string
  alt: string
  className?: string
  imageClassName?: string
  fetchPriority?: 'high' | 'low' | 'auto'
  quality?: number
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
  fetchPriority,
  quality = 60,
  sizes = '100vw',
}: ParallaxImageProps) {
  return (
    <div className={cn('overflow-hidden', className)}>
      <Image
        src={src || '/placeholder.svg'}
        alt={alt}
        fill
        fetchPriority={fetchPriority}
        loading={fetchPriority === 'high' ? 'eager' : undefined}
        quality={quality}
        sizes={sizes}
        className={cn('object-cover', imageClassName)}
      />
    </div>
  )
}
