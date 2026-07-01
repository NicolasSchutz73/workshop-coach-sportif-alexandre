import type { ReactNode } from 'react'

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
  const Tag = as

  return <Tag className={className}>{children}</Tag>
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
  const Tag = as

  return <Tag className={className}>{children}</Tag>
}
