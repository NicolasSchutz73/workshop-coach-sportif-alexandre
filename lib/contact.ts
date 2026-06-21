import {
  type PageHeaderContent,
  type SeoContent,
  splitKeywords,
} from '@/lib/content'
import { strapiFetch } from '@/lib/strapi'

export type ContactContent = {
  seo: SeoContent
  header: PageHeaderContent
  detailsTitle: string
  detailsDescription: string
  details: Array<{
    type: 'zone' | 'email' | 'telephone' | 'instagram'
    label: string
    value: string
    href?: string
  }>
  availabilityTitle: string
  hours: Array<{ days: string; hours: string }>
  goals: string[]
  privacyText: string
}

export const fallbackContact: ContactContent = {
  seo: {
    title: 'Contact',
    description:
      "Contactez votre coach running et trail à Chambéry. Posez vos questions sur le coaching, les plans d'entraînement et les e-books.",
    keywords: ['contact coach running Chambéry', 'coach trail Savoie'],
  },
  header: {
    eyebrow: 'Contact',
    title: 'Parlons de votre projet',
    description:
      "Une question sur le coaching, un plan d'entraînement ou un e-book ? Écrivez-moi, je réponds toujours personnellement.",
  },
  detailsTitle: 'Coordonnées',
  detailsDescription:
    'Basé à Chambéry, j’accompagne les coureurs en présentiel en Savoie et en visio partout en France.',
  details: [
    {
      type: 'zone',
      label: 'Zone',
      value: 'Chambéry & lac du Bourget, Savoie',
    },
    {
      type: 'email',
      label: 'Email',
      value: 'contact@alexandreschutz.fr',
      href: 'mailto:contact@alexandreschutz.fr',
    },
    {
      type: 'telephone',
      label: 'Téléphone',
      value: '06 12 34 56 78',
      href: 'tel:+33612345678',
    },
    {
      type: 'instagram',
      label: 'Instagram',
      value: '@alexandre.schutz.running',
      href: 'https://instagram.com',
    },
  ],
  availabilityTitle: 'Disponibilités',
  hours: [
    { days: 'Lundi – Vendredi', hours: '7h – 20h' },
    { days: 'Samedi', hours: '8h – 13h' },
    { days: 'Dimanche', hours: 'Fermé' },
  ],
  goals: [
    '10 km',
    'Semi-marathon',
    'Marathon',
    'Trail',
    'Ultra-trail',
    'Remise en forme',
  ],
  privacyText:
    'Vos informations restent confidentielles et ne sont jamais partagées.',
}

type StrapiContact = {
  seo?: { titre?: string; description?: string; motsCles?: string } | null
  entete?: { surtitre?: string; titre?: string; description?: string } | null
  titreCoordonnees?: string | null
  descriptionCoordonnees?: string | null
  coordonnees?: Array<{
    type?: ContactContent['details'][number]['type']
    libelle?: string
    valeur?: string
    lien?: string | null
  }> | null
  titreDisponibilites?: string | null
  horaires?: Array<{ jours?: string; heures?: string }> | null
  objectifsFormulaire?: Array<{ texte?: string }> | null
  confidentialiteFormulaire?: string | null
}

export async function getContactContent(): Promise<ContactContent> {
  try {
    const response = await strapiFetch<{ data?: StrapiContact | null }>(
      '/page-contact?populate=*',
      {
        next: {
          revalidate: Number(process.env.STRAPI_REVALIDATE_SECONDS ?? 60),
          tags: ['contact-page'],
        },
      },
    )
    const data = response.data
    if (!data) return fallbackContact

    const details: ContactContent['details'] = []
    for (const item of data.coordonnees ?? []) {
      const label = item.libelle?.trim()
      const value = item.valeur?.trim()

      if (!item.type || !label || !value) continue

      details.push({
        type: item.type,
        label,
        value,
        href: item.lien?.trim() || undefined,
      })
    }
    const hours =
      data.horaires
        ?.map((item) => ({
          days: item.jours?.trim() ?? '',
          hours: item.heures?.trim() ?? '',
        }))
        .filter((item) => item.days && item.hours) ?? []
    const goals =
      data.objectifsFormulaire
        ?.map((item) => item.texte?.trim())
        .filter((goal): goal is string => Boolean(goal)) ?? []
    const keywords = splitKeywords(data.seo?.motsCles)

    return {
      seo: {
        title: data.seo?.titre?.trim() || fallbackContact.seo.title,
        description:
          data.seo?.description?.trim() || fallbackContact.seo.description,
        keywords:
          keywords.length > 0 ? keywords : fallbackContact.seo.keywords,
      },
      header: {
        eyebrow:
          data.entete?.surtitre?.trim() || fallbackContact.header.eyebrow,
        title: data.entete?.titre?.trim() || fallbackContact.header.title,
        description:
          data.entete?.description?.trim() ||
          fallbackContact.header.description,
      },
      detailsTitle:
        data.titreCoordonnees?.trim() || fallbackContact.detailsTitle,
      detailsDescription:
        data.descriptionCoordonnees?.trim() ||
        fallbackContact.detailsDescription,
      details: details.length > 0 ? details : fallbackContact.details,
      availabilityTitle:
        data.titreDisponibilites?.trim() ||
        fallbackContact.availabilityTitle,
      hours: hours.length > 0 ? hours : fallbackContact.hours,
      goals: goals.length > 0 ? goals : fallbackContact.goals,
      privacyText:
        data.confidentialiteFormulaire?.trim() ||
        fallbackContact.privacyText,
    }
  } catch {
    return fallbackContact
  }
}
