// Données de l'utilisateur connecté, synchronisées en temps réel avec Firestore.
import type { User } from 'firebase/auth';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { perfHistory } from '../domain/stats';
import type { ActiveSession, PerfPoint, PhotoMeta, Profile, Program, SessionLog } from '../domain/types';
import * as repo from '../firebase/repo';

export interface Data {
  user: User;
  uid: string;
  email: string;
  /** null = pas encore de document profil (nouveau compte). */
  profile: Profile | null;
  programs: Program[];
  logs: SessionLog[];
  session: ActiveSession | null;
  photos: PhotoMeta[];
  history: Record<string, PerfPoint[]>;
  ready: boolean;
  error: string | null;
}

const Ctx = createContext<Data | null>(null);

export function DataProvider({ user, children }: { user: User; children: ReactNode }) {
  const uid = user.uid;
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [programs, setPrograms] = useState<Program[] | undefined>(undefined);
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [photos, setPhotos] = useState<PhotoMeta[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onError = (e: Error) => {
      console.error(e);
      setError('Impossible de synchroniser tes données');
    };
    const unsubs = [
      repo.subscribeProfile(uid, setProfile, onError),
      repo.subscribePrograms(uid, setPrograms, onError),
      repo.subscribeLogs(uid, setLogs, onError),
      repo.subscribeSession(uid, setSession, onError),
      repo.subscribePhotos(uid, setPhotos, onError)
    ];
    return () => unsubs.forEach(u => u());
  }, [uid]);

  const history = useMemo(() => perfHistory(logs), [logs]);

  const value = useMemo<Data>(() => ({
    user, uid, email: user.email || '', profile: profile ?? null, programs: programs ?? [], logs, session, photos, history,
    ready: profile !== undefined && programs !== undefined, error
  }), [user, uid, profile, programs, logs, session, photos, history, error]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useData() {
  const d = useContext(Ctx);
  if (!d) throw new Error('useData hors DataProvider');
  return d;
}
