import type { Metadata } from 'next'

export type SeoContent = {
  title: string
  description: string
  keywords: string[]
}

export type PageHeaderContent = {
  eyebrow: string
  title: string
  description: string
}

export type ButtonContent = {
  label: string
  href: string
}

export type StrapiBlocks = Array<{
  type?: string
  children?: Array<{ text?: string }>
}>

export function textFromBlocks(value?: StrapiBlocks | string | null) {
  if (!value) return ''
  if (typeof value === 'string') return value

  return value
    .map((block) =>
      block.children
        ?.map((child) => child.text)
        .filter(Boolean)
        .join(' '),
    )
    .filter(Boolean)
    .join('\n\n')
}

export function splitKeywords(value?: string | null) {
  return (
    value
      ?.split(/[\n,]/)
      .map((keyword) => keyword.trim())
      .filter(Boolean) ?? []
  )
}

export function metadataFromSeo(seo: SeoContent, pathname = '/'):
  Metadata {
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: pathname },
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url: pathname,
      title: seo.title,
      description: seo.description,
      siteName: 'Alexandre Schutz Coaching',
      images: [
        {
          url: '/images/hero-trail.jpg',
          width: 1200,
          height: 630,
          alt: 'Alexandre Schutz, coach running et trail en Savoie',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: ['/images/hero-trail.jpg'],
    },
  }
}
