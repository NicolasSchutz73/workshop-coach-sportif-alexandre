const placeholderLinks = new Set([
  'https://instagram.com',
  'https://www.instagram.com',
  'https://wa.me/33600000000',
  'https://nolio.io',
  'https://www.nolio.io',
])

export function configuredSocialLink(value?: string | null) {
  const normalized = value?.trim().replace(/\/$/, '')
  if (!normalized || placeholderLinks.has(normalized)) return undefined

  try {
    const url = new URL(normalized)
    return url.protocol === 'https:' ? value?.trim() : undefined
  } catch {
    return undefined
  }
}
