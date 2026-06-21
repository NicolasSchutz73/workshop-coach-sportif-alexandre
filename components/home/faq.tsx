import { SectionHeading } from '@/components/section-heading'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { FaqItem, SectionIntroContent } from '@/lib/homepage'

type FaqProps = {
  faqs: FaqItem[]
  intro: SectionIntroContent
}

export function Faq({ faqs, intro }: FaqProps) {
  return (
    <section className="border-t border-border/60 bg-card">
      <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow={intro.eyebrow}
          title={intro.title}
          description={intro.description}
          align="center"
        />
        <Accordion type="single" collapsible className="mt-10 w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={faq.question} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-heading text-base font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-pretty leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
