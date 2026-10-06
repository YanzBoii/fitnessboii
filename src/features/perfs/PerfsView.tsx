// Vue générée depuis le prototype (design/design/FitnessBoii.dc.html), styles à l'identique.
import { Fragment } from 'react';
import type { PerfsVals } from './perfsVals';

export function PerfsView({ v }: { v: PerfsVals }) {
  return (
    <>
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "900px" }}>
      <section style={{ borderRadius: "24px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", background: "linear-gradient(160deg, rgba(var(--fb-s1,58,22,32),.45), rgba(var(--fb-card,22,16,14),.78))", border: "1px solid var(--fb-line,rgba(var(--fb-a3,255,92,124),.10))", boxShadow: "var(--fb-cardsh,none)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", flexShrink: "0", borderRadius: "12px", display: "grid", placeItems: "center", background: "rgba(var(--fb-a,236,40,78),.14)", color: "rgb(var(--fb-a4,255,130,154))" }}>
              <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "19px", fontVariationSettings: "'FILL' 1" }}>
                compare
              </span>
            </div>
            <div>
              <div style={{ fontWeight: "700", fontSize: "14px" }}>
                Évolution physique
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "4px", padding: "4px", borderRadius: "99px", background: "rgba(var(--fb-ink,0,0,0),.3)" }}>
            {v.cmpModes.map((m, m_i) => (
              <Fragment key={m_i}>
                <button onClick={m.onClick} style={{ whiteSpace: "nowrap", padding: "7px 13px", borderRadius: "99px", border: "none", cursor: "pointer", font: "600 12px Manrope", background: m.bg, color: m.color }}>
                  {m.label}
                </button>
            </Fragment>
            ))}
          </div>
        </div>
        {v.canCompare && (<>
          <div ref={v.cmpRef} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {v.cmp.map((c, c_i) => (
              <Fragment key={c_i}>
                <div style={{ position: "relative", aspectRatio: "3/4", borderRadius: "18px", overflow: "hidden", background: "rgba(var(--fb-ink,0,0,0),.35)", border: c.border }}>
                  <div role="img" aria-label={c.title} style={{ position: "absolute", inset: "0", backgroundSize: "cover", backgroundPosition: "center", backgroundImage: c.bgImg }}>
                  </div>
                  <div style={{ position: "absolute", left: "0", right: "0", bottom: "0", padding: "28px 12px 10px", background: "linear-gradient(transparent, rgba(0,0,0,.75))" }}>
                    <div style={{ fontFamily: "Sora", fontWeight: "700", fontSize: "15px" }}>
                      {c.title}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--fb-tx2,#e8d6ca)", textTransform: "capitalize" }}>
                      {c.date}
                    </div>
                  </div>
                </div>
            </Fragment>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "13px", color: "var(--fb-tx2,#d4c2b6)" }}>
            <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "16px", fontVariationSettings: "'FILL' 0", color: "rgb(var(--fb-a4,255,130,154))" }}>
              date_range
            </span>
            {v.cmpGap}
          </div>
        </>)}
        {v.noCompare && (<>
          <div style={{ padding: "28px 16px", borderRadius: "18px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", textAlign: "center", border: "1.5px dashed rgba(var(--fb-fg,255,255,255),.1)" }}>
            <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "36px", fontVariationSettings: "'FILL' 0", color: "rgb(var(--fb-a4,255,130,154))" }}>
              add_a_photo
            </span>
            <div style={{ fontSize: "13px", color: "var(--fb-tx2,#d4c2b6)", maxWidth: "340px", textWrap: "pretty" }}>
              {v.cmpEmpty}
            </div>
          </div>
        </>)}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "2px" }}>
          <button onClick={v.pickPhoto} style={{ width: "76px", flexShrink: "0", aspectRatio: "3/4", borderRadius: "14px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", background: v.addBg, border: "1.5px dashed rgba(var(--fb-a3,255,92,124),.45)", color: "rgb(var(--fb-a4,255,130,154))", font: "600 11px Manrope" }}>
            <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "22px", fontVariationSettings: "'FILL' 0" }}>
              {v.addIcon}
            </span>
            {v.addLabel}
          </button>
          {v.photoList.map((p, p_i) => (
            <Fragment key={p_i}>
              <div style={{ position: "relative", width: "76px", flexShrink: "0", display: "flex", flexDirection: "column", gap: "4px" }}>
                <div role="img" aria-label={p.label} style={{ width: "100%", aspectRatio: "3/4", borderRadius: "14px", backgroundSize: "cover", backgroundPosition: "center", backgroundImage: p.bgImg, border: p.border }}>
                </div>
                <button onClick={p.onDelete} aria-label="Supprimer" style={{ position: "absolute", top: "4px", right: "4px", width: "24px", height: "24px", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center", border: "none", background: p.delBg, color: "var(--fb-on,#fff)" }}>
                  <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "14px", fontVariationSettings: "'FILL' 0" }}>
                    {p.delIcon}
                  </span>
                </button>
                <span style={{ fontSize: "11px", color: "var(--fb-tx3,#a8978c)", textAlign: "center" }}>
                  {p.label}
                </span>
              </div>
          </Fragment>
          ))}
        </div>
      </section>
      <section style={{ borderRadius: "24px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", background: "linear-gradient(160deg, rgba(var(--fb-s1,58,22,32),.45), rgba(var(--fb-card,22,16,14),.78))", border: "1px solid var(--fb-line,rgba(var(--fb-a3,255,92,124),.10))", boxShadow: "var(--fb-cardsh,none)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", flexShrink: "0", borderRadius: "12px", display: "grid", placeItems: "center", background: "rgba(var(--fb-a,236,40,78),.14)", color: "rgb(var(--fb-a4,255,130,154))" }}>
              <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "19px", fontVariationSettings: "'FILL' 1" }}>
                bar_chart
              </span>
            </div>
            <div>
              <div style={{ fontWeight: "700", fontSize: "14px" }}>
                Séances par semaine
              </div>
              <div style={{ fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
                12 dernières semaines
              </div>
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "var(--fb-tx2,#d4c2b6)" }}>
            Moyenne{' '}
            <span style={{ font: "700 15px Sora", color: "var(--fb-tx,#f5efe9)" }}>
              {v.barAvg}
            </span>
            {' '}/ sem.
          </div>
        </div>
        <div style={{ position: "relative", height: "150px", display: "flex", alignItems: "flex-end", gap: "6px" }}>
          <div style={{ position: "absolute", left: "0", right: "0", bottom: v.goalPct, borderTop: "1.5px dashed rgba(var(--fb-a,236,40,78),.45)", pointerEvents: "none" }}>
            <span style={{ position: "absolute", right: "0", bottom: "3px", fontSize: "10px", fontWeight: "700", color: "rgb(var(--fb-a4,255,130,154))" }}>
              objectif {v.settings.goal}
            </span>
          </div>
          {v.bars.map((b, b_i) => (
            <Fragment key={b_i}>
              <div title={b.title} style={{ flex: "1", minWidth: "0", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center" }}>
                <div data-bar="1" style={{ width: "100%", maxWidth: "30px", height: b.h, minHeight: "4px", borderRadius: "8px 8px 4px 4px", background: b.bg, boxShadow: b.shadow, transformOrigin: "bottom" }}>
                </div>
              </div>
          </Fragment>
          ))}
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "-6px" }}>
          {v.bars.map((b, b_i) => (
            <Fragment key={b_i}>
              <span style={{ flex: "1", minWidth: "0", textAlign: "center", fontSize: "10px", color: b.labelColor, whiteSpace: "nowrap" }}>
                {b.label}
              </span>
          </Fragment>
          ))}
        </div>
      </section>
      <section style={{ borderRadius: "24px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", background: "linear-gradient(160deg, rgba(var(--fb-s1,58,22,32),.45), rgba(var(--fb-card,22,16,14),.78))", border: "1px solid var(--fb-line,rgba(var(--fb-a3,255,92,124),.10))", boxShadow: "var(--fb-cardsh,none)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", flexShrink: "0", borderRadius: "12px", display: "grid", placeItems: "center", background: "rgba(var(--fb-a,236,40,78),.14)", color: "rgb(var(--fb-a4,255,130,154))" }}>
            <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "19px", fontVariationSettings: "'FILL' 1" }}>
              trending_up
            </span>
          </div>
          <div>
            <div style={{ fontWeight: "700", fontSize: "14px" }}>
              Ce qui a changé
            </div>
            <div style={{ fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
              30 derniers jours
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {v.changeStats.map((s, s_i) => (
            <Fragment key={s_i}>
              <div style={{ padding: "14px", borderRadius: "18px", background: "rgba(var(--fb-ink,0,0,0),.28)", display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--fb-tx2,#d4c2b6)" }}>
                  <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "16px", fontVariationSettings: "'FILL' 1", color: "rgb(var(--fb-a4,255,130,154))" }}>
                    {s.icon}
                  </span>
                  {s.label}
                </div>
                <div style={{ fontFamily: "Sora", fontWeight: "700", fontSize: "24px" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: "11px", color: "var(--fb-tx3,#a8978c)" }}>
                  {s.sub}
                </div>
              </div>
          </Fragment>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {v.changes.map((c, c_i) => (
            <Fragment key={c_i}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "11px 0", borderTop: "1px solid rgba(var(--fb-fg,255,255,255),.06)" }}>
                <div style={{ width: "36px", height: "36px", flexShrink: "0", borderRadius: "12px", display: "grid", placeItems: "center", background: "rgba(var(--fb-fg,255,255,255),.05)", color: "rgb(var(--fb-a4,255,130,154))" }}>
                  <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "19px", fontVariationSettings: "'FILL' 1" }}>
                    {c.icon}
                  </span>
                </div>
                <div style={{ flex: "1", minWidth: "0" }}>
                  <div style={{ fontWeight: "700", fontSize: "13px" }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--fb-tx3,#a8978c)", marginTop: "1px" }}>
                    {c.from} → {c.to}
                  </div>
                </div>
                <div style={{ position: "relative", width: "clamp(64px,14vw,120px)", height: "34px", flexShrink: "0" }}>
                  <svg viewBox="0 0 100 34" preserveAspectRatio="none" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", overflow: "visible" }}>
                    <path d={c.area} style={{ fill: "rgba(var(--fb-a,236,40,78),.16)" }} />
                    <polyline points={c.spark} fill="none" style={{ stroke: c.stroke }} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  </svg>
                  <div style={{ position: "absolute", left: "100%", top: c.lastY, width: "7px", height: "7px", borderRadius: "50%", transform: "translate(-50%,-50%)", background: c.stroke, boxShadow: `0 0 8px ${c.stroke}` }}>
                  </div>
                </div>
                <span style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "3px", fontSize: "12px", fontWeight: "700", padding: "4px 9px", borderRadius: "99px", background: c.pillBg, color: c.pillColor }}>
                  <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "14px", fontVariationSettings: "'FILL' 0" }}>
                    {c.arrow}
                  </span>
                  {c.delta}
                </span>
              </div>
          </Fragment>
          ))}
          {v.noChanges && (<>
            <div style={{ padding: "12px 0", fontSize: "13px", color: "var(--fb-tx3,#a8978c)", borderTop: "1px solid rgba(var(--fb-fg,255,255,255),.06)" }}>
              Rien de nouveau ce mois-ci. Continue comme ça.
            </div>
          </>)}
        </div>
      </section>
    </div>
    </>
  );
}
