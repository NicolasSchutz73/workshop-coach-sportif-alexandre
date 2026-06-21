import type { Metadata } from 'next'
import Link from 'next/link'
import { Camera, Mail, MapPin, Phone } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Reveal } from '@/components/animation/reveal'
import { getContactContent } from '@/lib/contact'
import { metadataFromSeo } from '@/lib/content'

const detailIconByType = {
  zone: MapPin,
  email: Mail,
  telephone: Phone,
  instagram: Camera,
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContactContent()
  return metadataFromSeo(content.seo)
}

export default async function ContactPage() {
  const content = await getContactContent()

  return (
    <>
      <SiteHeader />
      <main className="bg-background">
        <section className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 sm:py-16 lg:py-20">
          {/* Integrated intro */}
          <Reveal className="max-w-2xl">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
              {content.header.eyebrow}
            </p>
            <h1 className="mt-4 text-balance font-heading text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl">
              {content.header.title}
            </h1>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {content.header.description}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
            {/* Coordinates first on mobile */}
            <Reveal as="div" delay={0.05}>
              <h2 className="font-heading text-lg font-semibold">
                {content.detailsTitle}
              </h2>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                {content.detailsDescription}
              </p>

              <div className="mt-6 grid gap-3">
                {content.details.map((detail) => {
                  const Icon = detailIconByType[detail.type]
                  const card = (
                    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                        <Icon className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {detail.label}
                        </p>
                        <p className="mt-0.5 truncate font-medium">
                          {detail.value}
                        </p>
                      </div>
                    </div>
                  )

                  return detail.href ? (
                    <Link
                      key={`${detail.type}-${detail.value}`}
                      href={detail.href}
                      className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {card}
                    </Link>
                  ) : (
                    <div key={`${detail.type}-${detail.value}`}>{card}</div>
                  )
                })}
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-secondary p-5">
                <h3 className="font-heading text-base font-semibold">
                  {content.availabilityTitle}
                </h3>
                <dl className="mt-4 space-y-2 text-sm">
                  {content.hours.map((item) => (
                    <div
                      key={`${item.days}-${item.hours}`}
                      className="flex justify-between gap-4"
                    >
                      <dt className="text-muted-foreground">{item.days}</dt>
                      <dd className="font-medium">{item.hours}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            {/* Form */}
            <Reveal as="div" delay={0.1}>
              <ContactForm
                goals={content.goals}
                privacyText={content.privacyText}
              />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
