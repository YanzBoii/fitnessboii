# FitnessBoii

Application de suivi de musculation : programmes (exercices, machine, séries × reps × charge), séances guidées un exercice à la fois, perf max par exercice, régularité (heatmap de présence, série de semaines) et évolution physique (photo hebdomadaire + comparatifs).

Responsive PC / mobile, installable (PWA), utilisable hors-ligne à la salle, multi-utilisateur, hébergée gratuitement.

## Stack

| | |
|---|---|
| Front | React 18, TypeScript strict, Vite |
| Données | Firebase Auth (Google + email), Cloud Firestore (cache persistant hors-ligne) |
| Sécurité | Règles Firestore testées, App Check (reCAPTCHA v3), en-têtes HTTP stricts |
| PWA | vite-plugin-pwa (Workbox) |
| Tests | Vitest (logique métier) + émulateur Firestore (règles de sécurité) |
| CI / hébergement | GitHub Actions, Netlify |

Coût : 0 € (Firebase forfait Spark, Netlify gratuit).

## Architecture

```
src/
  domain/     logique pure, testée : dates, statistiques (série, présence, progrès), normalisation, séance
  firebase/   seul code qui parle à Firebase : config, auth, accès Firestore, photos
  state/      données temps réel (onSnapshot), état partagé, écritures différées
  ui/         thèmes (variables CSS --fb-*), animations (respect de prefers-reduced-motion)
  features/   un dossier par écran : <Écran>View.tsx (rendu) + <écran>Vals.ts (logique d'affichage)
tests/
  domain/     tests unitaires
  rules/      tests des règles Firestore contre l'émulateur
```

Chaque écran sépare **le rendu** (`*View.tsx`, composant pur qui reçoit un objet `v`) de **sa logique** (`use*Vals`, hook qui calcule cet objet à partir des données). Les vues ont été produites depuis le prototype de design (`design/`) pour garder styles et animations à l'identique ; leur typage est vérifié contre les hooks.

Les saisies (noms, charges, réglages) s'affichent immédiatement et sont écrites dans Firestore avec un léger délai groupé (`useOverlay`), ce qui évite une écriture par frappe.

## Modèle de données

Tout est rangé sous `users/{uid}` :

| Chemin | Contenu |
|---|---|
| `users/{uid}` | profil et réglages |
| `programs/{id}` | programme et ses exercices |
| `sessionLogs/{AAAA-MM-JJ}` | séance terminée : durée + perf max par exercice |
| `session/current` | séance en cours (reprise après fermeture, multi-appareils) |
| `photos/{lundi}` | métadonnées de la photo de la semaine |
| `photoData/{lundi}` | image JPEG compressée (octets) |

Présence, série, graphiques et historique des perfs sont calculés à partir de `sessionLogs` : aucune donnée dupliquée.

## Sécurité

- **Isolation** : un utilisateur ne peut lire/écrire que `users/{son uid}` ; tout le reste est refusé par défaut ([`firestore.rules`](firestore.rules)).
- **Email vérifié** obligatoire pour les comptes email/mot de passe, imposé côté serveur (`request.auth.token.email_verified`).
- **Validation des écritures** dans les règles : champs autorisés (`hasOnly`), types, bornes, énumérations, format des identifiants et des dates, taille des listes, image JPEG ≤ 900 Ko. Ce que les règles ne peuvent pas vérifier (éléments d'une liste) est normalisé côté client avec les mêmes bornes ([`normalize.ts`](src/domain/normalize.ts)).
- **Tests automatisés des règles** ([`tests/rules`](tests/rules/firestore.test.ts)) : autre utilisateur, visiteur, email non vérifié, champs inconnus, valeurs hors bornes, image trop lourde… exécutés à chaque push.
- **Photos privées** : compressées dans le navigateur (720 px, l'original n'est jamais envoyé), stockées dans Firestore et lues uniquement avec le jeton du propriétaire. Aucune URL publique.
- **App Check** : seule l'app déployée peut appeler le projet Firebase.
- **En-têtes HTTP** ([`netlify.toml`](netlify.toml)) : CSP restreinte à Firebase / Google Fonts, HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`.
- **Déconnexion** : le cache Firestore local est effacé (appareil partagé).
- **Suppression de compte** : ré-authentification, effacement de toutes les données, puis du compte. Export JSON disponible.

> La config web Firebase (`apiKey`…) est publique par nature : la sécurité repose sur les règles et App Check, pas sur le secret de ces valeurs.

## Lancer en local

Prérequis : Node 22+, Java 21+ (émulateurs).

```bash
npm install
cp .env.example .env        # puis renseigner la config web Firebase
npm run dev
```

Sans projet Firebase, avec les émulateurs locaux (aucun appel réseau vers Firebase) :

```bash
npm run emulators           # terminal 1
npm run dev:emu             # terminal 2
```

Le lien de vérification d'email est alors visible dans la sortie de l'émulateur Auth.

## Tests

```bash
npm test                    # logique métier
npm run test:rules          # règles de sécurité (lance l'émulateur Firestore)
npm run typecheck
```

## Déploiement

1. **Firebase** : projet Spark, Authentication (Email/Mot de passe + Google), Firestore. Déployer les règles : `npm run deploy:rules`.
2. **Netlify** : importer le dépôt GitHub (build et en-têtes lus depuis `netlify.toml`), ajouter les variables `VITE_*` de `.env.example`.
3. **Firebase Auth → Paramètres → Domaines autorisés** : ajouter le domaine Netlify.
4. **App Check** : enregistrer l'app web avec une clé reCAPTCHA v3 (domaine Netlify), renseigner `VITE_RECAPTCHA_SITE_KEY`, redéployer, vérifier les métriques puis activer l'application (« Enforce ») pour Firestore et Authentication.

## Licence

[MIT](LICENSE)
