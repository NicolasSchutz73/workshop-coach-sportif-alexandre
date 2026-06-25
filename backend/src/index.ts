import { randomUUID } from 'node:crypto';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Core } from '@strapi/strapi';
import { z } from 'zod';

type McpCustomService = {
  registerTool: (definition: {
    name: string;
    description: string;
    argsSchema: Record<string, unknown>;
    callback: (args: any) => Promise<{
      content: Array<{ type: 'text'; text: string }>;
    }>;
  }) => void;
};

function mcpText(payload: unknown) {
  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(payload),
      },
    ],
  };
}

function resolveSchemaPath(relativePath: string) {
  const normalized = relativePath.replace(/\\/g, '/');
  const isAllowedRoot =
    normalized.startsWith('src/api/') ||
    normalized.startsWith('src/components/');

  if (
    !isAllowedRoot ||
    normalized.includes('..') ||
    !normalized.endsWith('.json')
  ) {
    throw new Error(`Chemin de schéma non autorisé: ${relativePath}`);
  }

  return path.join(process.cwd(), normalized);
}

function registerMcpWriteTools(strapi: Core.Strapi) {
  const plugin = strapi.plugin('mcp');
  if (!plugin) return;

  const service = plugin.service('custom') as McpCustomService;

  service.registerTool({
    name: 'synchroniser-schemas-francais',
    description:
      'Crée ou met à jour en lot des schémas Strapi JSON sous src/api et src/components.',
    argsSchema: {
      fichiersJson: z.string(),
    },
    callback: async ({ fichiersJson }) => {
      const files = JSON.parse(fichiersJson) as Array<{
        chemin: string;
        schema: unknown;
      }>;

      if (!Array.isArray(files) || files.length === 0) {
        throw new Error('La liste de schémas est vide.');
      }

      for (const file of files) {
        const destination = resolveSchemaPath(file.chemin);
        await mkdir(path.dirname(destination), { recursive: true });
        await writeFile(
          destination,
          `${JSON.stringify(file.schema, null, 2)}\n`,
          'utf8',
        );
      }

      return mcpText({
        succes: true,
        fichiers: files.map((file) => file.chemin),
      });
    },
  });

  service.registerTool({
    name: 'importer-media-local',
    description:
      'Importe un fichier image local dans la médiathèque Strapi et retourne son identifiant.',
    argsSchema: {
      chemin: z.string(),
      texteAlternatif: z.string(),
    },
    callback: async ({ chemin, texteAlternatif }) => {
      const absolutePath = path.resolve(chemin);
      const allowedRoot = path.resolve(process.cwd(), '..', 'alexandre-coach');

      if (!absolutePath.startsWith(`${allowedRoot}${path.sep}`)) {
        throw new Error(`Chemin de média non autorisé: ${chemin}`);
      }

      const name = path.basename(absolutePath);
      const existing = await strapi.db
        .query('plugin::upload.file')
        .findOne({ where: { name } });

      if (existing) {
        if (existing.alternativeText !== texteAlternatif) {
          await strapi.db.query('plugin::upload.file').update({
            where: { id: existing.id },
            data: { alternativeText: texteAlternatif },
          });
        }

        return mcpText({
          succes: true,
          id: existing.id,
          nom: existing.name,
          url: existing.url,
          reutilise: true,
        });
      }

      const fileStats = await stat(absolutePath);
      const extension = path.extname(name).toLowerCase();
      const mimeByExtension: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
      };
      const uploaded = await strapi.plugin('upload').service('upload').upload({
        data: {
          fileInfo: {
            name,
            alternativeText: texteAlternatif,
          },
        },
        files: {
          filepath: absolutePath,
          originalFilename: name,
          mimetype:
            mimeByExtension[extension] ?? 'application/octet-stream',
          size: fileStats.size,
        },
      });
      const file = uploaded[0];

      return mcpText({
        succes: true,
        id: file.id,
        nom: file.name,
        url: file.url,
        reutilise: false,
      });
    },
  });

  service.registerTool({
    name: 'publier-single-type',
    description:
      'Crée ou met à jour un Single Type Strapi puis publie sa version initiale.',
    argsSchema: {
      uid: z.string(),
      donneesJson: z.string(),
    },
    callback: async ({ uid, donneesJson }) => {
      if (!uid.startsWith('api::')) {
        throw new Error(`UID non autorisé: ${uid}`);
      }

      const contentType = strapi.contentTypes[uid];
      if (!contentType || contentType.kind !== 'singleType') {
        throw new Error(`Single Type introuvable: ${uid}`);
      }

      const documents = strapi.documents(uid as any) as any;
      const data = JSON.parse(donneesJson);
      const existing = await documents.findFirst({ status: 'draft' });
      const document = existing
        ? await documents.update({
            documentId: existing.documentId,
            data,
          })
        : await documents.create({ data });

      await documents.publish({ documentId: document.documentId });

      return mcpText({
        succes: true,
        uid,
        documentId: document.documentId,
        operation: existing ? 'mise-a-jour' : 'creation',
      });
    },
  });

  service.registerTool({
    name: 'initialiser-contenu-administrable',
    description:
      'Importe les médias locaux puis crée, met à jour et publie en lot les Single Types administrables.',
    argsSchema: {
      mediasJson: z.string(),
      documentsJson: z.string(),
    },
    callback: async ({ mediasJson, documentsJson }) => {
      const mediaDefinitions = JSON.parse(mediasJson) as Array<{
        cle: string;
        chemin: string;
        texteAlternatif: string;
      }>;
      const documentDefinitions = JSON.parse(documentsJson) as Array<{
        uid: string;
        data: unknown;
      }>;
      const mediaIds: Record<string, number> = {};

      for (const definition of mediaDefinitions) {
        const absolutePath = path.resolve(definition.chemin);
        const allowedRoot = path.resolve(
          process.cwd(),
          '..',
          'alexandre-coach',
        );

        if (!absolutePath.startsWith(`${allowedRoot}${path.sep}`)) {
          throw new Error(
            `Chemin de média non autorisé: ${definition.chemin}`,
          );
        }

        const name = path.basename(absolutePath);
        const existing = await strapi.db
          .query('plugin::upload.file')
          .findOne({ where: { name } });

        if (existing) {
          mediaIds[definition.cle] = existing.id;
          continue;
        }

        const fileStats = await stat(absolutePath);
        const extension = path.extname(name).toLowerCase();
        const mimeByExtension: Record<string, string> = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.webp': 'image/webp',
        };
        const uploaded = await strapi.plugin('upload').service('upload').upload({
          data: {
            fileInfo: {
              name,
              alternativeText: definition.texteAlternatif,
            },
          },
          files: {
            filepath: absolutePath,
            originalFilename: name,
            mimetype:
              mimeByExtension[extension] ?? 'application/octet-stream',
            size: fileStats.size,
          },
        });

        mediaIds[definition.cle] = uploaded[0].id;
      }

      const replaceMediaReferences = (value: unknown): unknown => {
        if (
          typeof value === 'string' &&
          value.startsWith('$media:')
        ) {
          const key = value.slice('$media:'.length);
          const mediaId = mediaIds[key];

          if (!mediaId) {
            throw new Error(`Média introuvable pour la clé: ${key}`);
          }

          return mediaId;
        }

        if (Array.isArray(value)) {
          return value.map(replaceMediaReferences);
        }

        if (value && typeof value === 'object') {
          return Object.fromEntries(
            Object.entries(value).map(([key, entry]) => [
              key,
              replaceMediaReferences(entry),
            ]),
          );
        }

        return value;
      };
      const results = [];

      for (const definition of documentDefinitions) {
        try {
          const contentType = strapi.contentTypes[definition.uid];

          if (!contentType || contentType.kind !== 'singleType') {
            throw new Error(`Single Type introuvable: ${definition.uid}`);
          }

          const documents = strapi.documents(definition.uid as any) as any;
          const existing = await documents.findFirst({ status: 'draft' });
          const data = replaceMediaReferences(definition.data);
          const document = existing
            ? await documents.update({
                documentId: existing.documentId,
                data,
              })
            : await documents.create({ data });

          await documents.publish({ documentId: document.documentId });
          results.push({
            uid: definition.uid,
            documentId: document.documentId,
            operation: existing ? 'mise-a-jour' : 'creation',
          });
        } catch (error) {
          return mcpText({
            succes: false,
            medias: mediaIds,
            documents: results,
            erreur: {
              uid: definition.uid,
              nom:
                error instanceof Error ? error.name : 'Erreur inconnue',
              message:
                error instanceof Error ? error.message : String(error),
              details:
                error && typeof error === 'object' && 'details' in error
                  ? (error as { details?: unknown }).details
                  : undefined,
            },
          });
        }
      }

      return mcpText({
        succes: true,
        medias: mediaIds,
        documents: results,
      });
    },
  });
}

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
    titreCertifications: 'Titre des certifications',
    certifications: 'Certifications',
    titreReseaux: 'Titre des réseaux sociaux',
    reseaux: 'Réseaux sociaux',
    titrePhilosophie: 'Titre de la philosophie',
    principes: 'Principes de coaching',
    titreAppelAction: "Titre de l'appel à l'action",
    boutonPrincipal: 'Bouton principal',
    boutonSecondaire: 'Bouton secondaire',
  },
  'api::page-contact.page-contact': {
    nomInterne: 'Nom de la page',
    seo: 'Référencement',
    entete: 'En-tête',
    titreCoordonnees: 'Titre des coordonnées',
    descriptionCoordonnees: 'Description des coordonnées',
    coordonnees: 'Coordonnées',
    titreDisponibilites: 'Titre des disponibilités',
    horaires: 'Horaires',
    objectifsFormulaire: 'Objectifs proposés dans le formulaire',
    confidentialiteFormulaire: 'Message de confidentialité',
  },
  'api::page-reservation.page-reservation': {
    nomInterne: 'Nom de la page',
    seo: 'Référencement',
    entete: 'En-tête',
    titreDeroulement: 'Titre du déroulement',
    etapes: 'Étapes',
    reassurances: 'Éléments de réassurance',
    typesSeance: 'Types de séance',
    creneaux: 'Créneaux disponibles',
    joursFermes: 'Jours fermés',
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
    price: 'Prix',
    priceNote: 'Précision sur le prix',
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
    price: 'Prix',
    button: "Bouton d'achat",
    longDescription: 'Description longue',
    cover: 'Image de couverture',
    coverAlt: 'Texte alternatif de la couverture',
    contentsPreview: 'Image d’aperçu du sommaire',
    contentsPreviewAlt: 'Texte alternatif de l’aperçu',
    tableOfContents: 'Sommaire',
    receives: 'Vous allez recevoir',
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
  'partage.reseau-social': {
    plateforme: 'Plateforme',
    libelle: 'Libellé accessible',
    lien: 'Lien',
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
  'page-a-propos.principe': {
    titre: 'Titre',
    description: 'Description',
  },
  'page-contact.coordonnee': {
    type: 'Type',
    libelle: 'Libellé',
    valeur: 'Valeur affichée',
    lien: 'Lien',
  },
  'page-contact.horaire': {
    jours: 'Jours',
    heures: 'Heures',
  },
  'page-reservation.type-seance': {
    identifiant: 'Identifiant technique',
    libelle: 'Libellé',
    duree: 'Durée',
    mode: 'Mode',
    icone: 'Icône',
  },
  'page-reservation.reassurance': {
    icone: 'Icône',
    titre: 'Titre',
    texte: 'Texte',
  },
  'page-reservation.jour-ferme': {
    jour: 'Jour',
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
    const isComponent = Boolean(strapi.components[uid]);
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
          price: 55,
          priceNote: '/ séance',
          featured: false,
          features: [
            { name: 'Séance individuelle d’1h' },
            { name: 'Analyse de la foulée' },
            { name: 'Travail technique sur le terrain' },
            { name: 'Conseils nutrition & récupération' },
          ],
          button: { label: 'Réserver une séance', href: '/booking' },
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
          price: 120,
          priceNote: '/ mois',
          featured: true,
          features: [
            { name: 'Plan d’entraînement personnalisé' },
            { name: 'Ajustements hebdomadaires' },
            { name: 'Suivi illimité par messagerie' },
            { name: 'Bilan mensuel de progression' },
            { name: 'Accès à l’app Nolio' },
          ],
          button: { label: 'Commencer maintenant', href: '/booking' },
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
          price: 89,
          priceNote: '/ mois',
          featured: false,
          features: [
            { name: 'Plan d’entraînement mensuel' },
            { name: 'Suivi via Nolio' },
            { name: 'Point visio bimensuel' },
            { name: 'Réponses sous 24h' },
          ],
          button: { label: 'Démarrer en ligne', href: '/booking' },
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
          price: 19,
          priceNote: '/ plan',
          featured: false,
          features: [
            { name: 'Plans 10 km, semi & marathon' },
            { name: 'Plan trail découverte' },
            { name: 'Conseils nutrition inclus' },
            { name: 'Téléchargement immédiat' },
          ],
          button: { label: 'Voir les plans', href: '/services' },
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
            price: 19,
            button: { label: 'Acheter', href: '/plans/plan-10-km' },
          },
          {
            slug: 'plan-semi-marathon',
            title: 'Plan Semi-marathon',
            detail: '10 semaines · objectif chrono',
            price: 24,
            button: { label: 'Acheter', href: '/plans/plan-semi-marathon' },
          },
          {
            slug: 'plan-marathon',
            title: 'Plan Marathon',
            detail: '12 semaines · structuré & progressif',
            price: 29,
            button: { label: 'Acheter', href: '/plans/plan-marathon' },
          },
          {
            slug: 'plan-trail-decouverte',
            title: 'Plan Trail découverte',
            detail: '8 semaines · gestion du dénivelé',
            price: 24,
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
          href: '/booking',
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
      instagramUrl: 'https://instagram.com',
      whatsappUrl: 'https://wa.me/33600000000',
      nolioUrl: 'https://nolio.io',
      copyrightText: 'Alexandre Schutz Coaching. Tous droits réservés.',
      locationText: 'Chambéry · Savoie · France',
    },
  });

  await documents.publish({ documentId: created.documentId });
}

const initialSessionTypes = [
  {
    name: 'Échange découverte',
    duration: 30,
    mode: 'visio',
    slug: 'discovery',
    times: ['12:00', '18:30'],
  },
  {
    name: 'Séance coaching',
    duration: 60,
    mode: 'présentiel',
    slug: 'session',
    times: ['07:00', '08:30', '17:30'],
  },
  {
    name: 'Point coaching en ligne',
    duration: 45,
    mode: 'visio',
    slug: 'online',
    times: ['10:00', '19:30'],
  },
] as const;

async function ensureInitialBookingData(strapi: Core.Strapi) {
  const existingSessionType = await strapi.db
    .query('api::session-type.session-type' as any)
    .findOne({ select: ['id'] });
  const existingTimeSlot = await strapi.db
    .query('api::time-slot.time-slot' as any)
    .findOne({ select: ['id'] });

  // Seed only a completely empty installation. Later availability stays
  // entirely under the administrator's control.
  if (existingSessionType || existingTimeSlot) return;

  const sessionTypeDocuments = strapi.documents(
    'api::session-type.session-type' as any,
  ) as any;
  const timeSlotDocuments = strapi.documents(
    'api::time-slot.time-slot' as any,
  ) as any;
  const createdSessionTypes = [];

  for (const definition of initialSessionTypes) {
    const sessionType = await sessionTypeDocuments.create({
      data: {
        name: definition.name,
        duration: definition.duration,
        mode: definition.mode,
        slug: definition.slug,
      },
    });

    createdSessionTypes.push({
      documentId: sessionType.documentId,
      times: definition.times,
    });
  }

  const start = new Date();
  start.setUTCHours(12, 0, 0, 0);

  for (let dayOffset = 1; dayOffset <= 45; dayOffset += 1) {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + dayOffset);

    if (date.getUTCDay() === 0) continue;
    const dateKey = date.toISOString().slice(0, 10);

    for (const sessionType of createdSessionTypes) {
      for (const time of sessionType.times) {
        await timeSlotDocuments.create({
          data: {
            date: dateKey,
            startTime: `${time}:00.000`,
            isAvailable: true,
            sessionType: sessionType.documentId,
          },
        });
      }
    }
  }
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

async function ensureBookingPermissions(strapi: Core.Strapi) {
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
      'api::session-type.session-type.find',
      'api::session-type.session-type.findOne',
      'api::time-slot.time-slot.find',
      'api::time-slot.time-slot.findOne',
      'api::booking.booking.create',
    ],
    100,
  );

  const fullAccessActions = ['find', 'findOne', 'create', 'update', 'delete'];
  const authenticatedActions = [
    ...fullAccessActions.map(
      (action) => `api::session-type.session-type.${action}`,
    ),
    ...fullAccessActions.map(
      (action) => `api::time-slot.time-slot.${action}`,
    ),
    ...fullAccessActions.map((action) => `api::booking.booking.${action}`),
    'api::time-slot.time-slot.generate',
  ];

  await ensureRolePermissions(
    strapi,
    'authenticated',
    authenticatedActions,
    200,
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
    registerMcpWriteTools(strapi);
    await ensureFrenchContentManagerLabels(strapi);
    await ensureHomepageInternalName(strapi);
    await ensureServicesPageContent(strapi);
    await ensureFooterContent(strapi);
    await ensureInitialBookingData(strapi);
    await ensureBookingPermissions(strapi);
  },
};
