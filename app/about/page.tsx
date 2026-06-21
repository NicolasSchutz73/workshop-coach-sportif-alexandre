import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  Activity,
  ArrowRight,
  Award,
  Camera,
  MessageCircle,
  Quote,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHero } from '@/components/page-hero'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
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
        <PageHero
          eyebrow={content.header.eyebrow}
          title={content.header.title}
          description={content.header.description}
        />

        <section className="mx-auto grid w-full max-w-7xl items-start gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-20">
          <div className="lg:sticky lg:top-24">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[22px]">
              <Image
                src={content.image.url}
                alt={content.image.alt}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <h2 className="font-heading text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
              {content.storyTitle}
            </h2>
            <div className="mt-5 space-y-4 text-pretty leading-relaxed text-muted-foreground">
              {content.storyParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10">
              <h3 className="flex items-center gap-2 font-heading text-lg font-medium">
                <Award className="size-5 text-primary" />
                {content.certificationsTitle}
              </h3>
              <ul className="mt-4 grid border-t border-border sm:grid-cols-2">
                {content.certifications.map((certification) => (
                  <li
                    key={certification}
                    className="border-b border-border py-4 text-sm font-medium sm:px-4 sm:odd:border-r"
                  >
                    {certification}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10">
              <h3 className="font-heading text-lg font-medium">
                {content.socialsTitle}
              </h3>
              <div className="mt-4 flex items-center gap-2">
                {content.socials.map((social) => {
                  const Icon = socialIconByPlatform[social.platform]
                  return (
                    <a
                      key={`${social.platform}-${social.href}`}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="flex size-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      <Icon className="size-5" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-card">
          <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
            <div className="max-w-2xl">
              <Quote className="size-8 text-primary" />
              <h2 className="mt-4 text-balance font-heading text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
                {content.philosophyTitle}
              </h2>
            </div>
            <div className="mt-12 grid border-t border-foreground/20 md:grid-cols-3">
              {content.principles.map((principle, index) => (
                <div key={principle.title} className="border-b border-foreground/20 py-6 md:px-7 md:not-last:border-r">
                  <span className="font-mono text-sm font-semibold text-primary">
                    0{index + 1}
                  </span>
                  <h3 className="mt-3 font-heading text-lg font-medium">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <h2 className="text-balance font-heading text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
            {content.ctaTitle}
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 px-7 text-base"
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
              className="h-12 px-7 text-base"
            >
              <Link href={content.secondaryButton.href}>
                {content.secondaryButton.label}
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
