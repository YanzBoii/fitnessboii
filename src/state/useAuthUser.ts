import { onIdTokenChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../firebase/config';

export interface AuthState {
  loading: boolean;
  user: User | null;
  /** Incrémenté quand le token change (ex. email vérifié) pour forcer un re-rendu. */
  version: number;
}

export function useAuthUser(): AuthState {
  const [s, set] = useState<AuthState>({ loading: true, user: auth.currentUser, version: 0 });
  useEffect(() => onIdTokenChanged(auth, user => set(p => ({ loading: false, user, version: p.version + 1 }))), []);
  return s;
}
