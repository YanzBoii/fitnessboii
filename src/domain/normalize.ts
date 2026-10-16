// Normalisation des données avant écriture : mêmes bornes que firestore.rules,
// et validation de ce que les règles ne peuvent pas vérifier (éléments de listes/maps).
import { GROUP_IDS, LIMITS, PROG_ICONS, REST_OPTIONS, THEME_IDS } from './constants';
import type { ActiveSession, Exercise, Group, Profile, Program, RestSeconds, SessionLog, Split } from './types';

const SPLITS: Split[] = ['ppl', 'ul', 'fb', 'custom'];

const clamp = (v: unknown, min: number, max: number, fallback = min) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};
const int = (v: unknown, min: number, max: number, fallback = min) => Math.round(clamp(v, min, max, fallback));
const half = (v: number) => Math.round(v * 2) / 2;
/** Charges au quart de kilo (disques de 1,25 kg). */
const kg = (v: unknown) => Math.round(clamp(v, 0, 1000, 0) * 4) / 4;
const str = (v: unknown, max: number, fallback = '') => {
  const s = typeof v === 'string' ? v.trim().slice(0, max) : '';
  return s || fallback;
};
export const safeId = (id: string) => /^[A-Za-z0-9_-]{1,40}$/.test(id);
const group = (g: unknown): Group => (GROUP_IDS.includes(g as Group) ? (g as Group) : 'pecs');

export function normalizeExercise(e: Exercise): Exercise {
  const rest = int(e.rest, 0, 600, 0), note = str(e.note, 120);
  return {
    id: safeId(e.id) ? e.id : 'e' + Math.random().toString(36).slice(2, 10),
    name: str(e.name, 60, 'Exercice'),
    machine: str(e.machine, 60),
    group: group(e.group),
    sets: int(e.sets, 1, 20, 3),
    reps: int(e.reps, 0, 500, 10),
    weight: kg(e.weight),
    ...(rest ? { rest } : {}),
    ...(note ? { note } : {})
  };
}

export function normalizeProgram(p: Program): Program {
  return {
    id: p.id,
    name: str(p.name, 60, 'Programme'),
    subtitle: str(p.subtitle, 80),
    icon: PROG_ICONS.includes(p.icon) ? p.icon : 'fitness_center',
    days: [...new Set((p.days || []).filter(d => Number.isInteger(d) && d >= 0 && d <= 6))].sort(),
    order: int(p.order, 0, 1000, 0),
    exercises: (p.exercises || []).slice(0, LIMITS.exercises).map(normalizeExercise)
  };
}

/** Profil partiel prêt pour Firestore (pas de null : les règles les refusent). */
export function normalizeProfile(p: Partial<Profile>): Partial<Profile> {
  const o: Partial<Profile> = {};
  if (p.name !== undefined) o.name = str(p.name, 40);
  if (p.goalType) o.goalType = p.goalType;
  if (p.level) o.level = p.level;
  if (p.split && SPLITS.includes(p.split)) o.split = p.split;
  if (p.bodyWeight !== undefined) o.bodyWeight = half(clamp(p.bodyWeight, 20, 400, 75));
  if (p.height !== undefined) o.height = int(p.height, 100, 250, 175);
  if (p.goal !== undefined) o.goal = int(p.goal, 1, 7, 3);
  if (p.rest !== undefined) o.rest = (REST_OPTIONS as readonly number[]).includes(p.rest) ? p.rest : (90 as RestSeconds);
  if (p.autoTimer !== undefined) o.autoTimer = !!p.autoTimer;
  if (p.remind !== undefined) o.remind = !!p.remind;
  if (p.sound !== undefined) o.sound = !!p.sound;
  if (p.theme !== undefined) o.theme = THEME_IDS.includes(p.theme) ? p.theme : 'rubis';
  if (p.mode !== undefined) o.mode = p.mode === 'light' ? 'light' : 'dark';
  if (p.onboarded !== undefined) o.onboarded = !!p.onboarded;
  return o;
}

export function normalizeSession(s: ActiveSession): ActiveSession {
  const ex: ActiveSession['ex'] = {};
  Object.entries(s.ex).slice(0, LIMITS.exercises).forEach(([id, x]) => {
    if (!safeId(id)) return;
    ex[id] = { w: kg(x.w), r: int(x.r, 0, 500, 0), done: !!x.done };
    if (Array.isArray(x.sets)) ex[id].sets = x.sets.slice(0, 20).map(t => ({ w: kg(t?.w), r: int(t?.r, 0, 500, 0) }));
  });
  return {
    programId: s.programId, startedAt: Math.round(s.startedAt), cur: int(s.cur, 0, 100, 0), ex,
    ...(s.lastAt ? { lastAt: Math.round(s.lastAt) } : {}),
    ...(Array.isArray(s.plan) ? { plan: s.plan.slice(0, LIMITS.exercises).map(normalizeExercise) } : {})
  };
}

export function normalizeLog(l: SessionLog): SessionLog {
  const perf: SessionLog['perf'] = {};
  Object.entries(l.perf).slice(0, LIMITS.exercises).forEach(([id, p]) => {
    if (safeId(id)) perf[id] = { w: kg(p.w), r: int(p.r, 0, 500, 0), name: str(p.name, 60, 'Exercice'), group: group(p.group) };
  });
  return { date: l.date, programId: l.programId, programName: str(l.programName, 60), minutes: int(l.minutes, 1, 600, 1), perf };
}
