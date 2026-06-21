import {
  type ButtonContent,
  type PageHeaderContent,
  type SeoContent,
  type StrapiBlocks,
  splitKeywords,
  textFromBlocks,
} from '@/lib/content'
import { getStrapiMediaUrl, strapiFetch } from '@/lib/strapi'

export type AboutContent = {
  seo: SeoContent
  header: PageHeaderContent
  image: { url: string; alt: string }
  storyTitle: string
  storyParagraphs: string[]
  certificationsTitle: string
  certifications: string[]
  socialsTitle: string
  socials: Array<{
    platform: 'instagram' | 'whatsapp' | 'nolio'
    label: string
    href: string
  }>
  philosophyTitle: string
  principles: Array<{ title: string; description: string }>
  ctaTitle: string
  primaryButton: ButtonContent
  secondaryButton: ButtonContent
}

export const fallbackAbout: AboutContent = {
  seo: {
    title: 'À propos',
    description:
      'Découvrez le parcours d’Alexandre Schutz, coach running et trail indépendant en Savoie : certifications, philosophie d’entraînement et approche personnalisée.',
    keywords: ['Alexandre Schutz coach', 'coach running Savoie'],
  },
  header: {
    eyebrow: 'À propos',
    title: 'Coureur de cœur, coach de métier',
    description:
      'Mon objectif : vous aider à progresser durablement, en respectant votre corps et en gardant le plaisir de courir intact.',
  },
  image: {
    url: '/images/coach-portrait.png',
    alt: 'Alexandre Schutz, coach running et trail',
  },
  storyTitle: 'Mon parcours',
  storyParagraphs: [
    'J’ai grandi entre le Lac du Bourget et les massifs des Bauges, où la course est vite devenue une évidence. Des premières foulées sur piste aux longs trails en montagne, j’ai exploré toutes les facettes de ce sport — et toutes ses exigences.',
    'Après plusieurs années de compétition et un diplôme d’État en poche, j’ai choisi d’accompagner d’autres coureurs. Depuis, j’ai suivi plus de 120 athlètes, du débutant complet au marathonien cherchant à battre son record.',
    'Mon approche repose sur l’individualisation : aucun plan standardisé, mais un entraînement pensé pour vous, votre vie et vos ambitions.',
  ],
  certificationsTitle: 'Certifications',
  certifications: [
    'BPJEPS Athlétisme — course hors stade',
    'Certificat préparation physique',
    'Formation trail & ultra-endurance',
    'Premiers secours (PSC1)',
  ],
  socialsTitle: 'Me suivre',
  socials: [
    {
      platform: 'instagram',
      label: 'Instagram',
      href: 'https://instagram.com',
    },
    {
      platform: 'whatsapp',
      label: 'WhatsApp',
      href: 'https://wa.me/33600000000',
    },
    { platform: 'nolio', label: 'Nolio', href: 'https://nolio.io' },
  ],
  philosophyTitle: 'Ma philosophie de coaching',
  principles: [
    {
      title: 'Progressivité avant tout',
      description:
        'On construit la performance sur des bases solides. Pas de surcharge : chaque semaine prépare la suivante.',
    },
    {
      title: 'À l’écoute du corps',
      description:
        'Sensations, sommeil, fatigue : le plan s’ajuste à votre vie réelle, pas l’inverse. La régularité prime sur l’intensité.',
    },
    {
      title: 'Le plaisir comme moteur',
      description:
        'Courir doit rester un plaisir. Les paysages de Savoie sont mon terrain de jeu, et je veux qu’ils deviennent le vôtre.',
    },
  ],
  ctaTitle: 'On court ensemble ?',
  primaryButton: { label: 'Réserver un coaching', href: '/booking' },
  secondaryButton: { label: 'Voir les prestations', href: '/services' },
}

type StrapiAbout = {
  seo?: { titre?: string; description?: string; motsCles?: string } | null
  entete?: { surtitre?: string; titre?: string; description?: string } | null
  photo?: { url?: string; alternativeText?: string } | null
  texteAlternatifPhoto?: string | null
  titreParcours?: string | null
  parcours?: StrapiBlocks | null
  titreCertifications?: string | null
  certifications?: Array<{ label?: string | null }> | null
  titreReseaux?: string | null
  reseaux?: Array<{
    plateforme?: AboutContent['socials'][number]['platform']
    libelle?: string | null
    lien?: string | null
  }> | null
  titrePhilosophie?: string | null
  principes?: Array<{ titre?: string; description?: string }> | null
  titreAppelAction?: string | null
  boutonPrincipal?: { label?: string; href?: string } | null
  boutonSecondaire?: { label?: string; href?: string } | null
}

export async function getAboutContent(): Promise<AboutContent> {
  try {
    const response = await strapiFetch<{ data?: StrapiAbout | null }>(
      '/page-a-propos?populate=*',
      {
        next: {
          revalidate: Number(process.env.STRAPI_REVALIDATE_SECONDS ?? 60),
          tags: ['about-page'],
        },
      },
    )
    const data = response.data
    if (!data) return fallbackAbout

    const story = textFromBlocks(data.parcours)
      .split('\n\n')
      .filter(Boolean)
    const certifications =
      data.certifications?.map((item) => item.label?.trim()).filter(Boolean) ??
      []
    const socials =
      data.reseaux
        ?.map((social) => ({
          platform: social.plateforme,
          label: social.libelle?.trim() ?? '',
          href: social.lien?.trim() ?? '',
        }))
        .filter(
          (
            social,
          ): social is AboutContent['socials'][number] =>
            Boolean(social.platform && social.label && social.href),
        ) ?? []
    const principles =
      data.principes
        ?.map((item) => ({
          title: item.titre?.trim() ?? '',
          description: item.description?.trim() ?? '',
        }))
        .filter((item) => item.title && item.description) ?? []

    return {
      seo: {
        title: data.seo?.titre?.trim() || fallbackAbout.seo.title,
        description:
          data.seo?.description?.trim() || fallbackAbout.seo.description,
        keywords:
          splitKeywords(data.seo?.motsCles).length > 0
            ? splitKeywords(data.seo?.motsCles)
            : fallbackAbout.seo.keywords,
      },
      header: {
        eyebrow: data.entete?.surtitre?.trim() || fallbackAbout.header.eyebrow,
        title: data.entete?.titre?.trim() || fallbackAbout.header.title,
        description:
          data.entete?.description?.trim() ||
          fallbackAbout.header.description,
      },
      image: {
        url: getStrapiMediaUrl(data.photo?.url) || fallbackAbout.image.url,
        alt:
          data.texteAlternatifPhoto?.trim() ||
          data.photo?.alternativeText?.trim() ||
          fallbackAbout.image.alt,
      },
      storyTitle: data.titreParcours?.trim() || fallbackAbout.storyTitle,
      storyParagraphs: story.length > 0 ? story : fallbackAbout.storyParagraphs,
      certificationsTitle:
        data.titreCertifications?.trim() ||
        fallbackAbout.certificationsTitle,
      certifications:
        certifications.length > 0
          ? (certifications as string[])
          : fallbackAbout.certifications,
      socialsTitle: data.titreReseaux?.trim() || fallbackAbout.socialsTitle,
      socials: socials.length > 0 ? socials : fallbackAbout.socials,
      philosophyTitle:
        data.titrePhilosophie?.trim() || fallbackAbout.philosophyTitle,
      principles:
        principles.length > 0 ? principles : fallbackAbout.principles,
      ctaTitle:
        data.titreAppelAction?.trim() || fallbackAbout.ctaTitle,
      primaryButton: {
        label:
          data.boutonPrincipal?.label?.trim() ||
          fallbackAbout.primaryButton.label,
        href:
          data.boutonPrincipal?.href?.trim() ||
          fallbackAbout.primaryButton.href,
      },
      secondaryButton: {
        label:
          data.boutonSecondaire?.label?.trim() ||
          fallbackAbout.secondaryButton.label,
        href:
          data.boutonSecondaire?.href?.trim() ||
          fallbackAbout.secondaryButton.href,
      },
    }
  } catch {
    return fallbackAbout
  }
}
