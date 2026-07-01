import type { Metadata } from 'next'
import { PageTransition } from '@/components/animation/page-transition'
import { CalBookingWidget } from '@/components/cal-booking-widget'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Reveal } from '@/components/animation/reveal'
import { getBookingContent } from '@/lib/booking'
import { metadataFromSeo } from '@/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getBookingContent()
  return metadataFromSeo(content.seo, '/reservation')
}

export default async function ReservationPage() {
  const content = await getBookingContent()
  const steps = content.steps

  return (
    <>
      <SiteHeader />
      <PageTransition>
        <main>
          <section className="bg-background py-8 sm:py-12 lg:py-16">
            <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 sm:px-6 lg:min-h-[640px] lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.15fr)] lg:gap-8">
              <Reveal
                as="aside"
                className="rounded-2xl bg-primary p-7 text-primary-foreground sm:p-9 lg:min-h-[640px] lg:px-10 lg:pt-8 lg:pb-10"
              >
                <h1 className="max-w-xl text-balance font-heading text-3xl font-extrabold tracking-tight lg:-mt-2 sm:text-4xl">
                  {content.header.title}
                </h1>
                <p className="mt-4 max-w-lg text-pretty text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
                  {content.header.description}
                </p>

                <h2 className="mt-8 font-heading text-lg font-bold">
                  {content.processTitle}
                </h2>

                <ol className="mt-4 space-y-4">
                  {steps.map((step, index) => (
                    <li key={step} className="flex gap-4">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15 text-sm font-semibold text-primary-foreground">
                        {index + 1}
                      </span>
                      <p className="pt-1 text-pretty text-sm leading-relaxed text-primary-foreground/85">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </Reveal>

              <Reveal delay={0.08} className="lg:flex">
                <CalBookingWidget
                  className="w-full"
                  noPaymentText={content.noPaymentText}
                />
              </Reveal>
            </div>
          </section>
        </main>
      </PageTransition>
      <SiteFooter />
    </>
  )
}
