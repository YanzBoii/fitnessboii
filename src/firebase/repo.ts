// Accès Firestore. Toutes les données d'un utilisateur vivent sous users/{uid} (cf. firestore.rules).
import {
  collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp,
  setDoc, writeBatch, type DocumentReference, type Unsubscribe
} from 'firebase/firestore';
import { DEFAULT_PROFILE } from '../domain/constants';
import { normalizeLog, normalizeProfile, normalizeProgram, normalizeSession } from '../domain/normalize';
import type { ActiveSession, PhotoMeta, Profile, Program, SessionLog } from '../domain/types';
import { db } from './config';

const userDoc = (uid: string) => doc(db, 'users', uid);
const sub = (uid: string, name: string) => collection(db, 'users', uid, name);
const sessionDoc = (uid: string) => doc(db, 'users', uid, 'session', 'current');

export const SUBCOLLECTIONS = ['programs', 'sessionLogs', 'session', 'photos', 'photoData'] as const;

type OnError = (e: Error) => void;

// ---------- Profil ----------
export function subscribeProfile(uid: string, cb: (p: Profile | null) => void, onError?: OnError): Unsubscribe {
  return onSnapshot(userDoc(uid), s => {
    cb(s.exists() ? { ...DEFAULT_PROFILE, ...normalizeProfile(s.data() as Partial<Profile>) } : null);
  }, onError);
}

export const saveProfile = (uid: string, patch: Partial<Profile>) =>
  setDoc(userDoc(uid), { ...normalizeProfile(patch), updatedAt: serverTimestamp() }, { merge: true });

/** Fin du questionnaire : profil + programmes en une seule écriture atomique. */
export async function completeOnboarding(uid: string, profile: Partial<Profile>, programs: Program[], isNew: boolean) {
  const b = writeBatch(db);
  b.set(userDoc(uid), {
    ...normalizeProfile({ ...profile, onboarded: true }),
    updatedAt: serverTimestamp(),
    ...(isNew ? { createdAt: serverTimestamp() } : {})
  }, { merge: true });
  programs.forEach(p => {
    const { id, ...data } = normalizeProgram(p);
    b.set(doc(sub(uid, 'programs'), id), data);
  });
  await b.commit();
}

// ---------- Programmes ----------
export function subscribePrograms(uid: string, cb: (p: Program[]) => void, onError?: OnError): Unsubscribe {
  return onSnapshot(query(sub(uid, 'programs'), orderBy('order')), s => {
    cb(s.docs.map(d => normalizeProgram({ ...(d.data() as Omit<Program, 'id'>), id: d.id })));
  }, onError);
}

export function saveProgram(uid: string, p: Program) {
  const { id, ...data } = normalizeProgram(p);
  return setDoc(doc(sub(uid, 'programs'), id), data);
}

/** Plusieurs programmes d'un coup (ex. réassignation d'un jour). */
export async function savePrograms(uid: string, ps: Program[]) {
  const b = writeBatch(db);
  ps.forEach(p => {
    const { id, ...data } = normalizeProgram(p);
    b.set(doc(sub(uid, 'programs'), id), data);
  });
  await b.commit();
}

export const deleteProgram = (uid: string, id: string) => deleteDoc(doc(sub(uid, 'programs'), id));

// ---------- Séances terminées ----------
export function subscribeLogs(uid: string, cb: (l: SessionLog[]) => void, onError?: OnError): Unsubscribe {
  return onSnapshot(query(sub(uid, 'sessionLogs'), orderBy('date')), s => {
    cb(s.docs.map(d => normalizeLog(d.data() as SessionLog)));
  }, onError);
}

export async function getLog(uid: string, date: string) {
  const s = await getDoc(doc(sub(uid, 'sessionLogs'), date));
  return s.exists() ? normalizeLog(s.data() as SessionLog) : null;
}

/** Enregistre le log du jour et termine la séance en cours (atomique). */
export async function saveLogAndEndSession(uid: string, log: SessionLog) {
  const b = writeBatch(db);
  b.set(doc(sub(uid, 'sessionLogs'), log.date), { ...normalizeLog(log), createdAt: serverTimestamp() });
  b.delete(sessionDoc(uid));
  await b.commit();
}

// ---------- Séance en cours ----------
export function subscribeSession(uid: string, cb: (s: ActiveSession | null) => void, onError?: OnError): Unsubscribe {
  return onSnapshot(sessionDoc(uid), s => cb(s.exists() ? normalizeSession(s.data() as ActiveSession) : null), onError);
}

export const saveSession = (uid: string, s: ActiveSession) => setDoc(sessionDoc(uid), normalizeSession(s));
export const clearSession = (uid: string) => deleteDoc(sessionDoc(uid));

// ---------- Photos (métadonnées) ----------
export function subscribePhotos(uid: string, cb: (p: PhotoMeta[]) => void, onError?: OnError): Unsubscribe {
  return onSnapshot(query(sub(uid, 'photos'), orderBy('week')), s => {
    cb(s.docs.map(d => ({ week: d.id, date: String(d.data().date) })));
  }, onError);
}

export const photoMetaRef = (uid: string, week: string) => doc(sub(uid, 'photos'), week);
export const photoDataRef = (uid: string, week: string) => doc(sub(uid, 'photoData'), week);

// ---------- Export / effacement ----------
export async function exportAll(uid: string) {
  const [profile, programs, logs, photos] = await Promise.all([
    getDoc(userDoc(uid)),
    getDocs(sub(uid, 'programs')),
    getDocs(sub(uid, 'sessionLogs')),
    getDocs(sub(uid, 'photos'))
  ]);
  const plain = (v: unknown) => JSON.parse(JSON.stringify(v));
  return {
    exportedAt: new Date().toISOString(),
    profile: plain(profile.data() || {}),
    programs: programs.docs.map(d => ({ id: d.id, ...plain(d.data()) })),
    sessionLogs: logs.docs.map(d => plain(d.data())),
    photos: photos.docs.map(d => ({ week: d.id, date: d.data().date }))
  };
}

/** Efface toutes les sous-collections (par lots de 400), et le profil si demandé. */
export async function wipeAll(uid: string, includeProfile: boolean) {
  const refs: DocumentReference[] = [];
  for (const name of SUBCOLLECTIONS) {
    const s = await getDocs(sub(uid, name));
    s.docs.forEach(d => refs.push(d.ref));
  }
  if (includeProfile) refs.push(userDoc(uid));
  for (let i = 0; i < refs.length; i += 400) {
    const b = writeBatch(db);
    refs.slice(i, i + 400).forEach(r => b.delete(r));
    await b.commit();
  }
}
