import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { groupIcon } from '../../domain/constants';
import { fmtDur, mondayOf, pad, r25, dateKey } from '../../domain/dates';
import { autoSubtitle } from '../../domain/library';
import { bestSet, buildLog, doneSets, initEx, isStale, logSet, mergeLog, removeSet, sessionExercises } from '../../domain/session';
import { best } from '../../domain/stats';
import type { ActiveSession, Exercise, SessionEx } from '../../domain/types';
import { clearSession, saveLogAndEndSession } from '../../firebase/repo';
import { useApp } from '../../state/app';
import { anim, popRef } from '../../ui/anim';
import { unlockAudio } from '../../ui/beep';
import { useReenter } from '../shell/shellVals';
import { useStartSession } from './useStartSession';

const fmtKg = (n: number) => String(n).replace('.', ',');
const fmtAgo = (ms: number) => (ms < 86400_000 ? `${Math.round(ms / 3600_000)} h` : `${Math.round(ms / 86400_000)} j`);
const ACCENT = 'rgb(var(--fb-a,236,40,78))';

/** Bouton à double appui : le premier arme la confirmation pendant 4 s. */
function useConfirm() {
  const [armed, setArmed] = useState<string | null>(null);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(null), 4000);
    return () => clearTimeout(t);
  }, [armed]);
  return { armed, ask: (k: string, run: () => void) => (armed === k ? (setArmed(null), run()) : setArmed(k)) };
}

export function useSessionVals() {
  const a = useApp();
  const start = useStartSession();
  const se = a.session;
  const sp = se ? a.programs.find(x => x.id === se.programId) : undefined;
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState(false);
  const confirm = useConfirm();
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

  const order: Exercise[] = sp && se ? sessionExercises(sp, se) : [];
  const ci = se ? Math.min(Math.max(0, se.cur || 0), Math.max(0, order.length - 1)) : 0;
  // Exercice ajouté au programme pendant la séance : état initial calculé à la volée.
  const exOf = (e: Exercise): SessionEx => se?.ex[e.id] ?? initEx(e, a.history);

  useEffect(() => {
    if (prevCur.current != null && prevCur.current !== ci)
      anim(curEl.current, [{ opacity: 0, transform: `translateX(${ci > prevCur.current ? 28 : -28}px)` }, { opacity: 1, transform: 'none' }], { duration: 340 });
    prevCur.current = ci;
  }, [ci]);

  const save = (s: ActiveSession, immediate = false) => a.saveSessionLocal(s, immediate);
  const withEx = (s: ActiveSession) => ({ ...s, ex: Object.fromEntries(order.map(e => [e.id, s.ex[e.id] ?? exOf(e)])) });
  const updSx = (e: Exercise, patch: Partial<SessionEx>, immediate = false) => {
    if (!se) return;
    save({ ...se, ex: { ...se.ex, [e.id]: { ...exOf(e), ...patch } } }, immediate);
  };
  const setCur = (i: number) => se && save({ ...se, cur: i }, true);
  const rest = (e: Exercise) => a.setRestEnd(Date.now() + (+(e.rest ?? 0) || a.profile.rest) * 1000);

  const end = () => {
    a.dropSessionLocal();
    a.setRestEnd(null);
    a.go('home');
  };
  const cancel = () => {
    end();
    clearSession(a.uid).catch(a.fail);
  };
  const finish = () => {
    if (!se || !sp) return;
    const now = Date.now();
    const log = buildLog(sp, se, now);
    if (!Object.keys(log.perf).length) return cancel();
    end();
    // Pas d'await : hors-ligne, la promesse n'aboutit qu'au retour du réseau (écriture déjà en cache local).
    saveLogAndEndSession(a.uid, mergeLog(a.logs.find(l => l.date === log.date) || null, log)).catch(a.fail);
    a.flash(`Séance enregistrée · ${log.minutes} min`);
    const wk = dateKey(mondayOf(new Date()));
    if (!a.photos.some(p => p.week === wk)) setTimeout(() => a.setPhotoPrompt(true), 700);
  };

  /** Modification en cours de séance : pour cette fois, ou aussi dans le programme. */
  const applyEdit = (exs: Exercise[], alsoProgram: boolean) => {
    if (!se || !sp) return;
    const curId = order[ci]?.id;
    const ex: ActiveSession['ex'] = {};
    exs.forEach(e => {
      const x = se.ex[e.id] ?? initEx(e, a.history), sets = doneSets(x);
      // Séance d'avant le suivi par série : l'état « fait » est conservé.
      ex[e.id] = { ...x, sets, done: x.sets ? sets.length >= Math.max(1, e.sets) : x.done };
    });
    const idx = exs.findIndex(e => e.id === curId);
    const next = { ...se, ex, cur: idx >= 0 ? idx : Math.min(ci, exs.length - 1), lastAt: Date.now() };
    if (alsoProgram) {
      a.saveProg({ ...sp, exercises: exs, subtitle: autoSubtitle(exs) }, true);
      delete (next as ActiveSession).plan;
    } else next.plan = exs;
    save(next, true);
    setEditing(false);
    a.flash(alsoProgram ? 'Séance et programme mis à jour' : 'Séance modifiée');
  };

  let sess = null;
  if (se && sp) {
    const now = Math.max(a.now, Date.now());
    const ce = order[ci];
    const doneCount = order.filter(e => exOf(e).done).length;
    const anySet = order.some(e => doneSets(exOf(e)).length);
    let c = {
      num: 0, name: 'Aucun exercice', machine: '', icon: 'fitness_center', target: '', best: '—', w: '0', r: '0', hasNote: false, note: '',
      onW: (_: ChangeEvent<HTMLInputElement>) => {}, onR: (_: ChangeEvent<HTMLInputElement>) => {},
      wMinus: () => {}, wPlus: () => {}, rMinus: () => {}, rPlus: () => {}, validate: () => {},
      validateLabel: '', btnIcon: 'check', btnBg: '', btnColor: '', btnBorder: '', btnShadow: '',
      sets: [] as { label: string; sub: string; onClick: () => void; bg: string; color: string; border: string; icon: string; title: string }[],
      setsHint: ''
    };
    if (ce) {
      const x = exOf(ce);
      const b = best(a.history[ce.id] || []);
      const done = doneSets(x), target = Math.max(1, +ce.sets || 1);
      const field = (k: 'w' | 'r') => ({
        value: drafts[`${ce.id}.${k}`] ?? fmtKg(x[k]),
        onChange: (ev: ChangeEvent<HTMLInputElement>) => {
          const raw = ev.target.value;
          setDrafts(d => ({ ...d, [`${ce.id}.${k}`]: raw }));
          const n = Number(raw.replace(',', '.'));
          if (raw.trim() !== '' && Number.isFinite(n) && n >= 0) updSx(ce, { [k]: k === 'r' ? Math.round(n) : n });
        }
      });
      const step = (k: 'w' | 'r', v: number) => {
        setDrafts(({ [`${ce.id}.${k}`]: _, ...d }) => d);
        updSx(ce, { [k]: v });
      };
      const w = field('w'), r = field('r');
      c = {
        num: ci + 1, name: ce.name, machine: ce.machine || '—', icon: groupIcon(ce.group),
        target: `${ce.sets} × ${ce.reps}${+ce.weight ? ` · ${fmtKg(ce.weight)} kg` : ''}`,
        best: b ? `${fmtKg(b.w)} kg × ${b.r}` : '—', w: w.value, r: r.value, hasNote: !!ce.note, note: ce.note || '', onW: w.onChange, onR: r.onChange,
        wMinus: () => step('w', Math.max(0, r25((+x.w || 0) - 2.5))), wPlus: () => step('w', Math.min(1000, r25((+x.w || 0) + 2.5))),
        rMinus: () => step('r', Math.max(0, (+x.r || 0) - 1)), rPlus: () => step('r', Math.min(500, (+x.r || 0) + 1)),
        validate: () => {
          unlockAudio();
          setDrafts({});
          const res = logSet(withEx(se), order, ci, Date.now());
          save(res.session, true);
          // Repos après chaque série, sauf la toute dernière de la séance.
          if (a.profile.autoTimer && !res.allDone) rest(ce);
          if (res.allDone && res.exerciseDone) a.flash('Tous les exercices sont faits · tu peux terminer');
        },
        validateLabel: x.done ? 'Ajouter une série' : `Valider la série ${done.length + 1} / ${target}`,
        btnIcon: x.done ? 'add' : 'check',
        btnBg: x.done ? 'rgba(var(--fb-fg,255,255,255),.06)' : ACCENT,
        btnColor: x.done ? 'var(--fb-tx,#f5efe9)' : 'var(--fb-on,#fff)',
        btnBorder: x.done ? '1px solid rgba(var(--fb-fg,255,255,255),.14)' : 'none',
        btnShadow: x.done ? 'none' : '0 10px 28px rgba(var(--fb-a,236,40,78),.45)',
        sets: [
          ...done.map((s, k) => ({
            label: `${k + 1}`, sub: `${fmtKg(s.w)} × ${s.r}`, icon: 'check', title: 'Toucher pour retirer cette série',
            onClick: () => confirm.ask(`set-${ce.id}-${k}`, () => save(removeSet(withEx(se), ce, k, Date.now()), true)),
            bg: confirm.armed === `set-${ce.id}-${k}` ? 'rgba(255,90,70,.18)' : 'rgba(var(--fb-a,236,40,78),.14)',
            color: confirm.armed === `set-${ce.id}-${k}` ? '#ff8a73' : 'var(--fb-tx,#f5efe9)',
            border: confirm.armed === `set-${ce.id}-${k}` ? '1px solid rgba(255,90,70,.45)' : '1px solid rgba(var(--fb-a,236,40,78),.35)'
          })),
          ...Array.from({ length: Math.max(0, target - done.length) }, (_, k) => ({
            label: `${done.length + k + 1}`, sub: k === 0 ? 'en cours' : 'à faire', icon: k === 0 ? 'radio_button_checked' : 'radio_button_unchecked', title: '',
            onClick: () => {}, bg: 'transparent', color: k === 0 ? 'var(--fb-tx,#f5efe9)' : 'var(--fb-tx4,#8e7d72)',
            border: k === 0 ? '1.5px dashed rgba(var(--fb-a3,255,92,124),.55)' : '1px dashed rgba(var(--fb-fg,255,255,255),.14)'
          }))
        ],
        setsHint: confirm.armed?.startsWith(`set-${ce.id}-`) ? 'Touche encore pour retirer la série' : done.length ? 'Touche une série pour la retirer' : ''
      };
    }
    const idle = now - (se.lastAt ?? se.startedAt);
    sess = {
      name: sp.name, icon: sp.icon, total: order.length, done: doneCount,
      elapsed: fmtDur(now - se.startedAt), c,
      edit: () => setEditing(true),
      edited: !!se.plan,
      stale: isStale(se, now),
      staleText: `Séance commencée il y a ${fmtAgo(now - se.startedAt)}, sans activité depuis ${fmtAgo(idle)}.`,
      staleSave: finish,
      staleResume: () => save({ ...se, startedAt: Date.now(), lastAt: Date.now() }, true),
      list: order.map((e, i) => {
        const x = exOf(e), cur = i === ci, sets = doneSets(x), bs = bestSet(sets);
        return {
          name: e.name, onClick: () => setCur(i),
          sub: x.done && bs ? `${fmtKg(bs.w)} kg × ${bs.r} · ${sets.length} série${sets.length > 1 ? 's' : ''}` : sets.length ? `${sets.length} / ${e.sets} séries` : `${e.sets} × ${e.reps}`,
          stIcon: x.done ? 'check' : groupIcon(e.group),
          bg: cur ? 'rgba(var(--fb-a,236,40,78),.14)' : 'transparent',
          border: cur ? '1px solid rgba(var(--fb-a,236,40,78),.35)' : '1px solid transparent',
          dotBg: x.done ? ACCENT : cur ? 'rgba(var(--fb-a,236,40,78),.2)' : 'rgba(var(--fb-fg,255,255,255),.05)',
          dotColor: x.done ? 'var(--fb-on,#fff)' : cur ? 'rgb(var(--fb-a4,255,130,154))' : 'var(--fb-tx4,#8e7d72)',
          dotGlow: x.done ? '0 0 12px rgba(var(--fb-a,236,40,78),.55)' : 'none',
          nameColor: x.done && !cur ? 'var(--fb-tx3,#a8978c)' : 'var(--fb-tx,#f5efe9)',
          seg: x.done ? ACCENT : cur || sets.length ? 'rgba(var(--fb-a,236,40,78),.45)' : 'rgba(var(--fb-fg,255,255,255),.08)',
          segGlow: x.done ? '0 0 8px rgba(var(--fb-a,236,40,78),.6)' : 'none'
        };
      }),
      prev: () => ci > 0 && setCur(ci - 1), next: () => ci < order.length - 1 && setCur(ci + 1),
      prevOp: ci > 0 ? 1 : 0.35, nextOp: ci < order.length - 1 ? 1 : 0.35,
      cancelLabel: confirm.armed === 'cancel' ? 'Confirmer ?' : 'Abandonner',
      cancelColor: confirm.armed === 'cancel' ? '#ff8a73' : 'var(--fb-tx2,#d4c2b6)',
      cancelBorder: confirm.armed === 'cancel' ? '1px solid rgba(255,90,70,.5)' : '1px solid rgba(var(--fb-fg,255,255,255),.16)',
      finishLabel: confirm.armed === 'finish' ? 'Rien à enregistrer · quitter ?' : 'Terminer',
      finish: () => (anySet ? finish() : confirm.ask('finish', cancel))
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
    cancelSession: () => confirm.ask('cancel', cancel),
    /** Éditeur ouvert sur les exercices de la séance. */
    editor: editing && sp && se ? { program: { ...sp, exercises: order }, onApply: applyEdit, onClose: () => setEditing(false) } : null
  };
}

export type SessionVals = ReturnType<typeof useSessionVals>;
