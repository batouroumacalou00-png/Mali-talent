# Mali Talent

Mali Talent est une plateforme web conçue pour permettre aux jeunes sportifs maliens de créer leur profil, présenter leurs performances et être découverts par des recruteurs, clubs et partenaires.

## Fonctionnalités
- Inscription et connexion
- Création de profil athlète
- Ajout de sport, niveau, ville, âge, taille, poids, bio
- Réalisations, vidéos et certifications
- Recherche de talents
- Espace recruteur
- Design responsive pour mobile et desktop
- Installation sur téléphone via navigateur

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Stockage: JSON local (MVP simple)
- Déploiement: Railway

## Lancer le projet
```bash
npm install
npm --prefix packages/server install
npm --prefix packages/client install
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Build
```bash
npm run build
```

## Déploiement Railway
1. Connect the GitHub repo to Railway
2. Choose the service to deploy from the repo
3. Use the start command: `npm run start`
4. Deploy

## Installation sur téléphone
- Ouvrir le site dans le navigateur
- Utiliser "Ajouter à l'écran d'accueil"
- Lancer l'application comme une app native
