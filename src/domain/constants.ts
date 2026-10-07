import type { Exercise, GoalType, Group, Level, Profile, Program, ThemeId } from './types';

export const GROUPS: Record<Group, string> = {
  pecs: 'fitness_center', dos: 'rowing', epaules: 'accessibility_new', bras: 'sports_martial_arts',
  jambes: 'directions_run', abdos: 'self_improvement', cardio: 'monitor_heart'
};
export const GROUP_LABELS: Record<Group, string> = {
  pecs: 'Pecs', dos: 'Dos', epaules: 'Épaules', bras: 'Bras', jambes: 'Jambes', abdos: 'Abdos', cardio: 'Cardio'
};
export const GROUP_IDS = Object.keys(GROUPS) as Group[];
export const groupIcon = (g: string) => GROUPS[g as Group] || 'fitness_center';

export const PROG_ICONS = ['fitness_center', 'rowing', 'directions_run', 'sports_gymnastics',
  'local_fire_department', 'bolt', 'self_improvement', 'sprint'];

export const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
export const DAY_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
export const DAY_NAMES = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

export const OB_GOALS: [GoalType, string, string, string][] = [
  ['masse', 'Prise de masse', 'Gagner du muscle', 'fitness_center'],
  ['seche', 'Perte de poids', 'Sécher, perdre du gras', 'local_fire_department'],
  ['force', 'Force', 'Soulever plus lourd', 'bolt'],
  ['forme', 'Remise en forme', 'Bouger, être en forme', 'favorite']
];
export const OB_LEVELS: [Level, string, string, string][] = [
  ['debutant', 'Débutant', 'Moins de 6 mois de salle', 'eco'],
  ['inter', 'Intermédiaire', '6 mois à 2 ans', 'trending_up'],
  ['avance', 'Avancé', 'Plus de 2 ans', 'military_tech']
];

export const REST_OPTIONS = [60, 90, 120, 180] as const;

export interface ThemeVars {
  a: string; a2: string; a3: string; a4: string; a5: string; a6: string;
  s1: string; s2: string; s3: string; s4: string; bg: string; bg2: string;
}
export interface Theme { id: ThemeId; icon: string; name: string; v: ThemeVars }

export const THEMES: Theme[] = [
  { id: 'rubis', icon: 'diamond', name: 'Rubis', v: { a: '236,40,78', a2: '220,30,96', a3: '255,92,124', a4: '255,130,154', a5: '255,182,198', a6: '150,14,48', s1: '58,22,32', s2: '36,12,20', s3: '110,15,40', s4: '40,16,24', bg: '12,8,10', bg2: '20,11,15' } },
  { id: 'braise', icon: 'local_fire_department', name: 'Braise', v: { a: '255,74,36', a2: '255,59,47', a3: '255,122,61', a4: '255,138,99', a5: '255,176,138', a6: '184,41,14', s1: '60,32,20', s2: '36,18,11', s3: '120,30,10', s4: '40,24,18', bg: '12,9,8', bg2: '20,13,10' } },
  { id: 'ocean', icon: 'waves', name: 'Océan', v: { a: '42,140,255', a2: '32,112,240', a3: '92,170,255', a4: '124,188,255', a5: '172,212,255', a6: '16,70,170', s1: '22,36,62', s2: '12,20,38', s3: '15,50,120', s4: '16,24,40', bg: '8,10,14', bg2: '12,15,22' } },
  { id: 'menthe', icon: 'eco', name: 'Menthe', v: { a: '30,200,130', a2: '20,182,112', a3: '84,222,162', a4: '112,226,172', a5: '172,240,206', a6: '10,120,76', s1: '20,50,40', s2: '10,30,22', s3: '10,90,60', s4: '14,36,28', bg: '8,12,10', bg2: '12,19,16' } },
  { id: 'violet', icon: 'nights_stay', name: 'Violet', v: { a: '150,92,255', a2: '128,72,240', a3: '180,132,255', a4: '192,152,255', a5: '216,192,255', a6: '80,36,170', s1: '42,28,66', s2: '24,16,40', s3: '70,30,140', s4: '28,20,44', bg: '10,9,14', bg2: '16,14,22' } },
  { id: 'solaire', icon: 'wb_sunny', name: 'Solaire', v: { a: '255,176,32', a2: '255,150,20', a3: '255,196,80', a4: '255,206,110', a5: '255,226,170', a6: '170,100,8', s1: '60,44,16', s2: '36,26,10', s3: '120,80,10', s4: '40,30,14', bg: '12,10,7', bg2: '20,16,10' } }
];
export const THEME_IDS = THEMES.map(t => t.id);

const ex = (id: string, name: string, machine: string, sets: number, reps: number, weight: number, group: Group): Exercise =>
  ({ id, name, machine, sets, reps, weight, group });

/** Programmes modèles créés à l'onboarding. */
export const DEFAULT_PROGRAMS: Program[] = [
  { id: 'push', name: 'Push', icon: 'fitness_center', days: [], order: 0, subtitle: 'Pecs · Épaules · Triceps', exercises: [
    ex('dc', 'Développé couché', 'Banc plat — barre', 4, 8, 80, 'pecs'),
    ex('di', 'Développé incliné', 'Smith machine', 3, 10, 60, 'pecs'),
    ex('ec', 'Écarté poulie', 'Poulie vis-à-vis', 3, 12, 15, 'pecs'),
    ex('dm', 'Développé militaire', 'Machine épaules', 3, 10, 40, 'epaules'),
    ex('tri', 'Extension triceps', 'Poulie haute — corde', 3, 12, 25, 'bras')] },
  { id: 'pull', name: 'Pull', icon: 'rowing', days: [], order: 1, subtitle: 'Dos · Biceps', exercises: [
    ex('tv', 'Tirage vertical', 'Lat pulldown', 4, 10, 65, 'dos'),
    ex('ro', 'Rowing assis', 'Machine rowing', 4, 10, 60, 'dos'),
    ex('tr', 'Tractions', 'Barre fixe', 3, 8, 0, 'dos'),
    ex('fp', 'Face pull', 'Poulie haute — corde', 3, 15, 20, 'epaules'),
    ex('cu', 'Curl pupitre', 'Banc Larry Scott', 3, 10, 25, 'bras')] },
  { id: 'legs', name: 'Legs', icon: 'directions_run', days: [], order: 2, subtitle: 'Quadris · Ischios · Mollets', exercises: [
    ex('sq', 'Squat', 'Rack à squat', 4, 6, 100, 'jambes'),
    ex('pr', 'Presse à cuisses', 'Presse 45°', 4, 10, 180, 'jambes'),
    ex('lc', 'Leg curl', 'Machine ischios allongé', 3, 12, 45, 'jambes'),
    ex('le', 'Leg extension', 'Leg extension', 3, 12, 55, 'jambes'),
    ex('mo', 'Mollets debout', 'Machine mollets', 4, 15, 70, 'jambes')] }
];

export const DEFAULT_PROFILE: Profile = {
  name: '', goalType: null, level: null, split: null, bodyWeight: 75, height: 175, goal: 3, rest: 90,
  autoTimer: true, remind: false, theme: 'rubis', mode: 'dark', onboarded: false
};

export const LIMITS = { exercises: 40, programs: 20, photoBytes: 900_000 } as const;

export const newId = (prefix: string) =>
  prefix + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
