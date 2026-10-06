import type { ActiveSession, PerfPoint, Program, SessionEx, SessionLog } from './types';

/** Nouvelle séance : chaque exo démarre sur la dernière perf notée, sinon sur l'objectif. */
export function startSession(p: Program, history: Record<string, PerfPoint[]>, now: number): ActiveSession {
  const ex: ActiveSession['ex'] = {};
  p.exercises.forEach(e => {
    const last = (history[e.id] || []).slice(-1)[0];
    ex[e.id] = { w: last ? last.w : +e.weight || 0, r: +e.reps || 0, done: false };
  });
  return { programId: p.id, startedAt: now, cur: 0, ex };
}

/** Index du prochain exercice non fait après `from` (circulaire) ; `from` si tout est fait. */
export function nextTodo(order: string[], ex: Record<string, SessionEx>, from: number) {
  for (let k = 1; k <= order.length; k++) {
    const j = (from + k) % order.length;
    if (!ex[order[j]]?.done) return j;
  }
  return from;
}

/** Log de la séance : uniquement les exercices validés. */
export function buildLog(p: Program, s: ActiveSession, date: string, now: number): SessionLog {
  const perf: SessionLog['perf'] = {};
  p.exercises.forEach(e => {
    const x = s.ex[e.id];
    if (x?.done) perf[e.id] = { w: +x.w || 0, r: +x.r || 0, name: e.name, group: e.group };
  });
  return {
    date, programId: p.id, programName: p.name, perf,
    minutes: Math.max(1, Math.round((now - s.startedAt) / 60000))
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
