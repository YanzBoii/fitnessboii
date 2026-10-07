import { addDays, dateKey, mondayOf } from './dates';
import type { Exercise, Group, PerfPoint, SessionLog } from './types';

export const attendedSet = (logs: SessionLog[]) => new Set(logs.map(l => l.date));

const countWeek = (attended: Set<string>, monday: Date) => {
  let n = 0;
  for (let i = 0; i < 7; i++) if (attended.has(dateKey(addDays(monday, i)))) n++;
  return n;
};

/** Nombre de semaines consécutives avec ≥ 2 séances. La semaine en cours ne casse pas la série. */
export function streakWeeks(attended: Set<string>, today: Date) {
  const mon = mondayOf(today);
  let streak = 0;
  for (let w = 0; w < 520; w++) {
    if (countWeek(attended, addDays(mon, -7 * w)) >= 2) streak++;
    else if (w > 0) break;
  }
  return streak;
}

export interface DayCell { key: string; date: Date; done: boolean; isToday: boolean }

export function weekRow(attended: Set<string>, today: Date): DayCell[] {
  const mon = mondayOf(today), tk = dateKey(today);
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(mon, i), key = dateKey(d);
    return { key, date: d, done: attended.has(key), isToday: key === tk };
  });
}

export interface HeatCell { key: string; date: Date; on: boolean; future: boolean; isToday: boolean }

/** 7 lignes (lun → dim) × cols semaines ; la dernière colonne est la semaine courante. */
export function heatmap(attended: Set<string>, today: Date, cols: number): HeatCell[][] {
  const start = addDays(mondayOf(today), -7 * (cols - 1)), tk = dateKey(today);
  return Array.from({ length: 7 }, (_, di) => Array.from({ length: cols }, (_, wi) => {
    const d = addDays(start, wi * 7 + di), key = dateKey(d);
    return { key, date: d, on: attended.has(key), isToday: key === tk, future: d > today && key !== tk };
  }));
}

export const heatStart = (today: Date, cols: number) => addDays(mondayOf(today), -7 * (cols - 1));

export interface WeekBar { monday: Date; n: number; current: boolean; hit: boolean }

export function weeklyBars(attended: Set<string>, today: Date, goal: number): WeekBar[] {
  const mon = mondayOf(today);
  return Array.from({ length: 12 }, (_, i) => {
    const m = addDays(mon, -7 * (11 - i)), n = countWeek(attended, m);
    return { monday: m, n, current: i === 11, hit: n >= Math.max(1, goal) };
  });
}

/** Historique de la perf max par exercice, trié par date. */
export function perfHistory(logs: SessionLog[]): Record<string, PerfPoint[]> {
  const h: Record<string, PerfPoint[]> = {};
  [...logs].sort((a, b) => (a.date < b.date ? -1 : 1)).forEach(l => {
    Object.entries(l.perf || {}).forEach(([id, p]) => {
      (h[id] ||= []).push({ date: l.date, w: +p.w || 0, r: +p.r || 0 });
    });
  });
  return h;
}

/** Meilleure perf : poids max, puis reps max à poids égal. */
export const best = (points: PerfPoint[]) =>
  points.reduce<PerfPoint | null>((a, b) => (!a || b.w > a.w || (b.w === a.w && b.r > a.r) ? b : a), null);

export interface Change {
  id: string; name: string; group: Group;
  from: number; to: number; delta: number; unit: 'kg' | 'reps'; up: boolean; score: number;
  /** Points de la sparkline "x,y x,y" dans un viewBox 100×34. */
  spark: string; area: string; lastY: string;
}

/** Exercices dont la perf max a changé : 30 derniers jours vs avant. */
export function changes30d(history: Record<string, PerfPoint[]>, exercises: Exercise[], today: Date): Change[] {
  const cut = dateKey(addDays(today, -30));
  const out: Change[] = [];
  const seen = new Set<string>();
  for (const e of exercises) {
    if (seen.has(e.id)) continue;
    seen.add(e.id);
    const hh = history[e.id] || [];
    const rec = hh.filter(x => x.date >= cut), old = hh.filter(x => x.date < cut);
    if (!rec.length || !old.length) continue;
    // Poids du corps = aucune perf notée avec une charge (une charge cible à 0 veut aussi dire « auto »).
    const bw = hh.every(x => !x.w);
    const key = (x: PerfPoint) => (bw ? x.r : x.w);
    const to = Math.max(...rec.map(key)), from = Math.max(...old.map(key));
    const delta = Math.round((to - from) * 10) / 10;
    if (!delta) continue;
    const vs = hh.slice(-8).map(key);
    const mx = Math.max(...vs), mn = Math.min(...vs), rg = mx - mn || 1;
    const pts = vs.map((v, i) => [vs.length > 1 ? (i / (vs.length - 1)) * 100 : 50, 29 - ((v - mn) / rg) * 24]);
    const spark = pts.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ');
    out.push({
      id: e.id, name: e.name, group: e.group, from, to, delta, unit: bw ? 'reps' : 'kg', up: delta > 0,
      score: Math.abs(delta) / (from || 1),
      spark, area: `M0,34 L${spark.split(' ').join(' L')} L100,34 Z`,
      lastY: `${((pts[pts.length - 1][1] / 34) * 100).toFixed(1)}%`
    });
  }
  return out.sort((a, b) => b.score - a.score);
}

export interface Record3 { id: string; name: string; group: Group; w: number; r: number; diff: number; since: string }

/** Top 3 des exercices avec charge (hors poids du corps) par progression depuis la première perf. */
export function recentRecords(history: Record<string, PerfPoint[]>, exercises: Exercise[]): Record3[] {
  const seen = new Set<string>();
  return exercises
    .filter(e => (history[e.id] || []).some(x => x.w > 0) && !seen.has(e.id) && seen.add(e.id))
    .map(e => {
      const h = history[e.id], b = best(h)!;
      return { id: e.id, name: e.name, group: e.group, w: b.w, r: b.r, diff: Math.round((b.w - h[0].w) * 10) / 10, since: h[0].date };
    })
    .sort((a, b) => b.diff - a.diff)
    .slice(0, 3);
}
