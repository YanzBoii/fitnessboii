import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { groupIcon } from '../../domain/constants';
import { dateKey, fmtDur, mondayOf, pad, r25 } from '../../domain/dates';
import { buildLog, mergeLog, nextTodo } from '../../domain/session';
import { best } from '../../domain/stats';
import type { ActiveSession, SessionEx } from '../../domain/types';
import { clearSession, saveLogAndEndSession } from '../../firebase/repo';
import { useApp } from '../../state/app';
import { anim, popRef } from '../../ui/anim';
import { useReenter } from '../shell/shellVals';
import { useStartSession } from './useStartSession';

const fmtKg = (n: number) => String(n).replace('.', ',');

export function useSessionVals() {
  const a = useApp();
  const start = useStartSession();
  const se = a.session;
  const sp = se ? a.programs.find(x => x.id === se.programId) : undefined;
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const curEl = useRef<HTMLElement | null>(null);
  const prevCur = useRef<number | null>(null);

  useReenter([!!se]);

  // Programme supprimé entre-temps : la séance orpheline est abandonnée.
  useEffect(() => {
    if (se && a.ready && !sp) {
      a.dropSessionLocal();
      clearSession(a.uid).catch(a.fail);
    }
  }, [se, sp, a]);

  const order = sp && se ? sp.exercises.filter(e => se.ex[e.id]) : [];
  const ci = se ? Math.min(Math.max(0, se.cur || 0), Math.max(0, order.length - 1)) : 0;

  useEffect(() => {
    if (prevCur.current != null && prevCur.current !== ci)
      anim(curEl.current, [{ opacity: 0, transform: `translateX(${ci > prevCur.current ? 28 : -28}px)` }, { opacity: 1, transform: 'none' }], { duration: 340 });
    prevCur.current = ci;
  }, [ci]);

  const save = (s: ActiveSession, immediate = false) => a.saveSessionLocal(s, immediate);
  const updSx = (id: string, patch: Partial<SessionEx>, immediate = false) => {
    if (!se) return;
    save({ ...se, ex: { ...se.ex, [id]: { ...se.ex[id], ...patch } } }, immediate);
  };
  const setCur = (i: number) => se && save({ ...se, cur: i }, true);

  const finish = () => {
    if (!se || !sp) return;
    const now = Date.now(), today = dateKey(new Date(now));
    const log = mergeLog(a.logs.find(l => l.date === today) || null, buildLog(sp, se, today, now));
    a.dropSessionLocal();
    // Pas d'await : hors-ligne, la promesse n'aboutit qu'au retour du réseau (écriture déjà en cache local).
    saveLogAndEndSession(a.uid, log).catch(a.fail);
    a.setRestEnd(null);
    a.go('home');
    a.flash(`Séance enregistrée · ${Math.max(1, Math.round((now - se.startedAt) / 60000))} min`);
    const wk = dateKey(mondayOf(new Date()));
    if (!a.photos.some(p => p.week === wk)) setTimeout(() => a.setPhotoPrompt(true), 700);
  };

  const cancel = () => {
    a.dropSessionLocal();
    clearSession(a.uid).catch(a.fail);
    a.setRestEnd(null);
    a.go('home');
  };

  let sess = null;
  if (se && sp) {
    const ce = order[ci];
    const doneCount = order.filter(e => se.ex[e.id].done).length;
    let c = {
      num: 0, name: 'Aucun exercice', machine: '', icon: 'fitness_center', target: '', best: '—', w: '0', r: '0', hasNote: false, note: '',
      onW: (_: ChangeEvent<HTMLInputElement>) => {}, onR: (_: ChangeEvent<HTMLInputElement>) => {},
      wMinus: () => {}, wPlus: () => {}, rMinus: () => {}, rPlus: () => {}, validate: () => {},
      validateLabel: '', btnIcon: 'check', btnBg: '', btnColor: '', btnBorder: '', btnShadow: ''
    };
    if (ce) {
      const x = se.ex[ce.id];
      const b = best(a.history[ce.id] || []);
      const isLastTodo = order.every((e, i) => i === ci || se.ex[e.id].done);
      const field = (k: 'w' | 'r') => ({
        value: drafts[`${ce.id}.${k}`] ?? fmtKg(x[k]),
        onChange: (ev: ChangeEvent<HTMLInputElement>) => {
          const raw = ev.target.value;
          setDrafts(d => ({ ...d, [`${ce.id}.${k}`]: raw }));
          const n = Number(raw.replace(',', '.'));
          if (raw.trim() !== '' && Number.isFinite(n) && n >= 0) updSx(ce.id, { [k]: k === 'r' ? Math.round(n) : n });
        }
      });
      const step = (k: 'w' | 'r', v: number) => {
        setDrafts(({ [`${ce.id}.${k}`]: _, ...d }) => d);
        updSx(ce.id, { [k]: v });
      };
      const w = field('w'), r = field('r');
      c = {
        num: ci + 1, name: ce.name, machine: ce.machine || '—', icon: groupIcon(ce.group),
        target: `${ce.sets} × ${ce.reps}${+ce.weight ? ` · ${fmtKg(ce.weight)} kg` : ''}`,
        best: b ? `${fmtKg(b.w)} kg × ${b.r}` : '—', w: w.value, r: r.value, hasNote: !!ce.note, note: ce.note || '', onW: w.onChange, onR: r.onChange,
        wMinus: () => step('w', Math.max(0, r25((+x.w || 0) - 2.5))), wPlus: () => step('w', Math.min(1000, r25((+x.w || 0) + 2.5))),
        rMinus: () => step('r', Math.max(0, (+x.r || 0) - 1)), rPlus: () => step('r', Math.min(500, (+x.r || 0) + 1)),
        validate: () => {
          const exs = { ...se.ex, [ce.id]: { ...x, done: true } };
          const nx = nextTodo(order.map(e => e.id), exs, ci);
          save({ ...se, ex: exs, cur: nx }, true);
          if (!x.done && a.profile.autoTimer && nx !== ci) a.setRestEnd(Date.now() + (+(ce.rest ?? 0) || a.profile.rest) * 1000);
        },
        validateLabel: x.done ? 'Mettre à jour' : isLastTodo ? 'Valider le dernier exo' : 'Valider · exo suivant',
        btnIcon: x.done ? 'edit' : 'check',
        btnBg: x.done ? 'rgba(var(--fb-fg,255,255,255),.06)' : 'rgb(var(--fb-a,236,40,78))',
        btnColor: 'var(--fb-on,#fff)',
        btnBorder: x.done ? '1px solid rgba(var(--fb-fg,255,255,255),.14)' : 'none',
        btnShadow: x.done ? 'none' : '0 10px 28px rgba(var(--fb-a,236,40,78),.45)'
      };
    }
    sess = {
      name: sp.name, icon: sp.icon, total: order.length, done: doneCount,
      elapsed: fmtDur(Math.max(a.now, Date.now()) - se.startedAt), c,
      list: order.map((e, i) => {
        const x = se.ex[e.id], cur = i === ci;
        return {
          name: e.name, onClick: () => setCur(i), sub: x.done ? `${fmtKg(x.w)} kg × ${x.r}` : `${e.sets} × ${e.reps}`,
          stIcon: x.done ? 'check' : groupIcon(e.group),
          bg: cur ? 'rgba(var(--fb-a,236,40,78),.14)' : 'transparent',
          border: cur ? '1px solid rgba(var(--fb-a,236,40,78),.35)' : '1px solid transparent',
          dotBg: x.done ? 'rgb(var(--fb-a,236,40,78))' : cur ? 'rgba(var(--fb-a,236,40,78),.2)' : 'rgba(var(--fb-fg,255,255,255),.05)',
          dotColor: x.done ? 'var(--fb-on,#fff)' : cur ? 'rgb(var(--fb-a4,255,130,154))' : 'var(--fb-tx4,#8e7d72)',
          dotGlow: x.done ? '0 0 12px rgba(var(--fb-a,236,40,78),.55)' : 'none',
          nameColor: x.done && !cur ? 'var(--fb-tx3,#a8978c)' : 'var(--fb-tx,#f5efe9)',
          seg: x.done ? 'rgb(var(--fb-a,236,40,78))' : cur ? 'rgba(var(--fb-a,236,40,78),.45)' : 'rgba(var(--fb-fg,255,255,255),.08)',
          segGlow: x.done ? '0 0 8px rgba(var(--fb-a,236,40,78),.6)' : 'none'
        };
      }),
      prev: () => ci > 0 && setCur(ci - 1), next: () => ci < order.length - 1 && setCur(ci + 1),
      prevOp: ci > 0 ? 1 : 0.35, nextOp: ci < order.length - 1 ? 1 : 0.35
    };
  }

  const restLeft = a.restEnd ? Math.max(0, Math.ceil((a.restEnd - a.now) / 1000)) : 0;

  return {
    noSession: !sess, hasSession: !!sess, sess: sess!,
    progTabs: a.programs.map(p => ({ name: p.name, subtitle: p.subtitle, icon: p.icon, onStart: () => start(p.id) })),
    curRef: (el: HTMLElement | null) => { curEl.current = el; },
    popRef,
    hasRestInline: !!a.restEnd,
    restLabel: `${Math.floor(restLeft / 60)}:${pad(restLeft % 60)}`,
    restPlus: () => a.restEnd && a.setRestEnd(a.restEnd + 15000),
    restSkip: () => a.setRestEnd(null),
    cancelSession: cancel,
    finishSession: finish
  };
}

export type SessionVals = ReturnType<typeof useSessionVals>;
