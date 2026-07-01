import {
  type PageHeaderContent,
  type SeoContent,
  splitKeywords,
} from '@/lib/content'
import { strapiFetch } from '@/lib/strapi'

export type BookingContent = {
  seo: SeoContent
  header: PageHeaderContent
  processTitle: string
  steps: string[]
  noPaymentText: string
}

export const fallbackBooking: BookingContent = {
  seo: {
    title: 'Réserver une séance 1-to-1',
    description:
      'Réservez une séance 1-to-1 de coaching running à Chambéry pour travailler la technique, la reprise, la préparation d’une course ou la remise en route.',
    keywords: [
      'séance 1-to-1 running',
      'coach running Chambéry',
      'analyse foulée Chambéry',
    ],
  },
  header: {
    eyebrow: 'Séance ponctuelle',
    title: 'Réserver une séance 1-to-1',
    description:
      'Une séance individuelle pour travailler un point précis : technique, reprise, préparation d’une course ou remise en route. Le format et le tarif sont définis avec Alexandre selon votre besoin.',
  },
  processTitle: 'Ce que la séance couvre',
  steps: [
    'Séance terrain autour de Chambéry, adaptée à votre niveau et à votre objectif du moment.',
    'Analyse de la foulée, des appuis et des points techniques à corriger en priorité.',
    'Conseils personnalisés après la séance pour continuer à progresser sans repartir dans le flou.',
    'Idéal avant de choisir un suivi long, ou pour débloquer un point précis sans engagement mensuel.',
  ],
  noPaymentText:
    'Aucun paiement requis pour réserver ce créneau. Le format et le tarif de la séance 1-to-1 sont confirmés avec Alexandre avant la séance.',
}

type StrapiBooking = {
  seo?: { titre?: string; description?: string; motsCles?: string } | null
  entete?: { surtitre?: string; titre?: string; description?: string } | null
  titreDeroulement?: string | null
  etapes?: Array<{ texte?: string }> | null
  texteSansPaiement?: string | null
}

export async function getBookingContent(): Promise<BookingContent> {
  try {
    const response = await strapiFetch<{ data?: StrapiBooking | null }>(
      '/page-reservation?populate=*',
      {
        next: {
          revalidate: Number(process.env.STRAPI_REVALIDATE_SECONDS ?? 60),
          tags: ['booking-page'],
        },
      },
    )
    const data = response.data
    if (!data) return fallbackBooking

    return mapBookingContent(data)
  } catch {
    return fallbackBooking
  }
}

export function mapBookingContent(data: StrapiBooking): BookingContent {
  const steps = data.etapes
    ?.map((item) => item.texte?.trim())
    .filter((item): item is string => Boolean(item)) ?? []
  const keywords = splitKeywords(data.seo?.motsCles)

  return {
      seo: {
        title: data.seo?.titre?.trim() || fallbackBooking.seo.title,
        description: data.seo?.description?.trim() || fallbackBooking.seo.description,
        keywords: keywords.length > 0 ? keywords : fallbackBooking.seo.keywords,
      },
      header: {
        eyebrow: data.entete?.surtitre?.trim() || fallbackBooking.header.eyebrow,
        title: data.entete?.titre?.trim() || fallbackBooking.header.title,
        description: data.entete?.description?.trim() || fallbackBooking.header.description,
      },
      processTitle: data.titreDeroulement?.trim() || fallbackBooking.processTitle,
      steps: steps.length > 0 ? steps : fallbackBooking.steps,
      noPaymentText: data.texteSansPaiement?.trim() || fallbackBooking.noPaymentText,
  }
}
