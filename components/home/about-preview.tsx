import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AboutPreviewContent } from '@/lib/homepage'

type AboutPreviewProps = {
  content: AboutPreviewContent
}

export function AboutPreview({ content }: AboutPreviewProps) {
  return (
    <section className="border-y border-border/60 bg-card">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
          <Image
            src={content.imageUrl}
            alt={content.imageAlt}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
            {content.eyebrow}
          </p>
          <h2 className="text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
            {content.description}
          </p>

          <ul className="mt-7 space-y-3">
            {content.certifications.map((c) => (
              <li key={c} className="flex items-start gap-3">
                <Award className="mt-0.5 size-5 shrink-0 text-primary" />
                <span className="text-sm font-medium">{c}</span>
              </li>
            ))}
          </ul>

          <Button asChild className="mt-8 rounded-full">
            <Link href={content.ctaHref}>
              {content.ctaLabel}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
