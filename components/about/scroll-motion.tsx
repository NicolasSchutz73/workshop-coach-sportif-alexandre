import Image from 'next/image'
import { Children, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type WrapperProps = {
  children: ReactNode
  className?: string
  itemClassName?: string
}

type SmoothScrollProps = {
  children: ReactNode
  className?: string
  amount?: number
  scaleFrom?: number
}

export function SmoothScrollLift({ children, className }: SmoothScrollProps) {
  return <div className={className}>{children}</div>
}

type TextRevealStackProps = WrapperProps & {
  duration?: number
  stagger?: number
}

export function TextRevealStack({
  children,
  className,
  itemClassName,
}: TextRevealStackProps) {
  if (!itemClassName) return <div className={className}>{children}</div>

  return (
    <div className={className}>
      {Children.toArray(children).map((child, index) => (
        <div key={index} className={itemClassName}>
          {child}
        </div>
      ))}
    </div>
  )
}

type LinkedRevealGroupProps = WrapperProps & {
  stagger?: number
}

export function LinkedRevealGroup({
  children,
  className,
  itemClassName,
}: LinkedRevealGroupProps) {
  if (!itemClassName) return <div className={className}>{children}</div>

  return (
    <div className={className}>
      {Children.toArray(children).map((child, index) => (
        <div key={index} className={itemClassName}>
          {child}
        </div>
      ))}
    </div>
  )
}

export function DiplomaRevealGroup({
  children,
  className,
  itemClassName,
}: LinkedRevealGroupProps) {
  if (!itemClassName) return <div className={className}>{children}</div>

  return (
    <div className={className}>
      {Children.toArray(children).map((child, index) => (
        <div key={index} className={itemClassName}>
          {child}
        </div>
      ))}
    </div>
  )
}

type ScrollImageFigureProps = {
  src: string
  alt: string
  captionTitle?: string
  captionText?: string
  className?: string
  imageClassName?: string
  sizes?: string
  preload?: boolean
  variant?: 'portrait' | 'wide'
}

export function ScrollImageFigure({
  src,
  alt,
  captionTitle,
  captionText,
  className,
  imageClassName,
  sizes = '100vw',
  preload = false,
  variant = 'portrait',
}: ScrollImageFigureProps) {
  return (
    <figure
      className={cn(
        'overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-foreground/10',
        className,
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden',
          variant === 'portrait' ? 'aspect-square' : 'aspect-[16/10]',
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={preload ? 'eager' : undefined}
          className={cn('object-cover', imageClassName)}
        />
      </div>
      {(captionTitle || captionText) && (
        <figcaption className="grid gap-1 border-t border-border px-5 py-4">
          {captionTitle && (
            <span className="font-heading text-base font-semibold">
              {captionTitle}
            </span>
          )}
          {captionText && (
            <span className="text-sm leading-relaxed text-muted-foreground">
              {captionText}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  )
}
