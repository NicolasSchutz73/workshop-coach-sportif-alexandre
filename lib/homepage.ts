import {
  Gauge,
  Laptop,
  LineChart,
  Target,
  type LucideIcon,
} from 'lucide-react'
import { getStrapiMediaUrl, strapiFetch } from '@/lib/strapi'
import {
  type SeoContent,
  splitKeywords,
} from '@/lib/content'

export type CtaButtonContent = {
  label: string
  href: string
}

export type HomepageHero = {
  bannerImageUrl: string
  bannerImageAlt: string
  location: string
  title: string
  description: string
  primaryButtonLabel: string
  primaryButtonHref: string
  secondaryButtonLabel: string
  secondaryButtonHref: string
}

export type Benefit = {
  icon: LucideIcon
  title: string
  description: string
}

export type AboutPreviewContent = {
  eyebrow: string
  title: string
  description: string
  imageUrl: string
  imageAlt: string
  certifications: string[]
  ctaLabel: string
  ctaHref: string
}

export type FaqItem = {
  question: string
  answer: string
}

export type FinalCtaContent = {
  title: string
  description: string
  primaryButton: CtaButtonContent
  secondaryButton: CtaButtonContent
  imageUrl: string
  imageAlt: string
}

export type SectionIntroContent = {
  eyebrow?: string
  title: string
  description?: string
  button?: CtaButtonContent
}

export type TestimonialContent = {
  quote: string
  name: string
  detail: string
  rating: number
}

export type HomepageContent = {
  seo: SeoContent
  hero: HomepageHero
  benefits: Benefit[]
  servicesIntro: SectionIntroContent
  aboutPreview: AboutPreviewContent
  testimonialsIntro: SectionIntroContent
  testimonials: TestimonialContent[]
  faqIntro: SectionIntroContent
  faqs: FaqItem[]
  finalCta: FinalCtaContent
}

export const fallbackHomepageSeo: SeoContent = {
  title: 'Alexandre Schutz — Coach Running & Trail | Chambéry, Savoie',
  description:
    "Coach running et trail indépendant à Chambéry. Préparation marathon, semi-marathon et trail, coaching en ligne, suivi personnalisé et plans d'entraînement.",
  keywords: [
    'coach running Chambéry',
    'coach trail Savoie',
    'préparation marathon',
    'coaching running en ligne',
  ],
}

export const fallbackServicesIntro: SectionIntroContent = {
  eyebrow: 'Prestations',
  title: 'Un accompagnement pour chaque coureur',
  description:
    'Du suivi ponctuel au coaching complet, choisissez la formule adaptée à vos objectifs.',
  button: {
    label: 'Toutes les prestations',
    href: '/services',
  },
}

export const fallbackTestimonialsIntro: SectionIntroContent = {
  eyebrow: 'Témoignages',
  title: 'Des progrès réels, des coureurs satisfaits',
  description:
    'Quelques histoires d’athlètes accompagnés vers leurs objectifs.',
}

export const fallbackTestimonials: TestimonialContent[] = [
  {
    quote:
      'En six mois, je suis passé d’un objectif “finir” à un marathon en 3h28. Le suivi d’Alexandre est précis, humain et toujours bienveillant.',
    name: 'Julien M.',
    detail: 'Marathon de Lyon — 3h28',
    rating: 5,
  },
  {
    quote:
      'J’avais peur de me blesser en reprenant. Le plan progressif m’a redonné confiance et le plaisir de courir autour du Lac du Bourget.',
    name: 'Camille R.',
    detail: 'Reprise running',
    rating: 5,
  },
  {
    quote:
      'Pour mon premier trail de 42 km, j’étais parfaitement préparée. Gestion de l’effort, dénivelé, nutrition : tout était cadré.',
    name: 'Sophie L.',
    detail: 'Trail des Aravis — 42 km',
    rating: 5,
  },
]

export const fallbackFaqIntro: SectionIntroContent = {
  eyebrow: 'Questions fréquentes',
  title: 'Tout ce qu’il faut savoir',
}

export const fallbackHomepageHero: HomepageHero = {
  bannerImageUrl: '/images/hero-trail.png',
  bannerImageAlt:
    'Coureur de trail sur une crête de montagne au lever du soleil en Savoie',
  location: 'Chambéry · Aix-les-Bains · Lac du Bourget',
  title: 'Courez plus loin, progressez plus vite.',
  description:
    'Coaching running & trail personnalisé en Savoie. Un accompagnement sur-mesure pour préparer votre marathon, votre trail ou simplement reprendre le plaisir de courir.',
  primaryButtonLabel: 'Réserver un coaching',
  primaryButtonHref: '/booking',
  secondaryButtonLabel: 'Découvrir les prestations',
  secondaryButtonHref: '/services',
}

export const fallbackBenefits: Benefit[] = [
  {
    icon: Target,
    title: 'Coaching personnalisé',
    description:
      'Un plan d’entraînement construit autour de vos objectifs, votre niveau et votre emploi du temps.',
  },
  {
    icon: LineChart,
    title: 'Suivi de progression',
    description:
      'Analyse de vos séances, ajustements réguliers et feedback à chaque étape via Nolio.',
  },
  {
    icon: Gauge,
    title: 'Performance running',
    description:
      'Travail du seuil, du fractionné et de l’endurance pour gagner en vitesse et en régularité.',
  },
  {
    icon: Laptop,
    title: 'Flexibilité & en ligne',
    description:
      'Coaching à distance où que vous soyez, avec un accompagnement humain et réactif.',
  },
]

export const fallbackAboutPreview: AboutPreviewContent = {
  eyebrow: 'À propos',
  title: 'Coureur avant d’être coach',
  description:
    'Je m’appelle Alexandre. Né au pied des massifs de Savoie, je cours depuis plus de quinze ans, du 10 km sur route aux longs trails en montagne. Mon approche est simple : un entraînement structuré, progressif et respectueux de votre corps, pour durer et prendre du plaisir à chaque sortie.',
  imageUrl: '/images/coach-portrait.png',
  imageAlt: 'Alexandre Schutz, coach running et trail en Savoie',
  certifications: [
    'Diplômé d’État (BPJEPS) — Athlétisme & course hors stade',
    'Certifié préparation physique & trail',
    'Coureur trail & marathonien (PB 2h41)',
  ],
  ctaLabel: 'Mon parcours',
  ctaHref: '/about',
}

export const fallbackFaqs: FaqItem[] = [
  {
    question: 'Comment se passe la réservation d’un coaching ?',
    answer:
      'Vous réservez un premier échange gratuit depuis la page Réservation. Nous faisons le point sur vos objectifs, votre niveau et vos disponibilités, puis je vous propose la formule la plus adaptée.',
  },
  {
    question: 'Faut-il être un coureur expérimenté ?',
    answer:
      'Pas du tout. J’accompagne aussi bien les débutants qui veulent reprendre en douceur que les coureurs confirmés visant une performance. Le plan est toujours adapté à votre niveau actuel.',
  },
  {
    question: 'Le coaching en ligne, ça fonctionne vraiment ?',
    answer:
      'Oui. Le suivi se fait via l’application Nolio avec des plans détaillés, des retours sur vos séances et des points visio réguliers. La distance n’empêche pas un accompagnement précis et humain.',
  },
  {
    question: 'Que contiennent les plans d’entraînement PDF ?',
    answer:
      'Chaque plan couvre plusieurs semaines de préparation (10 km, semi, marathon ou trail) avec les séances détaillées, des conseils d’allure, de nutrition et de récupération. Téléchargement immédiat après achat.',
  },
  {
    question: 'Dans quelles zones intervenez-vous en présentiel ?',
    answer:
      'Principalement autour de Chambéry, Aix-les-Bains, le Lac du Bourget et les massifs de Savoie (Bauges, Chartreuse). Le coaching en ligne est disponible partout.',
  },
]

export const fallbackFinalCta: FinalCtaContent = {
  title: 'Prêt à passer un cap ?',
  description:
    'Réservez votre premier échange gratuit. On définit ensemble vos objectifs et le plan pour les atteindre.',
  primaryButton: {
    label: 'Réserver un coaching',
    href: '/booking',
  },
  secondaryButton: {
    label: 'Poser une question',
    href: '/contact',
  },
  imageUrl: '/images/cta-mountains.png',
  imageAlt: 'Massifs de Savoie au crépuscule',
}

const fallbackHomepage: HomepageContent = {
  seo: fallbackHomepageSeo,
  hero: fallbackHomepageHero,
  benefits: fallbackBenefits,
  servicesIntro: fallbackServicesIntro,
  aboutPreview: fallbackAboutPreview,
  testimonialsIntro: fallbackTestimonialsIntro,
  testimonials: fallbackTestimonials,
  faqIntro: fallbackFaqIntro,
  faqs: fallbackFaqs,
  finalCta: fallbackFinalCta,
}

type StrapiSingleResponse<T> = {
  data?: StrapiEntity<T> | null
}

type StrapiEntity<T> = T & {
  id?: number
  documentId?: string
  attributes?: T
}

type StrapiBlocks = Array<{
  type?: string
  children?: Array<{
    text?: string
  }>
}>

type StrapiMedia = {
  url?: string | null
  alternativeText?: string | null
  attributes?: {
    url?: string | null
    alternativeText?: string | null
  }
  data?: {
    url?: string | null
    alternativeText?: string | null
    attributes?: {
      url?: string | null
      alternativeText?: string | null
    }
  } | null
}

type StrapiButton = {
  label?: string | null
  href?: string | null
}

type StrapiBenefit = {
  title?: string | null
  description?: string | null
  icon?: string | null
}

type StrapiAboutPreview = {
  eyebrow?: string | null
  title?: string | null
  description?: StrapiBlocks | string | null
  image?: StrapiMedia | null
  imageAlt?: string | null
  certifications?: Array<{ label?: string | null }> | null
  button?: StrapiButton | null
}

type StrapiFaq = {
  question?: string | null
  answer?: string | null
}

type StrapiFinalCta = {
  title?: string | null
  description?: string | null
  primaryButton?: StrapiButton | null
  secondaryButton?: StrapiButton | null
  image?: StrapiMedia | null
  imageAlt?: string | null
}

type StrapiSectionIntro = {
  surtitre?: string | null
  titre?: string | null
  description?: string | null
  bouton?: StrapiButton | null
}

type StrapiTestimonial = {
  citation?: string | null
  nom?: string | null
  detail?: string | null
  note?: number | null
}

type StrapiHomepage = {
  seo?: {
    titre?: string | null
    description?: string | null
    motsCles?: string | null
  } | null
  hero?: {
    image?: StrapiMedia | null
    location?: string | null
    title?: string | null
    description?: StrapiBlocks | string | null
    primaryButton?: StrapiButton | null
    secondaryButton?: StrapiButton | null
  } | null
  benefits?: StrapiBenefit[] | null
  introductionPrestations?: StrapiSectionIntro | null
  aboutPreview?: StrapiAboutPreview | null
  introductionTemoignages?: StrapiSectionIntro | null
  temoignages?: StrapiTestimonial[] | null
  introductionFaq?: StrapiSectionIntro | null
  faqs?: StrapiFaq[] | null
  finalCta?: StrapiFinalCta | null
}

const benefitIconByKey: Record<string, LucideIcon> = {
  target: Target,
  'line-chart': LineChart,
  gauge: Gauge,
  laptop: Laptop,
}

function normalizeEntity<T>(entity: StrapiEntity<T>): T {
  return entity.attributes ?? entity
}

function textFromBlocks(value?: StrapiBlocks | string | null) {
  if (!value) return ''
  if (typeof value === 'string') return value

  return value
    .map((block) =>
      block.children
        ?.map((child) => child.text)
        .filter(Boolean)
        .join(' '),
    )
    .filter(Boolean)
    .join('\n\n')
}

function normalizeImage(image?: StrapiMedia | null) {
  const data = image?.data?.attributes ?? image?.data ?? image?.attributes ?? image
  const url = getStrapiMediaUrl(data?.url)

  if (!url) return undefined

  return {
    url,
    alt: data?.alternativeText ?? undefined,
  }
}

function normalizeButton(
  button: StrapiButton | null | undefined,
  fallback: CtaButtonContent,
): CtaButtonContent {
  return {
    label: button?.label?.trim() || fallback.label,
    href: button?.href?.trim() || fallback.href,
  }
}

function mapHomepage(data: StrapiHomepage): HomepageContent {
  const heroImage = normalizeImage(data.hero?.image)
  const aboutImage = normalizeImage(data.aboutPreview?.image)
  const finalCtaImage = normalizeImage(data.finalCta?.image)
  const benefits =
    data.benefits
      ?.map((benefit, index) => {
        const fallback = fallbackBenefits[index]
        const title = benefit.title?.trim() || fallback?.title
        const description =
          benefit.description?.trim() || fallback?.description

        if (!title || !description) return null

        return {
          icon:
            benefitIconByKey[benefit.icon ?? ''] ?? fallback?.icon ?? Target,
          title,
          description,
        }
      })
      .filter((benefit): benefit is Benefit => Boolean(benefit)) ?? []
  const certifications =
    data.aboutPreview?.certifications
      ?.map((certification) => certification.label?.trim())
      .filter((label): label is string => Boolean(label)) ?? []
  const faqs =
    data.faqs
      ?.map((faq) => {
        const question = faq.question?.trim()
        const answer = faq.answer?.trim()

        return question && answer ? { question, answer } : null
      })
      .filter((faq): faq is FaqItem => Boolean(faq)) ?? []
  const testimonials =
    data.temoignages
      ?.map((testimonial) => {
        const quote = testimonial.citation?.trim()
        const name = testimonial.nom?.trim()
        const detail = testimonial.detail?.trim()

        if (!quote || !name || !detail) return null

        return {
          quote,
          name,
          detail,
          rating: Math.min(5, Math.max(1, testimonial.note ?? 5)),
        }
      })
      .filter(
        (testimonial): testimonial is TestimonialContent =>
          Boolean(testimonial),
      ) ?? []
  const seoKeywords = splitKeywords(data.seo?.motsCles)

  return {
    seo: {
      title: data.seo?.titre?.trim() || fallbackHomepageSeo.title,
      description:
        data.seo?.description?.trim() || fallbackHomepageSeo.description,
      keywords:
        seoKeywords.length > 0 ? seoKeywords : fallbackHomepageSeo.keywords,
    },
    hero: {
      bannerImageUrl:
        heroImage?.url || fallbackHomepageHero.bannerImageUrl,
      bannerImageAlt:
        heroImage?.alt || fallbackHomepageHero.bannerImageAlt,
      location:
        data.hero?.location?.trim() || fallbackHomepageHero.location,
      title: data.hero?.title?.trim() || fallbackHomepageHero.title,
      description:
        textFromBlocks(data.hero?.description).trim() ||
        fallbackHomepageHero.description,
      primaryButtonLabel: normalizeButton(
        data.hero?.primaryButton,
        {
          label: fallbackHomepageHero.primaryButtonLabel,
          href: fallbackHomepageHero.primaryButtonHref,
        },
      ).label,
      primaryButtonHref: normalizeButton(
        data.hero?.primaryButton,
        {
          label: fallbackHomepageHero.primaryButtonLabel,
          href: fallbackHomepageHero.primaryButtonHref,
        },
      ).href,
      secondaryButtonLabel: normalizeButton(
        data.hero?.secondaryButton,
        {
          label: fallbackHomepageHero.secondaryButtonLabel,
          href: fallbackHomepageHero.secondaryButtonHref,
        },
      ).label,
      secondaryButtonHref: normalizeButton(
        data.hero?.secondaryButton,
        {
          label: fallbackHomepageHero.secondaryButtonLabel,
          href: fallbackHomepageHero.secondaryButtonHref,
        },
      ).href,
    },
    benefits: benefits.length > 0 ? benefits : fallbackBenefits,
    servicesIntro: {
      eyebrow:
        data.introductionPrestations?.surtitre?.trim() ||
        fallbackServicesIntro.eyebrow,
      title:
        data.introductionPrestations?.titre?.trim() ||
        fallbackServicesIntro.title,
      description:
        data.introductionPrestations?.description?.trim() ||
        fallbackServicesIntro.description,
      button: normalizeButton(
        data.introductionPrestations?.bouton,
        fallbackServicesIntro.button!,
      ),
    },
    aboutPreview: {
      eyebrow:
        data.aboutPreview?.eyebrow?.trim() || fallbackAboutPreview.eyebrow,
      title: data.aboutPreview?.title?.trim() || fallbackAboutPreview.title,
      description:
        textFromBlocks(data.aboutPreview?.description).trim() ||
        fallbackAboutPreview.description,
      imageUrl: aboutImage?.url || fallbackAboutPreview.imageUrl,
      imageAlt:
        data.aboutPreview?.imageAlt?.trim() ||
        aboutImage?.alt ||
        fallbackAboutPreview.imageAlt,
      certifications:
        certifications.length > 0
          ? certifications
          : fallbackAboutPreview.certifications,
      ctaLabel: normalizeButton(
        data.aboutPreview?.button,
        {
          label: fallbackAboutPreview.ctaLabel,
          href: fallbackAboutPreview.ctaHref,
        },
      ).label,
      ctaHref: normalizeButton(
        data.aboutPreview?.button,
        {
          label: fallbackAboutPreview.ctaLabel,
          href: fallbackAboutPreview.ctaHref,
        },
      ).href,
    },
    testimonialsIntro: {
      eyebrow:
        data.introductionTemoignages?.surtitre?.trim() ||
        fallbackTestimonialsIntro.eyebrow,
      title:
        data.introductionTemoignages?.titre?.trim() ||
        fallbackTestimonialsIntro.title,
      description:
        data.introductionTemoignages?.description?.trim() ||
        fallbackTestimonialsIntro.description,
    },
    testimonials:
      testimonials.length > 0 ? testimonials : fallbackTestimonials,
    faqIntro: {
      eyebrow:
        data.introductionFaq?.surtitre?.trim() ||
        fallbackFaqIntro.eyebrow,
      title:
        data.introductionFaq?.titre?.trim() || fallbackFaqIntro.title,
      description:
        data.introductionFaq?.description?.trim() ||
        fallbackFaqIntro.description,
    },
    faqs: faqs.length > 0 ? faqs : fallbackFaqs,
    finalCta: {
      title: data.finalCta?.title?.trim() || fallbackFinalCta.title,
      description:
        data.finalCta?.description?.trim() || fallbackFinalCta.description,
      primaryButton: normalizeButton(
        data.finalCta?.primaryButton,
        fallbackFinalCta.primaryButton,
      ),
      secondaryButton: normalizeButton(
        data.finalCta?.secondaryButton,
        fallbackFinalCta.secondaryButton,
      ),
      imageUrl: finalCtaImage?.url || fallbackFinalCta.imageUrl,
      imageAlt:
        data.finalCta?.imageAlt?.trim() ||
        finalCtaImage?.alt ||
        fallbackFinalCta.imageAlt,
    },
  }
}

export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    const response = await strapiFetch<StrapiSingleResponse<StrapiHomepage>>(
      '/homepage?populate[seo]=true&populate[hero][populate][image]=true&populate[hero][populate][primaryButton]=true&populate[hero][populate][secondaryButton]=true&populate[benefits]=true&populate[introductionPrestations][populate][bouton]=true&populate[aboutPreview][populate][image]=true&populate[aboutPreview][populate][certifications]=true&populate[aboutPreview][populate][button]=true&populate[introductionTemoignages]=true&populate[temoignages]=true&populate[introductionFaq]=true&populate[faqs]=true&populate[finalCta][populate][primaryButton]=true&populate[finalCta][populate][secondaryButton]=true&populate[finalCta][populate][image]=true',
      {
        next: {
          revalidate: Number(process.env.STRAPI_REVALIDATE_SECONDS ?? 60),
          tags: ['homepage'],
        },
      },
    )

    if (!response.data) return fallbackHomepage

    return mapHomepage(normalizeEntity(response.data))
  } catch {
    return fallbackHomepage
  }
}
