import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowUpRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/animation/page-transition'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Reveal } from '@/components/animation/reveal'
import { ParallaxImage } from '@/components/animation/parallax-image'
import { StaggerGroup, StaggerItem } from '@/components/animation/stagger'
import { getServices, getServicesPageContent } from '@/lib/services'
import { cn } from '@/lib/utils'
import { metadataFromSeo } from '@/lib/content'

const pageFadeTransition = ['page-fade']

export async function generateMetadata(): Promise<Metadata> {
  const content = await getServicesPageContent()
  return metadataFromSeo(content.seo, '/services')
}

export default async function ServicesPage() {
  const [services, pageContent] = await Promise.all([
    getServices(),
    getServicesPageContent(),
  ])

  return (
    <>
      <SiteHeader />
      <PageTransition>
        <main>
        {/* Editorial hero — centered hierarchy */}
        <section className="bg-card">
          <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 sm:py-16 lg:py-20">
            <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <h1 className="text-balance font-heading text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
                {pageContent.header.title}
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {pageContent.header.description}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Prestations comparatives */}
        <section className="bg-card">
          <div className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-6 sm:pb-20">
            <StaggerGroup className="flex flex-col gap-5 lg:grid lg:grid-cols-3 lg:items-stretch">
              {services.map((service) => (
                <ServiceCard key={service.slug} service={service} />
            ))}
            </StaggerGroup>
          </div>
        </section>

        {/* E-books & plans — distinct editorial universe, sticky image on desktop */}
        <section id="ebooks" className="scroll-mt-24 border-y border-border/60 bg-card">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 pb-24 pt-16 sm:px-6 sm:pb-28 sm:pt-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ParallaxImage
                src={pageContent.plansSection.image.url}
                alt={pageContent.plansSection.image.alt}
                className="relative aspect-[4/5] rounded-2xl"
                sizes="(min-width: 1024px) 40vw, 100vw"
                reveal
              />
            </div>

            <div>
              <Reveal>
                <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
                  {pageContent.plansSection.eyebrow}
                </p>
                <h2 className="mt-3 text-balance font-heading text-3xl font-extrabold leading-[1.04] tracking-tight sm:text-4xl">
                  {pageContent.plansSection.title}
                </h2>
                <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
                  {pageContent.plansSection.description}
                </p>
              </Reveal>

              <StaggerGroup
                as="ul"
                className="mt-10 border-t border-foreground/15"
              >
                {pageContent.plansSection.plans.map((ebook) => (
                  <StaggerItem
                    as="li"
                    key={ebook.title}
                    className="border-b border-foreground/15"
                  >
                    <Link
                      href={`/plans/${ebook.slug}`}
                      transitionTypes={pageFadeTransition}
                      className="group flex flex-col items-stretch gap-3 py-5 transition-colors hover:bg-background/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                    >
                      <div className="min-w-0">
                        <p className="font-heading text-lg font-medium leading-snug">
                          {ebook.title}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {ebook.detail}
                        </p>
                      </div>
                      <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-start">
                        <span className="font-heading text-lg font-medium tracking-tight">
                          {ebook.price}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors group-hover:border-primary group-hover:text-primary">
                          {ebook.button.label}
                          <ArrowUpRight className="size-4" />
                        </span>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          </div>
        </section>

        </main>
      </PageTransition>
      <SiteFooter />
    </>
  )
}

function ServiceCard({
  service,
}: {
  service: Awaited<ReturnType<typeof getServices>>[number]
}) {
  const isExternal = service.ctaHref.startsWith('http')

  return (
    <StaggerItem
      className={cn(
        'group flex flex-col rounded-2xl border p-7',
        service.featured
          ? 'bg-primary text-primary-foreground shadow-lg lg:-my-2 lg:py-9'
          : 'border-border bg-card shadow-sm hover:shadow-md',
      )}
    >
      {service.featured && (
        <span className="mb-5 inline-flex w-fit rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
          {service.featuredLabel ?? 'Le plus populaire'}
        </span>
      )}
      <h2 className="font-heading text-xl font-bold">{service.name}</h2>
      <p
        className={cn(
          'mt-1 text-sm',
          service.featured
            ? 'text-primary-foreground/75'
            : 'text-muted-foreground',
        )}
      >
        {service.tagline}
      </p>
      <div className="mt-5 flex items-baseline gap-1">
        <span className="font-heading text-3xl font-extrabold tracking-tight">
          {service.price}
        </span>
        <span
          className={cn(
            'text-sm',
            service.featured
              ? 'text-primary-foreground/75'
              : 'text-muted-foreground',
          )}
        >
          {service.priceNote}
        </span>
      </div>
      <p
        className={cn(
          'mt-4 text-pretty text-sm leading-relaxed',
          service.featured
            ? 'text-primary-foreground/85'
            : 'text-muted-foreground',
        )}
      >
        {service.description}
      </p>
      <ul className="mt-6 flex-1 space-y-3">
        {service.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <Check
              className={cn(
                'mt-0.5 size-4 shrink-0',
                service.featured ? 'text-primary-foreground' : 'text-primary',
              )}
            />
            <span
              className={service.featured ? 'text-primary-foreground/90' : ''}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>
      <Button
        asChild
        variant={service.featured ? 'secondary' : 'outline'}
        className={cn(
          'mt-7 h-11 rounded-full',
          service.featured &&
            'bg-primary-foreground text-primary hover:bg-primary-foreground/90',
        )}
      >
        <Link
          href={service.ctaHref}
          transitionTypes={
            service.ctaHref.startsWith('/') && !service.ctaHref.includes('#')
              ? pageFadeTransition
              : undefined
          }
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noreferrer' : undefined}
        >
          {service.cta}
        </Link>
      </Button>
    </StaggerItem>
  )
}
