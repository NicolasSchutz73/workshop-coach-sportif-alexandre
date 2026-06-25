import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal-page'
import { legalPages } from '@/lib/legal-pages'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: legalPages.mentionsLegales.description,
}

export default function MentionsLegalesPage() {
  return <LegalPage content={legalPages.mentionsLegales} />
}
