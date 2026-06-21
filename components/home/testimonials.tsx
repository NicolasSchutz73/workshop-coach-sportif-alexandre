import { Star } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
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
      <SectionHeading
        eyebrow={intro.eyebrow}
        title={intro.title}
        description={intro.description}
        align="center"
      />

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <figure
            key={`${testimonial.name}-${testimonial.detail}`}
            className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm"
          >
            <div
              className="flex gap-0.5"
              aria-label={`${testimonial.rating} sur 5`}
            >
              {Array.from({ length: testimonial.rating }).map((_, index) => (
                <Star
                  key={index}
                  className="size-4 fill-primary text-primary"
                />
              ))}
            </div>
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
          </figure>
        ))}
      </div>
    </section>
  )
}
