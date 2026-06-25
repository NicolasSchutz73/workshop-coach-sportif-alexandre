import {
  type ButtonContent,
  type PageHeaderContent,
  type SeoContent,
  type StrapiBlocks,
  splitKeywords,
  textFromBlocks,
} from '@/lib/content'
import { normalizeInternalHref, reservationPath } from '@/lib/routes'
import { getStrapiMediaUrl, strapiFetch } from '@/lib/strapi'

export type AboutContent = {
  seo: SeoContent
  header: PageHeaderContent
  image: { url: string; alt: string }
  stats: Array<{ value: string; label: string }>
  storyTitle: string
  storyEyebrow: string
  storyParagraphs: string[]
  signature: { name: string; role: string }
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
      'Du sentier de montagne à votre plan d’entraînement : un accompagnement humain, exigeant et sur-mesure pour vous faire progresser sans jamais perdre le plaisir de courir.',
  },
  image: {
    url: '/images/about-trail-lake.jpg',
    alt: 'Alexandre Schutz en trail au-dessus d’un lac d’altitude dans les Alpes',
  },
  stats: [
    { value: '+120', label: 'athlètes accompagnés' },
    { value: '10 ans', label: 'de compétition' },
    { value: '6', label: 'ultras terminés' },
    { value: '95%', label: 'd’objectifs atteints' },
  ],
  storyTitle: 'De la passion du sentier au métier de coach',
  storyEyebrow: 'Mon parcours',
  storyParagraphs: [
    'J’ai grandi entre le Lac du Bourget et les massifs des Bauges, où la course est vite devenue une évidence. Des premières foulées sur piste aux longues sorties en altitude, j’ai exploré toutes les facettes de ce sport — et appris à en respecter les exigences.',
    'Dix années de compétition, six ultras au compteur et un diplôme d’État en poche : j’ai vécu de l’intérieur ce que représentent la préparation, le doute, la blessure et la ligne d’arrivée. Cette expérience nourrit aujourd’hui chacun de mes accompagnements.',
    'Depuis, j’ai suivi plus de 120 coureurs, du débutant qui prépare son premier 10 km au traileur visant un format ultra. Ma conviction n’a jamais changé : aucun plan standardisé, mais un entraînement pensé pour vous, votre quotidien et vos ambitions.',
  ],
  signature: {
    name: 'Alexandre Schutz',
    role: 'Coach running & trail — Savoie',
  },
  certificationsTitle: 'Certifications & formations',
  certifications: [
    'BPJEPS Athlétisme — course hors stade',
    'Certificat de préparation physique',
    'Formation trail & ultra-endurance',
    'Spécialisation course en montagne',
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
  philosophyTitle: 'Trois principes qui guident chaque plan',
  principles: [
    {
      title: 'La progressivité avant tout',
      description:
        'La performance se construit sur des fondations solides. Pas de surcharge inutile : chaque séance a un objectif précis et chaque semaine prépare la suivante.',
    },
    {
      title: 'À l’écoute de votre corps',
      description:
        'Sensations, sommeil, charge de travail, fatigue : votre plan s’ajuste à votre vie réelle, pas l’inverse. La régularité l’emporte toujours sur l’intensité ponctuelle.',
    },
    {
      title: 'Le plaisir comme moteur',
      description:
        'Courir doit rester une source d’énergie, pas une contrainte. Les sentiers de Savoie sont mon terrain de jeu — mon ambition est qu’ils deviennent le vôtre.',
    },
  ],
  ctaTitle: 'On court ensemble ?',
  primaryButton: { label: 'Réserver un coaching', href: reservationPath },
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
      stats: fallbackAbout.stats,
      storyTitle: data.titreParcours?.trim() || fallbackAbout.storyTitle,
      storyEyebrow: fallbackAbout.storyEyebrow,
      storyParagraphs: story.length > 0 ? story : fallbackAbout.storyParagraphs,
      signature: fallbackAbout.signature,
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
        href: normalizeInternalHref(
          data.boutonPrincipal?.href?.trim() ||
            fallbackAbout.primaryButton.href,
        ),
      },
      secondaryButton: {
        label:
          data.boutonSecondaire?.label?.trim() ||
          fallbackAbout.secondaryButton.label,
        href: normalizeInternalHref(
          data.boutonSecondaire?.href?.trim() ||
            fallbackAbout.secondaryButton.href,
        ),
      },
    }
  } catch {
    return fallbackAbout
  }
}
