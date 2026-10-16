export type Group = 'pecs' | 'dos' | 'epaules' | 'bras' | 'jambes' | 'abdos' | 'cardio';
export type GoalType = 'masse' | 'seche' | 'force' | 'forme';
export type Level = 'debutant' | 'inter' | 'avance';
export type ThemeId = 'rubis' | 'braise' | 'ocean' | 'menthe' | 'violet' | 'solaire';
export type Mode = 'dark' | 'light';
export type RestSeconds = 60 | 90 | 120 | 180;
export type Split = 'ppl' | 'ul' | 'fb' | 'custom';

export interface Profile {
  name: string;
  goalType: GoalType | null;
  level: Level | null;
  /** Type de programme choisi à l'onboarding. */
  split: Split | null;
  bodyWeight: number;
  height: number;
  /** Objectif de séances par semaine (1–7). */
  goal: number;
  rest: RestSeconds;
  autoTimer: boolean;
  /** Ancien réglage « rappels » (jamais branché), gardé pour les profils existants. */
  remind: boolean;
  /** Son + vibration à la fin du repos. */
  sound: boolean;
  theme: ThemeId;
  mode: Mode;
  onboarded: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  machine: string;
  group: Group;
  sets: number;
  reps: number;
  /** Charge cible ; 0 = poids du corps ou « auto » (dernière perf). */
  weight: number;
  /** Repos spécifique en secondes ; absent/0 = réglage global. */
  rest?: number;
  /** Consigne perso : réglage machine, prise, tempo… */
  note?: string;
}

export interface Program {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  /** 0 = lundi … 6 = dimanche. */
  days: number[];
  order: number;
  exercises: Exercise[];
}

export interface PerfEntry {
  w: number;
  r: number;
  name: string;
  group: Group;
}

export interface SessionLog {
  /** "YYYY-MM-DD", aussi l'ID du document. */
  date: string;
  programId: string;
  programName: string;
  minutes: number;
  perf: Record<string, PerfEntry>;
}

export interface SetLog {
  w: number;
  r: number;
}

export interface SessionEx {
  /** Valeurs saisies pour la prochaine série. */
  w: number;
  r: number;
  /** Toutes les séries prévues sont faites. */
  done: boolean;
  /** Séries validées (absent sur les séances d'avant le suivi par série). */
  sets?: SetLog[];
}

export interface ActiveSession {
  programId: string;
  /** Epoch ms. */
  startedAt: number;
  cur: number;
  ex: Record<string, SessionEx>;
  /** Dernière action (epoch ms) : repère une séance oubliée. */
  lastAt?: number;
  /** Exercices modifiés pour cette séance seulement ; absent = ceux du programme. */
  plan?: Exercise[];
}

export interface PhotoMeta {
  /** Lundi ISO de la semaine, aussi l'ID du document. */
  week: string;
  date: string;
  /** Version (ms) : change quand la photo de la semaine est remplacée. */
  v: number;
}

export interface PerfPoint {
  date: string;
  w: number;
  r: number;
}
