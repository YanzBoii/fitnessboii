// Signal de fin de repos : trois bips (Web Audio) + vibration quand le téléphone le permet.
// iOS n'autorise le son qu'après un geste : `unlockAudio()` est appelé au clic « Valider ».
let ctx: AudioContext | null = null;

export function unlockAudio() {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
  } catch { /* Web Audio indisponible */ }
}

export function ring() {
  try { navigator.vibrate?.([180, 90, 180]); } catch { /* pas de vibreur */ }
  if (!ctx || ctx.state !== 'running') return;
  const t0 = ctx.currentTime;
  [0, 0.22, 0.44].forEach((dt, i) => {
    const osc = ctx!.createOscillator(), gain = ctx!.createGain();
    osc.type = 'sine';
    osc.frequency.value = i === 2 ? 1320 : 880;
    gain.gain.setValueAtTime(0.0001, t0 + dt);
    gain.gain.exponentialRampToValueAtTime(0.35, t0 + dt + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dt + 0.18);
    osc.connect(gain).connect(ctx!.destination);
    osc.start(t0 + dt);
    osc.stop(t0 + dt + 0.2);
  });
}
