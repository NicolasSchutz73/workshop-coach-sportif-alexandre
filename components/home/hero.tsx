import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ParallaxImage } from '@/components/animation/parallax-image'
import type { HomepageHero } from '@/lib/homepage'

type HeroProps = { content: HomepageHero }

export function Hero({ content }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <ParallaxImage
          src={content.bannerImageUrl}
          alt={content.bannerImageAlt}
          className="absolute inset-0"
          imageClassName="-scale-x-100"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/45 to-foreground/30" />
      </div>
      <div className="mx-auto flex min-h-[88vh] w-full max-w-6xl flex-col justify-center px-5 pb-16 pt-28 sm:px-6 sm:pb-20">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 backdrop-blur-sm">
            <MapPin className="size-3.5 text-white" />
            <span className="text-xs font-medium text-white">
              {content.location}
            </span>
          </div>
          <h1 className="text-balance font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
            {content.title}
          </h1>
          <p className="mt-5 max-w-xl whitespace-pre-line text-pretty text-base leading-relaxed text-white/80 sm:text-lg">
            {content.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full px-7 text-base transition-transform duration-200 hover:-translate-y-0.5"
            >
              <Link href={content.primaryButtonHref}>
                {content.primaryButtonLabel}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/40 bg-white/10 px-7 text-base text-white backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/20 hover:text-white"
            >
              <Link href={content.secondaryButtonHref}>
                {content.secondaryButtonLabel}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
