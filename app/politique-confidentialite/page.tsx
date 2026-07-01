import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal-page'
import { legalPages } from '@/lib/legal-pages'

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: legalPages.privacy.description,
  alternates: { canonical: '/politique-confidentialite' },
}

export default function PolitiqueConfidentialitePage() {
  return <LegalPage content={legalPages.privacy} />
}
