'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

const consentKey = 'analytics-consent-v1'
type Consent = 'accepted' | 'refused' | 'unknown'

export function AnalyticsConsent({ measurementId }: { measurementId?: string }) {
  const [consent, setConsent] = useState<Consent>('unknown')

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const stored = window.localStorage.getItem(consentKey)
      setConsent(stored === 'accepted' || stored === 'refused' ? stored : 'unknown')
    }, 0)
    return () => window.clearTimeout(timeout)
  }, [])

  const validMeasurementId =
    measurementId && /^G-[A-Z0-9]{6,20}$/.test(measurementId)
      ? measurementId
      : undefined

  if (!validMeasurementId) return null

  function choose(value: Exclude<Consent, 'unknown'>) {
    window.localStorage.setItem(consentKey, value)
    setConsent(value)
  }

  return (
    <>
      {consent === 'accepted' ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${validMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-consent" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('consent','default',{'analytics_storage':'granted'});gtag('config','${validMeasurementId}',{'anonymize_ip':true});`}
          </Script>
        </>
      ) : null}
      {consent === 'unknown' ? (
        <aside
          aria-label="Consentement aux statistiques"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-2xl border border-border bg-card p-5 shadow-xl"
        >
          <p className="font-heading text-base font-semibold">Mesure d’audience</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Autorisez-vous Google Analytics à mesurer la fréquentation du site ?
            Aucun script de mesure n’est chargé avant votre accord.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" onClick={() => choose('accepted')}>
              Accepter
            </Button>
            <Button type="button" variant="outline" onClick={() => choose('refused')}>
              Refuser
            </Button>
          </div>
        </aside>
      ) : null}
    </>
  )
}
