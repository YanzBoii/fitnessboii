import { dateKey } from './dates';
import type { ActiveSession, Exercise, PerfPoint, Program, SessionEx, SessionLog, SetLog } from './types';

/** Au-delà, une séance sans aucune action est considérée comme oubliée. */
export const STALE_MS = 3 * 3600_000;

/** État de départ d'un exercice : la dernière perf notée, sinon l'objectif. */
export function initEx(e: Exercise, history: Record<string, PerfPoint[]>): SessionEx {
  const last = (history[e.id] || []).slice(-1)[0];
  return { w: last ? last.w : +e.weight || 0, r: +e.reps || 0, done: false, sets: [] };
}

/** Nouvelle séance : chaque exo démarre sur la dernière perf notée, sinon sur l'objectif. */
export function startSession(p: Program, history: Record<string, PerfPoint[]>, now: number): ActiveSession {
  const ex: ActiveSession['ex'] = {};
  p.exercises.forEach(e => { ex[e.id] = initEx(e, history); });
  return { programId: p.id, startedAt: now, lastAt: now, cur: 0, ex };
}

/** Exercices de la séance : ceux modifiés en cours de séance, sinon ceux du programme. */
export const sessionExercises = (p: Program, s: ActiveSession) => s.plan ?? p.exercises;

/** Séries validées ; les séances d'avant le suivi par série comptent pour une série. */
export const doneSets = (x: SessionEx | undefined): SetLog[] => (!x ? [] : x.sets ?? (x.done ? [{ w: x.w, r: x.r }] : []));

/** Meilleure série : la plus lourde, puis le plus de reps. */
export function bestSet(sets: SetLog[]): SetLog | null {
  return sets.reduce<SetLog | null>((b, s) => (!b || s.w > b.w || (s.w === b.w && s.r > b.r) ? s : b), null);
}

/** Index du prochain exercice non fait après `from` (circulaire) ; `from` si tout est fait. */
export function nextTodo(order: string[], ex: Record<string, SessionEx>, from: number) {
  for (let k = 1; k <= order.length; k++) {
    const j = (from + k) % order.length;
    if (!ex[order[j]]?.done) return j;
  }
  return from;
}

/**
 * Valide une série de l'exercice `order[ci]`. Quand toutes les séries prévues sont faites,
 * l'exercice passe à « fait » et la séance avance au prochain exercice non fait.
 */
export function logSet(s: ActiveSession, order: Exercise[], ci: number, now: number) {
  const e = order[ci];
  const x = s.ex[e.id];
  const sets = [...doneSets(x), { w: +x.w || 0, r: +x.r || 0 }];
  const done = sets.length >= Math.max(1, +e.sets || 1);
  const ex = { ...s.ex, [e.id]: { ...x, sets, done } };
  const cur = done && !x.done ? nextTodo(order.map(o => o.id), ex, ci) : ci;
  return { session: { ...s, ex, cur, lastAt: now }, exerciseDone: done && !x.done, allDone: order.every(o => ex[o.id]?.done) };
}

/** Retire la série `k` ; l'exercice redevient « à faire » s'il manque des séries. */
export function removeSet(s: ActiveSession, e: Exercise, k: number, now: number): ActiveSession {
  const x = s.ex[e.id];
  const sets = doneSets(x).filter((_, i) => i !== k);
  return { ...s, ex: { ...s.ex, [e.id]: { ...x, sets, done: sets.length >= Math.max(1, +e.sets || 1) } }, lastAt: now };
}

/** Séance oubliée : aucune action depuis plus de 3 h. */
export const isStale = (s: ActiveSession, now: number) => now - (s.lastAt ?? s.startedAt) > STALE_MS;

/**
 * Log de la séance : meilleure série de chaque exercice ayant au moins une série validée.
 * Daté du jour où la séance a commencé ; une séance oubliée s'arrête à sa dernière action.
 */
export function buildLog(p: Program, s: ActiveSession, now: number): SessionLog {
  const perf: SessionLog['perf'] = {};
  sessionExercises(p, s).forEach(e => {
    const b = bestSet(doneSets(s.ex[e.id]));
    if (b) perf[e.id] = { w: b.w, r: b.r, name: e.name, group: e.group };
  });
  const end = isStale(s, now) ? (s.lastAt ?? s.startedAt) : now;
  return {
    date: dateKey(new Date(s.startedAt)), programId: p.id, programName: p.name, perf,
    minutes: Math.min(600, Math.max(1, Math.round((end - s.startedAt) / 60000)))
  };
}


/** Deux séances le même jour : meilleure perf par exo, minutes cumulées (≤ 600). */
export function mergeLog(existing: SessionLog | null, next: SessionLog): SessionLog {
  if (!existing) return next;
  const perf = { ...existing.perf };
  Object.entries(next.perf).forEach(([id, p]) => {
    const o = perf[id];
    if (!o || p.w > o.w || (p.w === o.w && p.r >= o.r)) perf[id] = p;
  });
  return { ...next, perf, minutes: Math.min(600, existing.minutes + next.minutes) };
}
