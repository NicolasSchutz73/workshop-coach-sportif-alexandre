import type { Metadata, Viewport } from 'next'
import { AnalyticsConsent } from '@/components/analytics-consent'
import { getSiteUrl, isProduction } from '@/lib/environment'
import { getSiteSettings } from '@/lib/site'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  return {
    metadataBase: getSiteUrl(),
    title: {
      default: settings.globalSeo.title,
      template: settings.titleTemplate,
    },
    description: settings.globalSeo.description,
    keywords: settings.globalSeo.keywords,
    alternates: { canonical: '/' },
    verification:
      isProduction() && process.env.GOOGLE_SITE_VERIFICATION
        ? { google: process.env.GOOGLE_SITE_VERIFICATION }
        : undefined,
    manifest: '/manifest.webmanifest',
    icons: {
      icon: [
        {
          url: '/icon-light-32x32.png',
          media: '(prefers-color-scheme: light)',
        },
        {
          url: '/icon-dark-32x32.png',
          media: '(prefers-color-scheme: dark)',
        },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: '/apple-icon.png',
    },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f5f4f0',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await getSiteSettings()

  return (
    <html lang="fr" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        <AnalyticsConsent
          measurementId={
            isProduction()
              ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
              : undefined
          }
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': ['Person', 'ProfessionalService'],
              name: 'Alexandre Schutz',
              url: getSiteUrl().toString(),
              image: new URL('/images/coach-portrait.png', getSiteUrl()).toString(),
              description: settings.globalSeo.description,
              areaServed: ['Chambéry', 'Aix-les-Bains', 'Savoie'],
              knowsAbout: ['Running', 'Trail', 'Préparation marathon'],
            }).replace(/</g, '\\u003c'),
          }}
        />
      </body>
    </html>
  )
}
