# FitnessBoii — Spécification fonctionnelle et technique

Date : 2026-10-06 · Statut : validé en brainstorming

## Objectif

Transformer le prototype `design/design/FitnessBoii.dc.html` (référence visuelle haute fidélité, voir `design/README.md`) en une vraie application multi-utilisateur, sécurisée, installable, gratuite à héberger, présentable dans un portfolio GitHub.

## Contraintes

- **Coût : 0 €.** Firebase forfait **Spark** uniquement (pas de Blaze, pas de carte). Pas de Firebase Storage, pas de Cloud Functions.
- Hébergement **Netlify** (offre gratuite), repo public GitHub.
- Multi-utilisateur : chacun ne voit que ses données.
- Fidélité visuelle : couleurs, typo, animations et textes du design sont finaux.

## Stack

- React 18 + Vite + TypeScript (strict).
- Firebase JS SDK modulaire : Auth, Firestore (cache persistant multi-onglets), App Check (reCAPTCHA v3).
- `vite-plugin-pwa` : manifest + service worker (app installable, coquille hors-ligne).
- Styles : CSS variables `--fb-*` (système de thèmes du proto), CSS modules par feature.
- Tests : Vitest (logique pure dans `src/domain`), `@firebase/rules-unit-testing` + émulateur Firestore (règles de sécurité). CI GitHub Actions.
- Pas d'Analytics (le `measurementId` fourni est ignoré).

## Authentification

- Google (popup, redirect en fallback mobile) et email/mot de passe.
- Apple : code présent mais masqué derrière `VITE_ENABLE_APPLE=false` (nécessite un compte Apple Developer payant).
- Email/mot de passe : **email vérifié obligatoire** avant d'accéder aux données (écran « Vérifie ton email » avec bouton renvoyer + « J'ai vérifié »). Imposé côté serveur par les règles (`email_verified == true`).
- Mot de passe oublié : `sendPasswordResetEmail`.
- Validation client : email `/\S+@\S+\.\S+/`, mot de passe ≥ 6 (Firebase impose aussi 6). Erreurs Firebase traduites en français.
- Ordre de démarrage : Auth → (vérification email) → Questionnaire si `onboarded != true` → App.

## Modèle de données (Firestore)

Tout est sous `users/{uid}` :

| Chemin | Contenu |
|---|---|
| `users/{uid}` | profil + réglages : name, goalType, level, bodyWeight, height, goal (séances/sem 1–7), rest (60/90/120/180), autoTimer, remind, theme, mode, onboarded, createdAt, updatedAt |
| `users/{uid}/programs/{id}` | name, subtitle, icon, days [0–6], order, exercises [{ id, name, machine, group, sets, reps, weight }] (≤ 40) |
| `users/{uid}/sessionLogs/{yyyy-mm-dd}` | date, programId, programName, minutes, perf { exId: { w, r, name, group } }, createdAt — 1 doc/jour (comme le proto) |
| `users/{uid}/session/current` | séance en cours : programId, startedAt (ms), cur, ex { exId: { w, r, done } } |
| `users/{uid}/photos/{lundiISO}` | métadonnées photo : week, date, createdAt (liste légère) |
| `users/{uid}/photoData/{lundiISO}` | image : type `image/jpeg`, bytes (≤ 900 Ko) |

Dérivés calculés côté client depuis `sessionLogs` : présence (heatmap), série (semaines ≥ 2 séances), barres hebdo, historique des perfs par exercice, « ce qui a changé ». Pas de données dupliquées.

L'email affiché vient de Firebase Auth (non modifiable dans le profil v1). Le temps de repos restant (minuteur) est un état local, non synchronisé.

## Sécurité

1. **Règles Firestore** (`firestore.rules`) : accès uniquement si `request.auth.uid == uid` et email vérifié ; refus par défaut de tout le reste ; validation de chaque écriture (champs autorisés via `hasOnly`, types, bornes, énumérations, format des IDs et des dates, taille des listes/maps, image ≤ 900 Ko en octets JPEG).
2. **Limite connue** : les règles ne peuvent pas boucler sur une liste ; la forme interne de `exercises` et des maps `perf`/`ex` est validée côté client (fonctions de normalisation typées dans `src/domain`), leur taille est bornée côté serveur.
3. **Photos** : jamais d'URL publique ; lues via Firestore avec le token de l'utilisateur ; compressées côté client (720 px max, JPEG qualité 0,8, re-compression si > 900 Ko). Le fichier original n'est jamais envoyé.
4. **App Check** (reCAPTCHA v3, gratuit) activé après le premier déploiement Netlify, puis « Enforce » sur Firestore et Auth.
5. **Netlify** (`netlify.toml`) : CSP stricte (self + domaines Firebase/Google/reCAPTCHA/Google Fonts), HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restrictive, fallback SPA.
6. **Auth Firebase** : domaines autorisés limités à localhost + domaine Netlify ; protection contre l'énumération d'emails activée.
7. **Suppression de compte** : supprime toutes les sous-collections puis le compte Auth (ré-authentification si demandée par Firebase). Remplace « Réinitialiser » du proto par deux actions : « Réinitialiser mes données » et « Supprimer mon compte ».
8. Aucune donnée personnelle dans les URLs ; config Firebase dans `.env` (publique par nature, mais non codée en dur) ; `.env` ignoré par git, `.env.example` versionné.

## Fonctionnalités (par écran)

Comportement identique au README de design, sauf :

- **Démo** : données factices supprimées. Un nouveau compte part de 3 programmes modèles (Push / Pull / Legs du proto), répartis cycliquement sur les jours choisis à l'onboarding.
- **Records récents (Accueil)** : les 3 exercices avec la plus forte progression (meilleure perf vs première perf), libellé de période réel (« +X kg depuis le JJ mois »). État vide si aucune séance.
- **Séance** : sauvegardée en continu dans `session/current` (reprise après fermeture, sync multi-appareils). « Terminer » écrit le `sessionLog` du jour (fusion si une séance existe déjà aujourd'hui : perf max par exo) puis supprime la séance en cours. Popup photo si 1ʳᵉ séance de la semaine sans photo.
- **Rappels** : le toggle est conservé et stocké ; les notifications push nécessitent Cloud Messaging + un serveur → hors périmètre v1 (libellé « bientôt »).
- **Profil** : export JSON de toutes les données (photos exclues), réinitialisation, suppression de compte, déconnexion, refaire le questionnaire.

## Hors-ligne

Cache Firestore persistant : lecture et écriture hors-ligne (programmes, séance, perfs), synchronisation automatique au retour du réseau. Envoi de photo : nécessite le réseau (message clair sinon). Service worker : précache de l'app, polices en cache.

## Architecture du code

```
src/
  firebase/   init (app, auth, firestore, appcheck), repos par collection (seul code qui importe firebase/*)
  domain/     types, constantes (thèmes, groupes, icônes), dates, stats (série, présence, barres, changements), normalisation — pur, testé
  state/      hooks de données (abonnements temps réel), contexte utilisateur, toasts
  ui/         composants partagés + thème (applyTheme), animations (respect reduced-motion)
  features/   auth, verify, onboarding, home, programs, session, perfs, settings, profile, photos
tests/rules/  tests des règles contre l'émulateur
```

## Tests et CI

- Vitest : dates (lundi, clés), série, heatmap, barres, changements 30 j, fusion des logs, normalisation, compression (calcul des dimensions).
- Règles : propriétaire OK / autre utilisateur refusé / non connecté refusé / email non vérifié refusé / champs inconnus refusés / bornes / image trop lourde.
- GitHub Actions : lint + typecheck + tests unitaires + tests de règles (émulateur, Java 21) + build.

## Livrables portfolio

README (captures, stack, schéma sécurité, lancer en local, déployer), licence MIT, `.env.example`, badges CI.

## Prérequis locaux

- Java 21+ pour l'émulateur Firestore (Java 8 actuellement installé).
- Compte Firebase CLI : `yanzboiii@gmail.com` (défini pour ce dossier).
