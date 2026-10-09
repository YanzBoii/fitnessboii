// Installation de la PWA : invite native (Android / PC Chromium) ou instructions (iPhone / iPad).
import { useSyncExternalStore } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferred: BeforeInstallPromptEvent | null = null;
let installed = false;
let version = 0;
const subs = new Set<() => void>();
const emit = () => { version++; subs.forEach(f => f()); };

/** À appeler au démarrage, avant le rendu : l'événement peut arriver très tôt. */
export function initInstall() {
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault(); // on affiche notre propre bouton
    deferred = e as BeforeInstallPromptEvent;
    emit();
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    installed = true;
    emit();
  });
}

export const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;

export const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export function useInstall() {
  useSyncExternalStore(cb => { subs.add(cb); return () => { subs.delete(cb); }; }, () => version);
  return {
    installed: installed || isStandalone(),
    canPrompt: !!deferred,
    ios: isIOS(),
    async prompt() {
      if (!deferred) return false;
      const e = deferred;
      deferred = null;
      await e.prompt();
      const { outcome } = await e.userChoice;
      emit();
      return outcome === 'accepted';
    }
  };
}
