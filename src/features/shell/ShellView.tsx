// Vue générée depuis le prototype (design/design/FitnessBoii.dc.html), styles à l'identique.
import { Fragment, type ReactNode } from 'react';
import type { ShellVals } from './shellVals';

export function ShellView({ v, children, overlays }: { v: ShellVals; children: ReactNode; overlays: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(900px 520px at 70% -10%, rgba(var(--fb-a,236,40,78),calc(.15 * var(--fb-gk,1))), transparent 70%), radial-gradient(700px 500px at 0% 100%, rgba(var(--fb-s3,110,15,40),.10), transparent 70%), rgb(var(--fb-bg,12,8,10))", position: "relative" }}>
      {v.isDesktop && (<>
        <aside style={{ position: "fixed", left: "0", top: "0", bottom: "0", width: "224px", padding: "24px 14px", display: "flex", flexDirection: "column", gap: "24px", borderRight: "1px solid var(--fb-line,rgba(var(--fb-a3,255,92,124),.08))", background: "rgba(var(--fb-bg,12,8,10),.7)", backdropFilter: "blur(20px)", zIndex: "10" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 10px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "9px", display: "grid", placeItems: "center", background: "linear-gradient(135deg,rgb(var(--fb-a3,255,92,124)),rgb(var(--fb-a,236,40,78)))", boxShadow: "0 0 16px rgba(var(--fb-a,236,40,78),.55)", color: "#fff" }}>
              <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "18px", fontVariationSettings: "'FILL' 1", color: "var(--fb-on,#fff)" }}>
                fitness_center
              </span>
            </div>
            <div style={{ fontFamily: "Sora", fontWeight: "700", fontSize: "17px", letterSpacing: "-.02em" }}>
              FitnessBoii
            </div>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {v.nav.map((n, n_i) => (
              <Fragment key={n_i}>
                <button onClick={n.onClick} style={{ display: "flex", alignItems: "center", gap: "11px", padding: "10px 12px", borderRadius: "14px", border: "none", cursor: "pointer", font: "600 14px Manrope", textAlign: "left", background: n.bg, color: n.color, boxShadow: n.shadow }}>
                  <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>
                    {n.icon}
                  </span>
                  {n.label}
                </button>
            </Fragment>
            ))}
          </nav>
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
            <button onClick={v.goProfile} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px", borderRadius: "14px", border: "none", background: "transparent", color: "var(--fb-tx,#f5efe9)", cursor: "pointer", textAlign: "left" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "50%", display: "grid", placeItems: "center", background: "linear-gradient(135deg,rgb(var(--fb-a3,255,92,124)),rgb(var(--fb-a6,150,14,48)))", fontFamily: "Sora", fontWeight: "600", fontSize: "14px", color: "#fff" }}>
                {v.initial}
              </div>
              <div style={{ minWidth: "0" }}>
                <div style={{ fontWeight: "700", fontSize: "13px" }}>
                  {v.settings.name}
                </div>
                <div style={{ fontSize: "12px", color: "var(--fb-tx3,#a8978c)", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {v.settings.email}
                </div>
              </div>
            </button>
          </div>
        </aside>
      </>)}
      <main ref={v.mainRef} style={{ marginLeft: v.mainML, padding: "clamp(16px,3vw,36px) clamp(14px,3vw,40px) 120px", maxWidth: "1240px" }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", marginBottom: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: "0" }}>
            {v.isMobile && (<>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "8px", display: "grid", placeItems: "center", background: "linear-gradient(135deg,rgb(var(--fb-a3,255,92,124)),rgb(var(--fb-a,236,40,78)))", boxShadow: "0 0 12px rgba(var(--fb-a,236,40,78),.55)", color: "#fff" }}>
                  <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "15px", fontVariationSettings: "'FILL' 1", color: "var(--fb-on,#fff)" }}>
                    fitness_center
                  </span>
                </div>
                <div style={{ fontFamily: "Sora", fontWeight: "700", fontSize: "15px" }}>
                  FitnessBoii
                </div>
              </div>
            </>)}
            <div style={{ fontSize: "13px", color: "var(--fb-tx3,#a8978c)", textTransform: "capitalize" }}>
              {v.dateLabel}
            </div>
            <h1 ref={v.titleRef} style={{ margin: "0", fontFamily: "Sora", fontWeight: "600", fontSize: "clamp(22px,2.6vw,30px)", letterSpacing: "-.025em" }}>
              {v.pageTitle}
            </h1>
          </div>
          <div style={{ display: "flex", gap: "8px", flexShrink: "0" }}>
            <button onClick={v.goPrograms} aria-label="Programmes" style={{ width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center", background: "rgba(var(--fb-fg,255,255,255),.05)", border: "1px solid rgba(var(--fb-fg,255,255,255),.08)", color: "var(--fb-tx2,#d4c2b6)" }}>
              <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px" }}>
                calendar_month
              </span>
            </button>
            <button onClick={v.goProfile} aria-label="Profil" style={{ width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center", background: "linear-gradient(135deg,rgb(var(--fb-a3,255,92,124)),rgb(var(--fb-a6,150,14,48)))", border: "none", color: "var(--fb-on,#fff)", font: "600 15px Sora" }}>
              {v.initial}
            </button>
          </div>
        </header>
      {children}
    </main>
      {v.hasRestFloat && (<>
        <div ref={v.popRef} style={{ position: "fixed", right: "clamp(14px,3vw,32px)", bottom: v.restBottom, display: "flex", alignItems: "center", gap: "10px", padding: "8px 8px 8px 16px", borderRadius: "99px", background: "rgba(var(--fb-s4,40,16,24),.85)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", border: "1px solid rgba(var(--fb-a3,255,92,124),.3)", boxShadow: "var(--fb-popsh,0 14px 34px rgba(0,0,0,.5))", zIndex: "25" }}>
          <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px", color: "rgb(var(--fb-a3,255,92,124))" }}>
            timer
          </span>
          <div>
            <div style={{ fontSize: "11px", color: "var(--fb-tx3,#a8978c)" }}>
              Repos
            </div>
            <div style={{ font: "700 18px Sora", fontVariantNumeric: "tabular-nums" }}>
              {v.restLabel}
            </div>
          </div>
          <button onClick={v.restPlus} style={{ height: "36px", padding: "0 12px", borderRadius: "99px", border: "1px solid rgba(var(--fb-fg,255,255,255),.15)", background: "transparent", color: "var(--fb-tx,#f5efe9)", font: "700 12px Manrope", cursor: "pointer" }}>
            +15s
          </button>
          <button onClick={v.restSkip} style={{ height: "36px", padding: "0 14px", borderRadius: "99px", border: "none", background: "rgb(var(--fb-a,236,40,78))", color: "var(--fb-on,#fff)", font: "700 12px Manrope", cursor: "pointer" }}>
            Passer
          </button>
        </div>
      </>)}
      {v.isMobile && (<>
        <nav style={{ position: "fixed", left: "50%", bottom: "16px", transform: "translateX(-50%)", display: "flex", gap: "6px", padding: "7px", borderRadius: "99px", background: "rgba(var(--fb-s4,40,16,24),.75)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)", boxShadow: "var(--fb-popsh,0 20px 40px rgba(0,0,0,.5))", zIndex: "20" }}>
          {v.nav.map((n, n_i) => (
            <Fragment key={n_i}>
              <button onClick={n.onClick} aria-label={n.label} style={{ width: "48px", height: "48px", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center", background: n.mbg, color: n.color, border: n.mborder, boxShadow: n.shadow }}>
                <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>
                  {n.icon}
                </span>
              </button>
          </Fragment>
          ))}
        </nav>
      </>)}
    {overlays}
    </div>
  );
}
