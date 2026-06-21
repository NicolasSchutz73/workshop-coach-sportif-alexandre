import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check, Download, ShieldCheck } from 'lucide-react'
import { EbookCheckoutButton } from '@/components/ebook-checkout-button'
import { PlanPreviewCarousel } from '@/components/plan-preview-carousel'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/animation/reveal'
import { StaggerGroup, StaggerItem } from '@/components/animation/stagger'
import { ebookSlugs, isEbookSlug } from '@/lib/ebooks'
import { getTrainingPlan } from '@/lib/services'

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

  return {
    title: `${plan.title} | Plan d’entraînement PDF`,
    description: plan.longDescription,
    keywords: [
      plan.title.toLocaleLowerCase('fr-FR'),
      'plan entraînement running',
      'plan PDF',
      'Alexandre Schutz',
    ],
  }
}

export default async function PlanPage({ params }: PlanPageProps) {
  const { slug } = await params

  if (!isEbookSlug(slug)) notFound()

  const plan = await getTrainingPlan(slug)
  if (!plan) notFound()

  return (
    <>
      <SiteHeader />
      <main>
        <section className="overflow-hidden border-b border-border/70 bg-background">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-20">
            <Reveal variant="scaleReveal">
              <PlanPreviewCarousel plan={plan} />
            </Reveal>

            <Reveal delay={0.05}>
              <Button asChild variant="link" size="sm" className="-ml-1">
                <Link href="/services">
                  <ArrowLeft className="size-4" />
                  Tous les plans
                </Link>
              </Button>
              <p className="mt-7 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Plan d’entraînement PDF
              </p>
              <h1 className="mt-4 text-balance font-heading text-5xl font-medium leading-[0.98] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
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
                  <p className="mt-1 font-heading text-3xl font-medium tracking-[-0.05em]">{plan.price}</p>
                </div>
                <div className="h-10 w-px bg-border" aria-hidden="true" />
                <p className="max-w-48 text-sm leading-snug text-muted-foreground">
                  Paiement sécurisé via Lemon Squeezy
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
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <Reveal>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">Dans ce plan</p>
            <h2 className="mt-4 text-balance font-heading text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
              Vous allez recevoir
            </h2>
            <StaggerGroup as="ul" className="mt-8 grid border-t border-border sm:grid-cols-2">
              {plan.receives.map((item) => (
                <StaggerItem as="li" key={item} className="flex gap-3 border-b border-border py-5 sm:px-5 sm:odd:border-r">
                  <Check className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="font-medium leading-snug">{item}</span>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </Reveal>

          <Reveal as="aside" delay={0.08} className="rounded-[2rem] bg-primary px-7 py-8 text-primary-foreground shadow-lg sm:px-9 sm:py-10">
            <ShieldCheck className="size-8" aria-hidden="true" />
            <h2 className="mt-6 font-heading text-3xl font-medium tracking-[-0.04em]">Prêt quand vous l’êtes</h2>
            <p className="mt-3 leading-relaxed text-primary-foreground/80">
              Votre plan est envoyé par e-mail par Lemon Squeezy après le paiement. Conservez-le sur votre téléphone ou imprimez-le pour suivre vos semaines d’entraînement.
            </p>
            <div className="mt-7 [&_button]:bg-background [&_button]:text-foreground [&_button]:hover:bg-background/90">
              <EbookCheckoutButton
                ebook={plan.slug}
                label="Accéder au paiement"
                size="lg"
                className="h-12 px-6"
              />
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
