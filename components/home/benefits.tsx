import type { Benefit } from '@/lib/homepage'

type BenefitsProps = {
  benefits: Benefit[]
}

export function Benefits({ benefits }: BenefitsProps) {
  return (
    <section className="border-y border-border/60 bg-card">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title}>
              <div className="flex h-4 items-center justify-start text-primary">
                <b.icon className="size-4" />
              </div>
              <h3 className="mt-3 font-heading text-lg font-semibold">
                {b.title}
              </h3>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
