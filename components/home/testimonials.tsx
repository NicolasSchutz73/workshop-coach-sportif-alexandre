import { Star } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/animation/reveal'
import { StaggerGroup, StaggerItem } from '@/components/animation/stagger'
import type {
  SectionIntroContent,
  TestimonialContent,
} from '@/lib/homepage'

type TestimonialsProps = {
  intro: SectionIntroContent
  testimonials: TestimonialContent[]
}

export function Testimonials({ intro, testimonials }: TestimonialsProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
      <Reveal>
        <SectionHeading
          eyebrow={intro.eyebrow}
          title={intro.title}
          description={intro.description}
          align="center"
        />
      </Reveal>

      <StaggerGroup className="mt-12 grid gap-5 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <StaggerItem
            as="figure"
            key={`${testimonial.name}-${testimonial.detail}`}
            className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md"
          >
            <div
              className="flex gap-0.5"
              aria-hidden="true"
            >
              {Array.from({ length: testimonial.rating }).map((_, index) => (
                <Star
                  key={index}
                  className="size-4 fill-primary text-primary"
                />
              ))}
            </div>
            <span className="sr-only">
              Note : {testimonial.rating} sur 5
            </span>
            <blockquote className="mt-4 flex-1 text-pretty leading-relaxed text-foreground">
              “{testimonial.quote}”
            </blockquote>
            <figcaption className="mt-6 border-t border-border/60 pt-4">
              <p className="font-heading text-sm font-semibold">
                {testimonial.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {testimonial.detail}
              </p>
            </figcaption>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  )
}
