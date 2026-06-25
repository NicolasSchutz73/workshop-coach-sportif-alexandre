'use client'

import { useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import type { EbookSlug } from '@/lib/ebooks'
import { cn } from '@/lib/utils'

type EbookCheckoutButtonProps = {
  ebook: EbookSlug
  label: string
  size?: 'xs' | 'sm' | 'default' | 'lg'
  className?: string
}

export function EbookCheckoutButton({
  ebook,
  label,
  size = 'sm',
  className,
}: EbookCheckoutButtonProps) {
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function startCheckout() {
    if (isRedirecting) return

    // Open synchronously from the user gesture so browsers do not block the
    // checkout after the asynchronous API request completes.
    const checkoutWindow = window.open('', '_blank')
    if (checkoutWindow) checkoutWindow.opener = null

    setIsRedirecting(true)
    setErrorMessage(null)

    try {
      const response = await fetch('/api/ebooks/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ebook }),
      })
      const payload = (await response.json().catch(() => null)) as {
        url?: string
        error?: string
      } | null

      if (!response.ok || !payload?.url) {
        throw new Error(
          payload?.error ?? 'Le paiement est temporairement indisponible.',
        )
      }

      if (!checkoutWindow) {
        throw new Error(
          'Votre navigateur a bloqué le nouvel onglet de paiement. Autorisez les pop-ups puis réessayez.',
        )
      }

      checkoutWindow.location.replace(payload.url)
    } catch (error) {
      checkoutWindow?.close()
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : 'Le paiement est temporairement indisponible.',
      )
      setIsRedirecting(false)
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        className={cn(buttonVariants({ size }), className ?? 'rounded-full')}
        disabled={isRedirecting}
        onClick={startCheckout}
      >
        {isRedirecting ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            Redirection…
          </>
        ) : (
          label
        )}
      </button>
      {errorMessage ? (
        <p role="alert" className="max-w-64 text-xs text-destructive">
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}
