import Image from 'next/image'
import type { Metadata } from 'next'
import { Activity, Award, Camera, MessageCircle } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Reveal } from '@/components/animation/reveal'
import { StaggerGroup, StaggerItem } from '@/components/animation/stagger'
import { getAboutContent } from '@/lib/about'
import { metadataFromSeo } from '@/lib/content'

const socialIconByPlatform = {
  instagram: Camera,
  whatsapp: MessageCircle,
  nolio: Activity,
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await getAboutContent()
  return metadataFromSeo(content.seo)
}

export default async function AboutPage() {
  const content = await getAboutContent()

  return (
    <>
      <SiteHeader />
      <main>
        {/* Compact hero */}
        <section className="border-b border-border/60 bg-card">
          <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
            <Reveal className="max-w-3xl">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
                {content.header.eyebrow}
              </p>
              <h1 className="mt-4 text-balance font-heading text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
                {content.header.title}
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {content.header.description}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Manifeste / profil — sticky portrait, resserré récit */}
        <section className="mx-auto grid w-full max-w-6xl items-start gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-24">
            <Reveal variant="scaleReveal" className="relative aspect-[4/5] overflow-hidden rounded-[22px]">
              <Image
                src={content.image.url}
                alt={content.image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </Reveal>
          </div>

          <Reveal>
            <h2 className="font-heading text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
              {content.storyTitle}
            </h2>
            <div className="mt-5 space-y-4 text-pretty leading-relaxed text-muted-foreground">
              {content.storyParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Ma méthode — séquence numérotée */}
        <section className="border-y border-border/60 bg-card">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <Reveal className="max-w-2xl">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
                Ma méthode
              </p>
              <h2 className="mt-3 text-balance font-heading text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
                {content.philosophyTitle}
              </h2>
            </Reveal>

            <StaggerGroup className="mt-12 grid border-t border-foreground/15 md:grid-cols-3">
              {content.principles.map((principle, index) => (
                <StaggerItem
                  key={principle.title}
                  className="flex flex-col border-b border-foreground/15 py-7 md:border-b-0 md:px-7 md:py-9 md:first:pl-0 md:not-first:border-l md:not-first:border-foreground/15"
                >
                  <span className="font-mono text-sm font-semibold tracking-wider text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-medium leading-snug">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {principle.description}
                  </p>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>

        {/* Certifications & réseaux — module secondaire compact */}
        <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal className="grid gap-10 rounded-3xl border border-border bg-secondary/60 p-7 sm:p-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="flex items-center gap-2 font-heading text-lg font-medium">
                <Award className="size-5 text-primary" />
                {content.certificationsTitle}
              </h2>
              <ul className="mt-4 border-t border-border">
                {content.certifications.map((certification) => (
                  <li
                    key={certification}
                    className="border-b border-border py-3.5 text-sm font-medium"
                  >
                    {certification}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-lg font-medium">
                {content.socialsTitle}
              </h2>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {content.socials.map((social) => {
                  const Icon = socialIconByPlatform[social.platform]
                  return (
                    <a
                      key={`${social.platform}-${social.href}`}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      <Icon className="size-4" />
                      {social.label}
                    </a>
                  )
                })}
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
