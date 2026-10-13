import { useEffect, useState } from 'react';

/**
 * Barre de navigation mobile : masquée quand on défile vers le bas, réaffichée dès qu'on remonte,
 * en haut de page et en bas de page (pour pouvoir changer d'onglet après avoir tout lu).
 */
export function useAutoHide(enabled: boolean, resetKey: unknown) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(false);
    if (!enabled) return;
    let last = window.scrollY, ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY, dy = y - last;
      const atBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 24;
      if (y < 40 || atBottom) setHidden(false);
      else if (dy > 8) setHidden(true);
      else if (dy < -8) setHidden(false);
      if (Math.abs(dy) > 8) last = y;
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [enabled, resetKey]);

  return hidden;
}
