# Handoff : FitnessBoii

## Overview
FitnessBoii est une app de suivi de musculation (PC + mobile, responsive). L'utilisateur y retrouve ses programmes (exercices + machine + séries/reps/poids), lance des séances guidées, note sa perf max par exercice, suit sa régularité (calendrier de présence à points rouges) et son évolution physique (photos hebdo + comparatifs).

## About the Design Files
Les fichiers de `design/` sont des **références de design en HTML** : un prototype interactif qui montre le rendu et le comportement attendus, **pas du code de production à copier**. La tâche est de **recréer ce design** dans un vrai environnement. Aucun codebase n'existe encore : recommandation **React + Vite + TypeScript** (ou Next.js), styles via CSS variables (le système de thème est déjà pensé en variables), persistance réelle via un backend (Supabase / Firebase) pour l'auth Google/Apple/email, les données et le stockage des photos.

Pour voir le prototype : ouvrir `design/FitnessBoii.dc.html` dans un navigateur (garder `support.js` à côté). Toute la logique est dans la classe `Component` en bas du fichier, tous les styles sont inline.

## Fidelity
**High-fidelity.** Couleurs, typo, rayons, ombres, animations et copy sont finaux. À reproduire fidèlement.

## Navigation & structure
- **Desktop (≥ 860px)** : sidebar fixe 224px à gauche (logo, nav, carte utilisateur en bas) + contenu `max-width:1240px`, padding `clamp(16px,3vw,36px) clamp(14px,3vw,40px)`.
- **Mobile (< 860px)** : header avec logo, nav en **pilule flottante** en bas (boutons ronds 48px, `bottom:16px`, fond verre flouté).
- Header de page : date du jour (13px, tx3, capitalisée) + titre H1 Sora 600 `clamp(22px,2.6vw,30px)`, à droite boutons ronds 40px (calendrier → Programmes, avatar → overlay Profil).
- 5 onglets : **Accueil, Programmes, Séance, Perfs, Réglages**. Profil = overlay (pas d'onglet).

Ordre de démarrage : **Auth → Questionnaire (si non complété) → App.**

## Screens / Views

### 1. Auth (création de compte / connexion)
- Plein écran, z-index au-dessus de tout.
- Desktop : split 50/50. Gauche = panneau marque (fond `s2` + glow accent radial) : logo, grille décorative 7×18 points (16px, gap 7, pleins = accent + glow, vides = anneau 1.5px fg .12), titre « Chaque séance compte. » (Sora 700 40px), sous-titre « Tes programmes, tes perfs et ta régularité au même endroit. ». Droite = formulaire centré `max-width:400px` (`margin:auto` pour scroller proprement sur petits écrans).
- Mobile : formulaire seul + tuile logo 56px.
- Formulaire : titre « Crée ton compte » / « Bon retour » (Sora 700 30px) ; boutons pilule 52px « Continuer avec Google » (fond blanc, logo G 4 couleurs) et « Continuer avec Apple » (fond noir) ; séparateur « ou avec ton email » ; champs 54px radius 16 avec icônes (mail / lock + œil afficher/masquer) ; message d'erreur rouge `#ff6b6b` ; lien « Mot de passe oublié ? » (mode connexion) ; CTA accent 56px avec spinner pendant le chargement ; lien bascule « Déjà un compte ? Se connecter » / « Pas encore de compte ? Créer un compte » ; mention CGU (inscription).
- Validation : email `/\S+@\S+\.\S+/`, mot de passe ≥ 6 caractères. Inscription email → questionnaire. Connexion → app si profil déjà complété.

### 2. Questionnaire de départ (onboarding)
Plein écran, colonne `max-width:520px`. Barre du haut : bouton retour rond 40px + 5 segments de progression (5px, accent quand fait) + compteur « n/5 ». CTA bas pilule 56px accent (« Commencer » / « Continuer » / « Démarrer »), opacité .4 si l'étape n'est pas valide. Transition entre étapes : slide X ±36px + fade, 380ms.
0. Bienvenue : tuile logo 76px, « Bienvenue sur FitnessBoii » + texte.
1. « Comment tu t'appelles ? » : input 62px Sora 22px (Entrée = continuer). Requis.
2. « Ton objectif principal ? » : Prise de masse / Perte de poids / Force / Remise en forme (cartes option : icône 44px, label, description, check). Requis.
3. « Ton niveau à la salle ? » : Débutant / Intermédiaire / Avancé. Requis.
4. « Tes mensurations » : steppers poids (kg) et taille (cm), boutons −/+ 48px, valeur Sora 700 38px.
5. « Quels jours tu t'entraînes ? » : 7 ronds L M M J V S D. ≥ 1 requis. Texte « X séances par semaine ».
6. Résumé : « C'est parti, {prénom} ! » + chips (objectif, niveau, séances/sem).
À la fin : objectif hebdo = nb de jours ; les programmes sont répartis cycliquement sur les jours choisis (Push, Pull, Legs, Push…).

### 3. Accueil
Grille `repeat(auto-fit, minmax(min(100%,320px),1fr))`, gap 14.
- **Carte « Séance du jour »** (hero) : fond glow accent radial + dégradé s2→bg2, pilule « Séance du jour » ou « Jour de repos », orbe 58px avec icône du programme, nom du programme Sora 700 `clamp(34px,4.4vw,46px)`, boutons « Commencer » (blanc/inv) + « Voir le programme » (ghost). Les jours de repos : « Repos » + prochaine séance.
- **Carte série** : flamme + « Série en cours » + nombre de semaines (Sora 800 44px accent, glow) + rangée de la semaine (7 ronds : check plein accent si séance, numéro du jour sinon, aujourd'hui = anneau accent). Une semaine compte dans la série à partir de 2 séances.
- **Présence à la salle** (pleine largeur) : heatmap 7 lignes × 24 semaines (14 en mobile) de **points** : rouge plein + glow = séance, anneau vide = repos, futur = opacité .25. Légende Séance/Repos. Apparition en pop colonne par colonne.
- **Records récents** : 3 cartes (icône groupe musculaire, nom, `poids kg × reps`, delta « +X kg en 2 mois »).

### 4. Programmes
- **Planning de la semaine** : 7 tuiles (jour, icône, nom du programme ou « Repos »). Cliquer un jour → rangée de pilules pour lui assigner un programme ou Repos.
- Onglets pilule des programmes + « + Nouveau » (pointillés).
- **Carte programme** : jours assignés (tags), tuile icône 48px, nom (Sora 700 `clamp(26px,3.4vw,34px)`), muscles, boutons « Lancer la séance » / « Modifier ».
- **Mode Modifier** : nom, muscles ciblés, choix d'icône (8), jours (un jour ne peut avoir qu'un programme), « Terminé », « Supprimer » (2 clics pour confirmer).
- Liste des exercices (grille `minmax(min(100%,300px),1fr)`) : icône groupe + numéro, nom, machine (icône location), `séries × reps`, poids. En mode Modifier : nom, machine, groupe musculaire (select), séries/reps/poids, supprimer + carte « Ajouter un exercice ».

### 5. Séance (focus, un exercice à la fois)
- Pas de séance active → cartes des programmes avec « Démarrer ».
- Layout : colonne principale (flex 1.6, min 380px) + colonne liste (flex 1, min 280px), empilées en mobile.
- **Carte header** : icône programme, « Séance en cours », nom, **chrono de durée** (Sora 700 28px, tabular-nums, mm:ss ou h:mm:ss) + barre segmentée (1 segment par exo : fait = accent + glow, courant = accent .45). Le **minuteur de repos** s'affiche dans cette carte pendant la séance (« Repos 1:30 », +15s, Passer).
- **Carte exercice courant** : « Exercice n / N », flèches précédent/suivant, tuile icône 60px, nom Sora 700 `clamp(24px,3vw,30px)`, machine, chips objectif (`4 × 8 · 80 kg`) et record. **Une seule perf à noter par exo** : 2 steppers « Charge max (kg) » (±2,5) et « Reps » (±1), valeur Sora 700 30px. Bouton 54px « Valider · exo suivant » → marque fait, passe au prochain exo non fait (slide X 28px), démarre le repos si l'option est active. Si déjà fait : « Mettre à jour ».
- **Liste** : tous les exos (rond statut 34px : check accent si fait, sinon icône groupe), sous-titre = perf notée ou objectif. Clic = aller à l'exo.
- « Abandonner » (ghost) / « Terminer » (blanc). Terminer enregistre la perf max par exo + la durée, notification « Séance enregistrée · X min ». **Si c'est la 1ère séance de la semaine sans photo → popup « Photo de la semaine ».**

### 6. Perfs (sobre : seulement ce qui a changé)
- **Évolution physique** : segmented « Début vs aujourd'hui » / « Mois par mois ». Comparatif 2 photos côte à côte (ratio 3/4, radius 18, légende en bas sur dégradé noir : « Début » / « Aujourd'hui » ou « Avant » / « Après » + date). Texte d'écart (« 22 semaines d'écart » ou « Dernière photo de chaque mois »). État vide si < 2 photos (ou < 2 mois). Bande horizontale : tuile « Cette sem. » / « Remplacer » + miniatures 76px avec suppression (2 clics).
- **Séances par semaine** : barres sur 12 semaines, ligne pointillée de l'objectif, semaine en cours en dégradé accent + glow, semaines à l'objectif en accent .75, autres en fg .1. Moyenne/sem. en haut à droite. Barres qui poussent depuis le bas (scaleY, stagger 35ms).
- **Ce qui a changé (30 derniers jours)** : 2 stats (séances ce mois vs mois dernier, records battus) + liste des exercices dont la perf max a changé (récent vs avant 30 jours, tri par variation relative) : icône, nom, « 70 kg → 80 kg », **sparkline** des 8 dernières séances (accent si ↑, gris si ↓), pilule delta.

### 7. Réglages
- **Apparence** : Sombre / Clair (cartes aperçu).
- **Thème de couleur** : 6 thèmes (cartes avec icône) : Rubis (défaut), Braise, Océan, Menthe, Violet, Solaire. Changement en fondu (View Transitions API si dispo).

### 8. Overlay Profil (clic avatar)
Desktop : modale centrée 440px ; mobile : bottom sheet (radius 26 en haut, slide depuis le bas). Contenu : avatar 56px + nom + email, champs prénom/email/poids/taille, séances/semaine (stepper), temps de repos (60s / 90s / 2min / 3min), toggles (minuteur de repos auto, rappels), boutons Se déconnecter, Refaire le questionnaire, Exporter (JSON), Réinitialiser (2 clics). Fermeture : clic fond ou ✕, anim inverse 240ms.

## Interactions & animations
- Changement d'onglet : titre fade + translateY 6px (320ms) ; cartes en cascade `translateY(14px) scale(.985)` → none, 460ms, stagger 45ms, easing `cubic-bezier(.2,.8,.2,1)`.
- Boutons : `:active` scale .95 (80ms), hover brightness 1.1, transitions couleur/fond 250ms.
- Toast : drop depuis le haut avec léger rebond (`cubic-bezier(.3,1.4,.5,1)`), 2,4s.
- Respecter `prefers-reduced-motion` (tout désactiver).

## State / données
- `settings` : name, email, bodyWeight, height, goal (séances/sem), rest (s), autoTimer, remind, theme, mode, goalType, level, loggedIn, onboarded.
- `programs[]` : { id, name, subtitle, icon, days:[0-6], exercises:[{ id, name, machine, group, sets, reps, weight }] } — groupes : pecs, dos, epaules, bras, jambes, abdos, cardio (chacun mappé à une icône).
- `session` : { programId, startedAt, cur, ex: { [exId]: { w, r, done } } }.
- `logs[]` : { date, programId, minutes } → alimente présence, série, barres.
- `perf` : { [exId]: [{ date, w, r }] } (1 entrée = perf max d'une séance).
- `photos[]` : { week (lundi ISO), date, src } — 1 par semaine. En prod : stockage fichier (bucket) + compression (~720px JPEG .8 dans le proto).
- Le proto contient des données factices (historique ~5 mois) pour la démo : à supprimer en prod.

## Design tokens
Polices : **Sora** (titres, chiffres : 600/700/800) + **Manrope** (texte : 400–700). Icônes : **Material Symbols Rounded** (FILL 1 pour les icônes pleines).

Variables CSS (préfixe `--fb-`, valeurs RGB sans `rgb()` pour composer l'alpha) :

| Thème | a | a3 | a4 | a6 | s1 | s2 | bg | bg2 |
|---|---|---|---|---|---|---|---|---|
| **Rubis (défaut)** | 236,40,78 | 255,92,124 | 255,130,154 | 150,14,48 | 58,22,32 | 36,12,20 | 12,8,10 | 20,11,15 |
| Braise | 255,74,36 | 255,122,61 | 255,138,99 | 184,41,14 | 60,32,20 | 36,18,11 | 12,9,8 | 20,13,10 |
| Océan | 42,140,255 | 92,170,255 | 124,188,255 | 16,70,170 | 22,36,62 | 12,20,38 | 8,10,14 | 12,15,22 |
| Menthe | 30,200,130 | 84,222,162 | 112,226,172 | 10,120,76 | 20,50,40 | 10,30,22 | 8,12,10 | 12,19,16 |
| Violet | 150,92,255 | 180,132,255 | 192,152,255 | 80,36,170 | 42,28,66 | 24,16,40 | 10,9,14 | 16,14,22 |
| Solaire | 255,176,32 | 255,196,80 | 255,206,110 | 170,100,8 | 60,44,16 | 36,26,10 | 12,10,7 | 20,16,10 |

(Valeurs complètes a2/a5/s3/s4 dans `THEMES` du fichier.)

Neutres sombre : tx `#f5efe9`, tx2 `#d4c2b6`, tx3 `#a8978c`, tx4 `#8e7d72`, fg 255,255,255 (overlays/bordures en alpha .04–.16), ink 0,0,0 (puits d'inputs .3–.35), card 22,16,14.
Neutres clair : tx `#18130f`, tx2 `#4b423c`, tx3 `#766a62`, tx4 `#9b8f87`, fg 28,20,14, ink 226,219,213, surfaces s1/s2/s4/bg2 = blanc, bg 245,243,240, line `rgba(28,20,14,.08)`, cardsh `0 1px 2px rgba(28,20,14,.04), 0 12px 32px -12px rgba(28,20,14,.12)`, popsh `0 18px 44px -10px rgba(28,20,14,.22)`, gk .42 (multiplicateur des glows accent), a4/a5 = a (contraste texte).

**Logo** : toujours en Rubis (tuile dégradé 135° `rgb(255,92,124)` → `rgb(236,40,78)` + glow), quel que soit le thème.

Cartes : radius 20–26px, fond `linear-gradient(160deg, rgba(s1,.45), rgba(card,.78))`, bordure 1px `rgba(a3,.10)`. Pilules/CTA : radius 99px. Tuiles icônes : 36–60px, radius 12–18px. Danger : `#ff8a73` sur `rgba(255,90,70,.1–.3)`.

## Assets
Aucune image. Icônes Material Symbols (Google Fonts). Logos Google/Apple en SVG inline dans le fichier (utiliser les kits officiels en prod). Photos de progression = fournies par l'utilisateur.

## Files
- `design/FitnessBoii.dc.html` — prototype complet (template + logique `class Component`).
- `design/support.js` — runtime nécessaire pour ouvrir le prototype.
