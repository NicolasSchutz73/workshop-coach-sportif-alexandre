import { randomUUID } from 'node:crypto';
import type { Core } from '@strapi/strapi';

const frenchLabels = {
  'api::homepage.homepage': {
    seo: 'Référencement',
    internalName: "Page d'accueil",
    hero: '1. Bannière principale',
    benefits: '2. Bénéfices',
    introductionPrestations: '3. Introduction des prestations',
    aboutPreview: '4. Aperçu À propos',
    introductionTemoignages: '5. Introduction des témoignages',
    temoignages: '6. Témoignages',
    introductionFaq: '7. Introduction des questions fréquentes',
    faqs: '8. Questions fréquentes',
    finalCta: "9. Appel à l'action final",
  },
  'api::services-page.services-page': {
    seo: 'Référencement',
    internalName: 'Page Prestations',
    header: '1. En-tête',
    services: '2. Prestations',
    plansSection: '3. E-books et plans',
    finalCta: "4. Appel à l'action final",
  },
  'api::footer.footer': {
    brandName: 'Nom affiché',
    description: 'Description',
    instagramUrl: 'Lien Instagram',
    whatsappUrl: 'Lien WhatsApp',
    nolioUrl: 'Lien Nolio',
    copyrightText: 'Texte de copyright',
    locationText: 'Localisation',
    colonnes: 'Colonnes de liens',
  },
  'api::parametres-site.parametres-site': {
    nomInterne: 'Nom de la configuration',
    nomMarque: 'Nom de la marque',
    navigation: 'Navigation principale',
    boutonReservation: 'Bouton de réservation',
    seoGlobal: 'Référencement global',
    modeleTitre: 'Modèle des titres de page',
    nomApplication: "Nom de l'application",
    nomApplicationCourt: "Nom court de l'application",
    descriptionApplication: "Description de l'application",
  },
  'api::page-a-propos.page-a-propos': {
    nomInterne: 'Nom de la page',
    seo: 'Référencement',
    entete: 'En-tête',
    photo: 'Photo du coach',
    texteAlternatifPhoto: 'Texte alternatif de la photo',
    titreParcours: 'Titre du parcours',
    parcours: 'Parcours',
    surtitreExperience: "Surtitre de l'expérience",
    titreExperience: "Titre de l'expérience",
    contenuExperience: "Texte de l'expérience",
    imageExperience: "Image de l'expérience",
    texteAlternatifImageExperience: "Texte alternatif de l'image",
    titreCertifications: 'Titre des certifications',
    certifications: 'Certifications',
  },
  'api::page-contact.page-contact': {
    nomInterne: 'Nom de la page',
    seo: 'Référencement',
    entete: 'En-tête',
    image: 'Image de la page',
    texteAlternatifImage: "Texte alternatif de l'image",
    objectifsFormulaire: 'Objectifs proposés dans le formulaire',
    confidentialiteFormulaire: 'Message de confidentialité',
  },
  'api::page-reservation.page-reservation': {
    nomInterne: 'Nom de la page',
    seo: 'Référencement',
    entete: 'En-tête',
    titreDeroulement: 'Titre du déroulement',
    etapes: 'Étapes',
    texteSansPaiement: 'Message sur le paiement',
  },
  'shared.feature': {
    name: 'Nom',
    description: 'Description',
  },
  'shared.certification': {
    label: 'Intitulé',
  },
  'shared.button': {
    label: 'Libellé',
    href: 'Lien',
  },
  'homepage.hero': {
    image: 'Image de fond',
    location: 'Localisation',
    title: 'Titre principal',
    description: 'Description',
    primaryButton: 'Bouton principal',
    secondaryButton: 'Bouton secondaire',
  },
  'homepage.benefit': {
    title: 'Titre',
    description: 'Description',
    icon: 'Icône',
  },
  'homepage.about-preview': {
    eyebrow: 'Surtitre',
    title: 'Titre',
    description: 'Description',
    image: 'Photo',
    imageAlt: 'Texte alternatif de la photo',
    certifications: 'Certifications',
    button: 'Bouton',
  },
  'homepage.faq': {
    question: 'Question',
    answer: 'Réponse',
  },
  'homepage.final-cta': {
    title: 'Question principale',
    description: 'Texte',
    primaryButton: 'Bouton principal',
    secondaryButton: 'Bouton secondaire',
  },
  'services-page.page-header': {
    eyebrow: 'Surtitre',
    title: 'Titre',
    description: 'Description',
  },
  'services-page.service-card': {
    title: 'Titre',
    slug: 'Identifiant technique',
    tagline: 'Accroche',
    description: 'Description',
    duration: 'Durée',
    featured: 'Mettre en avant',
    featuredLabel: 'Libellé de mise en avant',
    features: 'Points clés',
    image: 'Image',
    button: 'Bouton',
  },
  'services-page.plan': {
    title: 'Nom du plan',
    slug: 'Produit LemonSqueezy',
    detail: 'Durée et niveau',
    button: "Bouton d'achat",
    longDescription: 'Description longue',
    cover: 'Image de couverture',
    coverAlt: 'Texte alternatif de la couverture',
    contentsPreview: 'Image d’aperçu du sommaire',
    contentsPreviewAlt: 'Texte alternatif de l’aperçu',
    tableOfContents: 'Sommaire',
  },
  'services-page.plan-list-item': {
    title: 'Libellé',
  },
  'services-page.plans-section': {
    eyebrow: 'Surtitre',
    title: 'Titre',
    description: 'Description',
    plans: 'Plans disponibles',
    image: 'Image',
    imageAlt: "Texte alternatif de l'image",
  },
  'services-page.final-cta': {
    title: 'Titre',
    description: 'Description',
    button: 'Bouton',
  },
  'partage.seo': {
    titre: 'Titre SEO',
    description: 'Description SEO',
    motsCles: 'Mots-clés (un par ligne)',
  },
  'partage.lien': {
    libelle: 'Libellé',
    lien: 'Lien',
  },
  'partage.colonne-liens': {
    titre: 'Titre de la colonne',
    liens: 'Liens',
  },
  'partage.entete-page': {
    surtitre: 'Surtitre',
    titre: 'Titre',
    description: 'Description',
  },
  'partage.element-liste': {
    texte: 'Texte',
  },
  'page-accueil.introduction-section': {
    surtitre: 'Surtitre',
    titre: 'Titre',
    description: 'Description',
    bouton: 'Bouton',
  },
  'page-accueil.temoignage': {
    citation: 'Témoignage',
    nom: 'Nom affiché',
    detail: 'Résultat ou contexte',
    note: 'Note sur 5',
  },
} as const;

type ContentManagerConfiguration = {
  settings?: {
    mainField?: string;
    defaultSortBy?: string;
    [key: string]: unknown;
  };
  metadatas: Record<
    string,
    {
      edit?: { label?: string };
      list?: { label?: string };
    }
  >;
  layouts?: {
    edit?: Array<Array<{ name: string; size: number }>>;
    list?: string[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

type ContentManagerService = {
  findContentType?: (uid: string) => unknown;
  findComponent?: (uid: string) => unknown;
  findConfiguration: (model: unknown) => Promise<ContentManagerConfiguration>;
  updateConfiguration: (
    model: unknown,
    configuration: ContentManagerConfiguration,
  ) => Promise<unknown>;
};

async function ensureFrenchContentManagerLabels(strapi: Core.Strapi) {
  const contentManager = strapi.plugin('content-manager');

  for (const [uid, labels] of Object.entries(frenchLabels)) {
    const isComponent = Boolean(
      (strapi.components as unknown as Record<string, unknown>)[uid],
    );
    const serviceName = isComponent ? 'components' : 'content-types';
    const service = contentManager.service(
      serviceName,
    ) as unknown as ContentManagerService;
    const model = isComponent
      ? service.findComponent?.(uid)
      : service.findContentType?.(uid);

    if (!model) continue;

    const configuration = await service.findConfiguration(model);

    for (const [field, label] of Object.entries(labels)) {
      const metadata = configuration.metadatas[field];

      if (!metadata) continue;

      metadata.edit = { ...metadata.edit, label };
      metadata.list = { ...metadata.list, label };
    }

    if (
      uid === 'api::homepage.homepage' ||
      uid === 'api::services-page.services-page' ||
      uid === 'api::parametres-site.parametres-site' ||
      uid === 'api::page-a-propos.page-a-propos' ||
      uid === 'api::page-contact.page-contact' ||
      uid === 'api::page-reservation.page-reservation'
    ) {
      const mainField =
        uid === 'api::homepage.homepage' ||
        uid === 'api::services-page.services-page'
          ? 'internalName'
          : 'nomInterne';
      configuration.settings = {
        ...configuration.settings,
        mainField,
        defaultSortBy: mainField,
      };
      configuration.layouts = {
        ...configuration.layouts,
        edit: configuration.layouts?.edit?.map((row) =>
          row.filter((field) => field.name !== mainField),
        ),
      };
    }

    await service.updateConfiguration(model, configuration);
  }
}

async function ensureHomepageInternalName(strapi: Core.Strapi) {
  const documents = strapi.documents('api::homepage.homepage') as any;
  const homepage = await documents.findFirst({ status: 'draft' });

  if (!homepage || homepage.internalName === "Page d'accueil") return;

  await documents.update({
    documentId: homepage.documentId,
    data: {
      internalName: "Page d'accueil",
    },
  });
  await documents.publish({ documentId: homepage.documentId });
}

async function ensureServicesPageContent(strapi: Core.Strapi) {
  const documents = strapi.documents(
    'api::services-page.services-page',
  ) as any;
  const existing = await documents.findFirst({ status: 'draft' });

  if (existing) return;

  const created = await documents.create({
    data: {
      internalName: 'Page Prestations',
      header: {
        eyebrow: 'Prestations',
        title: 'Choisissez votre accompagnement',
        description:
          'Des formules pensées pour chaque coureur, du suivi ponctuel au coaching complet. Premier échange toujours gratuit.',
      },
      services: [
        {
          title: 'Coaching 1-to-1',
          slug: 'coaching-1to1',
          tagline: 'Séances individuelles',
          description: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Des séances en présentiel autour de Chambéry et du Lac du Bourget, centrées sur votre technique et vos sensations.',
                },
              ],
            },
          ],
          featured: false,
          features: [
            { name: 'Séance individuelle d’1h' },
            { name: 'Analyse de la foulée' },
            { name: 'Travail technique sur le terrain' },
            { name: 'Conseils nutrition & récupération' },
          ],
          button: { label: 'Réserver une séance', href: '/reservation' },
        },
        {
          title: 'Coaching mensuel',
          slug: 'coaching-mensuel',
          tagline: 'Le plus populaire',
          description: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'L’accompagnement complet pour progresser durablement, avec un plan évolutif et un suivi hebdomadaire.',
                },
              ],
            },
          ],
          featured: true,
          features: [
            { name: 'Plan d’entraînement personnalisé' },
            { name: 'Ajustements hebdomadaires' },
            { name: 'Suivi illimité par messagerie' },
            { name: 'Bilan mensuel de progression' },
            { name: 'Accès à l’app Nolio' },
          ],
          button: { label: 'Commencer maintenant', href: '/reservation' },
        },
        {
          title: 'Coaching en ligne',
          slug: 'coaching-en-ligne',
          tagline: 'Où que vous soyez',
          description: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Tout le suivi à distance, idéal pour les coureurs autonomes qui veulent une structure et un regard expert.',
                },
              ],
            },
          ],
          featured: false,
          features: [
            { name: 'Plan d’entraînement mensuel' },
            { name: 'Suivi via Nolio' },
            { name: 'Point visio bimensuel' },
            { name: 'Réponses sous 24h' },
          ],
          button: { label: 'Démarrer en ligne', href: '/reservation' },
        },
        {
          title: 'E-books & plans',
          slug: 'ebooks-plans',
          tagline: 'En téléchargement',
          description: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Des plans d’entraînement PDF prêts à l’emploi pour 10 km, semi, marathon et trail.',
                },
              ],
            },
          ],
          featured: false,
          features: [
            { name: 'Plans 10 km, semi & marathon' },
            { name: 'Plan trail découverte' },
            { name: 'Conseils nutrition inclus' },
            { name: 'Téléchargement immédiat' },
          ],
          button: { label: 'Voir les plans', href: '/services#ebooks' },
        },
      ],
      plansSection: {
        eyebrow: 'E-books & plans',
        title: 'Des plans prêts à courir',
        description:
          'Idéal pour les coureurs autonomes. Téléchargez votre plan PDF et suivez une préparation structurée, semaine après semaine.',
        imageAlt:
          'Chaussures de trail en pleine foulée sur un sentier de montagne',
        plans: [
          {
            slug: 'plan-10-km',
            title: 'Plan 10 km',
            detail: '8 semaines · débutant à intermédiaire',
            button: { label: 'Acheter', href: '/plans/plan-10-km' },
          },
          {
            slug: 'plan-semi-marathon',
            title: 'Plan Semi-marathon',
            detail: '10 semaines · objectif chrono',
            button: { label: 'Acheter', href: '/plans/plan-semi-marathon' },
          },
          {
            slug: 'plan-marathon',
            title: 'Plan Marathon',
            detail: '12 semaines · structuré & progressif',
            button: { label: 'Acheter', href: '/plans/plan-marathon' },
          },
          {
            slug: 'plan-trail-decouverte',
            title: 'Plan Trail découverte',
            detail: '8 semaines · gestion du dénivelé',
            button: { label: 'Acheter', href: '/plans/plan-trail-decouverte' },
          },
        ],
      },
      finalCta: {
        title: 'Vous hésitez sur la formule ?',
        description:
          'Réservez un premier échange gratuit. On choisit ensemble la meilleure approche pour vos objectifs.',
        button: {
          label: 'Réserver un échange gratuit',
          href: '/reservation',
        },
      },
    },
  });

  await documents.publish({ documentId: created.documentId });
}

async function ensureFooterContent(strapi: Core.Strapi) {
  const documents = strapi.documents('api::footer.footer');
  const existing = await documents.findFirst({ status: 'draft' });

  if (existing) return;

  const created = await documents.create({
    data: {
      brandName: 'Alexandre Schutz',
      description:
        'Coach running & trail indépendant. Chambéry, Aix-les-Bains, Lac du Bourget et massifs de Savoie.',
      nolioUrl: 'https://www.nolio.io/coach/alexandre.schutz.63155/',
      copyrightText: 'Alexandre Schutz Coaching. Tous droits réservés.',
      locationText: 'Chambéry · Savoie · France',
    },
  });

  await documents.publish({ documentId: created.documentId });
}

async function ensureRolePermissions(
  strapi: Core.Strapi,
  roleType: 'public' | 'authenticated',
  actions: string[],
  orderStart: number,
) {
  const knex = strapi.db.connection;
  const role = await knex('up_roles').where({ type: roleType }).first('id');

  if (!role?.id) return;
  const now = new Date().toISOString();

  for (const [index, action] of actions.entries()) {
    const existingPermission = await knex('up_permissions')
      .join(
        'up_permissions_role_lnk',
        'up_permissions.id',
        'up_permissions_role_lnk.permission_id',
      )
      .where('up_permissions.action', action)
      .where('up_permissions_role_lnk.role_id', role.id)
      .first('up_permissions.id');

    if (existingPermission) continue;

    const insertedIds = await knex('up_permissions').insert({
      document_id: randomUUID(),
      action,
      created_at: now,
      updated_at: now,
      published_at: now,
    });

    const insertedId = insertedIds[0] as number | { id: number } | undefined;
    const permissionId =
      typeof insertedId === 'object' ? insertedId.id : insertedId;

    if (!permissionId) continue;

    await knex('up_permissions_role_lnk').insert({
      permission_id: permissionId,
      role_id: role.id,
      permission_ord: index + orderStart,
    });
  }
}

async function ensurePublicContentPermissions(strapi: Core.Strapi) {
  await ensureRolePermissions(
    strapi,
    'public',
    [
      'api::homepage.homepage.find',
      'api::services-page.services-page.find',
      'api::footer.footer.find',
      'api::parametres-site.parametres-site.find',
      'api::page-a-propos.page-a-propos.find',
      'api::page-contact.page-contact.find',
      'api::page-reservation.page-reservation.find',
    ],
    100,
  );
}

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
  * This gives you an opportunity to set up your data model,
  * run jobs, or perform some special logic.
  */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensureFrenchContentManagerLabels(strapi);
    await ensureHomepageInternalName(strapi);
    await ensureServicesPageContent(strapi);
    await ensureFooterContent(strapi);
    await ensurePublicContentPermissions(strapi);
  },
};
