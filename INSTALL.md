# 🚀 Installation Mali Talent

## Installation Rapide Locale

### 1️⃣ Prérequis
- Node.js 18+ installé
- Git installé

### 2️⃣ Télécharger et installer

```bash
# Clone le projet
git clone https://github.com/batouroumacalou00-png/Mali-talent.git
cd Mali-talent

# Installe les dépendances
npm install
npm --prefix packages/server install
npm --prefix packages/client install
```

### 3️⃣ Lancer l'application

```bash
npm run dev
```

**Accès :**
- Frontend: http://localhost:3000
- API Backend: http://localhost:5000

### 4️⃣ Premiers pas
1. Va sur http://localhost:3000
2. Crée un compte (athlète ou recruteur)
3. Complète ton profil
4. Recherche les talents

---

## Installation sur Téléphone 📱

### Android / iOS
1. Ouvre http://localhost:3000 dans le navigateur de ton téléphone
2. Clique sur les 3 points (menu)
3. Sélectionne "Ajouter à l'écran d'accueil"
4. L'app s'installe automatiquement

---

## Déploiement en Ligne 🌐

### Option 1: Railway (Recommandé)

1. Va sur https://railway.app
2. Connecte-toi avec GitHub
3. Crée un nouveau projet
4. Importe le dépôt Mali-talent
5. Railway va automatiquement :
   - Déployer le backend sur un URL public
   - Déployer le frontend
   - Te donner un lien d'accès

### Accès après déploiement:
- URL publique: https://ton-app.railway.app
- API: https://ton-app.railway.app/api

---

## Dépannage

**Problème: Port 3000 ou 5000 déjà utilisé**
```bash
VITE_PORT=3001 npm --prefix packages/client run dev
PORT=5001 npm --prefix packages/server run dev
```

**Problème: npm install échoue**
```bash
npm cache clean --force
npm install
```

---

**Mali Talent - Votre plateforme de talents sportifs 🏅**
