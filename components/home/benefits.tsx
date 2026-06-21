import { StaggerGroup, StaggerItem } from '@/components/animation/stagger'
import type { Benefit } from '@/lib/homepage'

type BenefitsProps = {
  benefits: Benefit[]
}

export function Benefits({ benefits }: BenefitsProps) {
  return (
    <section className="border-y border-border/60 bg-card">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
        <StaggerGroup className="grid border-t border-border lg:grid-cols-4">
          {benefits.map((b, index) => {
            const number = String(index + 1).padStart(2, '0')
            return (
              <StaggerItem
                key={b.title}
                as="div"
                className="group flex gap-5 border-b border-border py-7 lg:flex-col lg:gap-0 lg:border-b-0 lg:border-l lg:px-7 lg:py-9 lg:first:border-l-0 lg:first:pl-0"
              >
                {/* Number / icon rail — vertical progression on mobile, horizontal on desktop */}
                <div className="flex flex-col items-center gap-3 lg:w-full lg:flex-row lg:gap-4">
                  <span className="font-mono text-sm font-semibold tracking-wider text-primary">
                    {number}
                  </span>
                  <span className="text-primary">
                    <b.icon className="size-4" />
                  </span>
                  <span
                    aria-hidden="true"
                    className="w-px flex-1 bg-border lg:h-px"
                  />
                </div>

                <div className="lg:mt-6">
                  <h3 className="font-heading text-lg font-semibold leading-snug">
                    {b.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
                    {b.description}
                  </p>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
