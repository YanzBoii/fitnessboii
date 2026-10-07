import { OB_SPLITS, programFromTemplate } from './library';
import type { Program, Split } from './types';

/** Répartit les jours choisis cycliquement sur les programmes (Push, Pull, Legs, Push…). */
export function distributeDays(programs: Program[], days: number[]): Program[] {
  const out = programs.map(p => ({ ...p, days: [] as number[] }));
  if (out.length) [...days].sort().forEach((d, i) => out[i % out.length].days.push(d));
  return out;
}

/**
 * Programmes à la fin du questionnaire.
 * - Pas encore de programmes : on crée ceux du split (aucun pour « Je crée les miens »).
 * - Questionnaire refait avec le même split, ou « Je crée les miens » : on garde les programmes existants.
 * - Split différent : les programmes du nouveau split remplacent les anciens (l'historique des perfs est conservé,
 *   il est rattaché aux ids d'exercices).
 */
export function planPrograms(split: Split, prevSplit: Split | null, existing: Program[], newId: () => string) {
  const names = OB_SPLITS.find(s => s[0] === split)?.[4] ?? [];
  const replace = names.length > 0 && (!existing.length || split !== prevSplit);
  if (!replace) return { programs: existing, removeIds: [] as string[] };
  const programs = names.map((n, i) => programFromTemplate(n, newId(), i)).filter((p): p is Program => !!p);
  return { programs, removeIds: existing.map(p => p.id) };
}
