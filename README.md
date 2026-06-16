# ThinkTech Solutions — Site web

## Démarrer en local (sur ton PC)

```bash
npm install
npm run dev
```

Le site sera visible sur http://localhost:4321/fr/

## Où modifier quoi

- **Textes du site (FR/EN)** : `src/i18n/fr.json` et `src/i18n/en.json` — aucun texte n'est codé en dur dans les composants, tout est ici.
- **Textes du chatbot** : `src/i18n/chatbot.fr.json` et `chatbot.en.json`.
- **Images** : dans `public/images/` (hero, about, platforms, partners) — remplace simplement le fichier au même nom et chemin pour utiliser tes vraies images (jpg/png/webp acceptés, adapte juste l'extension dans le JSON correspondant si besoin).
- **Logo** : `public/logo.svg` (déjà ton logo réel).
- **Articles de blog** : ajoute un fichier `.md` dans `src/content/articles/fr/` ou `en/`.
- **Couleurs / typographie** : `src/styles/themes.css` (couleurs clair/sombre) et `src/styles/global.css` (typographie).
- **Réseaux sociaux** : liens à compléter dans `src/components/layout/Footer.astro` (actuellement `href="#"`).
- **Variables SMTP (Brevo)** : fichier `.env` (jamais commité), basé sur `.env.example`.

## Déploiement (VPS Ubuntu + Docker + Nginx Proxy Manager)

Voir les commandes ci-dessous. Le site tourne en mode serveur (SSR Node, port interne **4321**) pour permettre l'envoi du formulaire de démo par e-mail.

```bash
docker compose build
docker compose up -d
```

Dans Nginx Proxy Manager, configure le Proxy Host avec :
- Forward Hostname/IP : `thinktech-site`
- Forward Port : **4321**

Active SSL Let's Encrypt depuis l'onglet SSL du Proxy Host.

## Mise à jour du site en production

```bash
cd /opt/thinktech-solutions
git pull
docker compose build
docker compose up -d
```
