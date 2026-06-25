import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/animation/reveal'
import { StaggerGroup, StaggerItem } from '@/components/animation/stagger'
import type { Service } from '@/lib/services'
import type { SectionIntroContent } from '@/lib/homepage'
import { cn } from '@/lib/utils'

type ServicesPreviewProps = {
  services: Service[]
  intro: SectionIntroContent
}

export function ServicesPreview({ services, intro }: ServicesPreviewProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
      <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow={intro.eyebrow}
          title={intro.title}
          description={intro.description}
        />
        <Button asChild variant="ghost" className="hidden shrink-0 rounded-full sm:inline-flex">
          <Link href={intro.button?.href ?? '/services'}>
            {intro.button?.label ?? 'Toutes les prestations'}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </Reveal>

      <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServicePreviewCard key={service.slug} service={service} />
        ))}
      </StaggerGroup>

      <div className="mt-8 sm:hidden">
        <Button asChild variant="outline" className="w-full rounded-full">
          <Link href={intro.button?.href ?? '/services'}>
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
        'flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md',
        service.featured && 'border-primary/40 ring-1 ring-primary/20',
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <service.icon className="size-5" />
      </div>
      <h3 className="mt-5 font-heading text-lg font-semibold">
        {service.name}
      </h3>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-heading text-2xl font-bold">
          {service.price}
        </span>
        <span className="text-sm text-muted-foreground">
          {service.priceNote}
        </span>
      </div>
      <ul className="mt-5 flex-1 space-y-2.5">
        {service.features.slice(0, 4).map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        asChild
        variant={service.featured ? 'default' : 'outline'}
        className="mt-6 rounded-full"
      >
        <Link
          href={service.ctaHref}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noreferrer' : undefined}
        >
          {service.cta}
        </Link>
      </Button>
    </StaggerItem>
  )
}
