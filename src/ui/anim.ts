// Animations Web Animations API du prototype (désactivées si prefers-reduced-motion).
import { reducedMotion } from './theme';

export const EASE = 'cubic-bezier(.2,.8,.2,1)';
export const BOUNCE = 'cubic-bezier(.3,1.4,.5,1)';

type El = Element | null | undefined;

export function anim(el: El, kf: Keyframe[], o: KeyframeAnimationOptions = {}) {
  if (el && 'animate' in el && !reducedMotion()) return el.animate(kf, { easing: EASE, fill: 'backwards', ...o });
}

const once = new WeakSet<Element>();
/** Ref callback qui joue une animation à la première apparition de l'élément. */
export const enterRef = (kf: Keyframe[], o: KeyframeAnimationOptions) => (el: HTMLElement | null) => {
  if (!el || once.has(el)) return;
  once.add(el);
  anim(el, kf, o);
};

export const fadeRef = (duration: number) => enterRef([{ opacity: 0 }, { opacity: 1 }], { duration });

export const spinRef = (el: HTMLElement | null) => {
  if (!el || once.has(el)) return;
  once.add(el);
  el.animate?.([{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], { duration: 700, iterations: Infinity });
};

export const popRef = enterRef([{ opacity: 0, transform: 'translateY(20px) scale(.9)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: BOUNCE });
export const toastRef = enterRef([{ opacity: 0, transform: 'translate(-50%,-24px) scale(.9)' }, { opacity: 1, transform: 'translate(-50%,0)' }], { duration: 420, easing: BOUNCE });

/** Cascade d'entrée des cartes d'un écran (titre + enfants des blocs racines). */
export function enterCascade(main: HTMLElement | null, title: HTMLElement | null, opts: { full: boolean; bars?: boolean; heatCols?: number }) {
  if (!main) return;
  if (opts.full) anim(title, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 320 });
  let i = 0;
  [...main.children].slice(1).forEach(r => [...r.children].slice(0, 14).forEach(c => {
    anim(c, [{ opacity: 0, transform: 'translateY(14px) scale(.985)' }, { opacity: 1, transform: 'none' }], { duration: 460, delay: 40 + i++ * 45 });
  }));
  if (opts.bars) main.querySelectorAll('[data-bar]').forEach((b, k) =>
    anim(b, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 520, delay: 120 + k * 35, easing: 'cubic-bezier(.2,.9,.3,1.15)' }));
  if (opts.full && opts.heatCols) main.querySelectorAll('[data-heat]').forEach((c, k) => {
    const col = k % opts.heatCols!;
    anim(c, [{ transform: 'scale(0)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 380, delay: 220 + col * 14, easing: 'cubic-bezier(.3,1.5,.5,1)' });
  });
}

export function pulse(el: El) {
  anim(el, [{ transform: 'scale(1)' }, { transform: 'scale(1.28)' }, { transform: 'scale(1)' }], { duration: 360, easing: 'cubic-bezier(.3,1.5,.5,1)', fill: 'none' });
}
