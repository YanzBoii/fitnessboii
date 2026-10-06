// Vue générée depuis le prototype (design/design/FitnessBoii.dc.html), styles à l'identique.
import { Fragment } from 'react';
import type { HomeVals } from './homeVals';

export function HomeView({ v }: { v: HomeVals }) {
  return (
    <>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "14px" }}>
      <section style={{ position: "relative", overflow: "hidden", borderRadius: "24px", padding: "20px", minHeight: "260px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px", background: "radial-gradient(380px 260px at 50% 0%, rgba(var(--fb-a,236,40,78),calc(.5 * var(--fb-gk,1))), rgba(var(--fb-s3,110,15,40),.22) 55%, transparent 80%), linear-gradient(180deg, rgb(var(--fb-s2,36,12,20)), rgb(var(--fb-bg2,20,11,15)))", border: "1px solid var(--fb-line,rgba(var(--fb-a3,255,92,124),.18))", boxShadow: "var(--fb-cardsh,none)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", padding: "5px 11px", borderRadius: "99px", background: "rgba(var(--fb-ink,0,0,0),.3)", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)" }}>
            <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "15px" }}>
              {v.hero.pillIcon}
            </span>
            {v.hero.pill}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "6px" }}>
          <div style={{ width: "58px", height: "58px", borderRadius: "50%", display: "grid", placeItems: "center", marginBottom: "6px", background: "radial-gradient(circle at 35% 30%, rgb(var(--fb-a5,255,182,198)), rgb(var(--fb-a,236,40,78)) 60%, rgb(var(--fb-a6,150,14,48)))", boxShadow: "0 0 40px rgba(var(--fb-a,236,40,78),.65), inset 0 -4px 10px rgba(0,0,0,.25)", color: "#fff" }}>
            <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "30px", fontVariationSettings: "'FILL' 1", color: "var(--fb-on,#fff)" }}>
              {v.hero.icon}
            </span>
          </div>
          <div style={{ fontSize: "13px", color: "var(--fb-tx2,#f1d9cc)" }}>
            {v.hero.subtitle}
          </div>
          <div style={{ fontFamily: "Sora", fontWeight: "700", fontSize: "clamp(34px,4.4vw,46px)", letterSpacing: "-.04em", lineHeight: "1.05" }}>
            {v.hero.name}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
          <button onClick={v.startToday} style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px", padding: "11px 20px", borderRadius: "99px", border: "none", background: "var(--fb-inv,#fff)", color: "rgb(var(--fb-bg2,20,11,15))", font: "700 14px Manrope", cursor: "pointer" }}>
            <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>
              play_arrow
            </span>
            {v.hero.cta}
          </button>
          <button onClick={v.goHeroProgram} style={{ whiteSpace: "nowrap", padding: "11px 18px", borderRadius: "99px", border: "1px solid rgba(var(--fb-fg,255,255,255),.22)", background: "rgba(var(--fb-ink,0,0,0),.25)", color: "var(--fb-tx,#f5efe9)", font: "600 14px Manrope", cursor: "pointer" }}>
            Voir le programme
          </button>
        </div>
      </section>
      <section style={{ borderRadius: "24px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", background: "linear-gradient(160deg, rgba(var(--fb-s1,58,22,32),.55), rgba(var(--fb-card,22,16,14),.75))", border: "1px solid var(--fb-line,rgba(var(--fb-a3,255,92,124),.10))", boxShadow: "var(--fb-cardsh,none)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <div style={{ width: "54px", height: "54px", borderRadius: "18px", display: "grid", placeItems: "center", background: "radial-gradient(circle at 50% 70%, rgba(var(--fb-a,236,40,78),calc(.45 * var(--fb-gk,1))), rgba(var(--fb-a,236,40,78),.08))", border: "1px solid rgba(var(--fb-a3,255,92,124),.25)", color: "#fff" }}>
            <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "32px", fontVariationSettings: "'FILL' 1", color: "rgb(var(--fb-a3,255,92,124))", textShadow: "0 0 18px rgba(var(--fb-a,236,40,78),.9)" }}>
              local_fire_department
            </span>
          </div>
          <div>
            <div style={{ fontSize: "13px", color: "var(--fb-tx3,#a8978c)" }}>
              Série en cours
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "2px" }}>
              <span style={{ fontFamily: "Sora", fontWeight: "800", fontSize: "44px", lineHeight: "1", color: "rgb(var(--fb-a,236,40,78))", textShadow: "0 0 30px rgba(var(--fb-a,236,40,78),.5)" }}>
                {v.streak}
              </span>
              <span style={{ fontFamily: "Sora", fontWeight: "600", fontSize: "16px" }}>
                semaines
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "5px", padding: "9px", borderRadius: "18px", background: "rgba(var(--fb-ink,0,0,0),.3)", border: "1px solid rgba(var(--fb-fg,255,255,255),.06)" }}>
          {v.weekRow.map((d, d_i) => (
            <Fragment key={d_i}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "11px", color: "var(--fb-tx3,#a8978c)" }}>
                  {d.label}
                </span>
                <div style={{ width: "100%", maxWidth: "36px", aspectRatio: "1", borderRadius: "50%", display: "grid", placeItems: "center", background: d.bg, border: d.border, boxShadow: d.shadow, color: d.color, fontSize: "12px", fontWeight: "600" }}>
                  <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "16px", display: d.checkDisplay }}>
                    check
                  </span>
                  <span style={{ display: d.numDisplay }}>
                    {d.num}
                  </span>
                </div>
              </div>
          </Fragment>
          ))}
        </div>
      </section>
      <section style={{ gridColumn: "1 / -1", borderRadius: "24px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", background: "linear-gradient(160deg, rgba(var(--fb-s1,58,22,32),.45), rgba(var(--fb-card,22,16,14),.75))", border: "1px solid var(--fb-line,rgba(var(--fb-a3,255,92,124),.10))", boxShadow: "var(--fb-cardsh,none)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "12px", display: "grid", placeItems: "center", background: "rgba(var(--fb-a,236,40,78),.14)", color: "rgb(var(--fb-a4,255,130,154))" }}>
              <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "19px" }}>
                event_available
              </span>
            </div>
            <div>
              <div style={{ fontWeight: "700", fontSize: "14px" }}>
                Présence à la salle
              </div>
              <div style={{ fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
                {v.heatRange} · {v.heatTotal} {v.heatTotal > 1 ? "séances" : "séance"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "14px", fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "rgb(var(--fb-a2,220,30,96))", boxShadow: "0 0 8px rgba(var(--fb-a2,220,30,96),.7)" }}>
              </span>
              Séance
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", border: "1.5px solid rgba(var(--fb-fg,255,255,255),.2)" }}>
              </span>
              Repos
            </span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {v.heatRows.map((row, row_i) => (
            <Fragment key={row_i}>
              <div style={{ display: "grid", gridTemplateColumns: `20px repeat(${v.heatCols}, minmax(0,1fr))`, gap: "5px", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "var(--fb-tx4,#8e7d72)" }}>
                  {row.label}
                </span>
                {row.cells.map((c, c_i) => (
                  <Fragment key={c_i}>
                    <div data-heat title={c.title} style={{ width: "100%", maxWidth: "16px", aspectRatio: "1", justifySelf: "center", borderRadius: "50%", background: c.bg, border: c.border, boxShadow: c.shadow, opacity: c.op }}>
                    </div>
                </Fragment>
                ))}
              </div>
          </Fragment>
          ))}
        </div>
      </section>
      <section style={{ gridColumn: "1 / -1", borderRadius: "24px", padding: "20px", background: "linear-gradient(160deg, rgba(var(--fb-s1,58,22,32),.45), rgba(var(--fb-card,22,16,14),.75))", border: "1px solid var(--fb-line,rgba(var(--fb-a3,255,92,124),.10))", boxShadow: "var(--fb-cardsh,none)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "12px", display: "grid", placeItems: "center", background: "rgba(var(--fb-a,236,40,78),.14)", color: "rgb(var(--fb-a4,255,130,154))" }}>
              <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "19px", fontVariationSettings: "'FILL' 1" }}>
                emoji_events
              </span>
            </div>
            <div style={{ fontWeight: "700", fontSize: "14px" }}>
              Records récents
            </div>
          </div>
          <button onClick={v.goPerf} style={{ border: "none", background: "none", color: "rgb(var(--fb-a4,255,130,154))", font: "600 13px Manrope", cursor: "pointer" }}>
            Tout voir
          </button>
        </div>
        {v.noPrs && <div style={{ fontSize: "13px", color: "var(--fb-tx3,#a8978c)" }}>Termine une séance pour voir tes records ici.</div>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "10px" }}>
          {v.prs.map((p, p_i) => (
            <Fragment key={p_i}>
              <button onClick={p.onClick} style={{ display: "flex", gap: "12px", alignItems: "center", textAlign: "left", cursor: "pointer", padding: "14px", borderRadius: "18px", background: "rgba(var(--fb-ink,0,0,0),.28)", border: "1px solid rgba(var(--fb-fg,255,255,255),.06)", color: "var(--fb-tx,#f5efe9)", fontFamily: "Manrope" }}>
                <div style={{ width: "40px", height: "40px", flexShrink: "0", borderRadius: "50%", display: "grid", placeItems: "center", background: "rgba(var(--fb-fg,255,255,255),.05)", color: "rgb(var(--fb-a4,255,130,154))" }}>
                  <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px" }}>
                    {p.icon}
                  </span>
                </div>
                <div style={{ minWidth: "0" }}>
                  <div style={{ fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
                    {p.name}
                  </div>
                  <div style={{ fontFamily: "Sora", fontWeight: "600", fontSize: "18px", marginTop: "2px" }}>
                    {p.w}{' '}
                    <span style={{ fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
                      kg × {p.r}
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "rgb(var(--fb-a4,255,130,154))", marginTop: "2px" }}>
                    {p.delta}
                  </div>
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
