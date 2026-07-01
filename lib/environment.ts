const fallbackSiteUrl = 'http://localhost:3000'

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()

  try {
    return new URL(configured || fallbackSiteUrl)
  } catch {
    return new URL(fallbackSiteUrl)
  }
}

export function isProduction() {
  return process.env.NODE_ENV === 'production'
}
