import { strapiFetch } from '@/lib/strapi'
import {
  type ButtonContent,
  type SeoContent,
  splitKeywords,
} from '@/lib/content'

export type SiteSettings = {
  brandName: string
  navigation: Array<{ label: string; href: string }>
  bookingButton: ButtonContent
  globalSeo: SeoContent
  titleTemplate: string
  appName: string
  appShortName: string
  appDescription: string
}

export const fallbackSiteSettings: SiteSettings = {
  brandName: 'Alexandre Schutz',
  navigation: [
    { href: '/', label: 'Accueil' },
    { href: '/services', label: 'Prestations' },
    { href: '/about', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ],
  bookingButton: {
    label: 'Réserver un coaching',
    href: '/booking',
  },
  globalSeo: {
    title: 'Alexandre Schutz — Coach Running & Trail | Chambéry, Savoie',
    description:
      "Coach running et trail indépendant à Chambéry. Préparation marathon, semi-marathon et trail, coaching en ligne, suivi personnalisé et plans d'entraînement. Aix-les-Bains, Lac du Bourget, Savoie.",
    keywords: [
      'coach running Chambéry',
      'coach trail Savoie',
      'préparation marathon',
      'coaching running en ligne',
      'plan entraînement trail',
      'Lac du Bourget',
      'Aix-les-Bains',
    ],
  },
  titleTemplate: '%s | Alexandre Schutz — Coach Running',
  appName: 'Alexandre Schutz — Coach Running & Trail',
  appShortName: 'Alexandre Schutz Coaching',
  appDescription:
    'Coach running et trail indépendant à Chambéry, Savoie. Préparation marathon, trail et coaching en ligne.',
}

type StrapiSiteSettings = {
  nomMarque?: string | null
  navigation?: Array<{
    libelle?: string | null
    lien?: string | null
  }> | null
  boutonReservation?: {
    label?: string | null
    href?: string | null
  } | null
  seoGlobal?: {
    titre?: string | null
    description?: string | null
    motsCles?: string | null
  } | null
  modeleTitre?: string | null
  nomApplication?: string | null
  nomApplicationCourt?: string | null
  descriptionApplication?: string | null
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const response = await strapiFetch<{ data?: StrapiSiteSettings | null }>(
      '/parametres-site?populate=*',
      {
        next: {
          revalidate: Number(process.env.STRAPI_REVALIDATE_SECONDS ?? 60),
          tags: ['site-settings'],
        },
      },
    )
    const data = response.data

    if (!data) return fallbackSiteSettings

    const navigation =
      data.navigation
        ?.map((link) => ({
          label: link.libelle?.trim() ?? '',
          href: link.lien?.trim() ?? '',
        }))
        .filter((link) => link.label && link.href) ?? []
    const keywords = splitKeywords(data.seoGlobal?.motsCles)

    return {
      brandName: data.nomMarque?.trim() || fallbackSiteSettings.brandName,
      navigation:
        navigation.length > 0 ? navigation : fallbackSiteSettings.navigation,
      bookingButton: {
        label:
          data.boutonReservation?.label?.trim() ||
          fallbackSiteSettings.bookingButton.label,
        href:
          data.boutonReservation?.href?.trim() ||
          fallbackSiteSettings.bookingButton.href,
      },
      globalSeo: {
        title:
          data.seoGlobal?.titre?.trim() ||
          fallbackSiteSettings.globalSeo.title,
        description:
          data.seoGlobal?.description?.trim() ||
          fallbackSiteSettings.globalSeo.description,
        keywords:
          keywords.length > 0
            ? keywords
            : fallbackSiteSettings.globalSeo.keywords,
      },
      titleTemplate:
        data.modeleTitre?.trim() || fallbackSiteSettings.titleTemplate,
      appName: data.nomApplication?.trim() || fallbackSiteSettings.appName,
      appShortName:
        data.nomApplicationCourt?.trim() ||
        fallbackSiteSettings.appShortName,
      appDescription:
        data.descriptionApplication?.trim() ||
        fallbackSiteSettings.appDescription,
    }
  } catch {
    return fallbackSiteSettings
  }
}
