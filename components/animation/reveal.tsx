import type { ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  variant?: 'fadeUp' | 'fadeIn' | 'scaleReveal'
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article' | 'figure' | 'header' | 'aside'
}

export function Reveal({
  children,
  className,
  as = 'div',
}: RevealProps) {
  const Tag = as

  return <Tag className={className}>{children}</Tag>
}
