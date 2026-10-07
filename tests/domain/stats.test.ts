import { describe, expect, it } from 'vitest';
import { addDays, dateKey } from '../../src/domain/dates';
import {
  attendedSet, best, changes30d, heatmap, perfHistory, recentRecords, streakWeeks, weekRow, weeklyBars
} from '../../src/domain/stats';
import type { Exercise, SessionLog } from '../../src/domain/types';

// Jeudi 8 octobre 2026
const today = new Date(2026, 9, 8, 15);
const k = (offset: number) => dateKey(addDays(today, offset));

const log = (date: string, perf: SessionLog['perf'] = {}): SessionLog =>
  ({ date, programId: 'push', programName: 'Push', minutes: 50, perf });

const dc: Exercise = { id: 'dc', name: 'Développé couché', machine: '', group: 'pecs', sets: 4, reps: 8, weight: 80 };
const tr: Exercise = { id: 'tr', name: 'Tractions', machine: '', group: 'dos', sets: 3, reps: 8, weight: 0 };

describe('streakWeeks', () => {
  it('compte les semaines à 2 séances ou plus', () => {
    // semaine courante (lun 5) : lun + mer ; S-1 : 2 séances ; S-2 : 2 séances
    const a = attendedSet([log('2026-10-05'), log('2026-10-07'), log('2026-09-28'), log('2026-09-30'), log('2026-09-21'), log('2026-09-23')]);
    expect(streakWeeks(a, today)).toBe(3);
  });
  it("une semaine courante incomplète n'interrompt pas la série", () => {
    const a = attendedSet([log('2026-10-05'), log('2026-09-28'), log('2026-09-30')]);
    expect(streakWeeks(a, today)).toBe(1);
  });
  it("s'arrête au premier trou", () => {
    const a = attendedSet([log('2026-09-28'), log('2026-09-30'), log('2026-09-14'), log('2026-09-16')]);
    expect(streakWeeks(a, today)).toBe(1);
  });
  it('0 sans séance', () => {
    expect(streakWeeks(new Set(), today)).toBe(0);
  });
});

describe('weekRow / heatmap / bars', () => {
  it('weekRow : 7 jours depuis lundi, marque aujourd’hui et les séances', () => {
    const row = weekRow(attendedSet([log('2026-10-06')]), today);
    expect(row).toHaveLength(7);
    expect(row[0].key).toBe('2026-10-05');
    expect(row[1].done).toBe(true);
    expect(row[3].isToday).toBe(true);
  });
  it('heatmap : 7 lignes × n colonnes, dernière colonne = semaine courante', () => {
    const h = heatmap(attendedSet([log(k(0))]), today, 14);
    expect(h).toHaveLength(7);
    expect(h[0]).toHaveLength(14);
    expect(h[3][13].key).toBe(k(0));
    expect(h[3][13].on).toBe(true);
    expect(h[4][13].future).toBe(true);
    expect(h[3][13].future).toBe(false);
  });
  it('weeklyBars : 12 semaines, la dernière est la courante', () => {
    const bars = weeklyBars(attendedSet([log('2026-10-05'), log('2026-10-06'), log('2026-10-07')]), today, 3);
    expect(bars).toHaveLength(12);
    expect(bars[11]).toMatchObject({ n: 3, current: true, hit: true });
    expect(bars[10]).toMatchObject({ n: 0, current: false, hit: false });
  });
});

describe('perfs', () => {
  const logs = [
    log('2026-08-01', { dc: { w: 70, r: 8, name: 'Développé couché', group: 'pecs' }, tr: { w: 0, r: 6, name: 'Tractions', group: 'dos' } }),
    log('2026-08-20', { dc: { w: 75, r: 8, name: 'Développé couché', group: 'pecs' } }),
    log('2026-10-01', { dc: { w: 80, r: 6, name: 'Développé couché', group: 'pecs' }, tr: { w: 0, r: 9, name: 'Tractions', group: 'dos' } })
  ];
  it('perfHistory regroupe par exercice et trie par date', () => {
    const h = perfHistory([logs[2], logs[0], logs[1]]);
    expect(h.dc.map(p => p.w)).toEqual([70, 75, 80]);
    expect(h.tr.map(p => p.r)).toEqual([6, 9]);
  });
  it('best : poids max puis reps', () => {
    expect(best([{ date: 'a', w: 80, r: 5 }, { date: 'b', w: 80, r: 7 }, { date: 'c', w: 75, r: 12 }])).toMatchObject({ w: 80, r: 7 });
    expect(best([])).toBeNull();
  });
  it('changes30d : compare récent vs avant J-30 (kg ou reps si poids du corps)', () => {
    const c = changes30d(perfHistory(logs), [dc, tr], today);
    const byId = Object.fromEntries(c.map(x => [x.id, x]));
    expect(byId.dc).toMatchObject({ from: 75, to: 80, delta: 5, unit: 'kg', up: true });
    expect(byId.tr).toMatchObject({ from: 6, to: 9, delta: 3, unit: 'reps', up: true });
    // tri par variation relative : tr (+50 %) avant dc (+6,7 %)
    expect(c[0].id).toBe('tr');
    expect(c[0].spark.length).toBeGreaterThan(0);
  });
  it('charge cible à 0 (« auto ») : comparé en kg si des charges ont été notées', () => {
    const auto = { ...dc, weight: 0 };
    expect(changes30d(perfHistory(logs), [auto], today)[0]).toMatchObject({ unit: 'kg', delta: 5 });
    expect(recentRecords(perfHistory(logs), [auto]).map(x => x.id)).toEqual(['dc']);
  });
  it('recentRecords : top 3 progressions, ignore les exos sans historique', () => {
    const r = recentRecords(perfHistory(logs), [dc, tr, { ...dc, id: 'zz' }]);
    expect(r.map(x => x.id)).toEqual(['dc']);
    expect(r[0]).toMatchObject({ w: 80, r: 6, diff: 10, since: '2026-08-01' });
  });
});
