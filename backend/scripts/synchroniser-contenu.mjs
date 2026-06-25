import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const mode = process.argv[2]
const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const frontendRoot = path.resolve(backendRoot, '..', 'alexandre-coach')
const mcpUrl = new URL('http://localhost:1337/api/mcp/streamable')

function component(collectionName, displayName, attributes, icon) {
  return {
    collectionName,
    info: {
      displayName,
      ...(icon ? { icon } : {}),
    },
    options: {},
    attributes,
  }
}

function singleType({
  collectionName,
  singularName,
  pluralName,
  displayName,
  description,
  attributes,
}) {
  return {
    kind: 'singleType',
    collectionName,
    info: {
      singularName,
      pluralName,
      displayName,
      description,
    },
    options: {
      draftAndPublish: true,
    },
    pluginOptions: {},
    attributes,
  }
}

function blocks(text) {
  return text.split('\n\n').map((paragraph) => ({
    type: 'paragraph',
    children: [{ type: 'text', text: paragraph }],
  }))
}

async function readJson(relativePath) {
  return JSON.parse(
    await readFile(path.join(backendRoot, relativePath), 'utf8'),
  )
}

async function createClient() {
  const response = await fetch(mcpUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-06-18',
        capabilities: {},
        clientInfo: {
          name: 'synchronisation-contenu-alexandre-coach',
          version: '1.0.0',
        },
      },
    }),
  })
  const sessionId = response.headers.get('mcp-session-id')

  if (!response.ok || !sessionId) {
    throw new Error(`Initialisation MCP impossible: ${response.status}`)
  }

  await fetch(mcpUrl, {
    method: 'POST',
    headers: {
      'mcp-session-id': sessionId,
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'notifications/initialized',
    }),
  })

  return {
    sessionId,
    nextId: 2,
  }
}

async function call(client, name, args) {
  const response = await fetch(mcpUrl, {
    method: 'POST',
    headers: {
      'mcp-session-id': client.sessionId,
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: client.nextId++,
      method: 'tools/call',
      params: {
        name,
        arguments: args,
      },
    }),
  })
  const body = await response.text()
  const dataLine = body
    .split('\n')
    .find((line) => line.startsWith('data: '))

  if (!response.ok || !dataLine) {
    throw new Error(`Appel MCP ${name} impossible: ${response.status} ${body}`)
  }

  const payload = JSON.parse(dataLine.slice(6))
  if (payload.error) {
    throw new Error(`Erreur MCP ${name}: ${JSON.stringify(payload.error)}`)
  }
  const text = payload.result?.content?.find(
    (item) => item.type === 'text',
  )?.text

  return text ? JSON.parse(text) : payload.result
}

async function closeClient(client) {
  try {
    await fetch(mcpUrl, {
      method: 'DELETE',
      headers: {
        'mcp-session-id': client.sessionId,
      },
    })
  } catch {
    // Le plugin MCP 1.1.0 peut fermer la connexion après un outil personnalisé.
  }
}

async function schemas() {
  const homepage = await readJson(
    'src/api/homepage/content-types/homepage/schema.json',
  )
  const servicesPage = await readJson(
    'src/api/services-page/content-types/services-page/schema.json',
  )
  const footer = await readJson(
    'src/api/footer/content-types/footer/schema.json',
  )
  const homepageFinalCta = await readJson(
    'src/components/homepage/final-cta.json',
  )
  const serviceCard = await readJson(
    'src/components/services-page/service-card.json',
  )

  homepage.attributes = {
    seo: {
      type: 'component',
      repeatable: false,
      component: 'partage.seo',
    },
    ...homepage.attributes,
    introductionPrestations: {
      type: 'component',
      repeatable: false,
      component: 'page-accueil.introduction-section',
    },
    introductionTemoignages: {
      type: 'component',
      repeatable: false,
      component: 'page-accueil.introduction-section',
    },
    temoignages: {
      type: 'component',
      repeatable: true,
      component: 'page-accueil.temoignage',
    },
    introductionFaq: {
      type: 'component',
      repeatable: false,
      component: 'page-accueil.introduction-section',
    },
  }

  servicesPage.attributes = {
    seo: {
      type: 'component',
      repeatable: false,
      component: 'partage.seo',
    },
    ...servicesPage.attributes,
  }

  footer.attributes.colonnes = {
    type: 'component',
    repeatable: true,
    component: 'partage.colonne-liens',
  }

  homepageFinalCta.attributes.image = {
    type: 'media',
    multiple: false,
    allowedTypes: ['images'],
  }
  homepageFinalCta.attributes.imageAlt = {
    type: 'string',
  }

  serviceCard.attributes.featuredLabel = {
    type: 'string',
  }

  const files = [
    {
      chemin: 'src/components/partage/seo.json',
      schema: component(
        'components_partage_seos',
        'Référencement',
        {
          titre: { type: 'string', required: true },
          description: { type: 'text', required: true },
          motsCles: { type: 'text' },
        },
        'search',
      ),
    },
    {
      chemin: 'src/components/partage/lien.json',
      schema: component(
        'components_partage_liens',
        'Lien',
        {
          libelle: { type: 'string', required: true },
          lien: { type: 'string', required: true },
        },
        'link',
      ),
    },
    {
      chemin: 'src/components/partage/colonne-liens.json',
      schema: component(
        'components_partage_colonnes_liens',
        'Colonne de liens',
        {
          titre: { type: 'string', required: true },
          liens: {
            type: 'component',
            repeatable: true,
            component: 'partage.lien',
            required: true,
          },
        },
        'bulletList',
      ),
    },
    {
      chemin: 'src/components/partage/entete-page.json',
      schema: component(
        'components_partage_entetes_page',
        'En-tête de page',
        {
          surtitre: { type: 'string', required: true },
          titre: { type: 'string', required: true },
          description: { type: 'text', required: true },
        },
        'heading',
      ),
    },
    {
      chemin: 'src/components/partage/element-liste.json',
      schema: component(
        'components_partage_elements_liste',
        'Élément de liste',
        {
          texte: { type: 'text', required: true },
        },
        'bulletList',
      ),
    },
    {
      chemin: 'src/components/partage/reseau-social.json',
      schema: component(
        'components_partage_reseaux_sociaux',
        'Réseau social',
        {
          plateforme: {
            type: 'enumeration',
            enum: ['instagram', 'whatsapp', 'nolio'],
            required: true,
          },
          libelle: { type: 'string', required: true },
          lien: { type: 'string', required: true },
        },
        'earth',
      ),
    },
    {
      chemin: 'src/components/page-accueil/introduction-section.json',
      schema: component(
        'components_page_accueil_introductions_section',
        'Introduction de section',
        {
          surtitre: { type: 'string' },
          titre: { type: 'string', required: true },
          description: { type: 'text' },
          bouton: {
            type: 'component',
            repeatable: false,
            component: 'shared.button',
          },
        },
        'heading',
      ),
    },
    {
      chemin: 'src/components/page-accueil/temoignage.json',
      schema: component(
        'components_page_accueil_temoignages',
        'Témoignage',
        {
          citation: { type: 'text', required: true },
          nom: { type: 'string', required: true },
          detail: { type: 'string', required: true },
          note: {
            type: 'integer',
            min: 1,
            max: 5,
            default: 5,
            required: true,
          },
        },
        'quote',
      ),
    },
    {
      chemin: 'src/components/page-a-propos/principe.json',
      schema: component(
        'components_page_a_propos_principes',
        'Principe de coaching',
        {
          titre: { type: 'string', required: true },
          description: { type: 'text', required: true },
        },
        'lightbulb',
      ),
    },
    {
      chemin: 'src/components/page-contact/coordonnee.json',
      schema: component(
        'components_page_contact_coordonnees',
        'Coordonnée',
        {
          type: {
            type: 'enumeration',
            enum: ['zone', 'email', 'telephone', 'instagram'],
            required: true,
          },
          libelle: { type: 'string', required: true },
          valeur: { type: 'string', required: true },
          lien: { type: 'string' },
        },
        'pinMap',
      ),
    },
    {
      chemin: 'src/components/page-contact/horaire.json',
      schema: component(
        'components_page_contact_horaires',
        'Horaire',
        {
          jours: { type: 'string', required: true },
          heures: { type: 'string', required: true },
        },
        'clock',
      ),
    },
    {
      chemin: 'src/components/page-reservation/type-seance.json',
      schema: component(
        'components_page_reservation_types_seance',
        'Type de séance',
        {
          identifiant: { type: 'string', required: true },
          libelle: { type: 'string', required: true },
          duree: { type: 'string', required: true },
          mode: { type: 'string', required: true },
          icone: {
            type: 'enumeration',
            enum: ['video', 'localisation'],
            required: true,
          },
        },
        'calendar',
      ),
    },
    {
      chemin: 'src/components/page-reservation/reassurance.json',
      schema: component(
        'components_page_reservation_reassurances',
        'Élément de réassurance',
        {
          icone: {
            type: 'enumeration',
            enum: ['horloge', 'localisation', 'securite'],
            required: true,
          },
          titre: { type: 'string', required: true },
          texte: { type: 'text', required: true },
        },
        'shield',
      ),
    },
    {
      chemin: 'src/components/page-reservation/jour-ferme.json',
      schema: component(
        'components_page_reservation_jours_fermes',
        'Jour fermé',
        {
          jour: {
            type: 'enumeration',
            enum: [
              'dimanche',
              'lundi',
              'mardi',
              'mercredi',
              'jeudi',
              'vendredi',
              'samedi',
            ],
            required: true,
          },
        },
        'calendar',
      ),
    },
    {
      chemin:
        'src/api/parametres-site/content-types/parametres-site/schema.json',
      schema: singleType({
        collectionName: 'parametres_site',
        singularName: 'parametres-site',
        pluralName: 'parametres-sites',
        displayName: 'Paramètres du site',
        description:
          'Identité, navigation, référencement global et manifeste de l’application',
        attributes: {
          nomInterne: {
            type: 'string',
            required: true,
            default: 'Paramètres du site',
          },
          nomMarque: { type: 'string', required: true },
          navigation: {
            type: 'component',
            repeatable: true,
            component: 'partage.lien',
            required: true,
          },
          boutonReservation: {
            type: 'component',
            repeatable: false,
            component: 'shared.button',
            required: true,
          },
          seoGlobal: {
            type: 'component',
            repeatable: false,
            component: 'partage.seo',
            required: true,
          },
          modeleTitre: { type: 'string', required: true },
          nomApplication: { type: 'string', required: true },
          nomApplicationCourt: { type: 'string', required: true },
          descriptionApplication: { type: 'text', required: true },
        },
      }),
    },
    {
      chemin: 'src/api/page-a-propos/content-types/page-a-propos/schema.json',
      schema: singleType({
        collectionName: 'pages_a_propos',
        singularName: 'page-a-propos',
        pluralName: 'pages-a-propos',
        displayName: 'Page À propos',
        description: 'Contenu administrable de la page À propos',
        attributes: {
          nomInterne: {
            type: 'string',
            required: true,
            default: 'Page À propos',
          },
          seo: {
            type: 'component',
            repeatable: false,
            component: 'partage.seo',
            required: true,
          },
          entete: {
            type: 'component',
            repeatable: false,
            component: 'partage.entete-page',
            required: true,
          },
          photo: {
            type: 'media',
            multiple: false,
            allowedTypes: ['images'],
          },
          texteAlternatifPhoto: { type: 'string', required: true },
          titreParcours: { type: 'string', required: true },
          parcours: { type: 'blocks', required: true },
          titreCertifications: { type: 'string', required: true },
          certifications: {
            type: 'component',
            repeatable: true,
            component: 'shared.certification',
            required: true,
          },
          titreReseaux: { type: 'string', required: true },
          reseaux: {
            type: 'component',
            repeatable: true,
            component: 'partage.reseau-social',
            required: true,
          },
          titrePhilosophie: { type: 'string', required: true },
          principes: {
            type: 'component',
            repeatable: true,
            component: 'page-a-propos.principe',
            required: true,
          },
          titreAppelAction: { type: 'string', required: true },
          boutonPrincipal: {
            type: 'component',
            repeatable: false,
            component: 'shared.button',
            required: true,
          },
          boutonSecondaire: {
            type: 'component',
            repeatable: false,
            component: 'shared.button',
            required: true,
          },
        },
      }),
    },
    {
      chemin: 'src/api/page-contact/content-types/page-contact/schema.json',
      schema: singleType({
        collectionName: 'pages_contact',
        singularName: 'page-contact',
        pluralName: 'pages-contact',
        displayName: 'Page Contact',
        description: 'Contenu administrable de la page Contact',
        attributes: {
          nomInterne: {
            type: 'string',
            required: true,
            default: 'Page Contact',
          },
          seo: {
            type: 'component',
            repeatable: false,
            component: 'partage.seo',
            required: true,
          },
          entete: {
            type: 'component',
            repeatable: false,
            component: 'partage.entete-page',
            required: true,
          },
          titreCoordonnees: { type: 'string', required: true },
          descriptionCoordonnees: { type: 'text', required: true },
          coordonnees: {
            type: 'component',
            repeatable: true,
            component: 'page-contact.coordonnee',
            required: true,
          },
          titreDisponibilites: { type: 'string', required: true },
          horaires: {
            type: 'component',
            repeatable: true,
            component: 'page-contact.horaire',
            required: true,
          },
          objectifsFormulaire: {
            type: 'component',
            repeatable: true,
            component: 'partage.element-liste',
            required: true,
          },
          confidentialiteFormulaire: { type: 'text', required: true },
        },
      }),
    },
    {
      chemin:
        'src/api/page-reservation/content-types/page-reservation/schema.json',
      schema: singleType({
        collectionName: 'pages_reservation',
        singularName: 'page-reservation',
        pluralName: 'pages-reservation',
        displayName: 'Page Réservation',
        description: 'Contenu et données métier de la page Réservation',
        attributes: {
          nomInterne: {
            type: 'string',
            required: true,
            default: 'Page Réservation',
          },
          seo: {
            type: 'component',
            repeatable: false,
            component: 'partage.seo',
            required: true,
          },
          entete: {
            type: 'component',
            repeatable: false,
            component: 'partage.entete-page',
            required: true,
          },
          titreDeroulement: { type: 'string', required: true },
          etapes: {
            type: 'component',
            repeatable: true,
            component: 'partage.element-liste',
            required: true,
          },
          reassurances: {
            type: 'component',
            repeatable: true,
            component: 'page-reservation.reassurance',
            required: true,
          },
          typesSeance: {
            type: 'component',
            repeatable: true,
            component: 'page-reservation.type-seance',
            required: true,
          },
          creneaux: {
            type: 'component',
            repeatable: true,
            component: 'partage.element-liste',
            required: true,
          },
          joursFermes: {
            type: 'component',
            repeatable: true,
            component: 'page-reservation.jour-ferme',
          },
          texteSansPaiement: { type: 'text', required: true },
        },
      }),
    },
    {
      chemin: 'src/api/homepage/content-types/homepage/schema.json',
      schema: homepage,
    },
    {
      chemin:
        'src/api/services-page/content-types/services-page/schema.json',
      schema: servicesPage,
    },
    {
      chemin: 'src/api/footer/content-types/footer/schema.json',
      schema: footer,
    },
    {
      chemin: 'src/components/homepage/final-cta.json',
      schema: homepageFinalCta,
    },
    {
      chemin: 'src/components/services-page/service-card.json',
      schema: serviceCard,
    },
  ]

  const client = await createClient()
  try {
    console.log(
      await call(client, 'synchroniser-schemas-francais', {
        fichiersJson: JSON.stringify(files),
      }),
    )
  } finally {
    await closeClient(client)
  }
}

async function content() {
  const client = await createClient()

  try {
    const mediaDefinitions = [
      {
        cle: 'hero',
        chemin: path.join(frontendRoot, 'public/images/hero-trail.png'),
        texteAlternatif:
          'Coureur de trail sur une crête de montagne au lever du soleil en Savoie',
      },
      {
        cle: 'portrait',
        chemin: path.join(frontendRoot, 'public/images/coach-portrait.png'),
        texteAlternatif:
          'Alexandre Schutz, coach running et trail en Savoie',
      },
      {
        cle: 'montagnes',
        chemin: path.join(frontendRoot, 'public/images/cta-mountains.png'),
        texteAlternatif: 'Massifs de Savoie au crépuscule',
      },
      {
        cle: 'marathon',
        chemin: path.join(frontendRoot, 'public/images/marathon.png'),
        texteAlternatif:
          'Chaussures de trail en pleine foulée sur un sentier de montagne',
      },
    ]

    const documents = [
      {
        uid: 'api::parametres-site.parametres-site',
        data: {
          nomInterne: 'Paramètres du site',
          nomMarque: 'Alexandre Schutz',
          navigation: [
            { libelle: 'Accueil', lien: '/' },
            { libelle: 'Prestations', lien: '/services' },
            { libelle: 'À propos', lien: '/about' },
            { libelle: 'Contact', lien: '/contact' },
          ],
          boutonReservation: {
            label: 'Réserver un coaching',
            href: '/booking',
          },
          seoGlobal: {
            titre:
              'Alexandre Schutz — Coach Running & Trail | Chambéry, Savoie',
            description:
              "Coach running et trail indépendant à Chambéry. Préparation marathon, semi-marathon et trail, coaching en ligne, suivi personnalisé et plans d'entraînement. Aix-les-Bains, Lac du Bourget, Savoie.",
            motsCles:
              'coach running Chambéry\ncoach trail Savoie\npréparation marathon\ncoaching running en ligne\nplan entraînement trail\nLac du Bourget\nAix-les-Bains',
          },
          modeleTitre: '%s | Alexandre Schutz — Coach Running',
          nomApplication: 'Alexandre Schutz — Coach Running & Trail',
          nomApplicationCourt: 'Alexandre Schutz Coaching',
          descriptionApplication:
            'Coach running et trail indépendant à Chambéry, Savoie. Préparation marathon, trail et coaching en ligne.',
        },
      },
      {
        uid: 'api::homepage.homepage',
        data: {
          internalName: "Page d'accueil",
          seo: {
            titre:
              'Alexandre Schutz — Coach Running & Trail | Chambéry, Savoie',
            description:
              "Coach running et trail indépendant à Chambéry. Préparation marathon, semi-marathon et trail, coaching en ligne, suivi personnalisé et plans d'entraînement.",
            motsCles:
              'coach running Chambéry\ncoach trail Savoie\npréparation marathon\ncoaching running en ligne',
          },
          hero: {
            image: '$media:hero',
            location: 'Chambéry · Aix-les-Bains · Lac du Bourget',
            title: 'Courez plus loin, progressez plus vite.',
            description: blocks(
              'Coaching running & trail personnalisé en Savoie. Un accompagnement sur-mesure pour préparer votre marathon, votre trail ou simplement reprendre le plaisir de courir.',
            ),
            primaryButton: {
              label: 'Réserver un coaching',
              href: '/booking',
            },
            secondaryButton: {
              label: 'Découvrir les prestations',
              href: '/services',
            },
          },
          benefits: [
            {
              icon: 'target',
              title: 'Coaching personnalisé',
              description:
                'Un plan d’entraînement construit autour de vos objectifs, votre niveau et votre emploi du temps.',
            },
            {
              icon: 'line-chart',
              title: 'Suivi de progression',
              description:
                'Analyse de vos séances, ajustements réguliers et feedback à chaque étape via Nolio.',
            },
            {
              icon: 'gauge',
              title: 'Performance running',
              description:
                'Travail du seuil, du fractionné et de l’endurance pour gagner en vitesse et en régularité.',
            },
            {
              icon: 'laptop',
              title: 'Flexibilité & en ligne',
              description:
                'Coaching à distance où que vous soyez, avec un accompagnement humain et réactif.',
            },
          ],
          introductionPrestations: {
            surtitre: 'Prestations',
            titre: 'Un accompagnement pour chaque coureur',
            description:
              'Du suivi ponctuel au coaching complet, choisissez la formule adaptée à vos objectifs.',
            bouton: {
              label: 'Toutes les prestations',
              href: '/services',
            },
          },
          aboutPreview: {
            eyebrow: 'À propos',
            title: 'Coureur avant d’être coach',
            description: blocks(
              'Je m’appelle Alexandre. Né au pied des massifs de Savoie, je cours depuis plus de quinze ans, du 10 km sur route aux longs trails en montagne. Mon approche est simple : un entraînement structuré, progressif et respectueux de votre corps, pour durer et prendre du plaisir à chaque sortie.',
            ),
            image: '$media:portrait',
            imageAlt: 'Alexandre Schutz, coach running et trail en Savoie',
            certifications: [
              {
                label:
                  'Diplômé d’État (BPJEPS) — Athlétisme & course hors stade',
              },
              { label: 'Certifié préparation physique & trail' },
              { label: 'Coureur trail & marathonien (PB 2h41)' },
            ],
            button: { label: 'Mon parcours', href: '/about' },
          },
          introductionTemoignages: {
            surtitre: 'Témoignages',
            titre: 'Des progrès réels, des coureurs satisfaits',
            description:
              'Quelques histoires d’athlètes accompagnés vers leurs objectifs.',
          },
          temoignages: [
            {
              citation:
                'En six mois, je suis passé d’un objectif “finir” à un marathon en 3h28. Le suivi d’Alexandre est précis, humain et toujours bienveillant.',
              nom: 'Julien M.',
              detail: 'Marathon de Lyon — 3h28',
              note: 5,
            },
            {
              citation:
                'J’avais peur de me blesser en reprenant. Le plan progressif m’a redonné confiance et le plaisir de courir autour du Lac du Bourget.',
              nom: 'Camille R.',
              detail: 'Reprise running',
              note: 5,
            },
            {
              citation:
                'Pour mon premier trail de 42 km, j’étais parfaitement préparée. Gestion de l’effort, dénivelé, nutrition : tout était cadré.',
              nom: 'Sophie L.',
              detail: 'Trail des Aravis — 42 km',
              note: 5,
            },
          ],
          introductionFaq: {
            surtitre: 'Questions fréquentes',
            titre: 'Tout ce qu’il faut savoir',
          },
          faqs: [
            {
              question: 'Comment se passe la réservation d’un coaching ?',
              answer:
                'Vous réservez un premier échange gratuit depuis la page Réservation. Nous faisons le point sur vos objectifs, votre niveau et vos disponibilités, puis je vous propose la formule la plus adaptée.',
            },
            {
              question: 'Faut-il être un coureur expérimenté ?',
              answer:
                'Pas du tout. J’accompagne aussi bien les débutants qui veulent reprendre en douceur que les coureurs confirmés visant une performance. Le plan est toujours adapté à votre niveau actuel.',
            },
            {
              question: 'Le coaching en ligne, ça fonctionne vraiment ?',
              answer:
                'Oui. Le suivi se fait via l’application Nolio avec des plans détaillés, des retours sur vos séances et des points visio réguliers. La distance n’empêche pas un accompagnement précis et humain.',
            },
            {
              question: 'Que contiennent les plans d’entraînement PDF ?',
              answer:
                'Chaque plan couvre plusieurs semaines de préparation (10 km, semi, marathon ou trail) avec les séances détaillées, des conseils d’allure, de nutrition et de récupération. Téléchargement immédiat après achat.',
            },
            {
              question: 'Dans quelles zones intervenez-vous en présentiel ?',
              answer:
                'Principalement autour de Chambéry, Aix-les-Bains, le Lac du Bourget et les massifs de Savoie (Bauges, Chartreuse). Le coaching en ligne est disponible partout.',
            },
          ],
          finalCta: {
            title: 'Prêt à passer un cap ?',
            description:
              'Réservez votre premier échange gratuit. On définit ensemble vos objectifs et le plan pour les atteindre.',
            primaryButton: {
              label: 'Réserver un coaching',
              href: '/booking',
            },
            secondaryButton: {
              label: 'Poser une question',
              href: '/contact',
            },
            image: '$media:montagnes',
            imageAlt: 'Massifs de Savoie au crépuscule',
          },
        },
      },
      {
        uid: 'api::services-page.services-page',
        data: {
          internalName: 'Page Prestations',
          seo: {
            titre: 'Prestations & tarifs',
            description:
              'Coaching running et trail à Chambéry : séances 1-to-1, coaching mensuel, suivi en ligne, e-books et plans d’entraînement. Tarifs clairs, accompagnement personnalisé.',
            motsCles:
              'coaching running Chambéry\ntarif coach running\nplan marathon\ncoaching trail',
          },
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
              description: blocks(
                'Des séances en présentiel autour de Chambéry et du Lac du Bourget, centrées sur votre technique et vos sensations.',
              ),
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
              description: blocks(
                'L’accompagnement complet pour progresser durablement, avec un plan évolutif et un suivi hebdomadaire.',
              ),
              price: 120,
              priceNote: '/ mois',
              featured: true,
              featuredLabel: 'Le plus populaire',
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
              description: blocks(
                'Tout le suivi à distance, idéal pour les coureurs autonomes qui veulent une structure et un regard expert.',
              ),
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
              description: blocks(
                'Des plans d’entraînement PDF prêts à l’emploi pour 10 km, semi, marathon et trail.',
              ),
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
            image: '$media:marathon',
            imageAlt:
              'Chaussures de trail en pleine foulée sur un sentier de montagne',
            plans: [
              {
                title: 'Plan 10 km',
                detail: '8 semaines · débutant à intermédiaire',
                price: 19,
                button: { label: 'Acheter', href: '/contact' },
              },
              {
                title: 'Plan Semi-marathon',
                detail: '10 semaines · objectif chrono',
                price: 24,
                button: { label: 'Acheter', href: '/contact' },
              },
              {
                title: 'Plan Marathon',
                detail: '12 semaines · structuré & progressif',
                price: 29,
                button: { label: 'Acheter', href: '/contact' },
              },
              {
                title: 'Plan Trail découverte',
                detail: '8 semaines · gestion du dénivelé',
                price: 24,
                button: { label: 'Acheter', href: '/contact' },
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
      },
      {
        uid: 'api::footer.footer',
        data: {
          brandName: 'Alexandre Schutz',
          description:
            'Coach running & trail indépendant. Chambéry, Aix-les-Bains, Lac du Bourget et massifs de Savoie.',
          instagramUrl: 'https://instagram.com',
          whatsappUrl: 'https://wa.me/33600000000',
          nolioUrl: 'https://nolio.io',
          copyrightText: 'Alexandre Schutz Coaching. Tous droits réservés.',
          locationText: 'Chambéry · Savoie · France',
          colonnes: [
            {
              titre: 'Navigation',
              liens: [
                { libelle: 'Accueil', lien: '/' },
                { libelle: 'Prestations', lien: '/services' },
                { libelle: 'À propos', lien: '/about' },
                { libelle: 'Contact', lien: '/contact' },
              ],
            },
            {
              titre: 'Prestations',
              liens: [
                { libelle: 'Coaching 1-to-1', lien: '/services' },
                { libelle: 'Coaching mensuel', lien: '/services' },
                { libelle: 'Coaching en ligne', lien: '/services' },
                { libelle: 'E-books & plans', lien: '/services' },
              ],
            },
          ],
        },
      },
      {
        uid: 'api::page-a-propos.page-a-propos',
        data: {
          nomInterne: 'Page À propos',
          seo: {
            titre: 'À propos',
            description:
              'Découvrez le parcours d’Alexandre Schutz, coach running et trail indépendant en Savoie : certifications, philosophie d’entraînement et approche personnalisée.',
            motsCles:
              'Alexandre Schutz coach\ncoach running Savoie\ncoach trail Chambéry',
          },
          entete: {
            surtitre: 'À propos',
            titre: 'Coureur de cœur, coach de métier',
            description:
              'Mon objectif : vous aider à progresser durablement, en respectant votre corps et en gardant le plaisir de courir intact.',
          },
          photo: '$media:portrait',
          texteAlternatifPhoto:
            'Alexandre Schutz, coach running et trail',
          titreParcours: 'Mon parcours',
          parcours: blocks(
            'J’ai grandi entre le Lac du Bourget et les massifs des Bauges, où la course est vite devenue une évidence. Des premières foulées sur piste aux longs trails en montagne, j’ai exploré toutes les facettes de ce sport — et toutes ses exigences.\n\nAprès plusieurs années de compétition et un diplôme d’État en poche, j’ai choisi d’accompagner d’autres coureurs. Depuis, j’ai suivi plus de 120 athlètes, du débutant complet au marathonien cherchant à battre son record.\n\nMon approche repose sur l’individualisation : aucun plan standardisé, mais un entraînement pensé pour vous, votre vie et vos ambitions.',
          ),
          titreCertifications: 'Certifications',
          certifications: [
            { label: 'BPJEPS Athlétisme — course hors stade' },
            { label: 'Certificat préparation physique' },
            { label: 'Formation trail & ultra-endurance' },
            { label: 'Premiers secours (PSC1)' },
          ],
          titreReseaux: 'Me suivre',
          reseaux: [
            {
              plateforme: 'instagram',
              libelle: 'Instagram',
              lien: 'https://instagram.com',
            },
            {
              plateforme: 'whatsapp',
              libelle: 'WhatsApp',
              lien: 'https://wa.me/33600000000',
            },
            {
              plateforme: 'nolio',
              libelle: 'Nolio',
              lien: 'https://nolio.io',
            },
          ],
          titrePhilosophie: 'Ma philosophie de coaching',
          principes: [
            {
              titre: 'Progressivité avant tout',
              description:
                'On construit la performance sur des bases solides. Pas de surcharge : chaque semaine prépare la suivante.',
            },
            {
              titre: 'À l’écoute du corps',
              description:
                'Sensations, sommeil, fatigue : le plan s’ajuste à votre vie réelle, pas l’inverse. La régularité prime sur l’intensité.',
            },
            {
              titre: 'Le plaisir comme moteur',
              description:
                'Courir doit rester un plaisir. Les paysages de Savoie sont mon terrain de jeu, et je veux qu’ils deviennent le vôtre.',
            },
          ],
          titreAppelAction: 'On court ensemble ?',
          boutonPrincipal: {
            label: 'Réserver un coaching',
            href: '/booking',
          },
          boutonSecondaire: {
            label: 'Voir les prestations',
            href: '/services',
          },
        },
      },
      {
        uid: 'api::page-contact.page-contact',
        data: {
          nomInterne: 'Page Contact',
          seo: {
            titre: 'Contact',
            description:
              "Contactez votre coach running et trail à Chambéry. Posez vos questions sur le coaching, les plans d'entraînement et les e-books.",
            motsCles:
              'contact coach running Chambéry\ncoach trail Savoie',
          },
          entete: {
            surtitre: 'Contact',
            titre: 'Parlons de votre projet',
            description:
              "Une question sur le coaching, un plan d'entraînement ou un e-book ? Écrivez-moi, je réponds toujours personnellement.",
          },
          titreCoordonnees: 'Coordonnées',
          descriptionCoordonnees:
            'Basé à Chambéry, j’accompagne les coureurs en présentiel en Savoie et en visio partout en France.',
          coordonnees: [
            {
              type: 'zone',
              libelle: 'Zone',
              valeur: 'Chambéry & lac du Bourget, Savoie',
            },
            {
              type: 'email',
              libelle: 'Email',
              valeur: 'contact@alexandreschutz.fr',
              lien: 'mailto:contact@alexandreschutz.fr',
            },
            {
              type: 'telephone',
              libelle: 'Téléphone',
              valeur: '06 12 34 56 78',
              lien: 'tel:+33612345678',
            },
            {
              type: 'instagram',
              libelle: 'Instagram',
              valeur: '@alexandre.schutz.running',
              lien: 'https://instagram.com',
            },
          ],
          titreDisponibilites: 'Disponibilités',
          horaires: [
            { jours: 'Lundi – Vendredi', heures: '7h – 20h' },
            { jours: 'Samedi', heures: '8h – 13h' },
            { jours: 'Dimanche', heures: 'Fermé' },
          ],
          objectifsFormulaire: [
            { texte: '10 km' },
            { texte: 'Semi-marathon' },
            { texte: 'Marathon' },
            { texte: 'Trail' },
            { texte: 'Ultra-trail' },
            { texte: 'Remise en forme' },
          ],
          confidentialiteFormulaire:
            'Vos informations restent confidentielles et ne sont jamais partagées.',
        },
      },
      {
        uid: 'api::page-reservation.page-reservation',
        data: {
          nomInterne: 'Page Réservation',
          seo: {
            titre: 'Réserver une séance',
            description:
              'Réservez votre échange découverte ou votre séance de coaching running et trail à Chambéry. Présentiel en Savoie ou visio.',
            motsCles:
              'réserver coach running\nséance coaching Chambéry\ncoaching trail visio',
          },
          entete: {
            surtitre: 'Réservation',
            titre: 'Réservons votre prochaine séance',
            description:
              'Réservez un échange découverte pour parler de vos objectifs, de votre pratique et de vos attentes. Nous définirons ensemble l’accompagnement le plus adapté.',
          },
          titreDeroulement: 'Comment ça se passe',
          etapes: [
            {
              texte:
                'Vous choisissez un créneau qui vous convient ci-contre.',
            },
            {
              texte:
                'On fait le point sur vos objectifs, votre passé sportif et vos contraintes.',
            },
            {
              texte:
                'Je vous propose un accompagnement adapté à votre projet.',
            },
          ],
          reassurances: [
            {
              icone: 'horloge',
              titre: 'Réponse sous 24h',
              texte:
                'Chaque demande est confirmée personnellement par email dans la journée.',
            },
            {
              icone: 'localisation',
              titre: 'Chambéry & alentours',
              texte:
                'Séances en présentiel autour du lac du Bourget, ou en visio partout en France.',
            },
            {
              icone: 'securite',
              titre: 'Sans engagement',
              texte:
                'Le premier échange découverte est gratuit et sans aucun engagement.',
            },
          ],
          typesSeance: [
            {
              identifiant: 'discovery',
              libelle: 'Échange découverte',
              duree: '30 min',
              mode: 'Visio',
              icone: 'video',
            },
            {
              identifiant: 'session',
              libelle: 'Séance coaching',
              duree: '60 min',
              mode: 'Présentiel',
              icone: 'localisation',
            },
            {
              identifiant: 'online',
              libelle: 'Point coaching en ligne',
              duree: '45 min',
              mode: 'Visio',
              icone: 'video',
            },
          ],
          creneaux: [
            { texte: '07:00' },
            { texte: '08:30' },
            { texte: '10:00' },
            { texte: '12:00' },
            { texte: '17:30' },
            { texte: '18:30' },
            { texte: '19:30' },
          ],
          joursFermes: [{ jour: 'dimanche' }],
          texteSansPaiement:
            'Aucun paiement requis pour réserver un échange.',
        },
      },
    ]

    console.log(
      await call(client, 'initialiser-contenu-administrable', {
        mediasJson: JSON.stringify(mediaDefinitions),
        documentsJson: JSON.stringify(documents),
      }),
    )
  } finally {
    await closeClient(client)
  }
}

if (mode === 'schemas') {
  await schemas()
} else if (mode === 'content') {
  await content()
} else {
  throw new Error(
    'Usage: node scripts/synchroniser-contenu.mjs <schemas|content>',
  )
}
