import { describe, expect, it } from 'vitest';
import { DEFAULT_PROGRAMS } from '../../src/domain/constants';
import { fitSize } from '../../src/domain/image';
import { normalizeExercise, normalizeProfile, normalizeProgram } from '../../src/domain/normalize';
import { distributeDays, planPrograms } from '../../src/domain/onboarding';
import { buildLog, mergeLog, nextTodo, startSession } from '../../src/domain/session';
import type { Program, SessionLog } from '../../src/domain/types';

describe('normalize', () => {
  it('borne et nettoie un exercice', () => {
    const e = normalizeExercise({ id: 'x', name: '  ' + 'a'.repeat(100), machine: 'm', group: 'bidon' as never, sets: 99, reps: -3, weight: 1234.37 });
    expect(e.name).toHaveLength(60);
    expect(e).toMatchObject({ group: 'pecs', sets: 20, reps: 0, weight: 1000 });
    expect(normalizeExercise({ id: 'y', name: '', machine: '', group: 'dos', sets: 3, reps: 10, weight: 22.3 }))
      .toMatchObject({ name: 'Exercice', weight: 22.5 });
  });
  it('programme : jours uniques triés, 40 exos max, icône valide', () => {
    const p = normalizeProgram({
      id: 'p1', name: '', subtitle: 's', icon: 'nope', days: [4, 1, 1, 9], order: 2,
      exercises: Array.from({ length: 45 }, (_, i) => ({ id: 'e' + i, name: 'n', machine: '', group: 'pecs', sets: 3, reps: 10, weight: 0 }))
    });
    expect(p).toMatchObject({ name: 'Programme', icon: 'fitness_center', days: [1, 4] });
    expect(p.exercises).toHaveLength(40);
  });
  it('profil : retire les null (refusés par les règles) et borne', () => {
    const p = normalizeProfile({ name: 'Yan', goalType: null, goal: 12, bodyWeight: 5, rest: 77 as never, theme: 'x' as never });
    expect('goalType' in p).toBe(false);
    expect(p).toMatchObject({ name: 'Yan', goal: 7, bodyWeight: 20, rest: 90, theme: 'rubis' });
  });
});

describe('onboarding', () => {
  it('répartit les jours cycliquement sur les programmes', () => {
    const r = distributeDays(DEFAULT_PROGRAMS, [5, 0, 2, 4]);
    expect(r.map(p => p.days)).toEqual([[0, 5], [2], [4]]);
  });
  let n = 0;
  const id = () => 'p' + n++;
  it('nouveau compte : crée les programmes du split', () => {
    const r = planPrograms('ul', null, [], id);
    expect(r.programs.map(p => p.name)).toEqual(['Haut du corps', 'Bas du corps']);
    expect(r.removeIds).toEqual([]);
  });
  it('« Je crée les miens » : aucun programme créé, rien supprimé', () => {
    expect(planPrograms('custom', null, [], id).programs).toEqual([]);
    expect(planPrograms('custom', 'ppl', DEFAULT_PROGRAMS, id)).toEqual({ programs: DEFAULT_PROGRAMS, removeIds: [] });
  });
  it('questionnaire refait avec le même split : programmes conservés', () => {
    expect(planPrograms('ppl', 'ppl', DEFAULT_PROGRAMS, id).programs).toBe(DEFAULT_PROGRAMS);
  });
  it('split différent : remplace les anciens programmes', () => {
    const r = planPrograms('fb', 'ppl', DEFAULT_PROGRAMS, id);
    expect(r.programs.map(p => p.name)).toEqual(['Full body']);
    expect(r.removeIds).toEqual(['push', 'pull', 'legs']);
  });
});

describe('séance', () => {
  const prog: Program = DEFAULT_PROGRAMS[1];
  it('startSession reprend la dernière perf, sinon le poids cible', () => {
    const s = startSession(prog, { tv: [{ date: '2026-09-01', w: 70, r: 9 }] }, 1000);
    expect(s.ex.tv).toEqual({ w: 70, r: 10, done: false });
    expect(s.ex.ro).toEqual({ w: 60, r: 10, done: false });
    expect(s).toMatchObject({ programId: 'pull', cur: 0, startedAt: 1000 });
  });
  it('nextTodo passe au prochain exo non fait (circulaire)', () => {
    const order = ['a', 'b', 'c'];
    expect(nextTodo(order, { a: { w: 0, r: 0, done: true }, b: { w: 0, r: 0, done: false }, c: { w: 0, r: 0, done: false } }, 0)).toBe(1);
    expect(nextTodo(order, { a: { w: 0, r: 0, done: false }, b: { w: 0, r: 0, done: true }, c: { w: 0, r: 0, done: true } }, 2)).toBe(0);
    expect(nextTodo(order, { a: { w: 0, r: 0, done: true }, b: { w: 0, r: 0, done: true }, c: { w: 0, r: 0, done: true } }, 1)).toBe(1);
  });
  it('buildLog ne garde que les exos validés', () => {
    const s = startSession(prog, {}, 0);
    s.ex.tv = { w: 72.5, r: 8, done: true };
    const l = buildLog(prog, s, '2026-10-08', 3_000_000);
    expect(Object.keys(l.perf)).toEqual(['tv']);
    expect(l).toMatchObject({ date: '2026-10-08', programId: 'pull', programName: 'Pull', minutes: 50 });
    expect(l.perf.tv).toEqual({ w: 72.5, r: 8, name: 'Tirage vertical', group: 'dos' });
  });
  it('mergeLog : garde la meilleure perf par exo et additionne les minutes', () => {
    const a: SessionLog = { date: 'd', programId: 'push', programName: 'Push', minutes: 400, perf: { dc: { w: 80, r: 5, name: 'DC', group: 'pecs' } } };
    const b: SessionLog = { date: 'd', programId: 'pull', programName: 'Pull', minutes: 300, perf: { dc: { w: 80, r: 8, name: 'DC', group: 'pecs' }, tv: { w: 60, r: 10, name: 'TV', group: 'dos' } } };
    const m = mergeLog(a, b);
    expect(m.minutes).toBe(600);
    expect(m.perf.dc.r).toBe(8);
    expect(m.perf.tv.w).toBe(60);
    expect(m.programId).toBe('pull');
    expect(mergeLog(null, b)).toBe(b);
  });
});

describe('image', () => {
  it('fitSize réduit sans agrandir', () => {
    expect(fitSize(4000, 3000, 720)).toEqual({ w: 720, h: 540 });
    expect(fitSize(3000, 4000, 720)).toEqual({ w: 540, h: 720 });
    expect(fitSize(300, 200, 720)).toEqual({ w: 300, h: 200 });
  });
});
