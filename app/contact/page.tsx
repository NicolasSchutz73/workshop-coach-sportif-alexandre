import type { Metadata } from 'next'
import Link from 'next/link'
import { Camera, Mail, MapPin, Phone } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { ContactForm } from '@/components/contact-form'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
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
      <main>
        <PageHero
          eyebrow={content.header.eyebrow}
          title={content.header.title}
          description={content.header.description}
        />

        <section className="border-b border-border bg-background">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:py-24">
            <div>
              <h2 className="text-balance font-heading text-2xl font-bold">
                {content.detailsTitle}
              </h2>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                {content.detailsDescription}
              </p>

              <div className="mt-8 grid gap-4">
                {content.details.map((detail) => {
                  const Icon = detailIconByType[detail.type]
                  const card = (
                    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                        <Icon className="size-5" />
                      </span>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {detail.label}
                        </p>
                        <p className="mt-0.5 font-medium">{detail.value}</p>
                      </div>
                    </div>
                  )

                  return detail.href ? (
                    <Link key={`${detail.type}-${detail.value}`} href={detail.href}>
                      {card}
                    </Link>
                  ) : (
                    <div key={`${detail.type}-${detail.value}`}>{card}</div>
                  )
                })}
              </div>

              <div className="mt-8 rounded-2xl border border-border bg-secondary p-6">
                <h3 className="font-heading text-base font-semibold">
                  {content.availabilityTitle}
                </h3>
                <dl className="mt-4 space-y-2 text-sm">
                  {content.hours.map((item) => (
                    <div
                      key={`${item.days}-${item.hours}`}
                      className="flex justify-between"
                    >
                      <dt className="text-muted-foreground">{item.days}</dt>
                      <dd className="font-medium">{item.hours}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <ContactForm
              goals={content.goals}
              privacyText={content.privacyText}
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
