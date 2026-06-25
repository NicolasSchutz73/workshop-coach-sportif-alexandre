# Configuration des réservations

## Route de réservation publique

Le parcours public de réservation est `/reservation`. Le texte public est
actuellement verrouillé côté frontend sur l’offre `Séance 1-to-1` : une séance
ponctuelle sur le terrain autour de Chambéry, avec analyse de la foulée, des
appuis et conseils personnalisés. Les créneaux Strapi peuvent encore être lus
si présents, puis les disponibilités et réservations passent par Cal.com.

Le navigateur passe uniquement par les routes serveur Next.js `/api/cal/slots`
et `/api/cal/bookings` : la clé API n’est jamais exposée. Les anciens liens
internes `/booking` sont normalisés vers `/reservation` côté frontend.

## Variables serveur Next.js

À définir dans l'environnement Next.js :

```env
STRAPI_URL=http://localhost:1337
STRAPI_PUBLIC_URL=http://localhost:1337
STRAPI_API_TOKEN=
STRAPI_REVALIDATE_SECONDS=60
CAL_API_KEY=
CAL_API_BASE_URL=https://api.cal.eu
CAL_API_VERSION=2024-09-04
# Facultatif — valeur par défaut : 2024-08-13
CAL_BOOKINGS_API_VERSION=2024-08-13
CAL_EVENT_USERNAME=nicolas-schutz-zdf9fu
CAL_EVENT_TYPE_SLUG=appel-decouverte
```

Pour ce compte Cal.eu, renseignez exactement
`CAL_API_BASE_URL=https://api.cal.eu`, `CAL_API_VERSION=2024-09-04` pour les
créneaux. Les réservations utilisent `2024-08-13` par défaut ;
`CAL_BOOKINGS_API_VERSION` est donc facultative mais, si elle est définie,
doit conserver cette valeur.
Toutes les variables `CAL_*` sont strictement serveur : ne leur donnez jamais
le préfixe `NEXT_PUBLIC_`.

L’événement Cal `nicolas-schutz-zdf9fu/appel-decouverte` ne doit imposer aucun
champ supplémentaire au nom et à l’e-mail. Le téléphone est transmis lorsqu’il
est renseigné, au format international E.164 (par exemple `+33612345678`), et
le message facultatif est enregistré dans les métadonnées de la réservation.

Côté Strapi, à définir dans `backend/.env` :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-google-app-password
EMAIL_DEFAULT_FROM="Alexandre Coach <your-email@gmail.com>"
EMAIL_DEFAULT_REPLY_TO="Alexandre Coach <your-email@gmail.com>"
EMAIL_TEST_ADDRESS=your-email@gmail.com
COACH_EMAIL=your-email@gmail.com
```

Avec Gmail, `SMTP_PASSWORD` doit être un mot de passe d'application Google, pas
le mot de passe normal du compte.

## Ancien parcours Strapi

Le widget maison `/booking` a été retiré du site public. Les routes techniques
`/api/slots` et `/api/bookings` peuvent encore exister dans le code, mais elles
ne doivent plus être utilisées comme parcours client sans décision explicite.

### Types de séance

Sur une installation vide, le bootstrap Strapi crée les types de séance et
45 jours de créneaux initiaux. Les slugs correspondent aux identifiants utilisés
par la page Réservation :

- `discovery`
- `session`
- `online`

Le `documentId` Strapi du type de séance doit être utilisé pour générer ses
créneaux.

Le bootstrap ne réinjecte rien dès qu'un type de séance ou un créneau existe.
Les suppressions et les disponibilités restent donc sous le contrôle de
l'administrateur après cette initialisation.

### Génération de créneaux

La route est réservée au rôle Authenticated ou à un API token Strapi autorisé :

```http
POST /api/time-slots/generate
Content-Type: application/json
Authorization: Bearer <token>

{
  "startDate": "2026-06-15",
  "endDate": "2026-06-21",
  "times": ["07:00", "08:30", "17:30"],
  "sessionTypeId": "<documentId>"
}
```

La période est inclusive. Les doublons déjà présents pour le même type de
séance, la même date et la même heure sont ignorés.

### Cache de l'administration

Après une mise à jour de dépendances ou si Vite signale un module dynamique
Strapi introuvable, redémarrer l'administration avec un cache propre :

```bash
npm run dev:clean
```

### Permissions

Le bootstrap Strapi configure automatiquement :

- Public : lecture des types de séance et créneaux, création d'une réservation.
- Authenticated : accès complet à `SessionType`, `TimeSlot` et `Booking`, plus
  la génération de créneaux.
