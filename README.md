# Alexandre Schutz — site de coaching running et trail

Monorepo du site vitrine d’Alexandre Schutz :

- frontend Next.js 16 à la racine du dépôt ;
- backend Strapi dans `backend/`.

Le site utilise Strapi pour le contenu éditorial, Lemon Squeezy pour les
e-books et Cal.com pour les réservations.

## Démarrage

Frontend :

```bash
npm install
npm run dev
```

Backend Strapi :

```bash
cd backend
npm install
npm run dev
```

Le site est disponible sur `http://localhost:3000` en développement Next.js.
Strapi est disponible sur `http://localhost:1337`. Vérifications disponibles :

```bash
npm run lint
npm run build
cd backend && npm run build
```

## Architecture fonctionnelle

- `/reservation` : réservation via l’API Cal.com. C’est la destination utilisée
  par les CTA publics.
- `/plans/[slug]` : pages de plans d’entraînement ; le checkout est créé par
  Lemon Squeezy.
- `lib/` : accès Strapi, Cal.com, Lemon Squeezy et données de repli.

Le contenu reste affichable avec ses valeurs de repli quand Strapi est
indisponible. Les routes de création (`/api/contact`, `/api/cal/*` et
`/api/ebooks/checkout`) nécessitent toutefois leurs variables serveur.

## Configuration

Copier les variables nécessaires dans `.env.local`, sans jamais leur donner le
préfixe `NEXT_PUBLIC_` lorsqu’elles sont secrètes :

```dotenv
STRAPI_URL=http://localhost:1337
STRAPI_PUBLIC_URL=http://localhost:1337
STRAPI_API_TOKEN=
STRAPI_REVALIDATE_SECONDS=60

SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USERNAME=
SMTP_PASSWORD=
EMAIL_DEFAULT_FROM="Alexandre Coach <coach@example.com>"
COACH_EMAIL=

CAL_API_KEY=
CAL_API_BASE_URL=https://api.cal.eu
CAL_API_VERSION=2024-09-04
CAL_BOOKINGS_API_VERSION=2024-08-13
CAL_EVENT_USERNAME=nicolas-schutz-zdf9fu
CAL_EVENT_TYPE_SLUG=appel-decouverte

LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_VARIANT_PLAN_10_KM=
LEMONSQUEEZY_VARIANT_PLAN_SEMI_MARATHON=
LEMONSQUEEZY_VARIANT_PLAN_MARATHON=
LEMONSQUEEZY_VARIANT_PLAN_TRAIL_DECOUVERTE=
LEMONSQUEEZY_TEST_MODE=true
```

Documentation opérationnelle :

- [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md), pour l'état du projet face
  à la note de cadrage et le reste à faire avant livraison.
- [`docs/RESERVATION_SETUP.md`](docs/RESERVATION_SETUP.md)
- [`docs/LEMONSQUEEZY_SETUP.md`](docs/LEMONSQUEEZY_SETUP.md)
- [`docs/STRAPI_PLANS.md`](docs/STRAPI_PLANS.md)
- [`CONTEXT.md`](CONTEXT.md), pour le vocabulaire et le périmètre produit.
