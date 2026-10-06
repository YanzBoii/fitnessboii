// Système de thèmes du prototype : variables CSS --fb-* (RGB sans rgb() pour composer l'alpha).
import { THEMES, type ThemeVars } from '../domain/constants';
import type { Mode, ThemeId } from '../domain/types';

const NEUTRAL = { tx: '#f5efe9', tx2: '#d4c2b6', tx3: '#a8978c', tx4: '#8e7d72', fg: '255,255,255', ink: '0,0,0', card: '22,16,14', inv: '#fff', on: '#fff' };
const LIGHT = {
  tx: '#18130f', tx2: '#4b423c', tx3: '#766a62', tx4: '#9b8f87', fg: '28,20,14', ink: '226,219,213', card: '255,255,255', inv: '#18130f',
  s1: '255,255,255', s2: '255,255,255', s3: '255,255,255', s4: '255,255,255', bg: '245,243,240', bg2: '255,255,255',
  line: 'rgba(28,20,14,.08)', cardsh: '0 1px 2px rgba(28,20,14,.04), 0 12px 32px -12px rgba(28,20,14,.12)',
  popsh: '0 18px 44px -10px rgba(28,20,14,.22)', gk: '.42'
};
const OPT_KEYS = ['line', 'cardsh', 'popsh', 'gk'];

let current = '';

export function applyTheme(id: ThemeId, mode: Mode) {
  const key = id + '|' + mode;
  if (key === current) return;
  current = key;
  const light = mode === 'light';
  const t = THEMES.find(x => x.id === id) || THEMES[0];
  const vars: Record<string, string> = { ...NEUTRAL, ...t.v, ...(light ? { ...LIGHT, a4: t.v.a, a5: t.v.a } : {}) };
  const r = document.documentElement.style;
  OPT_KEYS.forEach(k => { if (!(k in vars)) r.removeProperty('--fb-' + k); });
  Object.entries(vars).forEach(([k, v]) => r.setProperty('--fb-' + k, v));
  r.colorScheme = light ? 'light' : 'dark';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', `rgb(${vars.bg})`);
}

export const reducedMotion = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Transition de vue en fondu si le navigateur la supporte. */
export function viewTransition(fn: () => void) {
  type VT = { ready: Promise<void>; finished: Promise<void> };
  const d = document as Document & { startViewTransition?: (cb: () => void) => VT };
  if (!d.startViewTransition || reducedMotion()) return fn();
  const t = d.startViewTransition(fn);
  // Clics rapides : la transition précédente est annulée, ce n'est pas une erreur.
  t.ready.catch(() => {});
  t.finished.catch(() => {});
}

/** Aperçu de carte thème (Réglages / onboarding). */
export const themePreview = (v: ThemeVars, mode: Mode) => mode === 'light'
  ? `radial-gradient(120px 70px at 50% 0%, rgba(${v.a},.45), transparent 80%), linear-gradient(180deg, #f4f1ee, #ffffff)`
  : `radial-gradient(120px 70px at 50% 0%, rgba(${v.a},.55), transparent 80%), linear-gradient(180deg, rgb(${v.s2}), rgb(${v.bg2}))`;
