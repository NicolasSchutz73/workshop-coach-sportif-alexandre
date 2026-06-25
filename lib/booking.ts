import {
  type PageHeaderContent,
  type SeoContent,
} from '@/lib/content'
import { strapiFetch } from '@/lib/strapi'

export type BookingContent = {
  seo: SeoContent
  header: PageHeaderContent
  processTitle: string
  steps: string[]
  reassurances: Array<{
    icon: 'horloge' | 'localisation' | 'securite'
    title: string
    text: string
  }>
  sessionTypes: Array<{
    id: string
    label: string
    duration: string
    mode: string
    icon: 'video' | 'localisation'
  }>
  timeSlots: string[]
  closedWeekdays: number[]
  noPaymentText: string
}

const weekdayByKey: Record<string, number> = {
  dimanche: 0,
  lundi: 1,
  mardi: 2,
  mercredi: 3,
  jeudi: 4,
  vendredi: 5,
  samedi: 6,
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
  reassurances: [
    {
      icon: 'horloge',
      title: 'Format à définir',
      text: 'La durée, le lieu exact et le contenu sont ajustés selon votre besoin.',
    },
    {
      icon: 'localisation',
      title: 'Autour de Chambéry',
      text: 'La séance se fait sur le terrain, dans un environnement adapté au travail prévu.',
    },
    {
      icon: 'securite',
      title: 'Sans suivi imposé',
      text: 'Vous pouvez réserver une séance ponctuelle avant d’envisager un accompagnement plus long.',
    },
  ],
  sessionTypes: [
    {
      id: 'one-to-one',
      label: 'Séance 1-to-1',
      duration: 'À définir',
      mode: 'Présentiel',
      icon: 'localisation',
    },
  ],
  timeSlots: ['07:00', '08:30', '10:00', '12:00', '17:30', '18:30', '19:30'],
  closedWeekdays: [0],
  noPaymentText:
    'Aucun paiement requis pour réserver ce créneau. Le format et le tarif de la séance 1-to-1 sont confirmés avec Alexandre avant la séance.',
}

type StrapiBooking = {
  seo?: { titre?: string; description?: string; motsCles?: string } | null
  entete?: { surtitre?: string; titre?: string; description?: string } | null
  titreDeroulement?: string | null
  etapes?: Array<{ texte?: string }> | null
  reassurances?: Array<{
    icone?: BookingContent['reassurances'][number]['icon']
    titre?: string
    texte?: string
  }> | null
  typesSeance?: Array<{
    identifiant?: string
    libelle?: string
    duree?: string
    mode?: string
    icone?: BookingContent['sessionTypes'][number]['icon']
  }> | null
  creneaux?: Array<{ texte?: string }> | null
  joursFermes?: Array<{ jour?: string }> | null
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

    const timeSlots =
      data.creneaux
        ?.map((item) => item.texte?.trim())
        .filter((item): item is string => Boolean(item)) ?? []
    const closedWeekdays =
      data.joursFermes
        ?.map((item) => weekdayByKey[item.jour ?? ''])
        .filter((day): day is number => day !== undefined) ?? []

    return {
      seo: fallbackBooking.seo,
      header: fallbackBooking.header,
      processTitle: fallbackBooking.processTitle,
      steps: fallbackBooking.steps,
      reassurances: fallbackBooking.reassurances,
      sessionTypes: fallbackBooking.sessionTypes,
      timeSlots:
        timeSlots.length > 0 ? timeSlots : fallbackBooking.timeSlots,
      closedWeekdays:
        closedWeekdays.length > 0
          ? closedWeekdays
          : fallbackBooking.closedWeekdays,
      noPaymentText: fallbackBooking.noPaymentText,
    }
  } catch {
    return fallbackBooking
  }
}
