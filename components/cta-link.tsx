import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CtaButtonContent } from '@/lib/homepage'
import { cn } from '@/lib/utils'

type CtaLinkProps = {
  content: CtaButtonContent
  variant?: 'default' | 'outline'
  showArrow?: boolean
  className?: string
}

export function CtaLink({
  content,
  variant = 'default',
  showArrow = false,
  className,
}: CtaLinkProps) {
  return (
    <Button
      asChild
      size="lg"
      variant={variant}
      className={cn('h-12 rounded-full px-7 text-base', className)}
    >
      <Link href={content.href}>
        {content.label}
        {showArrow && <ArrowRight className="size-4" />}
      </Link>
    </Button>
  )
}
