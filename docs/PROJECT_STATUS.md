# Etat du projet face a la note de cadrage

Audit realise le 25 juin 2026 a partir de `note_de_cadrage_schutz_alexandre.pdf`,
du frontend Next.js a la racine du depot et du backend Strapi versionne dans
`backend/`.

## Synthese

Le socle V1 est largement en place : site Next.js, cinq pages principales,
pages legales, contenu administrable via Strapi, formulaire de contact,
parcours de reservation Cal.com, pages de plans d'entrainement et checkout
Lemon Squeezy.

Les principaux ecarts restants par rapport a la note de cadrage concernent la
preparation de livraison : SEO technique complet, suivi GA4/Search Console,
guide back-office, recette et validation des contenus definitifs.

## Conforme ou bien avance

- Pages principales V1 : accueil, a propos/presentation, prestations,
  reservation et contact sont implementees.
- Frontend : Next.js 16 avec App Router, contenu SSR et fallbacks si Strapi est
  indisponible.
- CMS/back-office : backend Strapi present avec types de contenu pour les pages,
  les prestations, le footer, les parametres site, les reservations, les types
  de seance et les creneaux.
- Contenu administrable : textes, boutons, SEO de page, liens sociaux, medias et
  plans d'entrainement sont modelises cote Strapi.
- Reservation : `/reservation` est le parcours public via widget Cal.com et
  routes serveur Next.js. Le texte public est aligne sur la prestation
  "Seance 1-to-1". Les anciens liens `/booking` sont normalises vers
  `/reservation`.
- Pages legales : mentions legales, politique de confidentialite et CGV sont
  presentes et liees dans le footer.
- Paiement e-books : checkout Lemon Squeezy via `/api/ebooks/checkout`, pages
  dynamiques `/plans/[slug]`, PDF sources ranges dans `assets/ebooks/`.
- Contact : formulaire frontend et envoi SMTP via `/api/contact`.
- Responsive/mobile-first : la structure Tailwind et les composants sont
  construits avec des variantes mobile/desktop.
- Documentation technique partielle : reservation, Lemon Squeezy et import des
  plans Strapi sont documentes.

## Reste a faire avant livraison V1

1. Finaliser le SEO technique.
   Les balises meta de page existent, mais il manque les routes/fichiers
   `sitemap` et `robots` cote frontend, les donnees structurees Schema.org et
   une verification des alt-texts definitifs.

2. Configurer le suivi de lancement.
   Le site embarque `@vercel/analytics`, mais la note demande explicitement
   Google Analytics 4 et Google Search Console. Il reste a ajouter/configurer le
   tag GA4, la verification Search Console et la documentation des acces.

3. Clarifier le paiement des prestations de coaching.
   Les e-books sont payables via Lemon Squeezy. La seance 1-to-1 renvoie vers
   `/reservation` sans paiement immediat, et le coaching mensuel renvoie vers le
   profil Nolio du coach. Il reste a arbitrer si la V1 garde ce fonctionnement,
   ajoute un acompte, ou ajoute un paiement direct des coachings.

4. Produire le guide d'administration back-office.
   Les docs actuelles couvrent surtout la configuration technique. Il manque un
   guide client pour Alexandre : modifier les textes/images, publier une page,
   gerer les creneaux, traiter une reservation, mettre a jour les prix/plans et
   verifier les commandes Lemon Squeezy.

5. Completer les contenus definitifs.
   Les fallbacks contiennent encore des valeurs generiques ou a confirmer
   (`https://instagram.com`, numero WhatsApp placeholder, certains textes et
   photos). Les contenus client, photos finales, liens Nolio/reseaux et PDF
   doivent etre valides.

6. Preparer la mise en production.
   Il reste a documenter le nom de domaine, les variables d'environnement de
   production, le deploiement Vercel, l'URL Strapi Cloud/serveur, les CORS et la
   strategie de sauvegarde minimale.

7. Faire la recette fonctionnelle.
   Tester de bout en bout : formulaire contact, reservation Cal.com, checkout
   Lemon Squeezy en mode test, rendu mobile,
   navigation, erreurs API et emails.

8. Mesurer les objectifs qualite.
    La note fixe notamment un score Lighthouse mobile d'au moins 80/100. Il faut
    lancer Lighthouse/PageSpeed sur l'URL de preproduction et corriger les points
    bloquants.

## Hors perimetre a ne pas demarrer sans accord

- Page activites outdoor kayak/tennis/seminaires avec avis Google.
- Blog SEO.
- Espace client et suivi de progression.
- Abonnement mensuel recurrent.
- Tunnel email automatise.
- Landing pages par objectif sportif.
- Version multilingue.

## Points d'attention

- Le backend Strapi contient aussi une API `contact-request`, mais le frontend
  actuel envoie le contact via SMTP Next.js. Garder un seul parcours officiel
  evitera de documenter deux workflows client.
- Les couts et outils choisis restent alignes avec la note : Vercel, Strapi,
  Lemon Squeezy et Cal.com minimisent les couts de demarrage.
