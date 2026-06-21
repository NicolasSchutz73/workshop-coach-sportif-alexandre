import type { MetadataRoute } from 'next'
import { getSiteSettings } from '@/lib/site'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings()

  return {
    name: settings.appName,
    short_name: settings.appShortName,
    description: settings.appDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f4f0',
    theme_color: '#f5f4f0',
    icons: [
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
