import { describe, expect, it } from 'vitest';
import { dateKey, fmtDur, mondayOf, r25, weekday } from '../../src/domain/dates';

describe('dates', () => {
  it('mondayOf renvoie le lundi de la semaine', () => {
    expect(dateKey(mondayOf(new Date(2026, 9, 8)))).toBe('2026-10-05');
    expect(dateKey(mondayOf(new Date(2026, 9, 11)))).toBe('2026-10-05');
    expect(dateKey(mondayOf(new Date(2026, 9, 5)))).toBe('2026-10-05');
  });
  it('dateKey est zéro-paddée', () => {
    expect(dateKey(new Date(2026, 0, 3))).toBe('2026-01-03');
  });
  it('weekday : lundi = 0, dimanche = 6', () => {
    expect(weekday(new Date(2026, 9, 5))).toBe(0);
    expect(weekday(new Date(2026, 9, 11))).toBe(6);
  });
  it('r25 arrondit au 2,5', () => {
    expect(r25(81.2)).toBe(80);
    expect(r25(81.3)).toBe(82.5);
  });
  it('fmtDur', () => {
    expect(fmtDur(65000)).toBe('01:05');
    expect(fmtDur(3725000)).toBe('1:02:05');
    expect(fmtDur(-5)).toBe('00:00');
  });
});
