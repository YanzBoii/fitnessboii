// Éditeur de programme (création / modification) : bibliothèque d'exercices, modèles, jours.
import { useRef, useState, type ChangeEvent, type KeyboardEvent, type MouseEvent } from 'react';
import { DAY_SHORT, DAYS, GROUP_LABELS, groupIcon, LIMITS, newId } from '../../domain/constants';
import { autoIcon, autoSubtitle, LIB, libById, libEx, norm, TEMPLATES } from '../../domain/library';
import type { Exercise, Group, Program } from '../../domain/types';
import { deleteProgram } from '../../firebase/repo';
import { useApp } from '../../state/app';
import { anim, fadeRef } from '../../ui/anim';

/** Exercice en cours d'édition : charge et repos gardent le texte saisi (« 22,5 »). */
type DraftEx = Omit<Exercise, 'weight' | 'rest'> & { weight: number | string; rest: number | string };

interface Draft {
  id: string | null;
  name: string;
  icon: string | null;
  days: number[];
  exercises: DraftEx[];
  q: string;
  grp: Group | 'all';
  confirmDel: boolean;
  openId: string | null;
}

type Ev = ChangeEvent<HTMLInputElement>;
const toNum = (v: number | string | undefined) => Number(String(v ?? '').replace(',', '.')) || 0;
const pill = (on: boolean) => ({
  bg: on ? 'rgb(var(--fb-a,236,40,78))' : 'rgba(var(--fb-fg,255,255,255),.05)',
  color: on ? 'var(--fb-on,#fff)' : 'var(--fb-tx2,#d4c2b6)',
  border: on ? 'none' : '1px solid rgba(var(--fb-fg,255,255,255),.08)'
});

export function draftFrom(p: Program | null): Draft {
  return p
    ? { id: p.id, name: p.name, icon: p.icon, days: [...p.days], exercises: p.exercises.map(e => ({ ...e, rest: e.rest ?? 0 })), q: '', grp: 'all', confirmDel: false, openId: null }
    : { id: null, name: '', icon: null, days: [], exercises: [], q: '', grp: 'all', confirmDel: false, openId: null };
}

export function useBuilderVals(initial: Program | null, onClose: () => void) {
  const a = useApp();
  const [b, setB] = useState<Draft>(() => draftFrom(initial));
  const panel = useRef<HTMLElement | null>(null);
  const mob = a.isMobile;
  const progs = a.programs;
  const set = (patch: Partial<Draft>) => setB(x => ({ ...x, ...patch }));
  const setEx = (fn: (xs: DraftEx[]) => DraftEx[]) => setB(x => ({ ...x, exercises: fn(x.exercises) }));
  const upd = (i: number, patch: Partial<DraftEx>) => setEx(xs => xs.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  const n = b.exercises.length;
  const full = n >= LIMITS.exercises;
  const ids = new Set(b.exercises.map(e => e.id));
  const q = norm(b.q.trim());
  const lib = LIB.filter(l => (b.grp === 'all' || l[3] === b.grp) && (!q || norm(l[1]).includes(q)));
  const exact = !!q && (LIB.some(l => norm(l[1]) === q) || b.exercises.some(e => norm(e.name) === q));
  const taken = (d: number) => progs.find(p => p.id !== b.id && p.days.includes(d));
  const moved = b.days.map(d => { const t = taken(d); return t ? `${DAY_SHORT[d]} (${t.name})` : null; }).filter(Boolean);

  const toggle = (id: string) => {
    if (ids.has(id)) return setEx(xs => xs.filter(x => x.id !== id));
    if (full) return a.flash(`${LIMITS.exercises} exercices maximum`);
    const l = libById(id);
    if (l) setEx(xs => [...xs, { ...libEx(l), rest: 0 }]);
  };
  const addCustom = () => {
    const name = b.q.trim().slice(0, 60);
    if (!name) return;
    if (full) return a.flash(`${LIMITS.exercises} exercices maximum`);
    const id = newId('e');
    setB(x => ({ ...x, q: '', openId: id, exercises: [...x.exercises, { id, name, machine: '', group: x.grp === 'all' ? 'pecs' : x.grp, sets: 3, reps: 10, weight: 0, rest: 0 }] }));
  };

  const save = () => {
    if (!n) return a.flash('Ajoute au moins un exercice');
    if (!b.id && progs.length >= LIMITS.programs) return a.flash(`${LIMITS.programs} programmes maximum`);
    const exercises: Exercise[] = b.exercises.map(e => ({
      ...e, name: (e.name || '').trim() || 'Exercice', sets: Math.max(1, +e.sets || 1), reps: Math.max(1, +e.reps || 1),
      weight: toNum(e.weight), rest: Math.round(toNum(e.rest)), note: (e.note || '').trim()
    }));
    const id = b.id || newId('p');
    const prev = progs.find(p => p.id === id);
    const prog: Program = {
      id, name: b.name.trim() || 'Mon programme', subtitle: autoSubtitle(exercises), icon: b.icon || autoIcon(exercises),
      days: [...b.days].sort(), order: prev ? prev.order : Math.max(-1, ...progs.map(p => p.order)) + 1, exercises
    };
    // Un jour = un programme : les jours choisis sont retirés des autres programmes.
    progs.forEach(p => {
      if (p.id !== id && p.days.some(d => b.days.includes(d))) a.saveProg({ ...p, days: p.days.filter(d => !b.days.includes(d)) }, true);
    });
    a.saveProg(prog, true);
    a.setProgId(id);
    a.flash(b.id ? 'Programme mis à jour' : 'Programme créé');
    onClose();
  };

  const remove = () => {
    if (!b.id) return;
    if (!b.confirmDel) return set({ confirmDel: true });
    if (a.session?.programId === b.id) return a.flash('Termine d’abord la séance en cours');
    a.dropProg(b.id);
    deleteProgram(a.uid, b.id).catch(a.fail);
    a.setProgId(progs.find(p => p.id !== b.id)?.id ?? null);
    a.flash('Programme supprimé');
    onClose();
  };

  return {
    fadeRef: fadeRef(260),
    bPanelRef: (el: HTMLElement | null) => {
      if (!el || panel.current === el) return;
      panel.current = el;
      anim(el, mob ? [{ transform: 'translateY(100%)' }, { transform: 'none' }] : [{ opacity: 0, transform: 'translateY(16px) scale(.96)' }, { opacity: 1, transform: 'none' }],
        { duration: mob ? 420 : 340, easing: 'cubic-bezier(.2,.9,.25,1)' });
    },
    stop: (ev: MouseEvent) => ev.stopPropagation(),
    bClose: onClose,
    sheetAlign: mob ? 'flex-end' : 'center', sheetPad: mob ? '0' : '24px', sheetRadius: mob ? '26px 26px 0 0' : '26px',
    bH: mob ? '94vh' : 'min(860px, 90vh)',
    bld: {
      title: b.id ? 'Modifier le programme' : 'Nouveau programme',
      name: b.name, onName: (ev: Ev) => set({ name: ev.target.value.slice(0, 60) }), isEdit: !!b.id,
      showTpl: !b.id && !n,
      templates: TEMPLATES.map(([name, icon, list]) => ({
        name, icon,
        onClick: () => set({ name, icon, exercises: list.map(libById).filter((l): l is NonNullable<typeof l> => !!l).map(l => ({ ...libEx(l), rest: 0 })) })
      })),
      count: n ? `${n} exercice${n > 1 ? 's' : ''}` : '', empty: !n,
      rows: b.exercises.map((e, i) => {
        const open = b.openId === e.id;
        return {
          name: e.name, machine: e.machine, icon: groupIcon(e.group), sets: e.sets, reps: e.reps,
          onMachine: (ev: Ev) => upd(i, { machine: ev.target.value.slice(0, 60) }),
          setsM: () => upd(i, { sets: Math.max(1, (+e.sets || 1) - 1) }), setsP: () => upd(i, { sets: Math.min(10, (+e.sets || 0) + 1) }),
          repsM: () => upd(i, { reps: Math.max(1, (+e.reps || 1) - 1) }), repsP: () => upd(i, { reps: Math.min(500, (+e.reps || 0) + 1) }),
          upVis: i ? 'visible' as const : 'hidden' as const,
          onUp: () => i && setEx(xs => { const c = [...xs]; [c[i - 1], c[i]] = [c[i], c[i - 1]]; return c; }),
          onRemove: () => setEx(xs => xs.filter((_, j) => j !== i)),
          isOpen: open, onInfo: () => set({ openId: open ? null : e.id }),
          infoLabel: open ? 'Fermer' : e.note || toNum(e.weight) || toNum(e.rest) ? 'Infos ✓' : 'Plus d’infos',
          infoBg: open ? 'rgba(var(--fb-a,236,40,78),.16)' : 'rgba(var(--fb-fg,255,255,255),.05)',
          infoColor: open ? 'rgb(var(--fb-a4,255,130,154))' : 'var(--fb-tx2,#d4c2b6)',
          infoBorder: open ? '1px solid rgba(var(--fb-a,236,40,78),.4)' : '1px solid rgba(var(--fb-fg,255,255,255),.08)',
          weight: toNum(e.weight) || typeof e.weight === 'string' ? String(e.weight) : '',
          rest: toNum(e.rest) || typeof e.rest === 'string' ? String(e.rest) : '',
          restPh: String(a.profile.rest || 90), note: e.note || '',
          onName: (ev: Ev) => upd(i, { name: ev.target.value.slice(0, 60) }),
          onWeight: (ev: Ev) => upd(i, { weight: ev.target.value.slice(0, 7) }),
          onRest: (ev: Ev) => upd(i, { rest: ev.target.value.replace(/\D/g, '').slice(0, 3) }),
          onNote: (ev: Ev) => upd(i, { note: ev.target.value.slice(0, 120) }),
          groups: (Object.entries(GROUP_LABELS) as [Group, string][]).map(([gid, label]) => ({ label, onClick: () => upd(i, { group: gid }), ...pill(e.group === gid) }))
        };
      }),
      q: b.q,
      onQ: (ev: Ev) => set({ q: ev.target.value.slice(0, 60) }),
      onQKey: (ev: KeyboardEvent) => {
        if (ev.key !== 'Enter') return;
        if (lib.length === 1 && !ids.has(lib[0][0])) { toggle(lib[0][0]); set({ q: '' }); }
        else if (q && !exact) addCustom();
      },
      canCreate: !!q && !exact, createLabel: `Créer « ${b.q.trim()} »`, create: addCustom,
      groups: ([['all', 'Tous'], ...Object.entries(GROUP_LABELS)] as [Group | 'all', string][]).map(([id, label]) => ({ label, onClick: () => set({ grp: id }), ...pill(b.grp === id) })),
      lib: lib.map(l => {
        const on = ids.has(l[0]);
        return {
          name: l[1], icon: on ? 'check' : 'add', onClick: () => toggle(l[0]),
          bg: on ? 'rgba(var(--fb-a,236,40,78),.16)' : 'rgba(var(--fb-fg,255,255,255),.04)',
          color: on ? 'rgb(var(--fb-a4,255,130,154))' : 'var(--fb-tx,#f5efe9)',
          border: on ? '1px solid rgba(var(--fb-a,236,40,78),.45)' : '1px solid rgba(var(--fb-fg,255,255,255),.08)'
        };
      }),
      days: DAYS.map((label, d) => {
        const on = b.days.includes(d), t = taken(d);
        return {
          label, title: t ? `Actuellement : ${t.name}` : '',
          onClick: () => set({ days: on ? b.days.filter(x => x !== d) : [...b.days, d] }),
          bg: on ? 'rgb(var(--fb-a,236,40,78))' : 'rgba(var(--fb-fg,255,255,255),.05)',
          color: on ? 'var(--fb-on,#fff)' : t ? 'var(--fb-tx3,#a8978c)' : 'var(--fb-tx2,#d4c2b6)',
          border: on ? 'none' : t ? '1px dashed rgba(var(--fb-fg,255,255,255),.2)' : '1px solid rgba(var(--fb-fg,255,255,255),.1)',
          shadow: on ? '0 0 14px rgba(var(--fb-a,236,40,78),.45)' : 'none'
        };
      }),
      daysHint: moved.length ? `Remplacera : ${moved.join(', ')}`
        : b.days.length ? `${b.days.length} jour${b.days.length > 1 ? 's' : ''} par semaine`
        : 'Les jours en pointillés sont déjà pris par un autre programme.',
      saveLabel: n ? `Enregistrer · ${n} exo${n > 1 ? 's' : ''}` : 'Ajoute un exercice', saveOp: n ? 1 : 0.45, save,
      delLabel: b.confirmDel ? 'Confirmer la suppression' : 'Supprimer le programme',
      delBg: b.confirmDel ? 'rgba(255,90,70,.15)' : 'transparent',
      del: remove
    }
  };
}

export type BuilderVals = ReturnType<typeof useBuilderVals>;
