import { THEMES } from '../../domain/constants';
import type { Mode, ThemeId } from '../../domain/types';
import { useApp } from '../../state/app';
import { applyTheme, themePreview, viewTransition } from '../../ui/theme';

export function useSettingsVals() {
  const a = useApp();
  const { theme, mode } = a.profile;

  const setTheme = (id: ThemeId) => {
    if (id === theme) return;
    viewTransition(() => applyTheme(id, mode));
    a.setting('theme', id);
  };
  const setMode = (m: Mode) => {
    if (m === mode) return;
    viewTransition(() => applyTheme(theme, m));
    a.setting('mode', m);
  };

  return {
    modes: ([['dark', 'Sombre', 'dark_mode'], ['light', 'Clair', 'light_mode']] as const).map(([id, label, icon]) => {
      const on = mode === id;
      return {
        label, icon, onClick: () => setMode(id), checkOp: on ? 1 : 0,
        border: on ? '1.5px solid rgb(var(--fb-a,236,40,78))' : '1px solid rgba(var(--fb-fg,255,255,255),.08)',
        preview: id === 'dark' ? 'linear-gradient(160deg,#2a2420,#0e0b0a)' : 'linear-gradient(160deg,#ffffff,#ece8e4)',
        iconColor: id === 'dark' ? '#f5efe9' : '#1a1512',
        bar1: id === 'dark' ? 'rgba(255,255,255,.14)' : 'rgba(var(--fb-ink,0,0,0),.1)',
        bar2: id === 'dark' ? 'rgba(255,255,255,.08)' : 'rgba(var(--fb-ink,0,0,0),.06)'
      };
    }),
    themes: THEMES.map(t => {
      const on = theme === t.id;
      return {
        name: t.name, icon: t.icon, onClick: () => setTheme(t.id), bgPreview: themePreview(t.v, mode),
        iconColor: `rgb(${t.v.a3})`, glow: `0 0 18px rgba(${t.v.a},.7)`,
        check: on ? 'grid' : 'none', border: on ? `1.5px solid rgb(${t.v.a})` : '1px solid rgba(var(--fb-fg,255,255,255),.08)'
      };
    })
  };
}

export type SettingsVals = ReturnType<typeof useSettingsVals>;
