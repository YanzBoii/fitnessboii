import {
  createUserWithEmailAndPassword, deleteUser, EmailAuthProvider, GoogleAuthProvider, OAuthProvider,
  reauthenticateWithCredential, reauthenticateWithPopup, sendEmailVerification, sendPasswordResetEmail,
  signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, signOut, type AuthProvider, type User
} from 'firebase/auth';
import { auth } from './config';
import { wipeAll } from './repo';

const google = () => new GoogleAuthProvider();
const apple = () => {
  const p = new OAuthProvider('apple.com');
  p.addScope('email');
  p.addScope('name');
  return p;
};

const continueUrl = () => ({ url: window.location.origin + '/' });

async function withPopup(provider: AuthProvider) {
  try {
    await signInWithPopup(auth, provider);
  } catch (e) {
    // Popups bloquées (certains navigateurs mobiles) : bascule en redirection.
    if (errCode(e) === 'auth/popup-blocked') return signInWithRedirect(auth, provider);
    throw e;
  }
}

export const signInGoogle = () => withPopup(google());
export const signInApple = () => withPopup(apple());

export async function signUpEmail(email: string, password: string) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(user, continueUrl());
}

export const signInEmail = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email, continueUrl());
export const resendVerification = (user: User) => sendEmailVerification(user, continueUrl());
export const logout = () => signOut(auth);

/** Recharge l'utilisateur et force un nouveau token (pour que email_verified soit pris en compte par les règles). */
export async function refreshVerified(user: User) {
  await user.reload();
  if (user.emailVerified) await user.getIdToken(true);
  return user.emailVerified;
}

export const isPasswordUser = (user: User) => user.providerData.some(p => p.providerId === 'password');

/**
 * Supprime toutes les données puis le compte.
 * On se ré-authentifie d'abord (Firebase l'exige pour deleteUser) pour ne jamais effacer
 * les données sans pouvoir ensuite supprimer le compte. Les données partent avant le compte :
 * après, les règles refuseraient l'accès.
 */
export async function deleteAccountAndData(user: User, password?: string) {
  if (isPasswordUser(user)) {
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email || '', password || ''));
  } else {
    await reauthenticateWithPopup(user, user.providerData.some(p => p.providerId === 'apple.com') ? apple() : google());
  }
  await wipeAll(user.uid, true);
  await deleteUser(user);
}

export const errCode = (e: unknown) => (e && typeof e === 'object' && 'code' in e ? String((e as { code: unknown }).code) : '');

const MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'Un compte existe déjà avec cet email',
  'auth/invalid-email': 'Adresse email invalide',
  'auth/invalid-credential': 'Email ou mot de passe incorrect',
  'auth/wrong-password': 'Email ou mot de passe incorrect',
  'auth/user-not-found': 'Email ou mot de passe incorrect',
  'auth/weak-password': '6 caractères minimum pour le mot de passe',
  'auth/password-does-not-meet-requirements': 'Mot de passe trop faible',
  'auth/too-many-requests': 'Trop de tentatives, réessaie dans quelques minutes',
  'auth/network-request-failed': 'Pas de connexion internet',
  'auth/user-disabled': 'Ce compte a été désactivé',
  'auth/account-exists-with-different-credential': 'Ce compte existe déjà avec une autre méthode de connexion',
  'auth/requires-recent-login': 'Reconnecte-toi pour confirmer',
  'auth/operation-not-allowed': 'Méthode de connexion non activée',
  'auth/unauthorized-domain': 'Domaine non autorisé dans Firebase'
};

/** Message FR, ou null si l'erreur doit être ignorée (popup fermée par l'utilisateur). */
export function authMessage(e: unknown): string | null {
  const c = errCode(e);
  if (c === 'auth/popup-closed-by-user' || c === 'auth/cancelled-popup-request') return null;
  return MESSAGES[c] || 'Une erreur est survenue, réessaie';
}
