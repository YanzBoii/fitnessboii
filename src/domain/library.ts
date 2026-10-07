// Bibliothèque d'exercices (majoritairement sur machines), modèles de programmes et splits d'onboarding.
import { GROUP_LABELS } from './constants';
import type { Exercise, Group, Program, Split } from './types';

/** [id, nom, machine, groupe, séries, reps] — les ids sont stables : l'historique des perfs y est rattaché. */
type LibEntry = [string, string, string, Group, number, number];

export const LIB: LibEntry[] = [
  ['l-pf','Pec fly','Machine pec fly / butterfly','pecs',3,12],['l-cpm','Chest press','Machine chest press','pecs',4,10],['l-cpi','Chest press incliné','Machine incliné convergente','pecs',3,10],
  ['ec','Écarté poulie','Poulie vis-à-vis','pecs',3,12],['dc','Développé couché','Banc plat — barre','pecs',4,8],['di','Développé incliné','Smith machine','pecs',3,10],
  ['l-dh','Développé haltères','Banc plat — haltères','pecs',3,10],['l-dpm','Dips assistés','Machine dips assistée','pecs',3,10],
  ['tv','Tirage vertical','Lat pulldown','dos',4,10],['ro','Rowing assis','Machine rowing','dos',4,10],['l-rp','Tirage horizontal poulie','Poulie basse — triangle','dos',3,12],
  ['l-tb','Rowing T-bar','Machine T-bar','dos',4,10],['l-tc','Tirage convergent','Machine tirage haut convergent','dos',3,10],['l-ta','Tractions assistées','Machine tractions assistées','dos',3,8],
  ['tr','Tractions','Barre fixe','dos',3,8],['l-pov','Pull-over poulie','Poulie haute — barre droite','dos',3,12],['l-lom','Extension lombaire','Banc à lombaires','dos',3,15],
  ['dm','Shoulder press','Machine épaules','epaules',3,10],['l-elm','Élévations latérales machine','Machine élévations latérales','epaules',3,12],
  ['l-el','Élévations latérales','Haltères','epaules',4,12],['l-rf','Reverse fly','Machine pec fly (sens inverse)','epaules',3,12],['fp','Face pull','Poulie haute — corde','epaules',3,15],
  ['l-elp','Élévations latérales poulie','Poulie basse — poignée','epaules',3,12],
  ['l-cum','Curl biceps machine','Machine curl biceps','bras',3,12],['cu','Curl pupitre','Banc Larry Scott','bras',3,10],['l-cpo','Curl poulie','Poulie basse — barre','bras',3,12],
  ['l-cm','Curl marteau','Haltères','bras',3,12],['tri','Extension triceps','Poulie haute — corde','bras',3,12],['l-trm','Triceps machine','Machine dips / triceps','bras',3,12],
  ['l-bf','Barre au front','Banc + barre EZ','bras',3,10],
  ['pr','Presse à cuisses','Presse 45°','jambes',4,10],['l-hs','Hack squat','Machine hack squat','jambes',4,10],['le','Leg extension','Machine leg extension','jambes',3,12],
  ['lc','Leg curl allongé','Machine ischios allongé','jambes',3,12],['l-lca','Leg curl assis','Machine ischios assis','jambes',3,12],['l-add','Adducteurs','Machine adducteurs','jambes',3,15],
  ['l-abd','Abducteurs','Machine abducteurs','jambes',3,15],['l-glu','Kickback fessiers','Machine fessiers','jambes',3,12],['l-ht','Hip thrust','Machine hip thrust','jambes',4,10],
  ['sq','Squat','Rack à squat','jambes',4,6],['l-ss','Squat Smith','Smith machine','jambes',4,8],['mo','Mollets debout','Machine mollets debout','jambes',4,15],
  ['l-mas','Mollets assis','Machine mollets assis','jambes',4,15],
  ['l-abm','Crunch machine','Machine abdos','abdos',3,15],['l-cp','Crunch poulie','Poulie haute — corde','abdos',3,15],['l-rj','Relevés de jambes','Chaise romaine','abdos',3,12],
  ['l-rot','Rotation buste','Machine rotation','abdos',3,15],
  ['l-tdc','Tapis de course','Tapis','cardio',1,15],['l-ve','Vélo','Vélo assis','cardio',1,20],['l-ell','Vélo elliptique','Elliptique','cardio',1,20],
  ['l-ra','Rameur','Rameur','cardio',1,10],['l-esc','Escalier','Stairmaster','cardio',1,10]
];

/** Icône de programme selon le groupe musculaire dominant. */
export const GROUP_PROG_ICON: Record<Group, string> = {
  pecs: 'fitness_center', dos: 'rowing', epaules: 'sports_gymnastics', bras: 'sports_martial_arts',
  jambes: 'directions_run', abdos: 'self_improvement', cardio: 'sprint'
};

/** [nom, icône, ids d'exercices]. */
export const TEMPLATES: [string, string, string[]][] = [
  ['Push', 'fitness_center', ['l-cpm', 'l-cpi', 'l-pf', 'dm', 'l-elm', 'tri']],
  ['Pull', 'rowing', ['tv', 'ro', 'l-tb', 'l-rf', 'l-cum', 'l-cm']],
  ['Legs', 'directions_run', ['pr', 'l-hs', 'le', 'l-lca', 'l-add', 'mo']],
  ['Haut du corps', 'sports_gymnastics', ['l-cpm', 'tv', 'dm', 'ro', 'l-cum', 'tri']],
  ['Bas du corps', 'directions_run', ['pr', 'le', 'lc', 'l-ht', 'l-abd', 'mo']],
  ['Full body', 'bolt', ['pr', 'l-cpm', 'ro', 'dm', 'l-abm']]
];

/** [id, libellé, description, icône, programmes créés]. */
export const OB_SPLITS: [Split, string, string, string, string[]][] = [
  ['ppl', 'Push / Pull / Legs', '3 séances qui tournent : poussée, tirage, jambes', 'splitscreen', ['Push', 'Pull', 'Legs']],
  ['ul', 'Haut / Bas du corps', '2 séances : haut du corps et bas du corps', 'swap_vert', ['Haut du corps', 'Bas du corps']],
  ['fb', 'Full body', '1 séance complète, tout le corps à chaque fois', 'accessibility_new', ['Full body']],
  ['custom', 'Je crée les miens', 'On part de zéro, tu ajoutes tes programmes', 'edit_note', []]
];

/** Recherche insensible à la casse et aux accents. */
export const norm = (s: string) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export const libEx = (l: LibEntry): Exercise => ({ id: l[0], name: l[1], machine: l[2], group: l[3], sets: l[4], reps: l[5], weight: 0 });

export const libById = (id: string) => LIB.find(l => l[0] === id);

/** Groupes triés par nombre d'exercices (le plus représenté d'abord). */
export function dominantGroups(exercises: Exercise[]): Group[] {
  const counts: Partial<Record<Group, number>> = {};
  exercises.forEach(e => { counts[e.group] = (counts[e.group] || 0) + 1; });
  return (Object.keys(counts) as Group[]).sort((x, y) => counts[y]! - counts[x]!);
}

/** Sous-titre auto : « Pecs · Épaules · Bras ». */
export const autoSubtitle = (exercises: Exercise[]) => dominantGroups(exercises).slice(0, 3).map(g => GROUP_LABELS[g]).join(' · ');

export const autoIcon = (exercises: Exercise[]) => GROUP_PROG_ICON[dominantGroups(exercises)[0]] || 'bolt';

/** Programme créé depuis un modèle (onboarding). */
export function programFromTemplate(name: string, id: string, order: number): Program | null {
  const t = TEMPLATES.find(x => x[0] === name);
  if (!t) return null;
  const exercises = t[2].map(libById).filter((l): l is LibEntry => !!l).map(libEx);
  return { id, name, icon: t[1], subtitle: autoSubtitle(exercises), days: [], order, exercises };
}
