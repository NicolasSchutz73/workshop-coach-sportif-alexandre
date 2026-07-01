import type { MetadataRoute } from 'next'
import { ebookSlugs } from '@/lib/ebooks'
import { getSiteUrl } from '@/lib/environment'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl()
  const paths = [
    '/',
    '/services',
    '/about',
    '/contact',
    '/reservation',
    '/mentions-legales',
    '/politique-confidentialite',
    '/cgv',
    ...ebookSlugs.map((slug) => `/plans/${slug}`),
  ]

  return paths.map((pathname, index) => ({
    url: new URL(pathname, baseUrl).toString(),
    changeFrequency: index < 5 ? 'monthly' : 'yearly',
    priority: pathname === '/' ? 1 : pathname.startsWith('/plans/') ? 0.7 : 0.8,
  }))
}
