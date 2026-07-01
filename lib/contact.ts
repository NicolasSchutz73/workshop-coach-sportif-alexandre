import type { PageHeaderContent, SeoContent } from '@/lib/content'
import { splitKeywords } from '@/lib/content'
import { getStrapiMediaUrl, strapiFetch } from '@/lib/strapi'

export type ContactContent = {
  seo: SeoContent
  header: PageHeaderContent
  image: { url: string; alt: string }
  objectives: string[]
  privacyText: string
}

export const fallbackContact: ContactContent = {
  seo: {
    title: 'Contact',
    description: "Contactez Alexandre Schutz pour toute question sur le coaching, les plans d'entraînement ou les e-books.",
    keywords: ['contact coach running', 'coach running Chambéry'],
  },
  header: {
    eyebrow: 'Contact',
    title: 'Parlons de votre projet',
    description: "Une question sur le coaching, un plan d’entraînement ou un e-book ?",
  },
  image: {
    url: '/images/contact-trail-runner.webp',
    alt: 'Un coureur de trail en montagne sous un ciel nuageux',
  },
  objectives: ['Coaching mensuel', 'Séance 1-to-1', 'E-book ou plan', 'Autre demande'],
  privacyText: 'Vos informations restent confidentielles et ne sont jamais partagées.',
}

type StrapiContact = {
  seo?: { titre?: string | null; description?: string | null; motsCles?: string | null } | null
  entete?: { surtitre?: string | null; titre?: string | null; description?: string | null } | null
  image?: { url?: string | null; alternativeText?: string | null } | null
  texteAlternatifImage?: string | null
  objectifsFormulaire?: Array<{ texte?: string | null }> | null
  confidentialiteFormulaire?: string | null
}

export function mapContactContent(data: StrapiContact): ContactContent {
  const keywords = splitKeywords(data.seo?.motsCles)
  const objectives = data.objectifsFormulaire?.map((item) => item.texte?.trim())
    .filter((item): item is string => Boolean(item)) ?? []

  return {
    seo: {
      title: data.seo?.titre?.trim() || fallbackContact.seo.title,
      description: data.seo?.description?.trim() || fallbackContact.seo.description,
      keywords: keywords.length > 0 ? keywords : fallbackContact.seo.keywords,
    },
    header: {
      eyebrow: data.entete?.surtitre?.trim() || fallbackContact.header.eyebrow,
      title: data.entete?.titre?.trim() || fallbackContact.header.title,
      description: data.entete?.description?.trim() || fallbackContact.header.description,
    },
    image: {
      url: getStrapiMediaUrl(data.image?.url) || fallbackContact.image.url,
      alt: data.texteAlternatifImage?.trim() || data.image?.alternativeText?.trim() || fallbackContact.image.alt,
    },
    objectives: objectives.length > 0 ? objectives : fallbackContact.objectives,
    privacyText: data.confidentialiteFormulaire?.trim() || fallbackContact.privacyText,
  }
}

export async function getContactContent(): Promise<ContactContent> {
  try {
    const response = await strapiFetch<{ data?: StrapiContact | null }>(
      '/page-contact?populate=*',
      { next: { revalidate: Number(process.env.STRAPI_REVALIDATE_SECONDS ?? 60), tags: ['contact-page'] } },
    )
    return response.data ? mapContactContent(response.data) : fallbackContact
  } catch {
    return fallbackContact
  }
}
