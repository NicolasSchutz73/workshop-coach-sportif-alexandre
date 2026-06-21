import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ArrowRight, Check, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHero } from '@/components/page-hero'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getServices, getServicesPageContent } from '@/lib/services'
import { cn } from '@/lib/utils'
import { metadataFromSeo } from '@/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getServicesPageContent()
  return metadataFromSeo(content.seo)
}

export default async function ServicesPage() {
  const [services, pageContent] = await Promise.all([
    getServices(),
    getServicesPageContent(),
  ])

  return (
    <>
      <SiteHeader />
      <main>
      <PageHero
        eyebrow={pageContent.header.eyebrow}
        title={pageContent.header.title}
        description={pageContent.header.description}
      />

      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-5 lg:grid-cols-3">
          {services
            .filter((s) => s.slug !== 'ebooks-plans')
            .map((service) => (
              <div
                key={service.slug}
                className={cn(
                  'relative flex flex-col rounded-3xl border border-border bg-card p-7 shadow-sm',
                  service.featured && 'border-primary/50 ring-1 ring-primary/20',
                )}
              >
                {service.featured && (
                  <span className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    <Star className="size-3 fill-current" />
                    {service.featuredLabel ?? 'Le plus populaire'}
                  </span>
                )}
                <div className="flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <service.icon className="size-6" />
                </div>
                <h2 className="mt-5 font-heading text-xl font-bold">
                  {service.name}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {service.tagline}
                </p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-heading text-3xl font-extrabold">
                    {service.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {service.priceNote}
                  </span>
                </div>
                <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant={service.featured ? 'default' : 'outline'}
                  className="mt-7 h-11 rounded-full"
                >
                  <Link href={service.ctaHref}>{service.cta}</Link>
                </Button>
              </div>
            ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-card">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
              {pageContent.plansSection.eyebrow}
            </p>
            <h2 className="text-balance font-heading text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
              {pageContent.plansSection.title}
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              {pageContent.plansSection.description}
            </p>

            <ul className="mt-8 border-t border-foreground/20">
              {pageContent.plansSection.plans.map((ebook) => (
                <li
                  key={ebook.title}
                  className="flex items-center justify-between gap-4 border-b border-foreground/20 py-4"
                >
                  <div>
                    <p className="font-heading text-sm font-medium">
                      {ebook.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ebook.detail}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-heading text-base font-medium">
                      {ebook.price}
                    </span>
                    <Button asChild size="sm">
                      <Link href={`/plans/${ebook.slug}`}>
                        {ebook.button.label}
                      </Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative order-first aspect-[4/3] overflow-hidden rounded-[22px] lg:order-last">
            <Image
              src={pageContent.plansSection.image.url}
              alt={pageContent.plansSection.image.alt}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
        <div className="border-y border-border px-0 py-12 text-center sm:py-16">
          <h2 className="text-balance font-heading text-3xl font-medium tracking-[-0.05em] sm:text-4xl">
            {pageContent.finalCta.title}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-pretty leading-relaxed text-muted-foreground">
            {pageContent.finalCta.description}
          </p>
          <Button asChild size="lg" className="mt-7 h-12 px-7 text-base">
            <Link href={pageContent.finalCta.button.href}>
              {pageContent.finalCta.button.label}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
      <SiteFooter />
    </>
  )
}
