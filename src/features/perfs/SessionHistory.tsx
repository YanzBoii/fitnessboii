// Historique des séances : détail de chaque séance et suppression d'une séance saisie par erreur.
import { useEffect, useState } from 'react';
import { groupIcon } from '../../domain/constants';
import { fromKey } from '../../domain/dates';
import { deleteLog } from '../../firebase/repo';
import { useApp } from '../../state/app';

const PAGE = 10;
const ms = (size: number, fill = 0) => ({ fontFamily: "'Material Symbols Rounded'", fontSize: `${size}px`, fontVariationSettings: `'FILL' ${fill}` });
const fmtKg = (n: number) => String(n).replace('.', ',');
const fmtDate = (k: string) => {
  const s = fromKey(k).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\./g, '');
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export function SessionHistory() {
  const a = useApp();
  const [open, setOpen] = useState<string | null>(null);
  const [shown, setShown] = useState(PAGE);
  const [armed, setArmed] = useState<string | null>(null);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(null), 4000);
    return () => clearTimeout(t);
  }, [armed]);

  const logs = [...a.logs].sort((x, y) => (x.date < y.date ? 1 : -1));
  const remove = (date: string) => {
    if (armed !== date) return setArmed(date);
    setArmed(null);
    setOpen(null);
    deleteLog(a.uid, date).catch(a.fail);
    a.flash('Séance supprimée');
  };

  return (
    <section style={{ marginTop: '14px', maxWidth: '900px', borderRadius: '24px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'linear-gradient(160deg, rgba(var(--fb-s1,58,22,32),.45), rgba(var(--fb-card,22,16,14),.78))', border: '1px solid var(--fb-line,rgba(var(--fb-a3,255,92,124),.10))', boxShadow: 'var(--fb-cardsh,none)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '36px', height: '36px', flexShrink: 0, borderRadius: '12px', display: 'grid', placeItems: 'center', background: 'rgba(var(--fb-a,236,40,78),.14)', color: 'rgb(var(--fb-a4,255,130,154))' }}>
          <span style={ms(19, 1)}>history</span>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '14px' }}>Historique des séances</div>
          <div style={{ fontSize: '12px', color: 'var(--fb-tx3,#a8978c)' }}>{logs.length ? `${logs.length} séance${logs.length > 1 ? 's' : ''}` : 'Aucune séance pour l’instant'}</div>
        </div>
      </div>
      {logs.slice(0, shown).map(l => {
        const isOpen = open === l.date, perf = Object.entries(l.perf);
        return (
          <div key={l.date} style={{ borderRadius: '16px', background: isOpen ? 'rgba(var(--fb-fg,255,255,255),.05)' : 'rgba(var(--fb-fg,255,255,255),.03)', border: '1px solid rgba(var(--fb-fg,255,255,255),.06)' }}>
            <button onClick={() => setOpen(isOpen ? null : l.date)} aria-expanded={isOpen} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: 'none', background: 'transparent', color: 'var(--fb-tx,#f5efe9)', cursor: 'pointer', textAlign: 'left', fontFamily: 'Manrope' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>{l.programName || 'Séance'}</div>
                <div style={{ fontSize: '12px', color: 'var(--fb-tx3,#a8978c)', marginTop: '2px' }}>
                  {fmtDate(l.date)} · {l.minutes} min · {perf.length} exo{perf.length > 1 ? 's' : ''}
                </div>
              </div>
              <span style={{ ...ms(20), color: 'var(--fb-tx3,#a8978c)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>expand_more</span>
            </button>
            {isOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 12px 12px' }}>
                {perf.map(([id, p]) => (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <span style={{ ...ms(17, 1), color: 'rgb(var(--fb-a4,255,130,154))' }}>{groupIcon(p.group)}</span>
                    <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                    <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{p.w ? `${fmtKg(p.w)} kg × ${p.r}` : `${p.r} reps`}</span>
                  </div>
                ))}
                {!perf.length && <div style={{ fontSize: '13px', color: 'var(--fb-tx3,#a8978c)' }}>Aucun exercice enregistré.</div>}
                <button onClick={() => remove(l.date)} style={{ alignSelf: 'flex-start', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '99px', cursor: 'pointer', border: '1px solid rgba(255,90,70,.35)', background: armed === l.date ? 'rgba(255,90,70,.15)' : 'transparent', color: '#ff8a73', font: '600 12px Manrope' }}>
                  <span style={ms(16)}>delete</span>
                  {armed === l.date ? 'Confirmer la suppression' : 'Supprimer cette séance'}
                </button>
              </div>
            )}
          </div>
        );
      })}
      {logs.length > shown && (
        <button onClick={() => setShown(shown + PAGE)} style={{ alignSelf: 'center', padding: '9px 16px', borderRadius: '99px', cursor: 'pointer', border: '1px solid rgba(var(--fb-fg,255,255,255),.12)', background: 'transparent', color: 'var(--fb-tx2,#d4c2b6)', font: '600 13px Manrope' }}>
          Voir plus
        </button>
      )}
    </section>
  );
}
