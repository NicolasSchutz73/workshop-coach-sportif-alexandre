import { strapiFetch } from '@/lib/strapi'
import { normalizeInternalHref } from '@/lib/routes'
import { configuredSocialLink } from '@/lib/social-links'

export type FooterContent = {
  brandName: string
  description: string
  instagramUrl?: string
  whatsappUrl?: string
  nolioUrl?: string
  copyrightText: string
  locationText: string
  columns: Array<{
    title: string
    links: Array<{ href: string; label: string }>
  }>
}

export const legalLinks = [
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/politique-confidentialite', label: 'Confidentialité' },
  { href: '/cgv', label: 'CGV' },
]

export const fallbackFooter: FooterContent = {
  brandName: 'Alexandre Schutz',
  description:
    'Coach running & trail indépendant. Chambéry, Aix-les-Bains, Lac du Bourget et massifs de Savoie.',
  instagramUrl: undefined,
  whatsappUrl: undefined,
  nolioUrl: 'https://www.nolio.io/coach/alexandre.schutz.63155/',
  copyrightText: 'Alexandre Schutz Coaching. Tous droits réservés.',
  locationText: 'Chambéry · Savoie · France',
  columns: [
    {
      title: 'Navigation',
      links: [
        { href: '/', label: 'Accueil' },
        { href: '/services', label: 'Prestations' },
        { href: '/about', label: 'À propos' },
        { href: '/contact', label: 'Contact' },
      ],
    },
    {
      title: 'Prestations',
      links: [
        { href: '/services', label: 'Coaching mensuel' },
        { href: '/services', label: 'Séance 1-to-1' },
        { href: '/services', label: 'E-books & plans' },
      ],
    },
  ],
}

type StrapiSingleResponse<T> = {
  data?: StrapiEntity<T> | null
}

type StrapiEntity<T> = T & {
  id?: number
  documentId?: string
  attributes?: T
}

type StrapiFooter = {
  brandName?: string | null
  description?: string | null
  instagramUrl?: string | null
  whatsappUrl?: string | null
  nolioUrl?: string | null
  copyrightText?: string | null
  locationText?: string | null
  colonnes?: Array<{
    titre?: string | null
    liens?: Array<{
      libelle?: string | null
      lien?: string | null
    }> | null
  }> | null
}

function normalizeEntity<T>(entity: StrapiEntity<T>): T {
  return entity.attributes ?? entity
}

export async function getFooter(): Promise<FooterContent> {
  try {
    const response = await strapiFetch<StrapiSingleResponse<StrapiFooter>>(
      '/footer?populate[colonnes][populate][liens]=true',
      {
        next: {
          revalidate: Number(process.env.STRAPI_REVALIDATE_SECONDS ?? 60),
          tags: ['footer'],
        },
      },
    )

    if (!response.data) return fallbackFooter

    const data = normalizeEntity(response.data)

    const columns =
      data.colonnes
        ?.map((column) => ({
          title: column.titre?.trim() ?? '',
          links:
            column.liens
              ?.map((link) => ({
                label: link.libelle?.trim() ?? '',
                href: normalizeInternalHref(link.lien?.trim() ?? ''),
              }))
              .filter((link) => link.label && link.href) ?? [],
        }))
        .filter((column) => column.title && column.links.length > 0) ?? []

    return {
      brandName: data.brandName?.trim() || fallbackFooter.brandName,
      description: data.description?.trim() || fallbackFooter.description,
      instagramUrl: configuredSocialLink(data.instagramUrl),
      whatsappUrl: configuredSocialLink(data.whatsappUrl),
      nolioUrl: configuredSocialLink(data.nolioUrl),
      copyrightText:
        data.copyrightText?.trim() || fallbackFooter.copyrightText,
      locationText: data.locationText?.trim() || fallbackFooter.locationText,
      columns: columns.length > 0 ? columns : fallbackFooter.columns,
    }
  } catch {
    return fallbackFooter
  }
}
