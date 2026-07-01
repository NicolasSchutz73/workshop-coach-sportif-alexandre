'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { TrainingPlan } from '@/lib/services'

type PlanPreviewCarouselProps = {
  plan: TrainingPlan
}

export function PlanPreviewCarousel({ plan }: PlanPreviewCarouselProps) {
  const [activeSlide, setActiveSlide] = useState(0)
  const slides = [
    {
      title: 'Couverture',
      image: plan.cover,
      overlay: null,
    },
    {
      title: 'Aperçu du sommaire',
      image: plan.contentsPreview,
      overlay: (
        <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/35 bg-background/90 p-5">
          <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary">
            Sommaire
          </p>
          <ol className="mt-3 space-y-2 border-t border-border pt-3 text-sm font-medium text-foreground">
            {plan.tableOfContents.map((item, index) => (
              <li key={item} className="flex gap-3">
                <span className="font-mono text-xs text-primary">0{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      ),
    },
  ]
  const active = slides[activeSlide]

  function showPrevious() {
    setActiveSlide((current) => (current === 0 ? slides.length - 1 : current - 1))
  }

  function showNext() {
    setActiveSlide((current) => (current + 1) % slides.length)
  }

  return (
    <section aria-label="Aperçu du plan" className="relative mx-auto w-full max-w-md">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
        <Image
          src={active.image.url}
          alt={active.image.alt}
          fill
          loading="eager"
          sizes="(min-width: 1024px) 42vw, 92vw"
          className="object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-foreground/10" />
        {active.overlay}
        <p className="absolute left-5 top-5 bg-background/90 px-3 py-1.5 font-mono text-[0.65rem] font-medium uppercase tracking-[0.14em] text-foreground">
          {active.title}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-10 rounded-full bg-background"
          onClick={showPrevious}
          aria-label="Afficher l’aperçu précédent"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Button>
        <div className="flex gap-2" aria-label={`Aperçu ${activeSlide + 1} sur ${slides.length}`}>
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setActiveSlide(index)}
              className="group rounded-full p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Afficher ${slide.title.toLocaleLowerCase('fr-FR')}`}
              aria-current={index === activeSlide ? 'true' : undefined}
            >
              <span
                className={`block h-1.5 rounded-full transition-all ${
                  index === activeSlide ? 'w-8 bg-primary' : 'w-1.5 bg-border group-hover:bg-muted-foreground'
                }`}
              />
            </button>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-10 rounded-full bg-background"
          onClick={showNext}
          aria-label="Afficher l’aperçu suivant"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </section>
  )
}
