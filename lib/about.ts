import {
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
  experience: {
    eyebrow: string
    title: string
    paragraphs: string[]
    image: { url: string; alt: string }
  }
  certificationsTitle: string
  certifications: string[]
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
  experience: {
    eyebrow: 'Performances',
    title: 'Une expérience forgée sur route comme en montagne.',
    paragraphs: [
      'Alexandre a construit son parcours en alternant les formats : 10 km, semi-marathon, marathon et trail. Ces expériences lui donnent une lecture concrète de l’effort, de la progression et de la gestion d’une préparation.',
      'Du Marathon de Paris aux sentiers du Ventoux, en passant par les courses en Savoie et Haute-Savoie, il s’appuie sur ce vécu pour accompagner chaque coureur avec des repères simples, réalistes et adaptés au terrain.',
    ],
    image: {
      url: '/images/hero-trail.jpg',
      alt: 'Coureur de trail en montagne',
    },
  },
  certificationsTitle: 'Certifications',
  certifications: [
    'BPJEPS Athlétisme — course hors stade',
    'Certificat préparation physique',
    'Formation trail & ultra-endurance',
    'Premiers secours (PSC1)',
  ],
}

type StrapiAbout = {
  seo?: { titre?: string; description?: string; motsCles?: string } | null
  entete?: { surtitre?: string; titre?: string; description?: string } | null
  photo?: { url?: string; alternativeText?: string } | null
  texteAlternatifPhoto?: string | null
  titreParcours?: string | null
  parcours?: StrapiBlocks | null
  surtitreExperience?: string | null
  titreExperience?: string | null
  contenuExperience?: StrapiBlocks | null
  imageExperience?: { url?: string; alternativeText?: string } | null
  texteAlternatifImageExperience?: string | null
  titreCertifications?: string | null
  certifications?: Array<{ label?: string | null }> | null
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
    const experienceParagraphs = textFromBlocks(data.contenuExperience)
      .split('\n\n')
      .filter(Boolean)
    const certifications =
      data.certifications?.map((item) => item.label?.trim()).filter(Boolean) ??
      []
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
      experience: {
        eyebrow:
          data.surtitreExperience?.trim() || fallbackAbout.experience.eyebrow,
        title: data.titreExperience?.trim() || fallbackAbout.experience.title,
        paragraphs:
          experienceParagraphs.length > 0
            ? experienceParagraphs
            : fallbackAbout.experience.paragraphs,
        image: {
          url:
            getStrapiMediaUrl(data.imageExperience?.url) ||
            fallbackAbout.experience.image.url,
          alt:
            data.texteAlternatifImageExperience?.trim() ||
            data.imageExperience?.alternativeText?.trim() ||
            fallbackAbout.experience.image.alt,
        },
      },
      certificationsTitle:
        data.titreCertifications?.trim() ||
        fallbackAbout.certificationsTitle,
      certifications:
        certifications.length > 0
          ? (certifications as string[])
          : fallbackAbout.certifications,
    }
  } catch {
    return fallbackAbout
  }
}
