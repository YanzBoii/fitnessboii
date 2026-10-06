import { useState, type ChangeEvent } from 'react';
import { DAY_NAMES, DAY_SHORT, DAYS, groupIcon, LIMITS, newId, PROG_ICONS } from '../../domain/constants';
import { weekday } from '../../domain/dates';
import type { Exercise, Group, Program } from '../../domain/types';
import { deleteProgram } from '../../firebase/repo';
import { useApp } from '../../state/app';
import { programInfo } from '../home/homeVals';
import { useReenter } from '../shell/shellVals';
import { useStartSession } from '../session/useStartSession';

type Ev = ChangeEvent<HTMLInputElement | HTMLSelectElement>;
const ACTIVE = 'rgb(var(--fb-a,236,40,78))';
const IDLE = 'rgba(var(--fb-fg,255,255,255),.05)';

export function useProgramsVals() {
  const a = useApp();
  const start = useStartSession();
  const { programs } = a;
  const [editing, setEditing] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [planDay, setPlanDay] = useState<number | null>(null);
  // Texte brut des champs numériques en cours de saisie ("22," → 22,5).
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const wd = weekday(new Date());

  const selP = programs.find(p => p.id === a.progId) || programs[0];
  useReenter([selP?.id, editing]);

  const upd = (p: Program, patch: Partial<Program>, immediate = false) => a.saveProg({ ...p, ...patch }, immediate);
  const updEx = (p: Program, eid: string, patch: Partial<Exercise>) =>
    upd(p, { exercises: p.exercises.map(e => (e.id === eid ? { ...e, ...patch } : e)) });

  /** Un jour ne peut avoir qu'un programme : retire le jour des autres. */
  const assignDay = (day: number, pid: string | null) => {
    programs.forEach(p => {
      const has = p.days.includes(day), want = p.id === pid;
      if (has !== want) upd(p, { days: want ? [...p.days, day].sort() : p.days.filter(d => d !== day) }, true);
    });
  };

  const numField = (p: Program, e: Exercise, k: 'sets' | 'reps' | 'weight') => {
    const key = `${e.id}.${k}`;
    return {
      value: drafts[key] ?? String(e[k]),
      onChange: (ev: Ev) => {
        const raw = ev.target.value;
        setDrafts(d => ({ ...d, [key]: raw }));
        const n = Number(raw.replace(',', '.'));
        if (raw.trim() !== '' && Number.isFinite(n)) updEx(p, e.id, { [k]: n });
      }
    };
  };

  let prog = null;
  if (selP) {
    const p = selP;
    prog = {
      ...p, ...programInfo(p),
      dayTags: p.days.map(d => DAY_NAMES[d]), noDays: !p.days.length,
      exercises: p.exercises.map((e, i) => {
        const sets = numField(p, e, 'sets'), reps = numField(p, e, 'reps'), weight = numField(p, e, 'weight');
        return {
          ...e, num: i + 1, icon: groupIcon(e.group),
          weightLabel: +e.weight ? `${String(e.weight).replace('.', ',')} kg` : 'Poids du corps',
          sets: sets.value, reps: reps.value, weight: weight.value,
          onSets: sets.onChange, onReps: reps.onChange, onWeight: weight.onChange,
          onName: (ev: Ev) => updEx(p, e.id, { name: ev.target.value.slice(0, 60) }),
          onMachine: (ev: Ev) => updEx(p, e.id, { machine: ev.target.value.slice(0, 60) }),
          onGroup: (ev: Ev) => updEx(p, e.id, { group: ev.target.value as Group }),
          onDelete: () => upd(p, { exercises: p.exercises.filter(x => x.id !== e.id) }, true)
        };
      })
    };
  }

  const pd = planDay;
  const curPlan = pd != null ? programs.find(x => x.days.includes(pd)) : null;

  return {
    hasProg: !!prog, noPrograms: !programs.length, isEditing: editing && !!prog, notEditing: !editing,
    prog: prog!,
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
        name: p.name, icon: p.icon,
        onClick: () => { a.setProgId(p.id); setEditing(false); setConfirmDel(false); },
        bg: on ? ACTIVE : IDLE, color: on ? 'var(--fb-on,#fff)' : 'var(--fb-tx2,#d4c2b6)',
        border: on ? 'none' : '1px solid rgba(var(--fb-fg,255,255,255),.08)', shadow: on ? '0 6px 20px rgba(var(--fb-a,236,40,78),.35)' : 'none'
      };
    }),
    iconPicker: PROG_ICONS.map(icon => {
      const on = !!selP && selP.icon === icon;
      return { icon, onClick: () => selP && upd(selP, { icon }, true), bg: on ? ACTIVE : IDLE, border: on ? 'none' : '1px solid rgba(var(--fb-fg,255,255,255),.1)' };
    }),
    dayPicker: DAYS.map((label, d) => {
      const on = !!selP && selP.days.includes(d);
      const other = programs.find(p => p.id !== selP?.id && p.days.includes(d));
      return {
        label, onClick: () => selP && (on ? upd(selP, { days: selP.days.filter(x => x !== d) }, true) : assignDay(d, selP.id)),
        bg: on ? ACTIVE : IDLE, color: on ? 'var(--fb-on,#fff)' : other ? 'var(--fb-tx4,#6f6058)' : 'var(--fb-tx2,#d4c2b6)',
        border: on ? 'none' : '1px solid rgba(var(--fb-fg,255,255,255),.1)', shadow: on ? '0 0 12px rgba(var(--fb-a,236,40,78),.5)' : 'none'
      };
    }),
    toggleEdit: () => { setEditing(!editing); setConfirmDel(false); },
    onProgName: (ev: Ev) => selP && upd(selP, { name: ev.target.value.slice(0, 60) }),
    onProgSub: (ev: Ev) => selP && upd(selP, { subtitle: ev.target.value.slice(0, 80) }),
    startSelected: () => selP && start(selP.id),
    addProgram: () => {
      if (programs.length >= LIMITS.programs) return a.flash(`${LIMITS.programs} programmes maximum`);
      const id = newId('p');
      a.saveProg({ id, name: 'Nouveau programme', subtitle: '', icon: 'bolt', days: [], order: Math.max(-1, ...programs.map(p => p.order)) + 1, exercises: [] }, true);
      a.setProgId(id);
      setEditing(true);
    },
    addExercise: () => {
      if (!selP) return;
      if (selP.exercises.length >= LIMITS.exercises) return a.flash(`${LIMITS.exercises} exercices maximum`);
      upd(selP, { exercises: [...selP.exercises, { id: newId('e'), name: 'Nouvel exercice', machine: '', sets: 3, reps: 10, weight: 20, group: 'pecs' }] }, true);
    },
    deleteProgram: () => {
      if (!selP) return;
      if (!confirmDel) return setConfirmDel(true);
      if (a.session?.programId === selP.id) return a.flash('Termine d’abord la séance en cours');
      a.dropProg(selP.id);
      deleteProgram(a.uid, selP.id).catch(a.fail);
      a.setProgId(programs.find(p => p.id !== selP.id)?.id ?? null);
      setEditing(false);
      setConfirmDel(false);
      a.flash('Programme supprimé');
    },
    delLabel: confirmDel ? 'Confirmer la suppression' : 'Supprimer',
    delBg: confirmDel ? 'rgba(255,90,70,.18)' : 'transparent'
  };
}

export type ProgramsVals = ReturnType<typeof useProgramsVals>;
