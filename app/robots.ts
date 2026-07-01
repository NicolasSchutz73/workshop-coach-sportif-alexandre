import type { MetadataRoute } from 'next'
import { getSiteUrl, isProduction } from '@/lib/environment'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl()

  return {
    rules: {
      userAgent: '*',
      allow: isProduction() ? '/' : undefined,
      disallow: isProduction() ? ['/api/'] : '/',
    },
    sitemap: new URL('/sitemap.xml', baseUrl).toString(),
    host: isProduction() ? baseUrl.origin : undefined,
  }
}
