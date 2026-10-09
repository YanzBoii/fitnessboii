import { useEffect, useRef, useState } from 'react';
import { groupIcon } from '../../domain/constants';
import { dateKey, fmtDay, fromKey, mondayOf } from '../../domain/dates';
import { attendedSet, changes30d, weeklyBars } from '../../domain/stats';
import { deletePhoto } from '../../firebase/photoApi';
import { useApp } from '../../state/app';
import { anim } from '../../ui/anim';
import { usePhotoUrls } from './usePhotoUrls';

const fmtNum = (n: number) => String(n).replace('.', ',');
const mlabel = (k: string) => fromKey(k).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
const short = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

export function usePerfsVals() {
  const a = useApp();
  const [cmpMode, setCmpMode] = useState<'start' | 'month'>('start');
  const [confirmPhoto, setConfirmPhoto] = useState<string | null>(null);
  const cmpEl = useRef<HTMLElement | null>(null);
  const firstMode = useRef(true);
  const today = new Date();
  const goal = Math.max(1, +a.profile.goal || 1);
  const attended = attendedSet(a.logs);
  const photos = a.photos;
  const urls = usePhotoUrls(a.uid, photos);

  useEffect(() => {
    if (firstMode.current) { firstMode.current = false; return; }
    anim(cmpEl.current, [{ opacity: 0, transform: 'scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 320 });
  }, [cmpMode]);

  // ---------- Évolution physique ----------
  let cmp: { title: string; date: string; week: string }[] = [], cmpGap = '', cmpEmpty = '';
  if (photos.length < 2) cmpEmpty = 'Ajoute au moins 2 photos pour voir ton évolution. L’app te propose une photo après ta première séance de chaque semaine.';
  else if (cmpMode === 'month') {
    const months = [...new Set(photos.map(p => p.date.slice(0, 7)))].sort();
    if (months.length < 2) cmpEmpty = 'Il faut des photos sur deux mois différents pour comparer.';
    else {
      const pick = (m: string) => photos.filter(p => p.date.startsWith(m)).slice(-1)[0];
      const pa = pick(months[months.length - 2]), pb = pick(months[months.length - 1]);
      cmp = [{ title: 'Avant', date: mlabel(pa.date), week: pa.week }, { title: 'Après', date: mlabel(pb.date), week: pb.week }];
      cmpGap = 'Dernière photo de chaque mois';
    }
  } else {
    const pa = photos[0], pb = photos[photos.length - 1];
    const wks = Math.round((fromKey(pb.week).getTime() - fromKey(pa.week).getTime()) / 604800000);
    cmp = [{ title: 'Début', date: fmtDay(pa.date), week: pa.week }, { title: 'Aujourd’hui', date: fmtDay(pb.date), week: pb.week }];
    cmpGap = `${wks} semaine${wks > 1 ? 's' : ''} d’écart`;
  }
  const bg = (week: string) => (urls[week] ? `url("${urls[week]}")` : 'none');
  const wk = dateKey(mondayOf(today));
  const hasWeek = photos.some(p => p.week === wk);

  // ---------- Séances par semaine ----------
  const wkCounts = weeklyBars(attended, today, goal);
  const bMax = Math.max(goal, ...wkCounts.map(w => w.n)) + 0.5;

  // ---------- Ce qui a changé ----------
  const changes = changes30d(a.history, a.programs.flatMap(p => p.exercises), today);
  const tk = dateKey(today);
  const prevM = dateKey(new Date(today.getFullYear(), today.getMonth() - 1, 1)).slice(0, 7);
  const monthCount = [...attended].filter(k => k.startsWith(tk.slice(0, 7))).length;
  const lastMCount = [...attended].filter(k => k.startsWith(prevM)).length;

  return {
    settings: { goal },
    cmpRef: (el: HTMLElement | null) => { cmpEl.current = el; },
    cmpModes: ([['start', 'Début vs aujourd’hui'], ['month', 'Mois par mois']] as const).map(([id, label]) => {
      const on = cmpMode === id;
      return { label, onClick: () => setCmpMode(id), bg: on ? 'rgb(var(--fb-a,236,40,78))' : 'transparent', color: on ? 'var(--fb-on,#fff)' : 'var(--fb-tx2,#d4c2b6)' };
    }),
    cmp: cmp.map((c, i) => ({ ...c, bgImg: bg(c.week), border: i ? '1.5px solid rgba(var(--fb-a,236,40,78),.5)' : '1px solid rgba(var(--fb-fg,255,255,255),.08)' })),
    cmpGap, cmpEmpty, canCompare: cmp.length === 2, noCompare: cmp.length !== 2,
    photoList: [...photos].reverse().map(p => {
      const conf = confirmPhoto === p.week;
      return {
        label: fmtDay(p.date), bgImg: bg(p.week),
        border: p.week === wk ? '1.5px solid rgba(var(--fb-a,236,40,78),.6)' : '1px solid rgba(var(--fb-fg,255,255,255),.08)',
        delIcon: conf ? 'delete' : 'close', delBg: conf ? '#e5484d' : 'rgba(var(--fb-ink,0,0,0),.55)',
        onDelete: () => {
          if (!conf) return setConfirmPhoto(p.week);
          setConfirmPhoto(null);
          deletePhoto(a.uid, p.week).then(() => a.flash('Photo supprimée')).catch(a.fail);
        }
      };
    }),
    addIcon: a.photoBusy ? 'hourglass_top' : hasWeek ? 'cached' : 'add_a_photo',
    addLabel: a.photoBusy ? 'Envoi…' : hasWeek ? 'Remplacer' : 'Cette sem.',
    addBg: hasWeek ? 'transparent' : 'rgba(var(--fb-a,236,40,78),.08)',
    pickPhoto: () => !a.photoBusy && a.pickPhoto(),
    bars: wkCounts.map((w, i) => ({
      h: `${(w.n / bMax) * 100}%`,
      title: `Semaine du ${short(w.monday)} · ${w.n} séance${w.n > 1 ? 's' : ''}`,
      // Un libellé toutes les 3 semaines, aligné sur « Cette sem. » (sinon les deux derniers se chevauchent).
      label: w.current ? 'Cette sem.' : i % 3 === 2 ? short(w.monday).replace('.', '') : '',
      labelJustify: w.current ? 'flex-end' : 'center',
      labelColor: w.current ? 'rgb(var(--fb-a4,255,130,154))' : 'var(--fb-tx4,#8e7d72)',
      bg: w.current ? 'linear-gradient(180deg, rgb(var(--fb-a3,255,92,124)), rgb(var(--fb-a,236,40,78)))' : w.hit ? 'rgba(var(--fb-a,236,40,78),.75)' : 'rgba(var(--fb-fg,255,255,255),.1)',
      shadow: w.current ? '0 0 16px rgba(var(--fb-a,236,40,78),.55)' : 'none'
    })),
    barAvg: (wkCounts.slice(0, 11).reduce((s, w) => s + w.n, 0) / 11).toFixed(1).replace('.', ','),
    goalPct: `${(goal / bMax) * 100}%`,
    changeStats: [
      { icon: 'calendar_today', label: 'Séances ce mois', value: monthCount, sub: `${lastMCount} le mois dernier` },
      { icon: 'emoji_events', label: 'Records battus', value: changes.filter(c => c.up).length, sub: 'sur 30 jours' }
    ],
    changes: changes.map(c => ({
      ...c, icon: groupIcon(c.group),
      from: `${fmtNum(c.from)} ${c.unit}`, to: `${fmtNum(c.to)} ${c.unit}`, delta: `${c.delta > 0 ? '+' : ''}${fmtNum(c.delta)} ${c.unit}`,
      stroke: c.up ? 'rgb(var(--fb-a3,255,92,124))' : 'var(--fb-tx4,#8e7d72)',
      arrow: c.up ? 'arrow_upward' : 'arrow_downward',
      pillBg: c.up ? 'rgba(var(--fb-a,236,40,78),.16)' : 'rgba(var(--fb-fg,255,255,255),.06)',
      pillColor: c.up ? 'rgb(var(--fb-a4,255,130,154))' : 'var(--fb-tx3,#a8978c)'
    })),
    noChanges: !changes.length
  };
}

export type PerfsVals = ReturnType<typeof usePerfsVals>;
