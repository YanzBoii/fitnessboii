import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { DAYS, DEFAULT_PROFILE, newId, OB_GOALS, OB_LEVELS } from '../../domain/constants';
import { OB_SPLITS } from '../../domain/library';
import { distributeDays, planPrograms } from '../../domain/onboarding';
import type { GoalType, Level, Split } from '../../domain/types';
import { completeOnboarding } from '../../firebase/repo';
import { useData } from '../../state/data';
import { useToast } from '../../state/toast';
import { anim, fadeRef } from '../../ui/anim';

/** Accepte la virgule décimale ("75,5"). */
const toNum = (v: number | string) => Number(String(v).replace(',', '.'));

interface Draft {
  name: string;
  goalType: GoalType | null;
  level: Level | null;
  split: Split | null;
  bodyWeight: number | string;
  height: number | string;
  days: number[];
}

export function useOnboardingVals() {
  const { uid, profile, programs } = useData();
  const flash = useToast();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const dir = useRef(1);
  const stepEl = useRef<HTMLDivElement | null>(null);
  const prevStep = useRef(0);
  const [d, setDraft] = useState<Draft>(() => ({
    name: profile?.name || '',
    goalType: profile?.goalType || null,
    level: profile?.level || null,
    split: profile?.split || null,
    bodyWeight: profile?.bodyWeight || 75,
    height: profile?.height || 175,
    days: programs.length ? [...new Set(programs.flatMap(p => p.days))].sort() : [0, 2, 4]
  }));
  const setD = (patch: Partial<Draft>) => setDraft(x => ({ ...x, ...patch }));

  useEffect(() => {
    if (prevStep.current === step) return;
    prevStep.current = step;
    anim(stepEl.current, [{ opacity: 0, transform: `translateX(${dir.current * 36}px)` }, { opacity: 1, transform: 'none' }], { duration: 380 });
  }, [step]);

  const valid = step === 1 ? !!d.name.trim() : step === 2 ? !!d.goalType : step === 3 ? !!d.level : step === 5 ? !!d.split : step === 6 ? d.days.length > 0 : true;
  const goTo = (n: number) => { dir.current = n > step ? 1 : -1; setStep(n); };

  const finish = async () => {
    if (saving) return;
    setSaving(true);
    const days = [...d.days].sort();
    const plan = planPrograms(d.split || 'custom', profile?.split ?? null, programs, () => newId('p'));
    try {
      await completeOnboarding(uid, {
        name: d.name.trim(), goalType: d.goalType, level: d.level, split: d.split,
        bodyWeight: toNum(d.bodyWeight) || 75, height: +d.height || 175, goal: days.length,
        ...(profile ? {} : { rest: DEFAULT_PROFILE.rest, autoTimer: DEFAULT_PROFILE.autoTimer, remind: DEFAULT_PROFILE.remind, theme: DEFAULT_PROFILE.theme, mode: DEFAULT_PROFILE.mode })
      }, distributeDays(plan.programs, days), !profile, plan.removeIds);
      flash(`Bienvenue ${d.name.trim()}`);
    } catch (e) {
      console.error(e);
      flash('Impossible d’enregistrer, réessaie');
      setSaving(false);
    }
  };
  const next = () => {
    if (!valid) return;
    if (step >= 7) return void finish();
    goTo(step + 1);
  };

  const sel = (on: boolean) => ({
    bg: on ? 'rgba(var(--fb-a,236,40,78),.14)' : 'rgba(var(--fb-fg,255,255,255),.04)',
    border: on ? '1.5px solid rgb(var(--fb-a,236,40,78))' : '1px solid rgba(var(--fb-fg,255,255,255),.08)',
    shadow: on ? '0 0 24px rgba(var(--fb-a,236,40,78),.25)' : 'none',
    iconBg: on ? 'rgb(var(--fb-a,236,40,78))' : 'rgba(var(--fb-fg,255,255,255),.06)',
    iconColor: on ? 'var(--fb-on,#fff)' : 'rgb(var(--fb-a4,255,130,154))',
    checkOp: on ? 1 : 0
  });
  const n = d.days.length;
  const goal = OB_GOALS.find(g => g[0] === d.goalType);
  const level = OB_LEVELS.find(g => g[0] === d.level);
  const split = OB_SPLITS.find(s => s[0] === d.split);

  return {
    obWrapRef: fadeRef(300),
    obRef: (el: HTMLDivElement | null) => { stepEl.current = el; },
    obd: d,
    obBar: Array.from({ length: 6 }, (_, i) => ({
      bg: i < step ? 'rgb(var(--fb-a,236,40,78))' : 'rgba(var(--fb-fg,255,255,255),.1)',
      glow: i < step ? '0 0 8px rgba(var(--fb-a,236,40,78),.5)' : 'none'
    })),
    obBarVis: step > 0 && step < 7 ? 'visible' as const : 'hidden' as const,
    obBackVis: step > 0 && step < 7 ? 'visible' as const : 'hidden' as const,
    obCount: `${Math.min(step, 6)}/6`,
    obBack: () => step > 0 && goTo(step - 1),
    obNext: next,
    obKey: (ev: KeyboardEvent) => { if (ev.key === 'Enter') next(); },
    obCta: step === 0 ? 'Commencer' : step === 7 ? (saving ? 'Préparation…' : 'Démarrer') : 'Continuer',
    obCtaOp: valid && !saving ? 1 : 0.4,
    obName: (ev: ChangeEvent<HTMLInputElement>) => setD({ name: ev.target.value.slice(0, 40) }),
    obGoals: OB_GOALS.map(([id, label, desc, icon]) => ({ label, desc, icon, ...sel(d.goalType === id), onClick: () => setD({ goalType: id }) })),
    obSplits: OB_SPLITS.map(([id, label, desc, icon]) => ({ label, desc, icon, ...sel(d.split === id), onClick: () => setD({ split: id }) })),
    obLevels: OB_LEVELS.map(([id, label, desc, icon]) => ({ label, desc, icon, ...sel(d.level === id), onClick: () => setD({ level: id }) })),
    obBw: (ev: ChangeEvent<HTMLInputElement>) => setD({ bodyWeight: ev.target.value }),
    obHt: (ev: ChangeEvent<HTMLInputElement>) => setD({ height: ev.target.value }),
    obBwM: () => setD({ bodyWeight: Math.max(30, (toNum(d.bodyWeight) || 0) - 1) }),
    obBwP: () => setD({ bodyWeight: Math.min(400, (toNum(d.bodyWeight) || 0) + 1) }),
    obHtM: () => setD({ height: Math.max(120, (+d.height || 0) - 1) }),
    obHtP: () => setD({ height: Math.min(250, (+d.height || 0) + 1) }),
    obDays: DAYS.map((label, i) => {
      const on = d.days.includes(i);
      return {
        label, onClick: () => setD({ days: on ? d.days.filter(x => x !== i) : [...d.days, i].sort() }),
        bg: on ? 'rgb(var(--fb-a,236,40,78))' : 'rgba(var(--fb-fg,255,255,255),.05)',
        color: on ? 'var(--fb-on,#fff)' : 'var(--fb-tx2,#d4c2b6)',
        border: on ? 'none' : '1px solid rgba(var(--fb-fg,255,255,255),.1)',
        shadow: on ? '0 0 16px rgba(var(--fb-a,236,40,78),.5)' : 'none'
      };
    }),
    obDaysLabel: n ? `${n} séance${n > 1 ? 's' : ''} par semaine` : 'Sélectionne au moins un jour',
    obSummary: [
      { icon: goal?.[3] || 'flag', label: goal?.[1] || '—' },
      { icon: level?.[3] || 'star', label: level?.[1] || '—' },
      { icon: split?.[3] || 'list', label: split?.[1] || '—' },
      { icon: 'event_repeat', label: `${n} séance${n > 1 ? 's' : ''} / sem.` }
    ],
    ob0: step === 0, ob1: step === 1, ob2: step === 2, ob3: step === 3, ob4: step === 4, ob5: step === 5, ob6: step === 6, ob7: step === 7
  };
}

export type OnboardingVals = ReturnType<typeof useOnboardingVals>;
