import { useRef, useState, type ChangeEvent, type MouseEvent } from 'react';
import { REST_OPTIONS } from '../../domain/constants';
import type { Profile, RestSeconds } from '../../domain/types';
import { authMessage, deleteAccountAndData, errCode, isPasswordUser, logout } from '../../firebase/authApi';
import { exportAll, saveProfile, wipeAll } from '../../firebase/repo';
import { useApp } from '../../state/app';
import { reducedMotion } from '../../ui/theme';
import { anim } from '../../ui/anim';

type Ev = ChangeEvent<HTMLInputElement>;

export function useProfileVals() {
  const a = useApp();
  const S = a.profile;
  const mob = a.isMobile;
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [delPw, setDelPw] = useState('');
  const [drafts, setDrafts] = useState<Partial<Record<'bodyWeight' | 'height', string>>>({});
  const bd = useRef<HTMLElement | null>(null), pn = useRef<HTMLElement | null>(null);
  const closing = useRef(false);

  const close = () => {
    if (closing.current) return;
    const done = () => { closing.current = false; a.setProfileOpen(false); };
    if (reducedMotion() || !pn.current?.animate) return done();
    closing.current = true;
    bd.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: 'forwards' });
    pn.current.animate(mob ? [{ transform: 'none' }, { transform: 'translateY(100%)' }] : [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(12px) scale(.97)' }],
      { duration: 240, easing: 'cubic-bezier(.4,0,.8,.4)', fill: 'forwards' });
    setTimeout(done, 250);
  };

  const num = (k: 'bodyWeight' | 'height') => (ev: Ev) => {
    const raw = ev.target.value;
    setDrafts(d => ({ ...d, [k]: raw }));
    const n = Number(raw.replace(',', '.'));
    if (raw.trim() !== '' && Number.isFinite(n) && n > 0) a.setting(k, n as Profile[typeof k]);
  };

  const needsPw = isPasswordUser(a.user);

  return {
    backdropRef: (el: HTMLElement | null) => {
      if (!el || bd.current === el) return;
      bd.current = el;
      anim(el, [{ opacity: 0 }, { opacity: 1 }], { duration: 260 });
    },
    panelRef: (el: HTMLElement | null) => {
      if (!el || pn.current === el) return;
      pn.current = el;
      anim(el, mob ? [{ transform: 'translateY(100%)' }, { transform: 'none' }] : [{ opacity: 0, transform: 'translateY(16px) scale(.96)' }, { opacity: 1, transform: 'none' }],
        { duration: mob ? 420 : 340, easing: 'cubic-bezier(.2,.9,.25,1)' });
    },
    closeProfile: close,
    stop: (ev: MouseEvent) => ev.stopPropagation(),
    sheetAlign: mob ? 'flex-end' : 'center', sheetPad: mob ? '0' : '24px', sheetMaxH: mob ? '90vh' : '86vh', sheetRadius: mob ? '26px 26px 0 0' : '26px',
    initial: (S.name || '?').trim().charAt(0).toUpperCase(),
    settings: {
      name: S.name, email: a.email, goal: S.goal,
      bodyWeight: drafts.bodyWeight ?? String(S.bodyWeight), height: drafts.height ?? String(S.height)
    },
    onName: (ev: Ev) => a.setting('name', ev.target.value.slice(0, 40)),
    onEmail: () => {},
    onBodyWeight: num('bodyWeight'),
    onHeight: num('height'),
    goalDown: () => a.setting('goal', Math.max(1, S.goal - 1)),
    goalUp: () => a.setting('goal', Math.min(7, S.goal + 1)),
    restOptions: REST_OPTIONS.map(v => {
      const on = S.rest === v;
      return {
        label: v < 120 ? `${v} s` : `${v / 60} min`, onClick: () => a.setting('rest', v as RestSeconds),
        bg: on ? 'rgb(var(--fb-a,236,40,78))' : 'rgba(var(--fb-fg,255,255,255),.05)',
        color: on ? 'var(--fb-on,#fff)' : 'var(--fb-tx2,#d4c2b6)', border: on ? 'none' : '1px solid rgba(var(--fb-fg,255,255,255),.1)'
      };
    }),
    toggles: ([['autoTimer', 'Minuteur de repos auto'], ['remind', 'Rappels les jours de séance (bientôt)']] as const).map(([k, label]) => ({
      label, onClick: () => a.setting(k, !S[k]),
      track: S[k] ? 'rgb(var(--fb-a,236,40,78))' : 'rgba(var(--fb-fg,255,255,255),.12)',
      justify: S[k] ? 'flex-end' : 'flex-start'
    })),
    logout: () => { logout().catch(a.fail); },
    redoOb: () => { a.setProfileOpen(false); saveProfile(a.uid, { onboarded: false }).catch(a.fail); },
    exportData: async () => {
      try {
        const data = await exportAll(a.uid);
        const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = `fitnessboii-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (e) {
        a.fail(e, 'Export impossible');
      }
    },
    resetData: async () => {
      if (!confirmReset) return setConfirmReset(true);
      setConfirmReset(false);
      try {
        a.setProfileOpen(false);
        await wipeAll(a.uid, false);
        await saveProfile(a.uid, { onboarded: false });
        a.flash('Données réinitialisées');
      } catch (e) {
        a.fail(e, 'Réinitialisation impossible');
      }
    },
    resetLabel: confirmReset ? 'Confirmer la réinitialisation' : 'Réinitialiser mes données',
    resetBg: confirmReset ? 'rgba(255,90,70,.15)' : 'transparent',
    askPassword: confirmDelete && needsPw,
    delPw,
    onDelPw: (ev: Ev) => setDelPw(ev.target.value),
    deleting,
    deleteAccount: async () => {
      if (!confirmDelete) return setConfirmDelete(true);
      if (needsPw && !delPw) return a.flash('Entre ton mot de passe pour confirmer');
      if (!navigator.onLine) return a.flash('Connexion requise pour supprimer le compte');
      setDeleting(true);
      try {
        await deleteAccountAndData(a.user, delPw);
      } catch (e) {
        // Seul le mot de passe est saisi ici : pas de mention de l'email.
        const badPw = ['auth/invalid-credential', 'auth/wrong-password'].includes(errCode(e));
        a.flash(badPw ? 'Mot de passe incorrect' : authMessage(e) || 'Suppression annulée');
        setDeleting(false);
      }
    },
    deleteLabel: deleting ? 'Suppression…' : confirmDelete ? 'Confirmer : tout supprimer définitivement' : 'Supprimer mon compte',
    deleteBg: confirmDelete ? 'rgba(255,90,70,.18)' : 'transparent'
  };
}

export type ProfileVals = ReturnType<typeof useProfileVals>;
