import { describe, expect, it } from 'vitest';
import { autoIcon, autoSubtitle, LIB, libById, libEx, norm, OB_SPLITS, programFromTemplate, TEMPLATES } from '../../src/domain/library';
import { normalizeExercise, normalizeProfile } from '../../src/domain/normalize';

describe('bibliothèque', () => {
  it('ids uniques et compatibles avec les règles', () => {
    const ids = LIB.map(l => l[0]);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach(id => expect(id).toMatch(/^[A-Za-z0-9_-]{1,40}$/));
  });
  it('les anciens ids sont conservés (historique des perfs)', () => {
    ['dc', 'di', 'ec', 'dm', 'tri', 'tv', 'ro', 'tr', 'fp', 'cu', 'sq', 'pr', 'lc', 'le', 'mo'].forEach(id => expect(libById(id)).toBeTruthy());
  });
  it('tous les modèles et splits pointent vers des exercices/modèles existants', () => {
    TEMPLATES.forEach(([, , ids]) => ids.forEach(id => expect(libById(id)).toBeTruthy()));
    OB_SPLITS.forEach(([, , , , names]) => names.forEach(n => expect(TEMPLATES.some(t => t[0] === n)).toBe(true)));
  });
  it('norm ignore accents et casse', () => {
    expect(norm('Élévations LATÉRALES')).toBe('elevations laterales');
  });
  it('sous-titre et icône déduits des groupes dominants', () => {
    const ex = ['l-cpm', 'l-pf', 'dm', 'tri'].map(id => libEx(libById(id)!));
    expect(autoSubtitle(ex)).toBe('Pecs · Épaules · Bras');
    expect(autoIcon(ex)).toBe('fitness_center');
    expect(autoIcon([])).toBe('bolt');
  });
  it('programFromTemplate', () => {
    const p = programFromTemplate('Pull', 'p1', 2)!;
    expect(p).toMatchObject({ id: 'p1', name: 'Pull', icon: 'rowing', order: 2, days: [] });
    expect(p.exercises).toHaveLength(6);
    expect(p.exercises[0]).toMatchObject({ id: 'tv', weight: 0 });
    expect(programFromTemplate('Inconnu', 'x', 0)).toBeNull();
  });
});

describe('nouveaux champs', () => {
  it('exercice : repos et note bornés, omis si vides', () => {
    const base = { id: 'x', name: 'n', machine: '', group: 'pecs' as const, sets: 3, reps: 10, weight: 0 };
    expect(normalizeExercise({ ...base, rest: 9999, note: ' ' + 'a'.repeat(200) })).toMatchObject({ rest: 600 });
    expect(normalizeExercise({ ...base, rest: 9999, note: 'a'.repeat(200) }).note).toHaveLength(120);
    const e = normalizeExercise({ ...base, rest: 0, note: '  ' });
    expect('rest' in e).toBe(false);
    expect('note' in e).toBe(false);
  });
  it('profil : split validé', () => {
    expect(normalizeProfile({ split: 'ul' })).toEqual({ split: 'ul' });
    expect(normalizeProfile({ split: 'bro' as never })).toEqual({});
  });
});
