# Calendrier de l'Avent — App (React + Vite + Tailwind + PWA)

## ⚙️ Installation locale
1) Installe Node.js (version 18+).
2) Ouvre un terminal dans ce dossier, puis:
```bash
npm install
npm run dev
```
3) Ouvre l'URL locale affichée (par ex. http://localhost:5173).

## 📱 L'installer comme app (PWA)
Une fois déployé en HTTPS, ouvre l'URL sur ton téléphone puis:
- **Android (Chrome)**: ⋮ > *Ajouter à l'écran d'accueil*.
- **iPhone (Safari)**: bouton partager > *Sur l'écran d'accueil*.
L'app aura une icône, s'ouvrira plein écran, et fonctionnera offline de base pour les pages statiques.

## ☁️ Déploiement (Vercel)
1) Crée un repo Git (GitHub) et pousse ce dossier.
2) Va sur vercel.com, *New Project* > importe le repo.
3) Framework: **Vite** (auto détecté). Build: `npm run build`. Output: `dist`.
4) Déploie. Tu obtiendras une URL publique en HTTPS.

## 🔐 Astuce Admin
- Tape **joyeuxnoel** dans le champ du haut pour activer l'admin (ou bascule le bouton).
- Le contenu est stocké localement (localStorage) dans ce starter. Pour “anti-spoil” côté serveur, branche Supabase + règles RLS.

## 🧱 Structure
- `src/App.jsx`: l'app (24 cases, gating par date Europe/Brussels, éditeur admin)
- `public/manifest.webmanifest` + `public/sw.js`: PWA installable
- `tailwind.config.js` + `src/index.css`: style avec Tailwind

## 🔮 Aller plus loin (optionnel)
- Supabase (auth + base + edge functions) pour servir uniquement le contenu des jours déverrouillés.
- Mettre un sous-domaine (ex: `avent.mondomaine.be`).
- Ajouter des confettis/animations, sons, compte à rebours, etc.
