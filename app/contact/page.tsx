import type { Metadata } from 'next'
import Image from 'next/image'
import { ContactForm } from '@/components/contact-form'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    "Contactez Alexandre Schutz pour toute question sur le coaching, les plans d'entraînement ou les e-books.",
}

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-background">
        <section className="lg:grid lg:min-h-[calc(100dvh-4.5rem)] lg:grid-cols-2">
          <figure className="relative isolate h-64 overflow-hidden bg-secondary sm:h-80 lg:h-[calc(100dvh-4.5rem)]">
            <Image
              src="/images/contact-trail-runner.webp"
              alt="Un coureur de trail en montagne sous un ciel nuageux"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent"
            />
          </figure>

          <div className="flex min-h-[calc(100dvh-4.5rem)] items-center px-5 py-10 sm:px-10 lg:px-12 lg:py-4 xl:px-20">
            <div className="mx-auto w-full max-w-xl">
              <header className="mx-auto max-w-lg text-center">
                <h1 className="text-balance font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-foreground">
                  Parlons de votre projet
                </h1>
                <p className="mx-auto mt-3 max-w-xl text-pretty leading-relaxed text-muted-foreground sm:text-lg">
                  Une question sur le coaching, un plan d&apos;entraînement ou un e-book ?
                </p>
              </header>

              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
