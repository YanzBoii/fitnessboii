// État applicatif partagé entre les écrans : navigation, toasts, minuteur de repos,
// profil/programmes avec modifications locales différées, photos.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { DEFAULT_PROFILE } from '../domain/constants';
import { dateKey, mondayOf } from '../domain/dates';
import type { ActiveSession, Profile, Program } from '../domain/types';
import { compressToJpeg, savePhoto } from '../firebase/photoApi';
import * as repo from '../firebase/repo';
import { useData, type Data } from './data';
import { useToast } from './toast';
import { useOverlay } from './useOverlay';

export type Tab = 'home' | 'programs' | 'session' | 'perf' | 'settings';

export interface App extends Data {
  profile: Profile;
  programs: Program[];
  session: ActiveSession | null;
  w: number;
  isMobile: boolean;
  tab: Tab;
  go: (t: Tab) => void;
  progId: string | null;
  setProgId: (id: string | null) => void;
  profileOpen: boolean;
  setProfileOpen: (o: boolean) => void;
  flash: (msg: string) => void;
  fail: (e: unknown, msg?: string) => void;
  now: number;
  restEnd: number | null;
  setRestEnd: (t: number | null) => void;
  photoPrompt: boolean;
  setPhotoPrompt: (o: boolean) => void;
  pickPhoto: () => void;
  photoBusy: boolean;
  setting: <K extends keyof Profile>(k: K, v: Profile[K]) => void;
  saveProg: (p: Program, immediate?: boolean) => void;
  /** Annule une modification en attente (programme supprimé). */
  dropProg: (id: string) => void;
  saveSessionLocal: (s: ActiveSession, immediate?: boolean) => void;
  /** À appeler avant de terminer/abandonner : annule une saisie en attente. */
  dropSessionLocal: () => void;
}

const Ctx = createContext<App | null>(null);

const TAB_KEY = 'fitnessboii-tab';
const readTab = (): Tab => {
  try {
    const t = localStorage.getItem(TAB_KEY) as Tab | null;
    return t && ['home', 'programs', 'session', 'perf', 'settings'].includes(t) ? t : 'home';
  } catch {
    return 'home';
  }
};

export function AppProvider({ children }: { children: ReactNode }) {
  const data = useData();
  const { uid } = data;
  const [w, setW] = useState(window.innerWidth);
  const [tab, setTab] = useState<Tab>(readTab);
  const [progId, setProgId] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [restEnd, setRestEnd] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [photoPrompt, setPhotoPrompt] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const fileEl = useRef<HTMLInputElement | null>(null);

  const flash = useToast();
  const fail = useCallback((e: unknown, msg = 'Erreur de synchronisation') => {
    console.error(e);
    flash(navigator.onLine ? msg : 'Hors-ligne : ce sera synchronisé plus tard');
  }, [flash]);

  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Profil : surcouche locale, écriture différée.
  // Le patch s'accumule dans une ref : deux réglages modifiés coup sur coup partent ensemble.
  const patch = useRef<Partial<Profile>>({});
  const prof = useOverlay<Partial<Profile>>((_, p) => {
    patch.current = {};
    return repo.saveProfile(uid, p);
  }, fail);
  const profile = useMemo<Profile>(() => ({ ...DEFAULT_PROFILE, ...data.profile, ...prof.overlay.p }), [data.profile, prof.overlay.p]);
  const setting = useCallback(<K extends keyof Profile>(k: K, v: Profile[K]) => {
    patch.current = { ...patch.current, [k]: v };
    prof.set('p', patch.current, typeof v !== 'string' && typeof v !== 'number');
  }, [prof]);

  // Programmes : surcouche locale par programme.
  const progs = useOverlay<Program>((_, p) => repo.saveProgram(uid, p), fail);
  const programs = useMemo(() => {
    const byId = new Map(data.programs.map(p => [p.id, p]));
    Object.values(progs.overlay).forEach(p => byId.set(p.id, p));
    return [...byId.values()].sort((a, b) => a.order - b.order);
  }, [data.programs, progs.overlay]);
  const saveProg = useCallback((p: Program, immediate = false) => progs.set(p.id, p, immediate), [progs]);
  const dropProg = useCallback((id: string) => progs.clear(id), [progs]);

  // Séance en cours : surcouche locale (saisie des charges).
  const sess = useOverlay<ActiveSession>((_, s) => repo.saveSession(uid, s), fail, 600);
  const session = sess.overlay.s ?? data.session;
  const saveSessionLocal = useCallback((s: ActiveSession, immediate = false) => sess.set('s', s, immediate), [sess]);
  const dropSessionLocal = useCallback(() => sess.clear('s'), [sess]);

  // Horloge : chrono de séance et minuteur de repos.
  useEffect(() => {
    if (!restEnd && !(session && tab === 'session')) return;
    const t = setInterval(() => {
      const n = Date.now();
      setNow(n);
      if (restEnd && n >= restEnd) setRestEnd(null);
    }, 500);
    return () => clearInterval(t);
  }, [restEnd, session, tab]);

  const go = useCallback((t: Tab) => {
    setTab(t);
    try { localStorage.setItem(TAB_KEY, t); } catch { /* stockage indisponible */ }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const pickPhoto = useCallback(() => fileEl.current?.click(), []);
  const onFile = useCallback(async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const f = ev.target.files?.[0];
    ev.target.value = '';
    if (!f) return;
    if (!navigator.onLine) return flash('Connexion requise pour envoyer une photo');
    setPhotoBusy(true);
    try {
      const jpeg = await compressToJpeg(f);
      const d = new Date();
      await savePhoto(uid, dateKey(mondayOf(d)), dateKey(d), jpeg);
      setPhotoPrompt(false);
      flash('Photo ajoutée');
    } catch (e) {
      fail(e, (e as Error).message === 'not-image' ? 'Ce fichier n’est pas une image' : 'Impossible d’ajouter la photo');
    } finally {
      setPhotoBusy(false);
    }
  }, [uid, flash, fail]);

  const value: App = {
    ...data, profile, programs, session, w, isMobile: w < 860, tab, go, progId, setProgId, profileOpen, setProfileOpen,
    flash, fail, now, restEnd, setRestEnd, photoPrompt, setPhotoPrompt, pickPhoto, photoBusy, setting, saveProg, dropProg,
    saveSessionLocal, dropSessionLocal
  };

  return (
    <Ctx.Provider value={value}>
      {children}
      <input ref={fileEl} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
    </Ctx.Provider>
  );
}

export function useApp() {
  const a = useContext(Ctx);
  if (!a) throw new Error('useApp hors AppProvider');
  return a;
}
