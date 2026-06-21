import Image from 'next/image'
import { CtaLink } from '@/components/cta-link'
import type { FinalCtaContent } from '@/lib/homepage'
type FinalCtaProps = { content: FinalCtaContent }
export function FinalCta({ content }: FinalCtaProps) {
  return <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-20"><div className="relative isolate overflow-hidden rounded-[2rem]"><Image src={content.imageUrl} alt={content.imageAlt} fill className="object-cover" /><div className="absolute inset-0 bg-foreground/70" /><div className="relative flex flex-col items-center px-6 py-16 text-center sm:py-24"><h2 className="max-w-2xl text-balance font-heading text-3xl font-extrabold tracking-tight text-white sm:text-5xl">{content.title}</h2><p className="mt-4 max-w-lg text-pretty leading-relaxed text-white/80">{content.description}</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><CtaLink content={content.primaryButton} showArrow /><CtaLink content={content.secondaryButton} variant="outline" className="border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white" /></div></div></div></section>
}
