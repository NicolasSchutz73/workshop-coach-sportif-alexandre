import type { Metadata } from 'next'
import { PageTransition } from '@/components/animation/page-transition'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import {
  DiplomaRevealGroup,
  ScrollImageFigure,
  TextRevealStack,
} from '@/components/about/scroll-motion'
import { getAboutContent } from '@/lib/about'
import { metadataFromSeo } from '@/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getAboutContent()
  return metadataFromSeo(content.seo, '/about')
}

export default async function AboutPage() {
  const content = await getAboutContent()

  return (
    <>
      <SiteHeader />
      <PageTransition>
        <main className="overflow-hidden">
          <section className="relative border-b border-border bg-card">
            <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:gap-16">
              <TextRevealStack className="max-w-2xl" duration={1.55}>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {content.header.eyebrow}
                </p>
                <h1 className="mt-4 text-balance font-heading text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
                  {content.header.title}
                </h1>
                <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
                  {content.header.description}
                </p>
                <h2 className="mt-8 font-heading text-xl font-bold">
                  {content.storyTitle}
                </h2>
                <div className="mt-8 space-y-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {content.storyParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </TextRevealStack>

              <ScrollImageFigure
                src={content.image.url}
                alt={content.image.alt}
                sizes="(min-width: 1024px) 42vw, 100vw"
                preload
              />
            </div>
          </section>

          <section className="border-b border-border/60 bg-background py-16 sm:py-24">
            <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.94fr_1.06fr] lg:gap-16">
              <TextRevealStack className="max-w-2xl">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {content.experience.eyebrow}
                </p>
                <h2 className="mt-4 text-balance font-heading text-3xl font-extrabold leading-[1.04] tracking-tight sm:text-4xl">
                  {content.experience.title}
                </h2>
                <div className="mt-6 space-y-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {content.experience.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </TextRevealStack>
              <ScrollImageFigure
                src={content.experience.image.url}
                alt={content.experience.image.alt}
                sizes="(min-width: 1024px) 48vw, 100vw"
                variant="wide"
                imageClassName="object-[38%_center]"
              />
            </div>
          </section>

          <section className="px-5 py-16 sm:px-6 sm:py-24">
            <div className="mx-auto w-full max-w-6xl">
              <TextRevealStack className="max-w-3xl">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Diplômes
                </p>
                <h2 className="mt-4 text-balance font-heading text-3xl font-extrabold leading-[1.04] tracking-tight sm:text-4xl">
                  {content.certificationsTitle}
                </h2>
              </TextRevealStack>

              <DiplomaRevealGroup className="mt-10 border-t border-border">
                {content.certifications.map((certification, index) => (
                  <div
                    key={certification}
                    className="grid gap-3 border-b border-border py-6 sm:grid-cols-[7rem_1fr] sm:items-baseline"
                  >
                    <span className="font-mono text-xs font-semibold tracking-[0.16em] text-primary">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-heading text-xl font-semibold leading-snug tracking-tight">
                      {certification}
                    </h3>
                  </div>
                ))}
              </DiplomaRevealGroup>
            </div>
          </section>
        </main>
      </PageTransition>
      <SiteFooter />
    </>
  )
}
