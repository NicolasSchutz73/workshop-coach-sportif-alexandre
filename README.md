# Alexandre Schutz Coaching

Site vitrine réalisé pour l'activité de coaching running et trail d'Alexandre Schutz.

Le projet regroupe :

- un frontend Next.js pour les pages publiques ;
- un back-office Strapi pour administrer les contenus ;
- une réservation connectée à Cal.com ;
- un formulaire de contact envoyé par SMTP ;
- la vente de plans d'entraînement avec Lemon Squeezy.

## Stack

- Next.js 16, React 19 et TypeScript
- Tailwind CSS
- Strapi 5
- Vitest et Playwright

## Installation

Le projet utilise Node.js 20 à 24 et npm.

Installer les dépendances du frontend :

```bash
npm install
```

Installer celles du backend :

```bash
cd backend
npm install
cd ..
```

Créer ensuite les fichiers d'environnement :

```bash
cp .env.example .env.local
cp backend/.env.example backend/.env
```

Les valeurs par défaut permettent de travailler en local. Les fonctions liées à Strapi, Cal.com, Lemon Squeezy et aux e-mails nécessitent leurs identifiants respectifs.

## Lancer le projet

Dans un premier terminal, démarrer Strapi :

```bash
cd backend
npm run dev
```

Dans un second terminal, démarrer Next.js :

```bash
npm run dev
```

Le site est disponible sur [http://localhost:3000](http://localhost:3000) et l'administration Strapi sur [http://localhost:1337/admin](http://localhost:1337/admin).

Si Strapi n'est pas disponible, le frontend utilise des contenus de repli définis dans `lib/`.

## Organisation

```text
app/          pages et routes API Next.js
components/   composants d'interface
lib/          accès aux services et contenus de repli
public/       images publiques
assets/       fichiers sources des plans d'entraînement
backend/      application Strapi
tests/        tests unitaires, API et end-to-end
```

Les principales pages publiques sont l'accueil, les prestations, la présentation du coach, le contact, la réservation et les fiches des plans d'entraînement.

## Commandes utiles

```bash
npm run lint       # analyse ESLint
npm run typecheck  # vérification TypeScript
npm run test       # tests Vitest
npm run test:e2e   # tests Playwright
npm run build      # build du frontend
npm run check      # vérification complète frontend et backend
```

Pour tester les parcours complets, le frontend et Strapi doivent être lancés et les services externes configurés dans les fichiers d'environnement.
