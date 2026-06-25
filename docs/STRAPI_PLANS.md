# Plans d’entraînement dans Strapi

Les huit images de repli sont dans `public/images/plans/`. Elles permettent au site de fonctionner sans Strapi, mais les médias renseignés dans Strapi les remplacent automatiquement.

## Import

1. Redémarrer Strapi afin qu’il détecte les nouveaux champs du composant **Plan d’entraînement**.
2. Dans la médiathèque, importer les huit fichiers de `public/images/plans/`.
3. Ouvrir **Page Prestations** puis **E-books et plans**.
4. Pour chaque plan, associer une image de couverture et une image d’aperçu du sommaire, puis renseigner leurs textes alternatifs.
5. Renseigner la description longue, les éléments du sommaire et la liste **Vous allez recevoir**. Les titres du sommaire sont rendus dans le site ; ne les ajoutez pas dans l’image.

Les slugs sont techniques et doivent rester inchangés : `plan-10-km`, `plan-semi-marathon`, `plan-marathon`, `plan-trail-decouverte`. Ils associent chaque page au bon produit Lemon Squeezy.

La livraison affichée est volontairement limitée à : **PDF envoyé par e-mail après paiement**.
