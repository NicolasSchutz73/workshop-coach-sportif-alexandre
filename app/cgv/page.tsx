import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal-page'
import { legalPages } from '@/lib/legal-pages'

export const metadata: Metadata = {
  title: 'Conditions générales de vente',
  description: legalPages.terms.description,
  alternates: { canonical: '/cgv' },
}

export default function CgvPage() {
  return <LegalPage content={legalPages.terms} />
}
