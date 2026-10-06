export type Group = 'pecs' | 'dos' | 'epaules' | 'bras' | 'jambes' | 'abdos' | 'cardio';
export type GoalType = 'masse' | 'seche' | 'force' | 'forme';
export type Level = 'debutant' | 'inter' | 'avance';
export type ThemeId = 'rubis' | 'braise' | 'ocean' | 'menthe' | 'violet' | 'solaire';
export type Mode = 'dark' | 'light';
export type RestSeconds = 60 | 90 | 120 | 180;

export interface Profile {
  name: string;
  goalType: GoalType | null;
  level: Level | null;
  bodyWeight: number;
  height: number;
  /** Objectif de séances par semaine (1–7). */
  goal: number;
  rest: RestSeconds;
  autoTimer: boolean;
  remind: boolean;
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
  /** 0 = poids du corps. */
  weight: number;
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

export interface SessionEx {
  w: number;
  r: number;
  done: boolean;
}

export interface ActiveSession {
  programId: string;
  /** Epoch ms. */
  startedAt: number;
  cur: number;
  ex: Record<string, SessionEx>;
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
