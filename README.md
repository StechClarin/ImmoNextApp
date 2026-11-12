# ImmoVitrine Congo — Plateforme Immobilière (Vente, Location & Gestion)

Plateforme web moderne développée avec **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS** et **Prisma + SQLite** aux couleurs **Teal & Fusion (Orange + Jaune + Or)**, pensée pour le marché immobilier en **République du Congo (Brazzaville, Pointe-Noire, Kintélé)**.

## Démarrage rapide

```bash
npm install
npm run dev
```

Puis ouvrez `http://localhost:3000`.

## Base de données Prisma + SQLite & Déploiement

- Schéma Prisma défini dans `prisma/schema.prisma` (`provider = "sqlite"`).
- La base SQLite est créée dans `data/immovitrine.db` (`npm run db:push` / `npx prisma db push`) et pré-remplie automatiquement depuis `data/db.json` si elle est vide.
- Commandes utiles : `npm run db:push` (synchroniser le schéma) et `npm run db:studio` (ouvrir Prisma Studio).
- Variables d'environnement recommandées en production :
  - `DATABASE_URL` : URL de connexion SQLite Prisma (par défaut `file:../data/immovitrine.db`, voir `.env.example`).
  - `AUTH_SECRET` : clé secrète aléatoire pour signer les sessions admin.
  - `SUPERUSER_PASSWORD` : mot de passe du compte superuser `ethernanos` (par défaut `admin@1234`).
- Pour le déploiement sur VPS (PM2 / Docker / Node), veillez à conserver les dossiers `data/` et `public/uploads/` sur un disque persistant.

## Pages disponibles

- **Accueil (`/`)** : Recherche rapide, biens à la une, activités, équipe et dernières actualités.
- **Catalogue (`/catalogue`)** : Grille 3×3 avec filtres par opération (Vente / Location), ville (Brazzaville, Pointe-Noire), catégorie et mot-clé.
- **Fiche détaillée d'un bien (`/catalogue/[slug]`)** : Galerie photos interactive, caractéristiques, carte OpenStreetMap du quartier, conseiller dédié et formulaire de demande de visite.
- **L'Entreprise & Nos Activités (`/entreprise`)** : Histoire, valeurs et détail des prestations (Vente, Location, Gestion locative, Conseil foncier).
- **Notre Équipe (`/equipe`)** : Présentation des collaborateurs et contact direct (Téléphone, Email, WhatsApp).
- **Actualités (`/actualites` & `/actualites/[slug]`)** : Blog et conseils immobiliers au Congo.
- **Contact (`/contact`)** : Coordonnées, carte et formulaire de contact / estimation.
- **Back-Office d'Administration (`/admin`)** : Protégé par authentification (`ethernanos` en Superuser) avec gestion des biens, demandes clients, actualités, équipe, logo/coordonnées et comptes utilisateurs.
