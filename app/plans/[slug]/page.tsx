import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, Download } from 'lucide-react'
import { PageTransition } from '@/components/animation/page-transition'
import { EbookCheckoutButton } from '@/components/ebook-checkout-button'
import { PlanPreviewCarousel } from '@/components/plan-preview-carousel'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/animation/reveal'
import { ebookSlugs, isEbookSlug } from '@/lib/ebooks'
import { getTrainingPlan } from '@/lib/services'
import { metadataFromSeo } from '@/lib/content'
import { getCommerceMode } from '@/lib/commerce'

const pageFadeTransition = ['page-fade']

type PlanPageProps = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return ebookSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PlanPageProps): Promise<Metadata> {
  const { slug } = await params
  const plan = await getTrainingPlan(slug)

  if (!plan) {
    return { title: 'Plan introuvable' }
  }

  return metadataFromSeo({
    title: `${plan.title} | Plan d’entraînement PDF`,
    description: plan.longDescription,
    keywords: [
      plan.title.toLocaleLowerCase('fr-FR'),
      'plan entraînement running',
      'plan PDF',
      'Alexandre Schutz',
    ],
  }, `/plans/${slug}`)
}

export default async function PlanPage({ params }: PlanPageProps) {
  const { slug } = await params

  if (!isEbookSlug(slug)) notFound()

  const plan = await getTrainingPlan(slug)
  if (!plan) notFound()
  const commerceMode = getCommerceMode()

  return (
    <>
      <SiteHeader />
      <PageTransition>
        <main>
        <section className="overflow-hidden border-b border-border/70 bg-background">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-20">
            <Reveal variant="scaleReveal">
              <PlanPreviewCarousel plan={plan} />
            </Reveal>

            <Reveal delay={0.05}>
              <Button asChild variant="link" size="sm" className="-ml-1">
                <Link href="/services" transitionTypes={pageFadeTransition}>
                  <ArrowLeft className="size-4" />
                  Tous les plans
                </Link>
              </Button>
              <p className="mt-7 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Plan d’entraînement PDF
              </p>
              <h1 className="mt-4 text-balance font-heading text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
                {plan.title}
              </h1>
              <p className="mt-4 font-heading text-lg font-semibold text-primary">
                {plan.detail}
              </p>
              <p className="mt-6 max-w-xl text-pretty leading-relaxed text-muted-foreground">
                {plan.longDescription}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5 border-y border-border py-5">
                <div>
                  <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Prix</p>
                  <p className="mt-1 font-heading text-3xl font-extrabold tracking-tight">{plan.price}</p>
                </div>
                <div className="h-10 w-px bg-border" aria-hidden="true" />
                <p className="max-w-48 text-sm leading-snug text-muted-foreground">
                  Paiement sécurisé via Lemon Squeezy
                  {commerceMode === 'demo' ? ' · mode démonstration' : ''}
                </p>
              </div>
              <div className="mt-8 flex flex-col items-start gap-4">
                <EbookCheckoutButton
                  ebook={plan.slug}
                  label="Acheter le plan"
                  size="lg"
                  className="h-12 px-7 text-base"
                />
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Download className="size-4 text-primary" aria-hidden="true" />
                  PDF envoyé par e-mail après paiement
                </p>
              </div>
            </Reveal>
          </div>
        </section>
        </main>
      </PageTransition>
      <SiteFooter />
    </>
  )
}
