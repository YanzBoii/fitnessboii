# Architecture

## Organisation du code

```
src/
├── domain/       logique pure et testée : dates, statistiques (série, présence, progrès),
│                 bibliothèque d'exercices, onboarding, séance, normalisation
├── firebase/     seul code qui parle à Firebase : config, auth, accès Firestore, photos
├── state/        données temps réel (onSnapshot), état partagé, écritures différées
├── ui/           thèmes (variables CSS --fb-*), animations, installation PWA
└── features/     un dossier par écran : <Écran>View.tsx (rendu) + <écran>Vals.ts (logique)
tests/
├── domain/       tests unitaires (Vitest)
└── rules/        tests des règles Firestore contre l'émulateur
scripts/          captures d'écran du README (émulateur + Edge headless)
design/           prototype de design d'origine (référence visuelle)
```

Chaque écran sépare **le rendu** (`*View.tsx`, composant pur qui reçoit un objet `v`) de **sa logique** (`use*Vals`, hook qui calcule cet objet à partir des données). Les vues sont générées depuis le prototype (`design/`) pour garder styles et animations à l'identique ; leur typage est vérifié contre les hooks.

Les saisies (noms, charges, réglages) s'affichent immédiatement et sont écrites dans Firestore avec un léger délai groupé (`useOverlay`) : une écriture par pause de frappe, pas une par touche.

## Modèle de données

Tout est rangé sous `users/{uid}` :

| Chemin | Contenu |
|---|---|
| `users/{uid}` | profil et réglages (objectif, niveau, type de programme, thème…) |
| `programs/{id}` | programme et ses exercices (séries, reps, charge, repos et note par exercice) |
| `sessionLogs/{AAAA-MM-JJ}` | séance terminée : durée + perf max par exercice |
| `session/current` | séance en cours (reprise après fermeture, multi-appareils) |
| `photos/{lundi}` | métadonnées de la photo de la semaine |
| `photoData/{lundi}` | image JPEG compressée (octets) |

Présence, série, graphiques et historique des perfs sont calculés à partir de `sessionLogs` : aucune donnée dupliquée. Les exercices de la bibliothèque ont des identifiants stables, ce qui relie l'historique d'un même exercice entre programmes.

## Sécurité

- **Isolation** : un utilisateur ne peut lire/écrire que `users/{son uid}` ; tout le reste est refusé par défaut ([`firestore.rules`](../firestore.rules)).
- **Email vérifié** obligatoire pour les comptes email/mot de passe, imposé côté serveur (`request.auth.token.email_verified`).
- **Validation des écritures** dans les règles : champs autorisés (`hasOnly`), types, bornes, énumérations, format des identifiants et des dates, taille des listes, image JPEG ≤ 900 Ko. Ce que les règles ne peuvent pas vérifier (éléments d'une liste) est normalisé côté client avec les mêmes bornes ([`normalize.ts`](../src/domain/normalize.ts)).
- **Tests automatisés des règles** : autre utilisateur, visiteur, email non vérifié, champs inconnus, valeurs hors bornes, image trop lourde… exécutés à chaque push.
- **Photos privées** : compressées dans le navigateur (720 px, l'original n'est jamais envoyé), stockées dans Firestore et lues uniquement avec le jeton du propriétaire. Aucune URL publique.
- **En-têtes HTTP** ([`netlify.toml`](../netlify.toml)) : CSP restreinte à Firebase / Google Fonts, HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`.
- **App Check** (reCAPTCHA v3) : intégré, activé dès que `VITE_RECAPTCHA_SITE_KEY` est renseignée.
- **Déconnexion** : le cache Firestore local est effacé (appareil partagé).
- **Suppression de compte** : ré-authentification, effacement de toutes les données, puis du compte.

> La config web Firebase (`apiKey`…) est publique par nature : la sécurité repose sur les règles (et App Check), pas sur le secret de ces valeurs.

## PWA

- Manifeste complet (icônes, icône maskable, captures pour la fenêtre d'installation).
- Service worker Workbox : application pré-cachée, polices en cache, rechargement automatique quand une nouvelle version est déployée.
- Bouton « Installer l'app » : invite native sur Android / Chrome / Edge, pas-à-pas pour iPhone (Safari → Partager → Sur l'écran d'accueil).
- Données hors ligne : cache Firestore persistant, écritures synchronisées au retour du réseau.

## Déploiement

1. **Firebase** (forfait Spark) : Authentication (Email/Mot de passe + Google), Firestore. Règles : `npm run deploy:rules`.
2. **Netlify** : build et en-têtes lus depuis `netlify.toml`, variables `VITE_*` de `.env.example`.
3. **Firebase Auth → Domaines autorisés** : ajouter le domaine Netlify.
4. **App Check** (optionnel) : clé reCAPTCHA v3 pour le domaine, `VITE_RECAPTCHA_SITE_KEY`, redéployer, puis « Enforce » dans la console.

## Captures du README

```bash
npm run emulators                 # terminal 1
npm run preview:emu               # terminal 2 (build de prod branché sur l’émulateur, port 4173)
# Edge/Chrome headless avec --remote-debugging-port=9333, puis :
BROWSER_URL=http://127.0.0.1:9333 node scripts/screenshots.mjs
BROWSER_URL=http://127.0.0.1:9333 node scripts/showcase.mjs
```

Le script crée un compte de démonstration sur l'émulateur (16 semaines de séances), capture chaque écran en clair et en sombre, puis compose la vitrine.
