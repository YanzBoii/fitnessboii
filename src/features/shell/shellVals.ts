import { useLayoutEffect, useRef } from 'react';
import { pad } from '../../domain/dates';
import { useApp, type Tab } from '../../state/app';
import { enterCascade, popRef } from '../../ui/anim';

const NAV: [Tab, string, string][] = [
  ['home', 'Accueil', 'home'], ['programs', 'Programmes', 'fitness_center'], ['session', 'Séance', 'timer'],
  ['perf', 'Perfs', 'monitoring'], ['settings', 'Réglages', 'settings']
];

export function useShellVals() {
  const a = useApp();
  const { profile: S, tab, isMobile } = a;
  const mainEl = useRef<HTMLElement | null>(null);
  const titleEl = useRef<HTMLHeadingElement | null>(null);

  // Cascade d'entrée à chaque changement d'onglet.
  useLayoutEffect(() => {
    enterCascade(mainEl.current, titleEl.current, { full: true, bars: tab === 'perf', heatCols: tab === 'home' ? (isMobile ? 14 : 24) : 0 });
  }, [tab]);

  const titles: Record<Tab, string> = { home: `Salut ${S.name}`, programs: 'Mes programmes', session: 'Séance', perf: 'Performances', settings: 'Réglages' };
  const restLeft = a.restEnd ? Math.max(0, Math.ceil((a.restEnd - a.now) / 1000)) : 0;

  return {
    isMobile, isDesktop: !isMobile, mainML: isMobile ? '0' : '224px',
    mainRef: (el: HTMLElement | null) => { mainEl.current = el; },
    titleRef: (el: HTMLHeadingElement | null) => { titleEl.current = el; },
    nav: NAV.map(([id, label, icon]) => {
      const on = tab === id;
      return {
        label, icon, onClick: () => id !== tab && a.go(id),
        bg: on ? 'linear-gradient(135deg,rgb(var(--fb-a3,255,92,124)),rgb(var(--fb-a2,220,30,96)))' : 'transparent',
        mbg: on ? 'linear-gradient(135deg,rgb(var(--fb-a3,255,92,124)),rgb(var(--fb-a2,220,30,96)))' : 'rgba(var(--fb-fg,255,255,255),.05)',
        mborder: on ? 'none' : '1px solid rgba(var(--fb-fg,255,255,255),.08)',
        color: on ? 'var(--fb-on,#fff)' : 'var(--fb-tx2,#c9b8ad)',
        shadow: on ? '0 6px 20px rgba(var(--fb-a,236,40,78),.4)' : 'none'
      };
    }),
    initial: (S.name || '?').trim().charAt(0).toUpperCase(),
    settings: { name: S.name, email: a.email },
    dateLabel: new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
    pageTitle: titles[tab],
    goPrograms: () => a.go('programs'),
    goProfile: () => a.setProfileOpen(true),
    hasRestFloat: !!a.restEnd && tab !== 'session',
    popRef,
    restBottom: isMobile ? '92px' : '28px',
    restLabel: `${Math.floor(restLeft / 60)}:${pad(restLeft % 60)}`,
    restPlus: () => a.restEnd && a.setRestEnd(a.restEnd + 15000),
    restSkip: () => a.setRestEnd(null)
  };
}

export type ShellVals = ReturnType<typeof useShellVals>;

/** Relance la cascade d'entrée (sans le titre) quand un sous-état d'écran change. */
export function useReenter(deps: unknown[]) {
  const first = useRef(true);
  useLayoutEffect(() => {
    if (first.current) { first.current = false; return; }
    enterCascade(document.querySelector('main'), null, { full: false });
  }, deps);
}
