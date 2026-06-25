export const reservationPath = '/reservation'

export function normalizeInternalHref(href: string) {
  return href === '/booking' ? reservationPath : href
}
