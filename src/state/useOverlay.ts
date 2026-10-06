import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Modifications locales immédiates + écriture Firestore groupée (debounce).
 * Évite une écriture par frappe clavier tout en gardant l'UI réactive.
 * `flush(key, value)` reçoit la valeur fusionnée à écrire.
 */
export function useOverlay<T>(flush: (key: string, value: T) => Promise<unknown>, onError: (e: unknown) => void, ms = 450) {
  const [overlay, setOverlay] = useState<Record<string, T>>({});
  const pending = useRef<Record<string, { value: T; timer: number }>>({});
  const flushRef = useRef(flush);
  flushRef.current = flush;

  const run = useCallback((key: string) => {
    const p = pending.current[key];
    if (!p) return;
    delete pending.current[key];
    flushRef.current(key, p.value)
      .catch(onError)
      .finally(() => setOverlay(o => {
        if (pending.current[key]) return o; // une modif plus récente attend encore
        const { [key]: _, ...rest } = o;
        return rest;
      }));
  }, [onError]);

  const set = useCallback((key: string, value: T, immediate = false) => {
    setOverlay(o => ({ ...o, [key]: value }));
    const prev = pending.current[key];
    if (prev) clearTimeout(prev.timer);
    pending.current[key] = { value, timer: window.setTimeout(() => run(key), immediate ? 0 : ms) };
  }, [ms, run]);

  /** Abandonne une écriture en attente (ex. séance terminée entre-temps). */
  const clear = useCallback((key: string) => {
    const p = pending.current[key];
    if (p) clearTimeout(p.timer);
    delete pending.current[key];
    setOverlay(o => {
      const { [key]: _, ...rest } = o;
      return rest;
    });
  }, []);

  // Écrit ce qui reste en attente si l'utilisateur quitte la page.
  useEffect(() => {
    const flushAll = () => Object.keys(pending.current).forEach(k => { clearTimeout(pending.current[k].timer); run(k); });
    window.addEventListener('pagehide', flushAll);
    return () => { window.removeEventListener('pagehide', flushAll); flushAll(); };
  }, [run]);

  return { overlay, set, clear };
}
