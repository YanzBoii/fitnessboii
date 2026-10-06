# FitnessBoii Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recréer le prototype `design/design/FitnessBoii.dc.html` en app React multi-utilisateur sur Firebase Spark, sécurisée, installable (PWA), déployée sur Netlify.

**Architecture:** SPA React + TS. `src/firebase/*` est la seule couche qui importe Firebase (repos par collection). `src/domain/*` contient la logique pure testée (dates, stats, normalisation). `src/state/*` expose des hooks temps réel. `src/features/*` = un dossier par écran, rendu fidèle au proto. Spec : `docs/superpowers/specs/2026-10-06-fitnessboii-design.md`.

**Tech Stack:** React 18, Vite, TypeScript strict, Firebase JS SDK v11 (auth, firestore, app-check), vite-plugin-pwa, Vitest, @firebase/rules-unit-testing, ESLint.

**Référence UI :** pour chaque écran, le markup/style à reproduire est dans le template du proto (lignes 1–818) et sa logique dans `class Component` (lignes 896–1257). Les numéros de ligne cités ci-dessous pointent vers ce fichier.

---

## Structure des fichiers

```
index.html                     polices (Sora, Manrope, Material Symbols), meta PWA
netlify.toml                   build, fallback SPA, en-têtes sécurité/CSP
vite.config.ts                 react + pwa + vitest
.env.example                   VITE_FIREBASE_* , VITE_RECAPTCHA_SITE_KEY, VITE_ENABLE_APPLE
src/main.tsx                   bootstrap
src/App.tsx                    routeur d'état : Auth → Verify → Onboarding → Shell
src/domain/types.ts            Profile, Program, Exercise, SessionLog, ActiveSession, PhotoMeta
src/domain/constants.ts        GROUPS, PROG_ICONS, THEMES, OB_GOALS, OB_LEVELS, DAYS…, DEFAULT_PROGRAMS, DEFAULT_PROFILE
src/domain/dates.ts            pad, dateKey, addDays, mondayOf, r25, fmtDur
src/domain/stats.ts            attendedSet, streak, weekRow, heatmap, weeklyBars, perfHistory, best, changes30d, recentRecords
src/domain/normalize.ts        normalizeProgram/Exercise/Profile/ActiveSession (bornes = règles)
src/domain/onboarding.ts       distributeDays(programs, days)
src/domain/session.ts          startSession, validateExercise, mergeLog
src/domain/image.ts            fitSize(w,h,max)
src/firebase/config.ts         initializeApp, auth, db (persistentLocalCache), appCheck
src/firebase/authApi.ts        signUp, signIn, google, apple, resetPw, sendVerify, logout, deleteAccount, mapAuthError
src/firebase/repo.ts           profile/programs/logs/session/photos CRUD + subscribe*, exportAll, wipeAll
src/firebase/photoApi.ts       compressToJpeg(file) → Uint8Array, savePhoto, loadPhoto, deletePhoto
src/state/useAuthUser.ts       utilisateur + emailVerified
src/state/DataContext.tsx      abonnements profil/programmes/logs/session/photos
src/state/toast.tsx            toast global
src/ui/theme.ts                applyTheme(id, mode) (copie de la logique proto)
src/ui/global.css              reset, keyframes, reduced-motion, classes communes
src/ui/anim.ts                 anim(), useEnter() cascade
src/ui/Icon.tsx, Card.tsx, Stepper.tsx, Pill.tsx, Toggle.tsx
src/features/auth/AuthScreen.tsx
src/features/auth/VerifyEmail.tsx
src/features/onboarding/Onboarding.tsx
src/features/shell/Shell.tsx   sidebar desktop / nav pilule mobile / header page / overlays
src/features/home/Home.tsx
src/features/programs/Programs.tsx
src/features/session/Session.tsx (+ RestTimer.tsx)
src/features/perfs/Perfs.tsx (+ Photos.tsx, PhotoPrompt.tsx)
src/features/settings/Settings.tsx
src/features/profile/ProfileSheet.tsx
tests/domain/*.test.ts         Vitest
tests/rules/firestore.test.ts  émulateur
.github/workflows/ci.yml
README.md, LICENSE
```

---

### Task 1 : Scaffold

- [ ] `npm create vite@latest` (react-ts) dans le dossier, garder les fichiers existants.
- [ ] Installer : `firebase`, `vite-plugin-pwa`, dev : `vitest`, `@firebase/rules-unit-testing`, `@types/node`.
- [ ] `tsconfig` strict, scripts : `dev`, `build` (`tsc -b && vite build`), `test` (`vitest run tests/domain`), `test:rules` (`firebase emulators:exec --only firestore "vitest run tests/rules"`), `lint`, `typecheck`.
- [ ] `.env.example` + `.env` (config du projet `fitnessboii-fb4d3`).
- [ ] `npm run build` OK → commit `chore: scaffold vite react ts`.

### Task 2 : Domaine — dates, constantes, types (TDD)

- [ ] Tests `tests/domain/dates.test.ts` : `mondayOf(2026-10-08 jeu) = 2026-10-05`, `mondayOf(dimanche 2026-10-11) = 2026-10-05`, `dateKey` zéro-paddé, `r25(81.2)=80`, `fmtDur(65000)='01:05'`, `fmtDur(3725000)='1:02:05'`.
- [ ] Implémenter `dates.ts` (reprise des helpers proto l. 862–868), `constants.ts` (l. 820–860), `types.ts`.
- [ ] Tests verts → commit.

### Task 3 : Domaine — stats (TDD)

Entrée commune : `logs: SessionLog[]`, `today: Date`.
- [ ] Tests `stats.test.ts` :
  - `streak` : 2 séances/sem. sur les 3 dernières semaines → 3 ; semaine courante à 1 séance n'interrompt pas (w=0) ; trou → arrêt (logique l. 1076–1078).
  - `weeklyBars(logs, today, goal)` → 12 entrées, dernière = semaine courante.
  - `perfHistory(logs)` → `{ exId: [{date,w,r}] }` trié par date.
  - `changes30d` : exo avec perf avant/après J-30 → delta ; exo poids du corps (weight 0) compare les reps ; tri par variation relative (l. 1160–1170).
  - `recentRecords` : top 3 par progression, ignore exos sans historique.
- [ ] Implémenter → verts → commit.

### Task 4 : Domaine — normalisation, onboarding, séance (TDD)

- [ ] `normalize.test.ts` : nom tronqué à 60, sets borné 1–20, reps 0–500, weight 0–1000 arrondi 0,5, group inconnu → `pecs`, exercices > 40 tronqués.
- [ ] `onboarding.test.ts` : `distributeDays([push,pull,legs],[0,2,4,5])` → push [0,5], pull [2], legs [4].
- [ ] `session.test.ts` : `startSession` reprend la dernière perf (sinon poids cible) ; `validateExercise` passe au prochain non fait (circulaire) ; `mergeLog(existing, new)` garde le max par exo et somme les minutes (≤ 600).
- [ ] `image.test.ts` : `fitSize(4000,3000,720) = {w:720,h:540}`, pas d'agrandissement.
- [ ] Verts → commit.

### Task 5 : Tests des règles Firestore (émulateur)

Prérequis : Java 21.
- [ ] `tests/rules/firestore.test.ts` avec `initializeTestEnvironment({ projectId:'demo-fitnessboii', firestore:{ rules } })`.
- [ ] Cas : propriétaire vérifié lit/écrit profil, programme, log, session, photo ✔ ; autre uid ✘ ; anonyme ✘ ; `email_verified:false` ✘ ; champ inconnu (`isAdmin`) ✘ ; `goal: 9` ✘ ; `theme:'x'` ✘ ; log dont `date ≠ id` ✘ ; photo 900 001 octets ✘ ; `type:'image/png'` ✘ ; collection hors `users` ✘.
- [ ] `npm run test:rules` vert → commit.

### Task 6 : Couche Firebase

- [ ] `config.ts` : `initializeApp(env)`, `initializeFirestore(app,{ localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) })`, App Check si `VITE_RECAPTCHA_SITE_KEY` défini (`ReCaptchaV3Provider`, `isTokenAutoRefreshEnabled:true`), émulateurs si `VITE_USE_EMULATORS=true`.
- [ ] `authApi.ts` : fonctions listées + `mapAuthError(code)` → messages FR (`auth/email-already-in-use` → « Un compte existe déjà avec cet email », `auth/invalid-credential` → « Email ou mot de passe incorrect », `auth/too-many-requests`, `auth/network-request-failed`, `auth/popup-closed-by-user` → silencieux, `auth/requires-recent-login`).
- [ ] `repo.ts` : écritures passant par `normalize*`, `serverTimestamp()` pour createdAt/updatedAt, `writeBatch` pour onboarding (profil + 3 programmes), `wipeAll(uid)` par lots de 400.
- [ ] `photoApi.ts` : `createImageBitmap` → canvas `fitSize(…,720)` → `toBlob('image/jpeg',.8)` ; si > 900 Ko recommencer à .6 puis 560 px ; `Bytes.fromUint8Array` ; lecture → `URL.createObjectURL(new Blob([bytes]))` avec révocation.
- [ ] Typecheck OK → commit.

### Task 7 : État + UI de base

- [ ] `useAuthUser`, `DataContext` (`onSnapshot` sur profil, programmes triés par `order`, logs, session, photos meta), `toast`.
- [ ] `theme.ts` (applyTheme l. 846–850 + View Transitions), `global.css` (tokens, `:active` scale .95, hover brightness 1.1, reduced-motion), `anim.ts`.
- [ ] Composants `Icon`, `Card`, `Stepper`, `Pill`, `Toggle` d'après le template.
- [ ] Commit.

### Task 8 : Auth + vérification email

- [ ] `AuthScreen` : reproduire l'écran auth du template (split desktop, grille de points `authDots` l. 1033, formulaire). Apple affiché seulement si `VITE_ENABLE_APPLE==='true'`.
- [ ] Inscription email → `createUserWithEmailAndPassword` + `sendEmailVerification` → `VerifyEmail` (renvoyer avec cooldown 60 s, « J'ai vérifié » → `user.reload()` + `getIdToken(true)`, se déconnecter).
- [ ] Mot de passe oublié → `sendPasswordResetEmail` + toast « Lien envoyé à … ».
- [ ] Vérif manuelle en local (création compte, mail reçu) → commit.

### Task 9 : Onboarding

- [ ] Reproduire les 7 étapes (template + `obVals` l. 1035–1059), thème/mode appliqués en direct.
- [ ] Fin : batch profil `{…, goal: days.length, onboarded:true}` + `DEFAULT_PROGRAMS` via `distributeDays` (si l'utilisateur n'a encore aucun programme, sinon redistribue les existants comme le proto).
- [ ] Commit.

### Task 10 : Shell + Accueil

- [ ] `Shell` : sidebar 224 px ≥ 860 px, nav pilule mobile, header date + titre, boutons calendrier/avatar, transitions d'onglet (`enter` l. 950–958).
- [ ] `Home` : hero séance du jour (l. 1094–1099), série + semaine, heatmap 24/14 colonnes, records récents (état vide). Commit.

### Task 11 : Programmes

- [ ] Planning semaine + assignation (`assignDay` l. 997), onglets, carte programme, mode Modifier (nom, muscles, icône, jours, supprimer en 2 clics), exercices éditables (écritures debounce 400 ms), ajouter un exercice, nouveau programme. Commit.

### Task 12 : Séance

- [ ] Liste « Démarrer » si pas de séance ; séance active depuis `session/current` ; chrono (tick 500 ms) ; steppers ±2,5 / ±1 ; valider → exo suivant + repos auto ; minuteur de repos inline/flottant (+15 s, Passer) ; liste ; Abandonner / Terminer → `mergeLog` + suppression session + toast « Séance enregistrée · X min » + popup photo si aucune photo cette semaine. Commit.

### Task 13 : Perfs + photos

- [ ] Évolution physique (2 modes, état vide, bande miniatures, remplacer, suppression 2 clics) ; chargement paresseux des images.
- [ ] Barres 12 semaines, ligne objectif, moyenne ; « Ce qui a changé » + sparklines. Commit.

### Task 14 : Réglages + Profil

- [ ] Apparence, 6 thèmes. Profil : stats, champs prénom/poids/taille (email lecture seule), séances/sem., repos, toggles (rappels « bientôt »), Se déconnecter, Refaire le questionnaire, Exporter JSON, Réinitialiser mes données (2 clics), Supprimer mon compte (2 clics, ré-auth Google/mot de passe si `requires-recent-login`). Commit.

### Task 15 : PWA, sécurité Netlify, CI, README

- [ ] `vite-plugin-pwa` (manifest nom/couleurs Rubis, icônes générées en SVG→PNG, `registerType:'autoUpdate'`, cache Google Fonts).
- [ ] `netlify.toml` : `npm run build`, `dist`, redirect `/* /index.html 200`, en-têtes (CSP : `default-src 'self'; script-src 'self' https://www.google.com https://www.gstatic.com https://apis.google.com; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://firebaseinstallations.googleapis.com https://content-firebaseappcheck.googleapis.com https://www.google.com; frame-src https://fitnessboii-fb4d3.firebaseapp.com https://www.google.com https://accounts.google.com; img-src 'self' blob: data: https://*.googleusercontent.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'`).
- [ ] `.github/workflows/ci.yml` : Node 22, Java 21, `npm ci`, lint, typecheck, test, test:rules, build.
- [ ] README portfolio + LICENSE MIT. Commit.

### Task 16 : Vérification finale

- [ ] `npm run build`, `npm test`, `npm run test:rules` verts.
- [ ] Parcours complet dans le navigateur (desktop + mobile 375 px) : inscription → vérif → onboarding → séance → perfs → photo → profil → suppression de compte.
- [ ] Étapes de mise en ligne pour l'utilisateur : repo GitHub, Netlify, variables d'env, domaine autorisé Firebase Auth, App Check.
