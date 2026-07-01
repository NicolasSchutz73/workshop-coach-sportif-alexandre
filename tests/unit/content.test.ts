import { describe, expect, it } from 'vitest'
import { mapBookingContent } from '@/lib/booking'
import { mapContactContent } from '@/lib/contact'
import { metadataFromSeo } from '@/lib/content'
import { assertCommerceConfiguration } from '@/lib/commerce'

describe('Strapi mappings', () => {
  it('maps the reservation fields still used by the page', () => {
    const content = mapBookingContent({
      seo: { titre: 'Réserver', description: 'Description', motsCles: 'coach, trail' },
      entete: { surtitre: 'RDV', titre: 'Choisir', description: 'Introduction' },
      titreDeroulement: 'Déroulement',
      etapes: [{ texte: 'Étape administrée' }],
      texteSansPaiement: 'Aucun paiement.',
    })

    expect(content.header.title).toBe('Choisir')
    expect(content.steps).toEqual(['Étape administrée'])
    expect(content.noPaymentText).toBe('Aucun paiement.')
  })

  it('maps only the contact content rendered by the page', () => {
    const content = mapContactContent({
      entete: { surtitre: 'Contact', titre: 'Échangeons', description: 'Écrivez-moi' },
      objectifsFormulaire: [{ texte: 'Trail' }],
      confidentialiteFormulaire: 'Données confidentielles.',
    })

    expect(content.header.title).toBe('Échangeons')
    expect(content.objectives).toEqual(['Trail'])
  })
})

describe('SEO and commerce validation', () => {
  it('creates canonical and social metadata', () => {
    const metadata = metadataFromSeo({ title: 'Titre', description: 'Résumé', keywords: ['coach'] }, '/about')
    expect(metadata.alternates).toEqual({ canonical: '/about' })
    expect(metadata.openGraph).toMatchObject({ title: 'Titre', url: '/about' })
    expect(metadata.twitter).toMatchObject({ card: 'summary_large_image' })
  })

  it('keeps demo checkouts in test mode and blocks an unapproved live mode', () => {
    process.env.NEXT_PUBLIC_COMMERCE_MODE = 'demo'
    expect(assertCommerceConfiguration()).toEqual({ mode: 'demo', testMode: true })

    process.env.NEXT_PUBLIC_COMMERCE_MODE = 'live'
    delete process.env.COMMERCE_LIVE_APPROVED
    expect(() => assertCommerceConfiguration()).toThrow(/blocked/)
  })
})
