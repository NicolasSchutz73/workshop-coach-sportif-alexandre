import type { Schema, Struct } from '@strapi/strapi';

export interface HomepageAboutPreview extends Struct.ComponentSchema {
  collectionName: 'components_homepage_about_previews';
  info: {
    displayName: '3. Aper\u00E7u \u00C0 propos';
    icon: 'user';
  };
  attributes: {
    button: Schema.Attribute.Component<'shared.button', false>;
    certifications: Schema.Attribute.Component<'shared.certification', true>;
    description: Schema.Attribute.Blocks;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    imageAlt: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageBenefit extends Struct.ComponentSchema {
  collectionName: 'components_homepage_benefits';
  info: {
    displayName: 'B\u00E9n\u00E9fice';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.Enumeration<
      ['target', 'line-chart', 'gauge', 'laptop']
    > &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageFaq extends Struct.ComponentSchema {
  collectionName: 'components_homepage_faqs';
  info: {
    displayName: 'Question fr\u00E9quente';
    icon: 'question';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageFinalCta extends Struct.ComponentSchema {
  collectionName: 'components_homepage_final_ctas';
  info: {
    displayName: "5. Appel \u00E0 l'action final";
    icon: 'rocket';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    imageAlt: Schema.Attribute.String;
    primaryButton: Schema.Attribute.Component<'shared.button', false>;
    secondaryButton: Schema.Attribute.Component<'shared.button', false>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageHero extends Struct.ComponentSchema {
  collectionName: 'components_homepage_heroes';
  info: {
    displayName: '1. Banni\u00E8re principale';
    icon: 'picture';
  };
  attributes: {
    description: Schema.Attribute.Blocks;
    image: Schema.Attribute.Media<'images'>;
    location: Schema.Attribute.String;
    primaryButton: Schema.Attribute.Component<'shared.button', false>;
    secondaryButton: Schema.Attribute.Component<'shared.button', false>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageAProposPrincipe extends Struct.ComponentSchema {
  collectionName: 'components_page_a_propos_principes';
  info: {
    displayName: 'Principe de coaching';
    icon: 'lightbulb';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    titre: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageAccueilIntroductionSection extends Struct.ComponentSchema {
  collectionName: 'components_page_accueil_introductions_section';
  info: {
    displayName: 'Introduction de section';
    icon: 'heading';
  };
  attributes: {
    bouton: Schema.Attribute.Component<'shared.button', false>;
    description: Schema.Attribute.Text;
    surtitre: Schema.Attribute.String;
    titre: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageAccueilTemoignage extends Struct.ComponentSchema {
  collectionName: 'components_page_accueil_temoignages';
  info: {
    displayName: 'T\u00E9moignage';
    icon: 'quote';
  };
  attributes: {
    citation: Schema.Attribute.Text & Schema.Attribute.Required;
    detail: Schema.Attribute.String & Schema.Attribute.Required;
    nom: Schema.Attribute.String & Schema.Attribute.Required;
    note: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
  };
}

export interface PageContactCoordonnee extends Struct.ComponentSchema {
  collectionName: 'components_page_contact_coordonnees';
  info: {
    displayName: 'Coordonn\u00E9e';
    icon: 'pinMap';
  };
  attributes: {
    libelle: Schema.Attribute.String & Schema.Attribute.Required;
    lien: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<
      ['zone', 'email', 'telephone', 'instagram']
    > &
      Schema.Attribute.Required;
    valeur: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageContactHoraire extends Struct.ComponentSchema {
  collectionName: 'components_page_contact_horaires';
  info: {
    displayName: 'Horaire';
    icon: 'clock';
  };
  attributes: {
    heures: Schema.Attribute.String & Schema.Attribute.Required;
    jours: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageReservationJourFerme extends Struct.ComponentSchema {
  collectionName: 'components_page_reservation_jours_fermes';
  info: {
    displayName: 'Jour ferm\u00E9';
    icon: 'calendar';
  };
  attributes: {
    jour: Schema.Attribute.Enumeration<
      ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
    > &
      Schema.Attribute.Required;
  };
}

export interface PageReservationReassurance extends Struct.ComponentSchema {
  collectionName: 'components_page_reservation_reassurances';
  info: {
    displayName: '\u00C9l\u00E9ment de r\u00E9assurance';
    icon: 'shield';
  };
  attributes: {
    icone: Schema.Attribute.Enumeration<
      ['horloge', 'localisation', 'securite']
    > &
      Schema.Attribute.Required;
    texte: Schema.Attribute.Text & Schema.Attribute.Required;
    titre: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageReservationTypeSeance extends Struct.ComponentSchema {
  collectionName: 'components_page_reservation_types_seance';
  info: {
    displayName: 'Type de s\u00E9ance';
    icon: 'calendar';
  };
  attributes: {
    duree: Schema.Attribute.String & Schema.Attribute.Required;
    icone: Schema.Attribute.Enumeration<['video', 'localisation']> &
      Schema.Attribute.Required;
    identifiant: Schema.Attribute.String & Schema.Attribute.Required;
    libelle: Schema.Attribute.String & Schema.Attribute.Required;
    mode: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PartageColonneLiens extends Struct.ComponentSchema {
  collectionName: 'components_partage_colonnes_liens';
  info: {
    displayName: 'Colonne de liens';
    icon: 'bulletList';
  };
  attributes: {
    liens: Schema.Attribute.Component<'partage.lien', true> &
      Schema.Attribute.Required;
    titre: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PartageElementListe extends Struct.ComponentSchema {
  collectionName: 'components_partage_elements_liste';
  info: {
    displayName: '\u00C9l\u00E9ment de liste';
    icon: 'bulletList';
  };
  attributes: {
    texte: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface PartageEntetePage extends Struct.ComponentSchema {
  collectionName: 'components_partage_entetes_page';
  info: {
    displayName: 'En-t\u00EAte de page';
    icon: 'heading';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    surtitre: Schema.Attribute.String & Schema.Attribute.Required;
    titre: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PartageLien extends Struct.ComponentSchema {
  collectionName: 'components_partage_liens';
  info: {
    displayName: 'Lien';
    icon: 'link';
  };
  attributes: {
    libelle: Schema.Attribute.String & Schema.Attribute.Required;
    lien: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PartageReseauSocial extends Struct.ComponentSchema {
  collectionName: 'components_partage_reseaux_sociaux';
  info: {
    displayName: 'R\u00E9seau social';
    icon: 'earth';
  };
  attributes: {
    libelle: Schema.Attribute.String & Schema.Attribute.Required;
    lien: Schema.Attribute.String & Schema.Attribute.Required;
    plateforme: Schema.Attribute.Enumeration<
      ['instagram', 'whatsapp', 'nolio']
    > &
      Schema.Attribute.Required;
  };
}

export interface PartageSeo extends Struct.ComponentSchema {
  collectionName: 'components_partage_seos';
  info: {
    displayName: 'R\u00E9f\u00E9rencement';
    icon: 'search';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    motsCles: Schema.Attribute.Text;
    titre: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ServicesPageFinalCta extends Struct.ComponentSchema {
  collectionName: 'components_services_page_final_ctas';
  info: {
    displayName: "3. Appel \u00E0 l'action final";
    icon: 'rocket';
  };
  attributes: {
    button: Schema.Attribute.Component<'shared.button', false> &
      Schema.Attribute.Required;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ServicesPagePageHeader extends Struct.ComponentSchema {
  collectionName: 'components_services_page_headers';
  info: {
    displayName: '1. En-t\u00EAte';
    icon: 'heading';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    eyebrow: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ServicesPagePlan extends Struct.ComponentSchema {
  collectionName: 'components_services_page_plans';
  info: {
    displayName: "Plan d'entra\u00EEnement";
    icon: 'file';
  };
  attributes: {
    button: Schema.Attribute.Component<'shared.button', false> &
      Schema.Attribute.Required;
    contentsPreview: Schema.Attribute.Media<'images'>;
    contentsPreviewAlt: Schema.Attribute.String;
    cover: Schema.Attribute.Media<'images'>;
    coverAlt: Schema.Attribute.String;
    detail: Schema.Attribute.String & Schema.Attribute.Required;
    longDescription: Schema.Attribute.Text;
    price: Schema.Attribute.Decimal & Schema.Attribute.Required;
    receives: Schema.Attribute.Component<'services-page.plan-list-item', true>;
    slug: Schema.Attribute.Enumeration<
      [
        'plan-10-km',
        'plan-semi-marathon',
        'plan-marathon',
        'plan-trail-decouverte',
      ]
    >;
    tableOfContents: Schema.Attribute.Component<
      'services-page.plan-list-item',
      true
    >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ServicesPagePlanListItem extends Struct.ComponentSchema {
  collectionName: 'components_services_page_plan_list_items';
  info: {
    displayName: '\u00C9l\u00E9ment de liste de plan';
    icon: 'check';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ServicesPagePlansSection extends Struct.ComponentSchema {
  collectionName: 'components_services_page_plans_sections';
  info: {
    displayName: '2. E-books et plans';
    icon: 'book';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    eyebrow: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    imageAlt: Schema.Attribute.String;
    plans: Schema.Attribute.Component<'services-page.plan', true> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ServicesPageServiceCard extends Struct.ComponentSchema {
  collectionName: 'components_services_page_service_cards';
  info: {
    displayName: 'Prestation';
    icon: 'briefcase';
  };
  attributes: {
    button: Schema.Attribute.Component<'shared.button', false> &
      Schema.Attribute.Required;
    description: Schema.Attribute.Blocks;
    duration: Schema.Attribute.String;
    featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    featuredLabel: Schema.Attribute.String;
    features: Schema.Attribute.Component<'shared.feature', true>;
    image: Schema.Attribute.Media<'images'>;
    price: Schema.Attribute.Decimal;
    priceNote: Schema.Attribute.String;
    slug: Schema.Attribute.String & Schema.Attribute.Required;
    tagline: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_buttons';
  info: {
    displayName: 'Bouton';
    icon: 'cursor';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedCertification extends Struct.ComponentSchema {
  collectionName: 'components_shared_certifications';
  info: {
    displayName: 'Certification';
    icon: 'badge';
  };
  attributes: {
    label: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SharedFeature extends Struct.ComponentSchema {
  collectionName: 'components_shared_features';
  info: {
    displayName: 'Point cl\u00E9';
    icon: 'check';
  };
  attributes: {
    description: Schema.Attribute.Text;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'homepage.about-preview': HomepageAboutPreview;
      'homepage.benefit': HomepageBenefit;
      'homepage.faq': HomepageFaq;
      'homepage.final-cta': HomepageFinalCta;
      'homepage.hero': HomepageHero;
      'page-a-propos.principe': PageAProposPrincipe;
      'page-accueil.introduction-section': PageAccueilIntroductionSection;
      'page-accueil.temoignage': PageAccueilTemoignage;
      'page-contact.coordonnee': PageContactCoordonnee;
      'page-contact.horaire': PageContactHoraire;
      'page-reservation.jour-ferme': PageReservationJourFerme;
      'page-reservation.reassurance': PageReservationReassurance;
      'page-reservation.type-seance': PageReservationTypeSeance;
      'partage.colonne-liens': PartageColonneLiens;
      'partage.element-liste': PartageElementListe;
      'partage.entete-page': PartageEntetePage;
      'partage.lien': PartageLien;
      'partage.reseau-social': PartageReseauSocial;
      'partage.seo': PartageSeo;
      'services-page.final-cta': ServicesPageFinalCta;
      'services-page.page-header': ServicesPagePageHeader;
      'services-page.plan': ServicesPagePlan;
      'services-page.plan-list-item': ServicesPagePlanListItem;
      'services-page.plans-section': ServicesPagePlansSection;
      'services-page.service-card': ServicesPageServiceCard;
      'shared.button': SharedButton;
      'shared.certification': SharedCertification;
      'shared.feature': SharedFeature;
    }
  }
}
