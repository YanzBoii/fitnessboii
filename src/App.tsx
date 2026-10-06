// Ordre de démarrage : Auth → vérification email → questionnaire → app.
import { useEffect } from 'react';
import { AuthScreen } from './features/auth/AuthScreen';
import { VerifyEmail } from './features/auth/VerifyEmail';
import { Onboarding } from './features/onboarding/Onboarding';
import { Shell } from './features/shell/Shell';
import { AppProvider } from './state/app';
import { DataProvider, useData } from './state/data';
import { ToastProvider } from './state/toast';
import { useAuthUser } from './state/useAuthUser';
import { applyTheme } from './ui/theme';

function Splash() {
  return <div className="fb-splash" aria-label="Chargement"><div><span className="ms" style={{ fontSize: '30px' }}>fitness_center</span></div></div>;
}

function SignedIn() {
  const { ready, profile } = useData();
  useEffect(() => {
    if (profile) applyTheme(profile.theme, profile.mode);
  }, [profile?.theme, profile?.mode]);
  if (!ready) return <Splash />;
  if (!profile?.onboarded) return <Onboarding />;
  return <AppProvider><Shell /></AppProvider>;
}

export function App() {
  const { loading, user } = useAuthUser();
  useEffect(() => { if (!user) applyTheme('rubis', 'dark'); }, [user]);
  let screen;
  if (loading) screen = <Splash />;
  else if (!user) screen = <AuthScreen />;
  else if (!user.emailVerified) screen = <VerifyEmail user={user} />;
  else screen = <DataProvider key={user.uid} user={user}><SignedIn /></DataProvider>;
  return <ToastProvider>{screen}</ToastProvider>;
}
