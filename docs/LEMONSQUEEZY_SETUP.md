# Paiement des e-books avec Lemon Squeezy

Le site crée un checkout Lemon Squeezy à la demande via
`/api/ebooks/checkout`. Lemon Squeezy assure le paiement, la page de
confirmation et l’envoi du PDF par e-mail.

## Variables d’environnement

```dotenv
LEMONSQUEEZY_API_KEY=...
LEMONSQUEEZY_STORE_ID=...
LEMONSQUEEZY_VARIANT_PLAN_10_KM=...
LEMONSQUEEZY_VARIANT_PLAN_SEMI_MARATHON=...
LEMONSQUEEZY_VARIANT_PLAN_MARATHON=...
LEMONSQUEEZY_VARIANT_PLAN_TRAIL_DECOUVERTE=...
LEMONSQUEEZY_TEST_MODE=true
```

Chaque variable de variante correspond à un produit Lemon Squeezy contenant le
PDF associé. Configurez la livraison par e-mail et le fichier directement dans
Lemon Squeezy.

Les PDF sources sont rangés dans `assets/ebooks/`. Ils ne sont volontairement
pas exposés par Next.js : téléversez chaque fichier dans la variante Lemon
Squeezy correspondante. Les slugs et variables sont définis dans `lib/ebooks.ts`
et doivent rester synchronisés.

## Test

1. Démarrer le site avec `npm run dev`.
2. Ouvrir une page de plan puis sélectionner « Accéder au paiement ».
3. Vérifier que Lemon Squeezy ouvre le checkout du bon produit et que l’e-mail
   de livraison est configuré dans Lemon Squeezy.

Aucun webhook, stockage de commande, e-mail applicatif ou page de confirmation
interne n’est implémenté à ce stade.
