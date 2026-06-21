export const ebookSlugs = [
  'plan-10-km',
  'plan-semi-marathon',
  'plan-marathon',
  'plan-trail-decouverte',
] as const

export type EbookSlug = (typeof ebookSlugs)[number]

type Ebook = {
  title: string
  variantEnvironmentName: string
}

export const ebooks: Record<EbookSlug, Ebook> = {
  'plan-10-km': {
    title: 'Plan 10 km',
    variantEnvironmentName: 'LEMONSQUEEZY_VARIANT_PLAN_10_KM',
  },
  'plan-semi-marathon': {
    title: 'Plan Semi-marathon',
    variantEnvironmentName: 'LEMONSQUEEZY_VARIANT_PLAN_SEMI_MARATHON',
  },
  'plan-marathon': {
    title: 'Plan Marathon',
    variantEnvironmentName: 'LEMONSQUEEZY_VARIANT_PLAN_MARATHON',
  },
  'plan-trail-decouverte': {
    title: 'Plan Trail découverte',
    variantEnvironmentName: 'LEMONSQUEEZY_VARIANT_PLAN_TRAIL_DECOUVERTE',
  },
}

export function isEbookSlug(value: string | null | undefined): value is EbookSlug {
  return ebookSlugs.some((slug) => slug === value)
}
