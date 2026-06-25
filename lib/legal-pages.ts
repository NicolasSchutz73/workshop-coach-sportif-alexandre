export type LegalPageContent = {
  title: string
  description: string
  updatedAt: string
  sections: Array<{
    title: string
    paragraphs: string[]
  }>
}

export const legalPages = {
  mentionsLegales: {
    title: 'Mentions légales',
    description:
      'Informations légales relatives au site Alexandre Schutz Coaching.',
    updatedAt: '25 juin 2026',
    sections: [
      {
        title: 'Éditeur du site',
        paragraphs: [
          'Le site Alexandre Schutz Coaching présente les prestations de coaching running, trail et préparation physique proposées par Alexandre Schutz.',
          'Les informations administratives définitives de l’entreprise, dont le statut juridique, le numéro SIRET et l’adresse professionnelle, devront être complétées avant la mise en production.',
        ],
      },
      {
        title: 'Responsable de publication',
        paragraphs: [
          'Le responsable de publication est Alexandre Schutz.',
          'Pour toute demande liée au site, utilisez le formulaire de contact ou les coordonnées publiées sur la page Contact.',
        ],
      },
      {
        title: 'Hébergement',
        paragraphs: [
          'Le frontend est prévu pour être hébergé sur Vercel. Le back-office éditorial est prévu sur Strapi Cloud ou sur une instance Strapi dédiée.',
          'Les coordonnées exactes des hébergeurs et les URLs de production devront être renseignées lors de la mise en ligne.',
        ],
      },
      {
        title: 'Propriété intellectuelle',
        paragraphs: [
          'Les textes, images, logos, plans d’entraînement, e-books et éléments graphiques présents sur le site sont protégés par le droit de la propriété intellectuelle.',
          'Toute reproduction ou réutilisation sans autorisation écrite préalable est interdite.',
        ],
      },
    ],
  },
  privacy: {
    title: 'Politique de confidentialité',
    description:
      'Traitement des données personnelles collectées via le site Alexandre Schutz Coaching.',
    updatedAt: '25 juin 2026',
    sections: [
      {
        title: 'Données collectées',
        paragraphs: [
          'Le site peut collecter les informations transmises volontairement via les formulaires de contact et de réservation : nom, prénom, e-mail, téléphone, objectif sportif et message.',
          'Les données de paiement des e-books sont traitées par Lemon Squeezy. Le site ne stocke pas les numéros de carte bancaire.',
        ],
      },
      {
        title: 'Finalités',
        paragraphs: [
          'Les données sont utilisées pour répondre aux demandes, organiser les rendez-vous, assurer le suivi commercial et permettre la livraison des contenus numériques achetés.',
          'Aucune donnée personnelle n’est revendue à des tiers.',
        ],
      },
      {
        title: 'Services tiers',
        paragraphs: [
          'Le site s’appuie sur Strapi pour la gestion éditoriale, Cal.com pour la réservation en ligne, Lemon Squeezy pour le paiement des e-books et des outils de mesure d’audience configurés lors de la mise en production.',
          'Ces services peuvent traiter certaines données nécessaires à leur fonctionnement selon leurs propres politiques de confidentialité.',
        ],
      },
      {
        title: 'Durée de conservation et droits',
        paragraphs: [
          'Les données sont conservées pendant une durée proportionnée au traitement de la demande et aux obligations légales applicables.',
          'Vous pouvez demander l’accès, la rectification ou la suppression de vos données via la page Contact.',
        ],
      },
    ],
  },
  terms: {
    title: 'Conditions générales de vente',
    description:
      'Conditions applicables aux e-books et prestations présentés sur le site Alexandre Schutz Coaching.',
    updatedAt: '25 juin 2026',
    sections: [
      {
        title: 'Objet',
        paragraphs: [
          'Les présentes conditions encadrent la vente de contenus numériques, notamment les plans d’entraînement PDF, et la présentation des prestations de coaching proposées par Alexandre Schutz.',
          'Elles devront être relues et validées avant la mise en production avec les informations juridiques définitives de l’activité.',
        ],
      },
      {
        title: 'Prix et paiement',
        paragraphs: [
          'Les prix affichés sur le site sont indiqués en euros. Le paiement des e-books est réalisé via Lemon Squeezy, qui assure la transaction et la livraison du fichier par e-mail.',
          'Les prestations de coaching affichées sur le site donnent actuellement lieu à une prise de contact ou une réservation. Les modalités de paiement associées doivent être confirmées avant lancement.',
        ],
      },
      {
        title: 'Livraison des contenus numériques',
        paragraphs: [
          'Après paiement, les plans d’entraînement PDF sont envoyés par e-mail via Lemon Squeezy à l’adresse renseignée lors de l’achat.',
          'Le client doit vérifier l’exactitude de son adresse e-mail avant validation du paiement.',
        ],
      },
      {
        title: 'Droit de rétractation',
        paragraphs: [
          'Pour les contenus numériques fournis immédiatement après paiement, le droit de rétractation peut ne pas s’appliquer si le client accepte l’exécution immédiate du service et renonce expressément à ce droit.',
          'La formulation définitive de cette clause doit être validée dans Lemon Squeezy et dans les documents de vente avant la mise en production.',
        ],
      },
    ],
  },
} satisfies Record<string, LegalPageContent>
