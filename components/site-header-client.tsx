'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { ButtonContent } from '@/lib/content'

type SiteHeaderClientProps = {
  brandName: string
  navigation: Array<{ href: string; label: string }>
  bookingButton: ButtonContent
}

export function SiteHeaderClient({
  brandName,
  navigation,
  bookingButton,
}: SiteHeaderClientProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="font-heading text-sm font-semibold tracking-[-0.04em] sm:text-base">
            {brandName}
          </span>
        </Link>

        <nav
          className="hidden items-center gap-7 md:flex"
          aria-label="Navigation principale"
        >
          {navigation.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className={cn(
                'border-b border-transparent py-1 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground hover:text-foreground',
                pathname === link.href && 'border-foreground text-foreground',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button
            asChild
            className="h-10 px-5 text-sm"
          >
            <Link href={bookingButton.href}>
              {bookingButton.label}
            </Link>
          </Button>
        </div>

        <button
          type="button"
          className="flex size-11 items-center justify-center text-foreground md:hidden"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav
            className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-5 py-5"
            aria-label="Navigation mobile"
          >
            {navigation.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'border-b border-border px-0 py-3 text-base font-medium text-muted-foreground transition-colors hover:text-foreground',
                  pathname === link.href && 'text-foreground',
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="mt-5 h-12 text-base">
              <Link
                href={bookingButton.href}
                onClick={() => setOpen(false)}
              >
                {bookingButton.label}
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
