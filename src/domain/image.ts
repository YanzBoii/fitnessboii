/** Dimensions réduites pour que le plus grand côté fasse au plus `max` (jamais d'agrandissement). */
export function fitSize(w: number, h: number, max: number) {
  const sc = Math.min(1, max / Math.max(w, h));
  return { w: Math.round(w * sc), h: Math.round(h * sc) };
}
