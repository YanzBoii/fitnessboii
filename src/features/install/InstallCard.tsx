// Carte « Installer l'app » (Réglages) et bandeau refermable (Accueil, mobile).
import { useState } from 'react';
import { useApp } from '../../state/app';
import { useInstall } from '../../ui/install';

const DISMISS_KEY = 'fitnessboii-install-dismissed';
const ms = (size: number, fill = 1) => ({ fontFamily: "'Material Symbols Rounded'", fontSize: `${size}px`, fontVariationSettings: `'FILL' ${fill}` });

const card = {
  borderRadius: '24px', padding: '20px', display: 'flex', flexDirection: 'column' as const, gap: '14px',
  background: 'radial-gradient(420px 220px at 100% 0%, rgba(var(--fb-a,236,40,78),calc(.22 * var(--fb-gk,1))), transparent 70%), linear-gradient(160deg, rgba(var(--fb-s1,58,22,32),.55), rgba(var(--fb-card,22,16,14),.78))',
  border: '1px solid rgba(var(--fb-a3,255,92,124),.22)', boxShadow: 'var(--fb-cardsh,none)'
};
const step = { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--fb-tx2,#d4c2b6)' };
const num = { width: '24px', height: '24px', flexShrink: 0, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 700, background: 'rgba(var(--fb-a,236,40,78),.16)', color: 'rgb(var(--fb-a4,255,130,154))' };
const kbd = { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '8px', background: 'rgba(var(--fb-fg,255,255,255),.08)', color: 'var(--fb-tx,#f5efe9)', fontWeight: 600 };

export function InstallCard({ banner = false }: { banner?: boolean }) {
  const a = useApp();
  const inst = useInstall();
  const [dismissed, setDismissed] = useState(() => {
    try { return !!localStorage.getItem(DISMISS_KEY); } catch { return false; }
  });
  if (inst.installed || (banner && (dismissed || !a.isMobile))) return null;

  const dismiss = () => {
    setDismissed(true);
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch { /* stockage indisponible */ }
  };
  const install = async () => {
    if (await inst.prompt()) a.flash('App installée');
  };

  return (
    <section style={{ ...card, ...(banner ? { marginBottom: '14px' } : { maxWidth: '760px', marginBottom: '14px' }) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '44px', height: '44px', flexShrink: 0, borderRadius: '14px', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg,rgb(var(--fb-a3,255,92,124)),rgb(var(--fb-a,236,40,78)))', boxShadow: '0 0 20px rgba(var(--fb-a,236,40,78),.45)', color: 'var(--fb-on,#fff)' }}>
          <span style={ms(24)}>install_mobile</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '15px' }}>Installer FitnessBoii</div>
          <div style={{ fontSize: '12px', color: 'var(--fb-tx3,#a8978c)', marginTop: '2px' }}>
            Sur ton écran d’accueil, en plein écran, utilisable sans réseau à la salle.
          </div>
        </div>
        {banner && (
          <button onClick={dismiss} aria-label="Masquer" style={{ width: '32px', height: '32px', flexShrink: 0, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', background: 'rgba(var(--fb-fg,255,255,255),.06)', color: 'var(--fb-tx3,#a8978c)' }}>
            <span style={ms(18, 0)}>close</span>
          </button>
        )}
      </div>

      {inst.canPrompt ? (
        <button onClick={install} style={{ height: '48px', borderRadius: '99px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgb(var(--fb-a,236,40,78))', color: 'var(--fb-on,#fff)', font: '700 14px Manrope', boxShadow: '0 10px 28px rgba(var(--fb-a,236,40,78),.4)' }}>
          <span style={ms(20)}>download</span>Installer l’app
        </button>
      ) : inst.ios ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px', borderRadius: '16px', background: 'rgba(var(--fb-ink,0,0,0),.25)' }}>
          <div style={step}><span style={num}>1</span><span>Ouvre le site dans <b style={{ color: 'var(--fb-tx,#f5efe9)' }}>Safari</b></span></div>
          <div style={step}><span style={num}>2</span><span>Touche <span style={kbd}><span style={ms(16, 0)}>ios_share</span>Partager</span> en bas de l’écran</span></div>
          <div style={step}><span style={num}>3</span><span>Choisis <span style={kbd}><span style={ms(16, 0)}>add_box</span>Sur l’écran d’accueil</span></span></div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px', borderRadius: '16px', background: 'rgba(var(--fb-ink,0,0,0),.25)' }}>
          <div style={step}><span style={num}>1</span><span>Ouvre le menu du navigateur <span style={kbd}><span style={ms(16, 0)}>more_vert</span></span></span></div>
          <div style={step}><span style={num}>2</span><span>Choisis <span style={kbd}>Installer l’application</span> ou <span style={kbd}>Ajouter à l’écran d’accueil</span></span></div>
        </div>
      )}
    </section>
  );
}
