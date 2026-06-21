import {
  User,
  CalendarDays,
  BookOpen,
  Laptop,
  type LucideIcon,
} from 'lucide-react'
import { getStrapiMediaUrl, strapiFetch } from '@/lib/strapi'
import {
  type SeoContent,
  splitKeywords,
} from '@/lib/content'
import { isEbookSlug, type EbookSlug } from '@/lib/ebooks'

export type Service = {
  slug: string
  icon: LucideIcon
  name: string
  tagline: string
  price: string
  priceNote: string
  description: string
  features: string[]
  featured?: boolean
  featuredLabel?: string
  cta: string
  ctaHref: string
  image?: {
    url: string
    alt?: string
  }
}

export const fallbackServices: Service[] = [
  {
    slug: 'coaching-1to1',
    icon: User,
    name: 'Coaching 1-to-1',
    tagline: 'Séances individuelles',
    price: '55€',
    priceNote: '/ séance',
    description:
      'Des séances en présentiel autour de Chambéry et du Lac du Bourget, centrées sur votre technique et vos sensations.',
    features: [
      'Séance individuelle d’1h',
      'Analyse de la foulée',
      'Travail technique sur le terrain',
      'Conseils nutrition & récupération',
    ],
    cta: 'Réserver une séance',
    ctaHref: '/booking',
  },
  {
    slug: 'coaching-mensuel',
    icon: CalendarDays,
    name: 'Coaching mensuel',
    tagline: 'Le plus populaire',
    price: '120€',
    priceNote: '/ mois',
    description:
      'L’accompagnement complet pour progresser durablement, avec un plan évolutif et un suivi hebdomadaire.',
    features: [
      'Plan d’entraînement personnalisé',
      'Ajustements hebdomadaires',
      'Suivi illimité par messagerie',
      'Bilan mensuel de progression',
      'Accès à l’app Nolio',
    ],
    featured: true,
    featuredLabel: 'Le plus populaire',
    cta: 'Commencer maintenant',
    ctaHref: '/booking',
  },
  {
    slug: 'coaching-en-ligne',
    icon: Laptop,
    name: 'Coaching en ligne',
    tagline: 'Où que vous soyez',
    price: '89€',
    priceNote: '/ mois',
    description:
      'Tout le suivi à distance, idéal pour les coureurs autonomes qui veulent une structure et un regard expert.',
    features: [
      'Plan d’entraînement mensuel',
      'Suivi via Nolio',
      'Point visio bimensuel',
      'Réponses sous 24h',
    ],
    cta: 'Démarrer en ligne',
    ctaHref: '/booking',
  },
  {
    slug: 'ebooks-plans',
    icon: BookOpen,
    name: 'E-books & plans',
    tagline: 'En téléchargement',
    price: '19€',
    priceNote: '/ plan',
    description:
      'Des plans d’entraînement PDF prêts à l’emploi pour 10 km, semi, marathon et trail.',
    features: [
      'Plans 10 km, semi & marathon',
      'Plan trail découverte',
      'Conseils nutrition inclus',
      'Téléchargement immédiat',
    ],
    cta: 'Voir les plans',
    ctaHref: '/services',
  },
]

export const services = fallbackServices

export type TrainingPlan = {
  slug: EbookSlug
  title: string
  detail: string
  price: string
  button: {
    label: string
    href: string
  }
  longDescription: string
  cover: {
    url: string
    alt: string
  }
  contentsPreview: {
    url: string
    alt: string
  }
  tableOfContents: string[]
  receives: string[]
}

export type ServicesPageContent = {
  seo: SeoContent
  header: {
    eyebrow: string
    title: string
    description: string
  }
  plansSection: {
    eyebrow: string
    title: string
    description: string
    plans: TrainingPlan[]
    image: {
      url: string
      alt: string
    }
  }
  finalCta: {
    title: string
    description: string
    button: {
      label: string
      href: string
    }
  }
}

export const fallbackServicesPageContent: ServicesPageContent = {
  seo: {
    title: 'Prestations & tarifs',
    description:
      'Coaching running et trail à Chambéry : séances 1-to-1, coaching mensuel, suivi en ligne, e-books et plans d’entraînement. Tarifs clairs, accompagnement personnalisé.',
    keywords: [
      'coaching running Chambéry',
      'tarif coach running',
      'plan marathon',
      'coaching trail',
    ],
  },
  header: {
    eyebrow: 'Prestations',
    title: 'Choisissez votre accompagnement',
    description:
      'Des formules pensées pour chaque coureur, du suivi ponctuel au coaching complet. Premier échange toujours gratuit.',
  },
  plansSection: {
    eyebrow: 'E-books & plans',
    title: 'Des plans prêts à courir',
    description:
      'Idéal pour les coureurs autonomes. Téléchargez votre plan PDF et suivez une préparation structurée, semaine après semaine.',
    plans: [
      {
        slug: 'plan-10-km',
        title: 'Plan 10 km',
        detail: '8 semaines · débutant à intermédiaire',
        price: '19€',
        button: { label: 'Acheter', href: '/plans/plan-10-km' },
        longDescription:
          'Un cadre simple et progressif pour préparer votre premier 10 km ou retrouver de la régularité. Chaque semaine équilibre endurance, séances rythmées et récupération.',
        cover: {
          url: '/images/plans/plan-10-km-cover.png',
          alt: 'Coureur sur une route au lever du jour, face aux montagnes savoyardes',
        },
        contentsPreview: {
          url: '/images/plans/plan-10-km-contents.png',
          alt: 'Carnet de préparation et montre de course pour un plan 10 km',
        },
        tableOfContents: [
          'Le point de départ',
          'Les 8 semaines de préparation',
          'Allures et séances clés',
          'Conseils pour la semaine de course',
        ],
        receives: [
          'Un plan progressif sur 8 semaines',
          'Les allures expliquées simplement',
          'Des repères pour récupérer et rester régulier',
          'Un PDF clair, prêt à suivre',
        ],
      },
      {
        slug: 'plan-semi-marathon',
        title: 'Plan Semi-marathon',
        detail: '10 semaines · objectif chrono',
        price: '24€',
        button: { label: 'Acheter', href: '/plans/plan-semi-marathon' },
        longDescription:
          'Dix semaines pour construire une endurance solide, mieux gérer votre allure et arriver sur la ligne de départ avec une préparation cohérente.',
        cover: {
          url: '/images/plans/plan-semi-marathon-cover.png',
          alt: 'Coureur sur un chemin au bord d’un lac avec une crête alpine au loin',
        },
        contentsPreview: {
          url: '/images/plans/plan-semi-marathon-contents.png',
          alt: 'Carnet de préparation et équipement de course pour un semi-marathon',
        },
        tableOfContents: [
          'Poser les bonnes bases',
          'Les 10 semaines de préparation',
          'Séances à allure spécifique',
          'Stratégie de course et ravitaillement',
        ],
        receives: [
          'Un plan structuré sur 10 semaines',
          'Des séances ciblées pour votre objectif',
          'Des conseils d’allure et de ravitaillement',
          'Un PDF clair, prêt à suivre',
        ],
      },
      {
        slug: 'plan-marathon',
        title: 'Plan Marathon',
        detail: '12 semaines · structuré & progressif',
        price: '29€',
        button: { label: 'Acheter', href: '/plans/plan-marathon' },
        longDescription:
          'Une préparation progressive pour construire l’endurance nécessaire au marathon, répartir votre charge et aborder les longues sorties avec méthode.',
        cover: {
          url: '/images/plans/plan-marathon-cover.png',
          alt: 'Coureur sur une route de vallée entourée de montagnes',
        },
        contentsPreview: {
          url: '/images/plans/plan-marathon-contents.png',
          alt: 'Carnet de préparation, chaussure et carte pour un marathon',
        },
        tableOfContents: [
          'Construire votre endurance',
          'Les 12 semaines de préparation',
          'Longues sorties et semaines allégées',
          'La stratégie du jour J',
        ],
        receives: [
          'Un plan progressif sur 12 semaines',
          'Une structure claire pour les longues sorties',
          'Des repères pour gérer la charge et la récupération',
          'Un PDF clair, prêt à suivre',
        ],
      },
      {
        slug: 'plan-trail-decouverte',
        title: 'Plan Trail découverte',
        detail: '8 semaines · gestion du dénivelé',
        price: '24€',
        button: { label: 'Acheter', href: '/plans/plan-trail-decouverte' },
        longDescription:
          'Un premier cycle trail pour apprivoiser les montées, les descentes et le dénivelé sans brûler les étapes. Pensé pour prendre confiance sur les sentiers.',
        cover: {
          url: '/images/plans/plan-trail-decouverte-cover.png',
          alt: 'Coureur montant un sentier de montagne au-dessus d’une vallée',
        },
        contentsPreview: {
          url: '/images/plans/plan-trail-decouverte-contents.png',
          alt: 'Carnet de préparation, carte topographique et chaussures de trail',
        },
        tableOfContents: [
          'Découvrir le terrain',
          'Les 8 semaines de préparation',
          'Gérer montées et descentes',
          'Préparer votre première sortie trail',
        ],
        receives: [
          'Un plan trail progressif sur 8 semaines',
          'Des repères pour le dénivelé',
          'Des conseils pour courir en montée et en descente',
          'Un PDF clair, prêt à suivre',
        ],
      },
    ],
    image: {
      url: '/images/marathon.png',
      alt: 'Chaussures de trail en pleine foulée sur un sentier de montagne',
    },
  },
  finalCta: {
    title: 'Vous hésitez sur la formule ?',
    description:
      'Réservez un premier échange gratuit. On choisit ensemble la meilleure approche pour vos objectifs.',
    button: {
      label: 'Réserver un échange gratuit',
      href: '/booking',
    },
  },
}

type StrapiEntity<T> = T & {
  id?: number
  documentId?: string
  attributes?: T
}

type StrapiBlocksDescription = Array<{
  type?: string
  children?: Array<{
    text?: string
  }>
}>

type StrapiFeature = {
  id?: number
  name?: string | null
  description?: string | null
}

type StrapiMedia = {
  url?: string | null
  alternativeText?: string | null
  attributes?: {
    url?: string | null
    alternativeText?: string | null
  }
}

type StrapiService = {
  title?: string | null
  slug?: string | null
  tagline?: string | null
  description?: StrapiBlocksDescription | string | null
  price?: number | string | null
  priceNote?: string | null
  duration?: string | null
  featured?: boolean | null
  featuredLabel?: string | null
  features?: StrapiFeature[] | null
  image?: StrapiMedia | null
  order?: number | null
  button?: StrapiButton | null
}

type StrapiButton = {
  label?: string | null
  href?: string | null
}

type StrapiPlan = {
  slug?: string | null
  title?: string | null
  detail?: string | null
  price?: number | string | null
  button?: StrapiButton | null
  longDescription?: StrapiBlocksDescription | string | null
  cover?: StrapiMedia | null
  coverAlt?: string | null
  contentsPreview?: StrapiMedia | null
  contentsPreviewAlt?: string | null
  tableOfContents?: StrapiPlanItem[] | null
  receives?: StrapiPlanItem[] | null
}

type StrapiPlanItem = {
  title?: string | null
}

type StrapiServicesPage = {
  seo?: {
    titre?: string | null
    description?: string | null
    motsCles?: string | null
  } | null
  services?: StrapiService[] | null
  header?: {
    eyebrow?: string | null
    title?: string | null
    description?: string | null
  } | null
  plansSection?: {
    eyebrow?: string | null
    title?: string | null
    description?: string | null
    plans?: StrapiPlan[] | null
    image?: StrapiMedia | null
    imageAlt?: string | null
  } | null
  finalCta?: {
    title?: string | null
    description?: string | null
    button?: StrapiButton | null
  } | null
}

type StrapiSingleResponse<T> = {
  data?: StrapiEntity<T> | null
}

const iconBySlug: Record<string, LucideIcon> = {
  'coaching-1to1': User,
  'coaching-mensuel': CalendarDays,
  'coaching-en-ligne': Laptop,
  'ebooks-plans': BookOpen,
}

function normalizeEntity<T>(entity: StrapiEntity<T>): T {
  return entity.attributes ?? entity
}

function getFallbackBySlug(slug: string) {
  return fallbackServices.find((service) => service.slug === slug)
}

function textFromBlocks(description: StrapiService['description']) {
  if (!description) return ''
  if (typeof description === 'string') return description

  return description
    .map((block) =>
      block.children
        ?.map((child) => child.text)
        .filter(Boolean)
        .join(' '),
    )
    .filter(Boolean)
    .join('\n\n')
}

function formatPrice(price: StrapiService['price']) {
  if (price === null || price === undefined || price === '') return ''

  const numericPrice = typeof price === 'number' ? price : Number(price)
  if (!Number.isFinite(numericPrice)) return String(price)

  return `${new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: Number.isInteger(numericPrice) ? 0 : 2,
  }).format(numericPrice)}€`
}

function normalizeImage(image?: StrapiMedia | null) {
  const data = image?.attributes ?? image
  const url = getStrapiMediaUrl(data?.url)

  if (!url) return undefined

  return {
    url,
    alt: data?.alternativeText ?? undefined,
  }
}

function normalizeButton(
  button: StrapiButton | null | undefined,
  fallback: { label: string; href: string },
) {
  return {
    label: button?.label ?? fallback.label,
    href: button?.href ?? fallback.href,
  }
}

function toService(entry: StrapiEntity<StrapiService>, index: number): Service {
  const data = normalizeEntity(entry)
  const slug = data.slug ?? `service-${entry.documentId ?? entry.id ?? index}`
  const fallback = getFallbackBySlug(slug) ?? fallbackServices[index]
  const features =
    data.features
      ?.map((feature) => feature.name ?? feature.description)
      .filter((feature): feature is string => Boolean(feature)) ?? []

  return {
    slug,
    icon: iconBySlug[slug] ?? fallback?.icon ?? User,
    name: data.title ?? fallback?.name ?? 'Service',
    tagline: data.tagline ?? fallback?.tagline ?? '',
    price: formatPrice(data.price) || fallback?.price || '',
    priceNote: data.priceNote ?? fallback?.priceNote ?? '',
    description: textFromBlocks(data.description) || fallback?.description || '',
    features: features.length > 0 ? features : fallback?.features ?? [],
    featured: data.featured ?? fallback?.featured,
    featuredLabel:
      data.featuredLabel?.trim() || fallback?.featuredLabel,
    cta: data.button?.label ?? fallback?.cta ?? 'Réserver',
    ctaHref: data.button?.href ?? fallback?.ctaHref ?? '/booking',
    image: normalizeImage(data.image),
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const response = await strapiFetch<
      StrapiSingleResponse<StrapiServicesPage>
    >(
      '/services-page?populate[services][populate][features]=true&populate[services][populate][image]=true&populate[services][populate][button]=true',
      {
        next: {
          revalidate: Number(process.env.STRAPI_REVALIDATE_SECONDS ?? 60),
          tags: ['services-page'],
        },
      },
    )

    if (!response.data) return fallbackServices

    const data = normalizeEntity(response.data)
    if (!data.services?.length) return fallbackServices

    return data.services.map((service, index) =>
      toService(service as StrapiEntity<StrapiService>, index),
    )
  } catch {
    return fallbackServices
  }
}

export async function getServicesPageContent(): Promise<ServicesPageContent> {
  try {
    const response = await strapiFetch<
      StrapiSingleResponse<StrapiServicesPage>
    >(
      '/services-page?populate[seo]=true&populate[header]=true&populate[plansSection][populate][plans][populate][button]=true&populate[plansSection][populate][plans][populate][cover]=true&populate[plansSection][populate][plans][populate][contentsPreview]=true&populate[plansSection][populate][plans][populate][tableOfContents]=true&populate[plansSection][populate][plans][populate][receives]=true&populate[plansSection][populate][image]=true&populate[finalCta][populate][button]=true',
      {
        next: {
          revalidate: Number(process.env.STRAPI_REVALIDATE_SECONDS ?? 60),
          tags: ['services-page'],
        },
      },
    )

    if (!response.data) return fallbackServicesPageContent

    const data = normalizeEntity(response.data)
    const fallback = fallbackServicesPageContent
    const plansSection = data.plansSection
    const plans =
      plansSection?.plans?.map((plan, index) => {
        const fallbackPlan =
          (isEbookSlug(plan.slug)
            ? fallback.plansSection.plans.find(
                (candidate) => candidate.slug === plan.slug,
              )
            : undefined) ??
          fallback.plansSection.plans[index] ??
          fallback.plansSection.plans[0]
        const cover = normalizeImage(plan.cover)
        const contentsPreview = normalizeImage(plan.contentsPreview)
        const tableOfContents =
          plan.tableOfContents
            ?.map((item) => item.title?.trim())
            .filter((item): item is string => Boolean(item)) ?? []
        const receives =
          plan.receives
            ?.map((item) => item.title?.trim())
            .filter((item): item is string => Boolean(item)) ?? []

        return {
          slug: isEbookSlug(plan.slug) ? plan.slug : fallbackPlan.slug,
          title: plan.title ?? fallbackPlan.title,
          detail: plan.detail ?? fallbackPlan.detail,
          price: formatPrice(plan.price) || fallbackPlan.price,
          button: normalizeButton(plan.button, fallbackPlan.button),
          longDescription:
            textFromBlocks(plan.longDescription) || fallbackPlan.longDescription,
          cover: {
            url: cover?.url ?? fallbackPlan.cover.url,
            alt: plan.coverAlt ?? cover?.alt ?? fallbackPlan.cover.alt,
          },
          contentsPreview: {
            url: contentsPreview?.url ?? fallbackPlan.contentsPreview.url,
            alt:
              plan.contentsPreviewAlt ??
              contentsPreview?.alt ??
              fallbackPlan.contentsPreview.alt,
          },
          tableOfContents:
            tableOfContents.length > 0
              ? tableOfContents
              : fallbackPlan.tableOfContents,
          receives: receives.length > 0 ? receives : fallbackPlan.receives,
        }
      }) ?? fallback.plansSection.plans
    const image = normalizeImage(plansSection?.image)
    const seoKeywords = splitKeywords(data.seo?.motsCles)

    return {
      seo: {
        title: data.seo?.titre?.trim() || fallback.seo.title,
        description:
          data.seo?.description?.trim() || fallback.seo.description,
        keywords:
          seoKeywords.length > 0 ? seoKeywords : fallback.seo.keywords,
      },
      header: {
        eyebrow: data.header?.eyebrow ?? fallback.header.eyebrow,
        title: data.header?.title ?? fallback.header.title,
        description:
          data.header?.description ?? fallback.header.description,
      },
      plansSection: {
        eyebrow:
          plansSection?.eyebrow ?? fallback.plansSection.eyebrow,
        title: plansSection?.title ?? fallback.plansSection.title,
        description:
          plansSection?.description ?? fallback.plansSection.description,
        plans: plans.length > 0 ? plans : fallback.plansSection.plans,
        image: {
          url: image?.url ?? fallback.plansSection.image.url,
          alt:
            plansSection?.imageAlt ??
            image?.alt ??
            fallback.plansSection.image.alt,
        },
      },
      finalCta: {
        title: data.finalCta?.title ?? fallback.finalCta.title,
        description:
          data.finalCta?.description ?? fallback.finalCta.description,
        button: normalizeButton(
          data.finalCta?.button,
          fallback.finalCta.button,
        ),
      },
    }
  } catch {
    return fallbackServicesPageContent
  }
}

export async function getTrainingPlan(slug: string): Promise<TrainingPlan | null> {
  if (!isEbookSlug(slug)) return null

  const content = await getServicesPageContent()
  return (
    content.plansSection.plans.find((plan) => plan.slug === slug) ?? null
  )
}
