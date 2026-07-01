import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/animation/reveal'
import { StaggerGroup, StaggerItem } from '@/components/animation/stagger'
import type { Service } from '@/lib/services'
import type { SectionIntroContent } from '@/lib/homepage'
import { cn } from '@/lib/utils'

const pageFadeTransition = ['page-fade']

type ServicesPreviewProps = {
  services: Service[]
  intro: SectionIntroContent
}

export function ServicesPreview({ services, intro }: ServicesPreviewProps) {
  const introHref = intro.button?.href ?? '/services'

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
      <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow={intro.eyebrow}
          title={intro.title}
          description={intro.description}
        />
        <Button
          asChild
          variant="ghost"
          className="hidden shrink-0 rounded-full sm:inline-flex"
        >
          <Link
            href={introHref}
            transitionTypes={
              introHref.startsWith('/') && !introHref.includes('#')
                ? pageFadeTransition
                : undefined
            }
          >
            {intro.button?.label ?? 'Toutes les prestations'}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </Reveal>

      <StaggerGroup className="mt-12 flex flex-col gap-5 lg:grid lg:grid-cols-3 lg:items-stretch">
        {services.map((service) => (
          <ServicePreviewCard key={service.slug} service={service} />
        ))}
      </StaggerGroup>

      <div className="mt-8 sm:hidden">
        <Button asChild variant="outline" className="w-full rounded-full">
          <Link
            href={introHref}
            transitionTypes={
              introHref.startsWith('/') && !introHref.includes('#')
                ? pageFadeTransition
                : undefined
            }
          >
            {intro.button?.label ?? 'Toutes les prestations'}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}

function ServicePreviewCard({ service }: { service: Service }) {
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
      <h3 className="font-heading text-xl font-bold">{service.name}</h3>
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
