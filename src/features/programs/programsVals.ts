import { useState } from 'react';
import { DAY_NAMES, DAY_SHORT } from '../../domain/constants';
import { weekday } from '../../domain/dates';
import type { Program } from '../../domain/types';
import { useApp } from '../../state/app';
import { programInfo } from '../home/homeVals';
import { useReenter } from '../shell/shellVals';
import { useStartSession } from '../session/useStartSession';

const ACTIVE = 'rgb(var(--fb-a,236,40,78))';
const IDLE = 'rgba(var(--fb-fg,255,255,255),.05)';

/** `openBuilder(null)` = nouveau programme, `openBuilder(p)` = modifier p. */
export function useProgramsVals(openBuilder: (p: Program | null) => void) {
  const a = useApp();
  const start = useStartSession();
  const { programs } = a;
  const [planDay, setPlanDay] = useState<number | null>(null);
  const wd = weekday(new Date());

  const selP = programs.find(p => p.id === a.progId) || programs[0];
  useReenter([selP?.id]);

  /** Un jour ne peut avoir qu'un programme : retire le jour des autres. */
  const assignDay = (day: number, pid: string | null) => {
    programs.forEach(p => {
      const has = p.days.includes(day), want = p.id === pid;
      if (has !== want) a.saveProg({ ...p, days: want ? [...p.days, day].sort() : p.days.filter(d => d !== day) }, true);
    });
  };

  const pd = planDay;
  const curPlan = pd != null ? programs.find(x => x.days.includes(pd)) : null;

  return {
    hasProg: !!selP, noPrograms: !programs.length,
    prog: selP
      ? {
          ...selP, ...programInfo(selP),
          dayTags: selP.days.map(d => DAY_NAMES[d]), noDays: !selP.days.length,
          exercises: selP.exercises.map((e, i) => ({ ...e, num: i + 1, machine: e.machine || '—' }))
        }
      : { icon: '', name: '', subtitle: '', exCount: 0, dayTags: [] as string[], noDays: true, exercises: [] as { num: number; name: string; machine: string; sets: number; reps: number }[] },
    plan: DAY_SHORT.map((short, d) => {
      const p = programs.find(x => x.days.includes(d)), sel = planDay === d;
      return {
        short, name: p ? p.name : 'Repos', icon: p ? p.icon : 'bedtime',
        iconColor: p ? 'rgb(var(--fb-a3,255,92,124))' : 'var(--fb-tx4,#5f514a)',
        nameColor: p ? 'var(--fb-tx,#f5efe9)' : 'var(--fb-tx4,#8e7d72)',
        onClick: () => setPlanDay(sel ? null : d),
        bg: sel ? 'rgba(var(--fb-a,236,40,78),.18)' : p ? 'rgba(var(--fb-a,236,40,78),.07)' : 'rgba(var(--fb-ink,0,0,0),.25)',
        border: sel ? '1.5px solid rgb(var(--fb-a,236,40,78))' : d === wd ? '1.5px solid rgba(var(--fb-a3,255,92,124),.5)' : '1px solid rgba(var(--fb-fg,255,255,255),.06)'
      };
    }),
    hasPlanDay: pd != null,
    planDayName: pd != null ? DAY_NAMES[pd] : '',
    planOptions: pd == null ? [] : [...programs.map(p => ({ id: p.id as string | null, name: p.name, icon: p.icon })), { id: null, name: 'Repos', icon: 'bedtime' }]
      .map(o => {
        const on = (curPlan ? curPlan.id : null) === o.id;
        return {
          ...o, onClick: () => { assignDay(pd, o.id); setPlanDay(null); },
          bg: on ? ACTIVE : IDLE, color: on ? 'var(--fb-on,#fff)' : 'var(--fb-tx2,#d4c2b6)', border: on ? 'none' : '1px solid rgba(var(--fb-fg,255,255,255),.1)'
        };
      }),
    progTabs: programs.map(p => {
      const on = !!selP && p.id === selP.id;
      return {
        name: p.name, icon: p.icon, onClick: () => a.setProgId(p.id),
        bg: on ? ACTIVE : IDLE, color: on ? 'var(--fb-on,#fff)' : 'var(--fb-tx2,#d4c2b6)',
        border: on ? 'none' : '1px solid rgba(var(--fb-fg,255,255,255),.08)', shadow: on ? '0 6px 20px rgba(var(--fb-a,236,40,78),.35)' : 'none'
      };
    }),
    startSelected: () => selP && start(selP.id),
    newProgram: () => openBuilder(null),
    editProgram: () => selP && openBuilder(selP)
  };
}

export type ProgramsVals = ReturnType<typeof useProgramsVals>;
