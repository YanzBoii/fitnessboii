// Vue générée depuis le prototype (design/design/FitnessBoii.dc.html), styles à l'identique.
import { Fragment } from 'react';
import type { SettingsVals } from './settingsVals';

export function SettingsView({ v }: { v: SettingsVals }) {
  return (
    <>
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "760px" }}>
      <section style={{ borderRadius: "24px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", background: "linear-gradient(160deg, rgba(var(--fb-s1,58,22,32),.45), rgba(var(--fb-card,22,16,14),.78))", border: "1px solid var(--fb-line,rgba(var(--fb-a3,255,92,124),.10))", boxShadow: "var(--fb-cardsh,none)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "12px", display: "grid", placeItems: "center", background: "rgba(var(--fb-a,236,40,78),.14)", color: "rgb(var(--fb-a4,255,130,154))" }}>
            <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "19px", fontVariationSettings: "'FILL' 1" }}>
              contrast
            </span>
          </div>
          <div style={{ fontWeight: "700", fontSize: "14px" }}>
            Apparence
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {v.modes.map((m, m_i) => (
            <Fragment key={m_i}>
              <button onClick={m.onClick} style={{ cursor: "pointer", padding: "8px 8px 12px", borderRadius: "18px", display: "flex", flexDirection: "column", gap: "10px", textAlign: "left", background: "rgba(var(--fb-ink,0,0,0),.2)", border: m.border, color: "var(--fb-tx,#f5efe9)", fontFamily: "Manrope" }}>
                <div style={{ position: "relative", height: "70px", borderRadius: "12px", overflow: "hidden", padding: "10px", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "5px", background: m.preview }}>
                  <span style={{ position: "absolute", top: "8px", left: "10px", fontFamily: "'Material Symbols Rounded'", fontSize: "22px", fontVariationSettings: "'FILL' 1", color: m.iconColor }}>
                    {m.icon}
                  </span>
                  <div style={{ height: "6px", width: "70%", borderRadius: "99px", background: m.bar1 }}>
                  </div>
                  <div style={{ height: "6px", width: "45%", borderRadius: "99px", background: m.bar2 }}>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px" }}>
                  <span style={{ fontWeight: "700", fontSize: "13px" }}>
                    {m.label}
                  </span>
                  <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "18px", fontVariationSettings: "'FILL' 1", color: "rgb(var(--fb-a,236,40,78))", opacity: m.checkOp }}>
                    check_circle
                  </span>
                </div>
              </button>
          </Fragment>
          ))}
        </div>
      </section>
      <section style={{ borderRadius: "24px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", background: "linear-gradient(160deg, rgba(var(--fb-s1,58,22,32),.45), rgba(var(--fb-card,22,16,14),.78))", border: "1px solid var(--fb-line,rgba(var(--fb-a3,255,92,124),.10))", boxShadow: "var(--fb-cardsh,none)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "12px", display: "grid", placeItems: "center", background: "rgba(var(--fb-a,236,40,78),.14)", color: "rgb(var(--fb-a4,255,130,154))" }}>
            <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "19px", fontVariationSettings: "'FILL' 1" }}>
              palette
            </span>
          </div>
          <div style={{ fontWeight: "700", fontSize: "14px" }}>
            Thème de couleur
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 130px), 1fr))", gap: "10px" }}>
          {v.themes.map((t, t_i) => (
            <Fragment key={t_i}>
              <button onClick={t.onClick} style={{ cursor: "pointer", padding: "8px 8px 12px", borderRadius: "18px", display: "flex", flexDirection: "column", gap: "10px", textAlign: "left", background: "rgba(var(--fb-ink,0,0,0),.28)", border: t.border, color: "var(--fb-tx,#f5efe9)", fontFamily: "Manrope" }}>
                <div style={{ position: "relative", height: "70px", borderRadius: "12px", overflow: "hidden", background: t.bgPreview }}>
                  <span style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", fontFamily: "'Material Symbols Rounded'", fontSize: "34px", fontVariationSettings: "'FILL' 1", color: t.iconColor, textShadow: t.glow }}>
                    {t.icon}
                  </span>
                  <div style={{ position: "absolute", top: "6px", right: "6px", width: "22px", height: "22px", borderRadius: "50%", display: t.check, placeItems: "center", background: "var(--fb-inv,#fff)", color: "rgb(var(--fb-bg,12,8,10))" }}>
                    <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "15px" }}>
                      check
                    </span>
                  </div>
                </div>
                <div style={{ fontWeight: "700", fontSize: "13px", padding: "0 4px" }}>
                  {t.name}
                </div>
              </button>
          </Fragment>
          ))}
        </div>
      </section>
    </div>
    </>
  );
}
