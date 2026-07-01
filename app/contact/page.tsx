import type { Metadata } from 'next'
import Image from 'next/image'
import { PageTransition } from '@/components/animation/page-transition'
import { ContactForm } from '@/components/contact-form'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getContactContent } from '@/lib/contact'
import { metadataFromSeo } from '@/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContactContent()
  return metadataFromSeo(content.seo, '/contact')
}

export default async function ContactPage() {
  const content = await getContactContent()

  return (
    <>
      <SiteHeader />
      <PageTransition>
        <main className="bg-background">
          <section className="lg:grid lg:min-h-[calc(100dvh-4.5rem)] lg:grid-cols-2">
            <figure className="relative isolate h-64 overflow-hidden bg-secondary sm:h-80 lg:h-[calc(100dvh-4.5rem)]">
              <Image
                src={content.image.url}
                alt={content.image.alt}
                fill
                fetchPriority="high"
                loading="eager"
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </figure>

            <div className="flex min-h-[calc(100dvh-4.5rem)] items-center px-5 py-10 sm:px-10 lg:px-12 lg:py-4 xl:px-20">
              <div className="mx-auto w-full max-w-xl">
                <header className="mx-auto max-w-lg text-center">
                  <h1 className="text-balance font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground">
                    {content.header.title}
                  </h1>
                  <p className="mx-auto mt-3 max-w-xl text-pretty leading-relaxed text-muted-foreground sm:text-lg">
                    {content.header.description}
                  </p>
                </header>

                <div className="mt-6">
                  <ContactForm objectives={content.objectives} privacyText={content.privacyText} />
                </div>
              </div>
            </div>
          </section>
        </main>
      </PageTransition>
      <SiteFooter />
    </>
  )
}
