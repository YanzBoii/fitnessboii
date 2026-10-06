import { DAY_NAMES, DAYS, groupIcon } from '../../domain/constants';
import { dateKey, fmtDay, weekday } from '../../domain/dates';
import { attendedSet, heatmap, heatStart, recentRecords, streakWeeks, weekRow } from '../../domain/stats';
import type { Program } from '../../domain/types';
import { useApp } from '../../state/app';
import { useStartSession } from '../session/useStartSession';

const fmtMonth = (d: Date) => d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');
const fmtShort = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

export const programInfo = (p: Program) => {
  const sets = p.exercises.reduce((a, e) => a + (+e.sets || 0), 0);
  return { exCount: p.exercises.length, totalSets: sets, duration: sets * 3 + 5 };
};

export function useHomeVals() {
  const a = useApp();
  const start = useStartSession();
  const today = new Date();
  const wd = weekday(today);
  const attended = attendedSet(a.logs);
  const { programs } = a;
  const heatCols = a.isMobile ? 14 : 24;

  const todayP = programs.find(p => p.days.includes(wd));
  let nextP: Program | undefined, nextDay = 0;
  for (let i = 1; i <= 7 && !nextP; i++) {
    const d = (wd + i) % 7;
    nextP = programs.find(x => x.days.includes(d));
    if (nextP) nextDay = d;
  }
  const heroP = todayP || nextP || programs[0];
  const hero = !heroP
    ? { pill: 'Aucun programme', pillIcon: 'info', icon: 'add', subtitle: 'Crée ton premier programme', name: '—', cta: 'Créer', id: null as string | null }
    : todayP
      ? { pill: 'Séance du jour', pillIcon: 'today', icon: todayP.icon, subtitle: todayP.subtitle || `${programInfo(todayP).exCount} exercices · ~${programInfo(todayP).duration} min`, name: todayP.name, cta: 'Commencer', id: todayP.id }
      : { pill: 'Jour de repos', pillIcon: 'bedtime', icon: 'bedtime', subtitle: nextP ? `Prochaine séance : ${nextP.name} (${DAY_NAMES[nextDay].toLowerCase()})` : 'Récupère bien', name: 'Repos', cta: `Faire ${heroP.name} quand même`, id: heroP.id };

  const hs = heatStart(today, heatCols);
  const startKey = dateKey(hs);
  const prs = recentRecords(a.history, programs.flatMap(p => p.exercises));

  return {
    hero,
    startToday: () => (hero.id ? start(hero.id) : a.go('programs')),
    goHeroProgram: () => { if (hero.id) a.setProgId(hero.id); a.go('programs'); },
    streak: streakWeeks(attended, today),
    weekRow: weekRow(attended, today).map((d, i) => ({
      label: DAYS[i], num: d.date.getDate(),
      checkDisplay: d.done ? 'block' : 'none', numDisplay: d.done ? 'none' : 'block',
      bg: d.done ? (d.isToday ? 'rgb(var(--fb-a,236,40,78))' : 'rgba(var(--fb-a2,220,30,96),.85)') : 'rgba(var(--fb-fg,255,255,255),.04)',
      border: d.isToday && !d.done ? '1.5px solid rgb(var(--fb-a,236,40,78))' : d.done ? 'none' : '1px solid rgba(var(--fb-fg,255,255,255),.08)',
      shadow: d.done ? '0 0 14px rgba(var(--fb-a2,220,30,96),.5)' : 'none',
      // Blanc sur la pastille pleine, couleur du texte sinon (lisible en thème clair).
      color: d.done ? 'var(--fb-on,#fff)' : 'var(--fb-tx,#f5efe9)'
    })),
    heatCols,
    heatRange: `${fmtMonth(hs)} → ${fmtMonth(today)}`,
    heatTotal: [...attended].filter(k => k >= startKey).length,
    heatRows: heatmap(attended, today, heatCols).map((cells, di) => ({
      label: DAYS[di],
      cells: cells.map(c => ({
        title: fmtShort(c.date) + (c.on ? ' · séance' : ''),
        bg: c.on ? 'rgb(var(--fb-a2,220,30,96))' : 'transparent',
        border: c.on ? 'none' : c.isToday ? '1.5px solid rgb(var(--fb-a,236,40,78))' : '1.5px solid rgba(var(--fb-fg,255,255,255),.14)',
        shadow: c.on ? '0 0 9px rgba(var(--fb-a2,220,30,96),.6)' : 'none',
        op: c.future ? 0.25 : 1
      }))
    })),
    prs: prs.map(r => ({
      name: r.name, icon: groupIcon(r.group), w: r.w, r: r.r,
      delta: r.diff > 0 ? `+${String(r.diff).replace('.', ',')} kg depuis le ${fmtDay(r.since)}` : 'Premier record',
      onClick: () => a.go('perf')
    })),
    noPrs: !prs.length,
    goPerf: () => a.go('perf')
  };
}

export type HomeVals = ReturnType<typeof useHomeVals>;
