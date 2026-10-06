export const pad = (n: number) => String(n).padStart(2, '0');

/** Clé de jour locale "YYYY-MM-DD". */
export const dateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

/** Lundi (00:00 local) de la semaine de d. */
export const mondayOf = (d: Date) => {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return addDays(x, -((x.getDay() + 6) % 7));
};

/** Index du jour dans la semaine : 0 = lundi … 6 = dimanche. */
export const weekday = (d: Date) => (d.getDay() + 6) % 7;

export const fromKey = (k: string) => new Date(k + 'T12:00');

/** Arrondi au 2,5 kg le plus proche. */
export const r25 = (v: number) => Math.round(v / 2.5) * 2.5;

export const fmtDur = (ms: number) => {
  const t = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, s = t % 60;
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};

export const fmtDay = (k: string) =>
  fromKey(k).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }).replace('.', '');
