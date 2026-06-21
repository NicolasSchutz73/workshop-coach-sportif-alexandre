import { Hero } from '@/components/home/hero'
import { Benefits } from '@/components/home/benefits'
import { ServicesPreview } from '@/components/home/services-preview'
import { AboutPreview } from '@/components/home/about-preview'
import { Testimonials } from '@/components/home/testimonials'
import { Faq } from '@/components/home/faq'
import { FinalCta } from '@/components/home/final-cta'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getHomepageContent } from '@/lib/homepage'
import { getServices } from '@/lib/services'
import type { Metadata } from 'next'
import { metadataFromSeo } from '@/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepageContent()
  return metadataFromSeo(homepage.seo)
}

export default async function Page() {
  const [homepage, services] = await Promise.all([
    getHomepageContent(),
    getServices(),
  ])

  return (
    <>
      <SiteHeader />
      <main>
        <Hero content={homepage.hero} />
        <Benefits benefits={homepage.benefits} />
        <ServicesPreview services={services} intro={homepage.servicesIntro} />
        <AboutPreview content={homepage.aboutPreview} />
        <Testimonials
          intro={homepage.testimonialsIntro}
          testimonials={homepage.testimonials}
        />
        <Faq faqs={homepage.faqs} intro={homepage.faqIntro} />
        <FinalCta content={homepage.finalCta} />
      </main>
      <SiteFooter />
    </>
  )
}
