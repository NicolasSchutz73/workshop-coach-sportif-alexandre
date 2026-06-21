import { SiteHeaderClient } from '@/components/site-header-client'
import { getSiteSettings } from '@/lib/site'

export async function SiteHeader() {
  const settings = await getSiteSettings()

  return (
    <SiteHeaderClient
      brandName={settings.brandName}
      navigation={settings.navigation}
      bookingButton={settings.bookingButton}
    />
  )
}
