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
    title: 'Réserver une séance',
    description:
      'Réservez votre échange découverte ou votre séance de coaching running et trail à Chambéry. Présentiel en Savoie ou visio.',
    keywords: ['réserver coach running', 'séance coaching Chambéry'],
  },
  header: {
    eyebrow: 'Réservation',
    title: 'Réservons votre prochaine séance',
    description:
      'Choisissez le type de séance, votre date et votre créneau. On commence presque toujours par un échange découverte pour définir ensemble vos objectifs.',
  },
  processTitle: 'Comment ça se passe',
  steps: [
    'Vous choisissez un créneau qui vous convient ci-contre.',
    'Je vous confirme le rendez-vous par email avec le lieu ou le lien visio.',
    'On fait le point sur vos objectifs, votre passé sportif et vos contraintes.',
    'Je vous propose un accompagnement adapté à votre projet.',
  ],
  reassurances: [
    {
      icon: 'horloge',
      title: 'Réponse sous 24h',
      text: 'Chaque demande est confirmée personnellement par email dans la journée.',
    },
    {
      icon: 'localisation',
      title: 'Chambéry & alentours',
      text: 'Séances en présentiel autour du lac du Bourget, ou en visio partout en France.',
    },
    {
      icon: 'securite',
      title: 'Sans engagement',
      text: 'Le premier échange découverte est gratuit et sans aucun engagement.',
    },
  ],
  sessionTypes: [
    {
      id: 'discovery',
      label: 'Échange découverte',
      duration: '30 min',
      mode: 'Visio',
      icon: 'video',
    },
    {
      id: 'session',
      label: 'Séance coaching',
      duration: '60 min',
      mode: 'Présentiel',
      icon: 'localisation',
    },
    {
      id: 'online',
      label: 'Point coaching en ligne',
      duration: '45 min',
      mode: 'Visio',
      icon: 'video',
    },
  ],
  timeSlots: ['07:00', '08:30', '10:00', '12:00', '17:30', '18:30', '19:30'],
  closedWeekdays: [0],
  noPaymentText: 'Aucun paiement requis pour réserver un échange.',
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

    const keywords = splitKeywords(data.seo?.motsCles)
    const steps =
      data.etapes
        ?.map((item) => item.texte?.trim())
        .filter((item): item is string => Boolean(item)) ?? []
    const reassurances =
      data.reassurances
        ?.map((item) => ({
          icon: item.icone,
          title: item.titre?.trim() ?? '',
          text: item.texte?.trim() ?? '',
        }))
        .filter(
          (
            item,
          ): item is BookingContent['reassurances'][number] =>
            Boolean(item.icon && item.title && item.text),
        ) ?? []
    const sessionTypes =
      data.typesSeance
        ?.map((item) => ({
          id: item.identifiant?.trim() ?? '',
          label: item.libelle?.trim() ?? '',
          duration: item.duree?.trim() ?? '',
          mode: item.mode?.trim() ?? '',
          icon: item.icone,
        }))
        .filter(
          (
            item,
          ): item is BookingContent['sessionTypes'][number] =>
            Boolean(
              item.id &&
                item.label &&
                item.duration &&
                item.mode &&
                item.icon,
            ),
        ) ?? []
    const timeSlots =
      data.creneaux
        ?.map((item) => item.texte?.trim())
        .filter((item): item is string => Boolean(item)) ?? []
    const closedWeekdays =
      data.joursFermes
        ?.map((item) => weekdayByKey[item.jour ?? ''])
        .filter((day): day is number => day !== undefined) ?? []

    return {
      seo: {
        title: data.seo?.titre?.trim() || fallbackBooking.seo.title,
        description:
          data.seo?.description?.trim() || fallbackBooking.seo.description,
        keywords:
          keywords.length > 0 ? keywords : fallbackBooking.seo.keywords,
      },
      header: {
        eyebrow:
          data.entete?.surtitre?.trim() || fallbackBooking.header.eyebrow,
        title: data.entete?.titre?.trim() || fallbackBooking.header.title,
        description:
          data.entete?.description?.trim() ||
          fallbackBooking.header.description,
      },
      processTitle:
        data.titreDeroulement?.trim() || fallbackBooking.processTitle,
      steps: steps.length > 0 ? steps : fallbackBooking.steps,
      reassurances:
        reassurances.length > 0
          ? reassurances
          : fallbackBooking.reassurances,
      sessionTypes:
        sessionTypes.length > 0 ? sessionTypes : fallbackBooking.sessionTypes,
      timeSlots:
        timeSlots.length > 0 ? timeSlots : fallbackBooking.timeSlots,
      closedWeekdays:
        closedWeekdays.length > 0
          ? closedWeekdays
          : fallbackBooking.closedWeekdays,
      noPaymentText:
        data.texteSansPaiement?.trim() || fallbackBooking.noPaymentText,
    }
  } catch {
    return fallbackBooking
  }
}
