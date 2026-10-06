import { startSession } from '../../domain/session';
import { useApp } from '../../state/app';

/** Démarre une séance (ou reprend celle en cours au lieu de l'écraser). */
export function useStartSession() {
  const a = useApp();
  return (programId: string) => {
    if (a.session) {
      a.go('session');
      if (a.session.programId !== programId) a.flash('Termine d’abord la séance en cours');
      return;
    }
    const p = a.programs.find(x => x.id === programId);
    if (!p) return;
    if (!p.exercises.length) return a.flash('Ajoute d’abord des exercices à ce programme');
    a.saveSessionLocal(startSession(p, a.history, Date.now()), true);
    a.go('session');
  };
}
