// Écran affiché tant que l'email d'un compte email/mot de passe n'est pas vérifié.
// Les règles Firestore refusent tout accès sans email vérifié.
import type { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { authMessage, logout, refreshVerified, resendVerification } from '../../firebase/authApi';
import { useToast } from '../../state/toast';
import { fadeRef, spinRef } from '../../ui/anim';

const COOLDOWN = 60;

export function VerifyEmail({ user }: { user: User }) {
  const flash = useToast();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [wait, setWait] = useState(COOLDOWN);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait(wait - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  // Vérifie automatiquement au retour sur l'onglet (après avoir cliqué le lien du mail).
  useEffect(() => {
    const on = () => { if (document.visibilityState === 'visible') refreshVerified(user).catch(() => {}); };
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, [user]);

  const check = async () => {
    setBusy(true);
    setErr('');
    try {
      if (!(await refreshVerified(user))) setErr('Email pas encore vérifié. Pense à regarder tes spams.');
    } catch (e) {
      setErr(authMessage(e) || '');
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    if (wait > 0) return;
    try {
      await resendVerification(user);
      flash('Email renvoyé');
      setWait(COOLDOWN);
    } catch (e) {
      setErr(authMessage(e) || '');
    }
  };

  return (
    <div ref={fadeRef(300)} style={{ position: 'fixed', inset: 0, zIndex: 70, overflowY: 'auto', display: 'flex', padding: 'clamp(24px,5vh,48px) 20px', background: 'radial-gradient(700px 520px at 50% 0%, rgba(var(--fb-a,236,40,78),calc(.25 * var(--fb-gk,1))), transparent 70%), rgb(var(--fb-bg,12,8,10))' }}>
      <div style={{ margin: 'auto', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '22px', textAlign: 'center', alignItems: 'center' }}>
        <div style={{ width: '76px', height: '76px', borderRadius: '24px', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg,rgb(255,92,124),rgb(236,40,78))', boxShadow: '0 0 44px rgba(236,40,78,.55)', color: '#fff' }}>
          <span className="ms" style={{ fontSize: '38px' }}>mark_email_unread</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h1 style={{ margin: 0, fontFamily: 'Sora', fontWeight: 700, fontSize: '30px', letterSpacing: '-.03em' }}>Vérifie ton email</h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--fb-tx3,#a8978c)' }}>
            On a envoyé un lien à <b style={{ color: 'var(--fb-tx,#f5efe9)' }}>{user.email}</b>. Clique dessus puis reviens ici.
          </p>
        </div>
        <button onClick={check} disabled={busy} style={{ width: '100%', height: '56px', borderRadius: '99px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'rgb(var(--fb-a,236,40,78))', color: 'var(--fb-on,#fff)', font: '700 16px Manrope', boxShadow: '0 12px 32px rgba(var(--fb-a,236,40,78),.45)', opacity: 1 }}>
          {busy && <span ref={spinRef} style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2.5px solid currentColor', borderRightColor: 'transparent', display: 'block' }} />}
          J’ai vérifié mon email
        </button>
        <span style={{ minHeight: '18px', fontSize: '12px', fontWeight: 600, color: '#ff6b6b' }}>{err}</span>
        <div style={{ display: 'flex', gap: '18px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={resend} disabled={wait > 0} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', color: 'rgb(var(--fb-a4,255,130,154))', font: '700 14px Manrope' }}>
            {wait > 0 ? `Renvoyer (${wait}s)` : 'Renvoyer l’email'}
          </button>
          <button onClick={() => logout()} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', color: 'var(--fb-tx3,#a8978c)', font: '600 14px Manrope' }}>
            Changer de compte
          </button>
        </div>
      </div>
    </div>
  );
}
