import type { Program } from './types';

/** Répartit les jours choisis cycliquement sur les programmes (Push, Pull, Legs, Push…). */
export function distributeDays(programs: Program[], days: number[]): Program[] {
  const out = programs.map(p => ({ ...p, days: [] as number[] }));
  if (out.length) [...days].sort().forEach((d, i) => out[i % out.length].days.push(d));
  return out;
}
