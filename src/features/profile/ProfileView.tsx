// Vue générée depuis le prototype (design/design/FitnessBoii.dc.html), styles à l'identique.
import { Fragment } from 'react';
import type { ProfileVals } from './profileVals';

export function ProfileView({ v }: { v: ProfileVals }) {
  return (
    <>
    <div ref={v.backdropRef} onClick={v.closeProfile} style={{ position: "fixed", inset: "0", zIndex: "40", display: "flex", alignItems: v.sheetAlign, justifyContent: "center", padding: v.sheetPad, background: "rgba(5,3,2,.6)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}>
      <div ref={v.panelRef} onClick={v.stop} style={{ width: "100%", maxWidth: "440px", maxHeight: v.sheetMaxH, overflowY: "auto", borderRadius: v.sheetRadius, padding: "20px", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(380px 200px at 50% 0%, rgba(var(--fb-a,236,40,78),calc(.28 * var(--fb-gk,1))), transparent 75%), rgb(var(--fb-bg2,20,11,15))", border: "1px solid var(--fb-line,rgba(var(--fb-a3,255,92,124),.16))", boxShadow: "var(--fb-popsh,0 30px 80px rgba(0,0,0,.6))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", flexShrink: "0", display: "grid", placeItems: "center", background: "linear-gradient(135deg,rgb(var(--fb-a3,255,92,124)),rgb(var(--fb-a6,150,14,48)))", boxShadow: "0 0 24px rgba(var(--fb-a,236,40,78),.45)", font: "700 22px Sora", color: "#fff" }}>
            {v.initial}
          </div>
          <div style={{ flex: "1", minWidth: "0" }}>
            <div style={{ fontFamily: "Sora", fontWeight: "700", fontSize: "19px" }}>
              {v.settings.name}
            </div>
            <div style={{ fontSize: "13px", color: "var(--fb-tx3,#a8978c)", overflow: "hidden", textOverflow: "ellipsis" }}>
              {v.settings.email}
            </div>
          </div>
          <button onClick={v.closeProfile} aria-label="Fermer" style={{ width: "38px", height: "38px", flexShrink: "0", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center", background: "rgba(var(--fb-fg,255,255,255),.06)", border: "1px solid rgba(var(--fb-fg,255,255,255),.08)", color: "var(--fb-tx2,#d4c2b6)" }}>
            <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px" }}>
              close
            </span>
          </button>
        </div>
        <div style={{ borderRadius: "20px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "rgba(var(--fb-fg,255,255,255),.03)", border: "1px solid rgba(var(--fb-fg,255,255,255),.06)" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
            Prénom
            <input value={v.settings.name} onChange={v.onName} style={{ height: "40px", padding: "0 12px", borderRadius: "12px", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)", background: "rgba(var(--fb-ink,0,0,0),.35)", color: "var(--fb-tx,#f5efe9)", fontSize: "14px", outline: "none", width: "100%" }} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
            Email
            <input type="email" value={v.settings.email} readOnly title="Email du compte" style={{ opacity: ".7", height: "40px", padding: "0 12px", borderRadius: "12px", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)", background: "rgba(var(--fb-ink,0,0,0),.35)", color: "var(--fb-tx,#f5efe9)", fontSize: "14px", outline: "none", width: "100%" }} />
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
              Poids (kg)
              <input type="text" inputMode="decimal" value={v.settings.bodyWeight} onChange={v.onBodyWeight} style={{ height: "40px", padding: "0 12px", borderRadius: "12px", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)", background: "rgba(var(--fb-ink,0,0,0),.35)", color: "var(--fb-tx,#f5efe9)", fontSize: "14px", outline: "none", width: "100%", fontFamily: "Sora", fontWeight: "600" }} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
              Taille (cm)
              <input type="number" value={v.settings.height} onChange={v.onHeight} style={{ height: "40px", padding: "0 12px", borderRadius: "12px", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)", background: "rgba(var(--fb-ink,0,0,0),.35)", color: "var(--fb-tx,#f5efe9)", fontSize: "14px", outline: "none", width: "100%", fontFamily: "Sora", fontWeight: "600" }} />
            </label>
          </div>
        </div>
        <div style={{ borderRadius: "20px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "rgba(var(--fb-fg,255,255,255),.03)", border: "1px solid rgba(var(--fb-fg,255,255,255),.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
            <div style={{ fontWeight: "600" }}>
              Séances / semaine
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px", borderRadius: "99px", background: "rgba(var(--fb-ink,0,0,0),.35)" }}>
              <button onClick={v.goalDown} style={{ width: "30px", height: "30px", borderRadius: "50%", border: "none", cursor: "pointer", background: "rgba(var(--fb-fg,255,255,255),.06)", color: "var(--fb-tx,#f5efe9)", display: "grid", placeItems: "center" }}>
                <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "18px" }}>
                  remove
                </span>
              </button>
              <span style={{ minWidth: "24px", textAlign: "center", font: "700 15px Sora" }}>
                {v.settings.goal}
              </span>
              <button onClick={v.goalUp} style={{ width: "30px", height: "30px", borderRadius: "50%", border: "none", cursor: "pointer", background: "rgb(var(--fb-a,236,40,78))", color: "var(--fb-on,#fff)", display: "grid", placeItems: "center" }}>
                <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "18px" }}>
                  add
                </span>
              </button>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ fontWeight: "600" }}>
              Repos
            </div>
            <div style={{ display: "flex", gap: "5px" }}>
              {v.restOptions.map((o, o_i) => (
                <Fragment key={o_i}>
                  <button onClick={o.onClick} style={{ whiteSpace: "nowrap", padding: "6px 11px", borderRadius: "99px", cursor: "pointer", font: "600 12px Manrope", background: o.bg, color: o.color, border: o.border }}>
                    {o.label}
                  </button>
              </Fragment>
              ))}
            </div>
          </div>
          {v.toggles.map((t, t_i) => (
            <Fragment key={t_i}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <div style={{ fontWeight: "600" }}>
                  {t.label}
                </div>
                <button onClick={t.onClick} aria-label={t.label} style={{ width: "44px", height: "26px", flexShrink: "0", borderRadius: "99px", border: "none", cursor: "pointer", padding: "3px", display: "flex", justifyContent: t.justify, background: t.track, transition: "background .2s" }}>
                  <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }}>
                  </span>
                </button>
              </div>
          </Fragment>
          ))}
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button onClick={v.logout} style={{ flex: "1 1 100%", whiteSpace: "nowrap", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "11px", borderRadius: "14px", cursor: "pointer", background: "transparent", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)", color: "var(--fb-tx2,#d4c2b6)", font: "600 13px Manrope" }}>
            <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "18px", fontVariationSettings: "'FILL' 0" }}>
              logout
            </span>
            Se déconnecter
          </button>
          <button onClick={v.redoOb} style={{ flex: "1 1 100%", whiteSpace: "nowrap", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "11px", borderRadius: "14px", cursor: "pointer", background: "rgba(var(--fb-fg,255,255,255),.04)", border: "1px solid rgba(var(--fb-fg,255,255,255),.08)", color: "var(--fb-tx,#f5efe9)", font: "600 13px Manrope" }}>
            <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "18px", color: "rgb(var(--fb-a4,255,130,154))" }}>
              quiz
            </span>
            Refaire le questionnaire
          </button>
          <button onClick={v.exportData} style={{ flex: "1", whiteSpace: "nowrap", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "11px", borderRadius: "14px", cursor: "pointer", background: "rgba(var(--fb-fg,255,255,255),.04)", border: "1px solid rgba(var(--fb-fg,255,255,255),.08)", color: "var(--fb-tx,#f5efe9)", font: "600 13px Manrope" }}>
            <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "18px", color: "rgb(var(--fb-a4,255,130,154))" }}>
              download
            </span>
            Exporter
          </button>
          <button onClick={v.resetData} style={{ flex: "1", whiteSpace: "nowrap", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "11px", borderRadius: "14px", cursor: "pointer", background: v.resetBg, border: "1px solid rgba(255,90,70,.3)", color: "#ff8a73", font: "600 13px Manrope" }}>
            <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "18px" }}>
              restart_alt
            </span>
            {v.resetLabel}
          </button>
          {v.askPassword && (
            <input type="password" value={v.delPw} onChange={v.onDelPw} placeholder="Mot de passe pour confirmer" autoComplete="current-password" style={{ flex: "1 1 100%", height: "40px", padding: "0 12px", borderRadius: "12px", border: "1px solid rgba(255,90,70,.3)", background: "rgba(var(--fb-ink,0,0,0),.35)", color: "var(--fb-tx,#f5efe9)", fontSize: "14px", outline: "none" }} />
          )}
          <button onClick={v.deleteAccount} disabled={v.deleting} style={{ flex: "1 1 100%", whiteSpace: "nowrap", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "11px", borderRadius: "14px", cursor: "pointer", background: v.deleteBg, border: "1px solid rgba(255,90,70,.3)", color: "#ff8a73", font: "600 13px Manrope" }}>
            <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "18px" }}>
              person_remove
            </span>
            {v.deleteLabel}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
