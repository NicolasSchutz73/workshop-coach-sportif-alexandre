import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Reveal } from '@/components/animation/reveal'
import type { LegalPageContent } from '@/lib/legal-pages'

type LegalPageProps = {
  content: LegalPageContent
}

export function LegalPage({ content }: LegalPageProps) {
  return (
    <>
      <SiteHeader />
      <main className="bg-background">
        <section className="border-b border-border/60 bg-card">
          <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
            <Reveal className="max-w-3xl">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
                Légal
              </p>
              <h1 className="mt-4 text-balance font-heading text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
                {content.title}
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {content.description}
              </p>
              <p className="mt-5 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Dernière mise à jour : {content.updatedAt}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="divide-y divide-border border-y border-border">
            {content.sections.map((section) => (
              <Reveal
                key={section.title}
                className="grid gap-5 py-8 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] md:gap-10"
              >
                <h2 className="font-heading text-2xl font-semibold tracking-tight">
                  {section.title}
                </h2>
                <div className="space-y-4 text-pretty leading-relaxed text-muted-foreground">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
