import { useEffect, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { appleEnabled } from '../../firebase/config';
import { authMessage, resetPassword, signInApple, signInEmail, signInGoogle, signUpEmail } from '../../firebase/authApi';
import { useToast } from '../../state/toast';
import { anim, fadeRef, spinRef } from '../../ui/anim';
import { rng, useWidth } from '../../ui/useWidth';

const EMAIL = /^\S+@\S+\.\S+$/;

export function useAuthVals() {
  const flash = useToast();
  const isMobile = useWidth() < 860;
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const formEl = useRef<HTMLDivElement | null>(null);
  const firstMode = useRef(true);
  const signup = mode === 'signup';

  useEffect(() => {
    if (firstMode.current) { firstMode.current = false; return; }
    anim(formEl.current, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 320 });
  }, [mode]);

  const run = async (fn: () => Promise<unknown>) => {
    if (loading) return;
    setLoading(true);
    setErr('');
    try {
      await fn();
    } catch (e) {
      const m = authMessage(e);
      if (m) setErr(m);
    } finally {
      setLoading(false);
    }
  };

  const submit = () => {
    const em = email.trim();
    if (!EMAIL.test(em)) return setErr('Adresse email invalide');
    if (pw.length < 6) return setErr('6 caractères minimum pour le mot de passe');
    run(() => (signup ? signUpEmail(em, pw) : signInEmail(em, pw)));
  };

  const authDots = useMemo(() => {
    const rnd = rng(11);
    return Array.from({ length: 7 }, (_, r) => Array.from({ length: 18 }, (_, c) => {
      const on = rnd() < ([0, 2, 4].includes(r) ? 0.75 : r === 5 ? 0.3 : 0.1) * (0.5 + c / 36);
      return {
        bg: on ? 'rgb(var(--fb-a,236,40,78))' : 'transparent',
        border: on ? 'none' : '1.5px solid rgba(var(--fb-fg,255,255,255),.12)',
        shadow: on ? '0 0 10px rgba(var(--fb-a,236,40,78),.6)' : 'none'
      };
    }));
  }, []);

  return {
    isMobile, isDesktop: !isMobile, showApple: appleEnabled,
    obWrapRef: fadeRef(300), authFormRef: (el: HTMLDivElement | null) => { formEl.current = el; }, spinRef,
    auth: { email, pw, err }, isSignup: signup, isLogin: !signup, authLoading: loading,
    authTitle: signup ? 'Crée ton compte' : 'Bon retour',
    authSub: signup ? 'Commence à suivre tes séances en quelques secondes.' : 'Connecte-toi pour retrouver tes séances.',
    authCta: loading ? (signup ? 'Création…' : 'Connexion…') : signup ? 'Créer mon compte' : 'Se connecter',
    authSwitchText: signup ? 'Déjà un compte ?' : 'Pas encore de compte ?',
    authSwitchCta: signup ? 'Se connecter' : 'Créer un compte',
    authSwitch: () => { setMode(signup ? 'login' : 'signup'); setErr(''); },
    authEmail: (ev: ChangeEvent<HTMLInputElement>) => { setEmail(ev.target.value); setErr(''); },
    authPw: (ev: ChangeEvent<HTMLInputElement>) => { setPw(ev.target.value); setErr(''); },
    authKey: (ev: KeyboardEvent) => { if (ev.key === 'Enter') submit(); },
    authSubmit: submit,
    authBorder: err ? 'rgba(255,107,107,.6)' : 'rgba(var(--fb-fg,255,255,255),.1)',
    pwType: show ? 'text' : 'password', pwIcon: show ? 'visibility_off' : 'visibility', togglePw: () => setShow(!show),
    forgotPw: () => {
      const em = email.trim();
      if (!EMAIL.test(em)) return setErr('Entre ton email d’abord');
      // Message identique que le compte existe ou non (pas d'énumération d'emails).
      run(async () => { await resetPassword(em); flash(`Si un compte existe, un lien a été envoyé à ${em}`); });
    },
    authGoogle: () => run(signInGoogle),
    authApple: () => run(signInApple),
    authDots
  };
}

export type AuthVals = ReturnType<typeof useAuthVals>;
