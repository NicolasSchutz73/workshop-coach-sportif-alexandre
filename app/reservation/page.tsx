import type { Metadata } from 'next'
import { Clock, MapPin, ShieldCheck } from 'lucide-react'
import { CalBookingWidget } from '@/components/cal-booking-widget'
import { PageHero } from '@/components/page-hero'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Reveal } from '@/components/animation/reveal'
import { getBookingContent } from '@/lib/booking'
import { metadataFromSeo } from '@/lib/content'

const reassuranceIconByKey = {
  horloge: Clock,
  localisation: MapPin,
  securite: ShieldCheck,
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await getBookingContent()
  return metadataFromSeo(content.seo)
}

export default async function ReservationPage() {
  const content = await getBookingContent()

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
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:py-24">
            <Reveal>
              <CalBookingWidget noPaymentText={content.noPaymentText} />
            </Reveal>

            <Reveal as="aside" delay={0.08} className="lg:pt-2">
              <h2 className="font-heading text-xl font-semibold">
                {content.processTitle}
              </h2>
              <ol className="mt-6 space-y-6">
                {content.steps.map((step, index) => (
                  <li key={step} className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-pretty leading-relaxed text-muted-foreground">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>

              <div className="mt-10 grid gap-4">
                {content.reassurances.map((item) => {
                  const Icon = reassuranceIconByKey[item.icon]
                  return (
                    <div
                      key={item.title}
                      className="flex gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
                    >
                      <Icon className="size-5 shrink-0 text-primary" />
                      <div>
                        <h3 className="text-sm font-semibold">{item.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
