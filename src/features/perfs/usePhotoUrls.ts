import { useEffect, useRef, useState } from 'react';
import type { PhotoMeta } from '../../domain/types';
import { loadPhotoUrl } from '../../firebase/photoApi';

/** Charge à la demande les images des photos visibles (URL blob: locales, révoquées au démontage). */
export function usePhotoUrls(uid: string, photos: PhotoMeta[]) {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const loaded = useRef<Record<string, { v: number; url: string | null }>>({});
  const mounted = useRef(true);

  const sig = photos.map(p => `${p.week}:${p.v}`).join('|');
  useEffect(() => {
    const weeks = new Set(photos.map(p => p.week));
    // Photos supprimées : libère la mémoire.
    Object.entries(loaded.current).forEach(([w, e]) => {
      if (!weeks.has(w)) {
        if (e.url) URL.revokeObjectURL(e.url);
        delete loaded.current[w];
      }
    });
    photos.forEach(p => {
      const cur = loaded.current[p.week];
      if (cur && cur.v === p.v) return;
      loaded.current[p.week] = { v: p.v, url: cur?.url ?? null };
      loadPhotoUrl(uid, p.week).then(url => {
        if (!mounted.current || !url || loaded.current[p.week]?.v !== p.v) return;
        const old = loaded.current[p.week]?.url;
        if (old && old !== url) URL.revokeObjectURL(old);
        loaded.current[p.week] = { v: p.v, url };
        setUrls(u => ({ ...u, [p.week]: url }));
      }).catch(console.error);
    });
    setUrls(u => Object.fromEntries(Object.entries(u).filter(([w]) => weeks.has(w))));
  }, [uid, sig]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      Object.values(loaded.current).forEach(e => e.url && URL.revokeObjectURL(e.url));
      loaded.current = {};
    };
  }, []);

  return urls;
}
