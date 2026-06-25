import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Activity, ArrowRight, Award, Camera, MapPin, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ParallaxImage } from '@/components/animation/parallax-image'
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
        {/* Full-bleed hero */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <ParallaxImage
              src={content.image.url}
              alt={content.image.alt}
              className="absolute inset-0"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/55 to-foreground/35" />
          </div>
          <div className="mx-auto flex min-h-[72vh] w-full max-w-6xl flex-col justify-end px-5 pb-14 pt-32 sm:px-8 sm:pb-20 sm:pt-40">
            <Reveal className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 backdrop-blur-sm">
                <MapPin className="size-3.5 text-white" />
                <span className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-white">
                  {content.header.eyebrow}
                </span>
              </div>
              <h1 className="text-balance font-heading text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {content.header.title}
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/85 sm:text-lg">
                {content.header.description}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Stats band */}
        <section className="border-b border-border/60 bg-card">
          <StaggerGroup className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-y-8 px-5 py-10 sm:px-8 lg:grid-cols-4">
            {content.stats.map((stat) => (
              <StaggerItem
                key={stat.label}
                className="flex flex-col items-center text-center lg:items-start lg:text-left"
              >
                <span className="font-heading text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>

        {/* Story / manifeste */}
        <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal variant="scaleReveal" className="lg:sticky lg:top-24">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[22px]">
                <Image
                  src={content.image.url}
                  alt={content.image.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <Reveal>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
                {content.storyEyebrow}
              </p>
              <h2 className="mt-3 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                {content.storyTitle}
              </h2>
              <div className="mt-6 space-y-4 text-pretty leading-relaxed text-muted-foreground">
                {content.storyParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-8 border-t border-border pt-6">
                <p className="font-heading text-lg font-semibold">
                  {content.signature.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {content.signature.role}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Ma méthode — séquence numérotée */}
        <section className="border-y border-border/60 bg-card">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <Reveal className="max-w-2xl">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
                Ma méthode
              </p>
              <h2 className="mt-3 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
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
                  <h3 className="mt-4 font-heading text-lg font-semibold leading-snug">
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

        {/* Certifications & réseaux */}
        <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal className="grid gap-10 rounded-3xl border border-border bg-secondary/60 p-7 sm:p-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold">
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
              <h2 className="font-heading text-lg font-semibold">
                {content.socialsTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Coulisses des entraînements, conseils et sorties en montagne :
                rejoignez-moi sur mes réseaux.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
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

        {/* Final CTA */}
        <section className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24">
          <div className="relative isolate overflow-hidden rounded-[2rem]">
            <ParallaxImage
              src={content.image.url}
              alt={content.image.alt}
              className="absolute inset-0"
              imageClassName="object-[center_30%]"
              sizes="(min-width: 1152px) 1088px, 100vw"
            />
            <div className="absolute inset-0 bg-foreground/75" />
            <Reveal className="relative flex flex-col items-center px-6 py-16 text-center sm:py-24">
              <h2 className="max-w-2xl text-balance font-heading text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                {content.ctaTitle}
              </h2>
              <p className="mt-4 max-w-lg text-pretty leading-relaxed text-white/80">
                Discutons de vos objectifs et construisons ensemble le plan qui
                vous ressemble.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full px-7 text-base transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <Link href={content.primaryButton.href}>
                    {content.primaryButton.label}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/40 bg-white/10 px-7 text-base text-white backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/20 hover:text-white"
                >
                  <Link href={content.secondaryButton.href}>
                    {content.secondaryButton.label}
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
