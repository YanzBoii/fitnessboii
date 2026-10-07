// Vue générée depuis le prototype (design/design/FitnessBoii.dc.html), styles à l'identique.
import { Fragment } from 'react';
import type { SessionVals } from './sessionVals';

export function SessionView({ v }: { v: SessionVals }) {
  return (
    <>
    {v.noSession && (<>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "12px" }}>
        {v.progTabs.map((t, t_i) => (
          <Fragment key={t_i}>
            <button onClick={t.onStart} style={{ textAlign: "left", cursor: "pointer", padding: "18px", borderRadius: "22px", color: "var(--fb-tx,#f5efe9)", fontFamily: "Manrope", display: "flex", flexDirection: "column", gap: "12px", background: "radial-gradient(260px 160px at 100% 0%, rgba(var(--fb-a,236,40,78),calc(.3 * var(--fb-gk,1))), transparent 70%), linear-gradient(160deg, rgba(var(--fb-s1,58,22,32),.55), rgba(var(--fb-card,22,16,14),.75))", border: "1px solid var(--fb-line,rgba(var(--fb-a3,255,92,124),.12))", boxShadow: "var(--fb-cardsh,none)" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "14px", display: "grid", placeItems: "center", background: "linear-gradient(135deg,rgb(var(--fb-a3,255,92,124)),rgb(var(--fb-a2,220,30,96)))", boxShadow: "0 6px 18px rgba(var(--fb-a,236,40,78),.4)", color: "#fff" }}>
                <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "24px", fontVariationSettings: "'FILL' 1" }}>
                  {t.icon}
                </span>
              </div>
              <div>
                <div style={{ fontFamily: "Sora", fontWeight: "700", fontSize: "24px" }}>
                  {t.name}
                </div>
                <div style={{ fontSize: "12px", color: "var(--fb-tx3,#a8978c)", marginTop: "2px" }}>
                  {t.subtitle}
                </div>
              </div>
              <span style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: "5px", padding: "8px 14px", borderRadius: "99px", background: "var(--fb-inv,#fff)", color: "rgb(var(--fb-bg2,20,11,15))", fontWeight: "700", fontSize: "13px" }}>
                <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
                Démarrer
              </span>
            </button>
        </Fragment>
        ))}
      </div>
    </>)}
    {v.hasSession && (<>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "flex-start" }}>
        <div style={{ flex: "1.6 1 380px", minWidth: "0", display: "flex", flexDirection: "column", gap: "12px" }}>
          <section style={{ borderRadius: "22px", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "12px", background: "linear-gradient(160deg, rgba(var(--fb-s1,58,22,32),.5), rgba(var(--fb-card,22,16,14),.8))", border: "1px solid var(--fb-line,rgba(var(--fb-a3,255,92,124),.12))", boxShadow: "var(--fb-cardsh,none)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", flexShrink: "0", borderRadius: "13px", display: "grid", placeItems: "center", background: "linear-gradient(135deg,rgb(var(--fb-a3,255,92,124)),rgb(var(--fb-a,236,40,78)))", boxShadow: "0 0 18px rgba(var(--fb-a,236,40,78),.45)", color: "var(--fb-on,#fff)" }}>
                <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>
                  {v.sess.icon}
                </span>
              </div>
              <div style={{ flex: "1", minWidth: "0" }}>
                <div style={{ fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
                  Séance en cours
                </div>
                <div style={{ fontFamily: "Sora", fontWeight: "700", fontSize: "18px" }}>
                  {v.sess.name}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ font: "700 28px Sora", letterSpacing: "-.02em", fontVariantNumeric: "tabular-nums", lineHeight: "1" }}>
                  {v.sess.elapsed}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px", fontSize: "11px", color: "var(--fb-tx3,#a8978c)", marginTop: "4px" }}>
                  <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "13px", fontVariationSettings: "'FILL' 0" }}>
                    schedule
                  </span>
                  durée
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              {v.sess.list.map((s, s_i) => (
                <Fragment key={s_i}>
                  <div style={{ flex: "1", height: "5px", borderRadius: "99px", background: s.seg, boxShadow: s.segGlow, transition: "background .4s, box-shadow .4s" }}>
                  </div>
              </Fragment>
              ))}
            </div>
            {v.hasRestInline && (<>
              <div ref={v.popRef} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 8px 8px 12px", borderRadius: "16px", background: "rgba(var(--fb-a,236,40,78),.12)", border: "1px solid rgba(var(--fb-a,236,40,78),.3)" }}>
                <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px", color: "rgb(var(--fb-a3,255,92,124))" }}>
                  timer
                </span>
                <div style={{ flex: "1", display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontSize: "12px", color: "var(--fb-tx2,#d4c2b6)" }}>
                    Repos
                  </span>
                  <span style={{ font: "700 18px Sora", fontVariantNumeric: "tabular-nums" }}>
                    {v.restLabel}
                  </span>
                </div>
                <button onClick={v.restPlus} style={{ height: "34px", padding: "0 12px", borderRadius: "99px", border: "1px solid rgba(var(--fb-fg,255,255,255),.15)", background: "transparent", color: "var(--fb-tx,#f5efe9)", font: "700 12px Manrope", cursor: "pointer" }}>
                  +15s
                </button>
                <button onClick={v.restSkip} style={{ height: "34px", padding: "0 14px", borderRadius: "99px", border: "none", background: "rgb(var(--fb-a,236,40,78))", color: "var(--fb-on,#fff)", font: "700 12px Manrope", cursor: "pointer" }}>
                  Passer
                </button>
              </div>
            </>)}
          </section>
          <section ref={v.curRef} style={{ borderRadius: "26px", padding: "20px", display: "flex", flexDirection: "column", gap: "18px", background: "radial-gradient(460px 240px at 50% 0%, rgba(var(--fb-a,236,40,78),calc(.32 * var(--fb-gk,1))), transparent 75%), linear-gradient(180deg, rgb(var(--fb-s2,36,12,20)), rgb(var(--fb-bg2,20,11,15)))", border: "1px solid var(--fb-line,rgba(var(--fb-a3,255,92,124),.18))", boxShadow: "var(--fb-cardsh,none)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
              <span style={{ whiteSpace: "nowrap", fontSize: "12px", fontWeight: "700", padding: "5px 11px", borderRadius: "99px", background: "rgba(var(--fb-ink,0,0,0),.3)", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)" }}>
                Exercice {v.sess.c.num} / {v.sess.total}
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={v.sess.prev} aria-label="Précédent" style={{ width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center", background: "rgba(var(--fb-ink,0,0,0),.3)", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)", color: "var(--fb-tx,#f5efe9)", opacity: v.sess.prevOp }}>
                  <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px", fontVariationSettings: "'FILL' 0" }}>
                    chevron_left
                  </span>
                </button>
                <button onClick={v.sess.next} aria-label="Suivant" style={{ width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center", background: "rgba(var(--fb-ink,0,0,0),.3)", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)", color: "var(--fb-tx,#f5efe9)", opacity: v.sess.nextOp }}>
                  <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px", fontVariationSettings: "'FILL' 0" }}>
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "60px", height: "60px", flexShrink: "0", borderRadius: "18px", display: "grid", placeItems: "center", background: "linear-gradient(135deg,rgb(var(--fb-a3,255,92,124)),rgb(var(--fb-a6,150,14,48)))", boxShadow: "0 10px 28px rgba(var(--fb-a,236,40,78),.4)", color: "var(--fb-on,#fff)" }}>
                <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "30px", fontVariationSettings: "'FILL' 1" }}>
                  {v.sess.c.icon}
                </span>
              </div>
              <div style={{ minWidth: "0" }}>
                <div style={{ fontFamily: "Sora", fontWeight: "700", fontSize: "clamp(24px,3vw,30px)", letterSpacing: "-.03em", lineHeight: "1.1" }}>
                  {v.sess.c.name}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "var(--fb-tx2,#d4c2b6)", marginTop: "5px" }}>
                  <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "15px", fontVariationSettings: "'FILL' 0" }}>
                    location_on
                  </span>
                  {v.sess.c.machine}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "600", padding: "6px 11px", borderRadius: "99px", background: "rgba(var(--fb-fg,255,255,255),.06)" }}>
                <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "15px", fontVariationSettings: "'FILL' 0", color: "rgb(var(--fb-a4,255,130,154))" }}>
                  repeat
                </span>
                {v.sess.c.target}
              </span>
              <span style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "600", padding: "6px 11px", borderRadius: "99px", background: "rgba(var(--fb-fg,255,255,255),.06)" }}>
                <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "15px", fontVariationSettings: "'FILL' 1", color: "rgb(var(--fb-a4,255,130,154))" }}>
                  emoji_events
                </span>
                Record {v.sess.c.best}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "12px", borderRadius: "20px", background: "rgba(var(--fb-ink,0,0,0),.32)", border: "1px solid rgba(var(--fb-fg,255,255,255),.06)" }}>
                <div style={{ fontSize: "12px", color: "var(--fb-tx3,#a8978c)", textAlign: "center" }}>
                  Charge max (kg)
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button onClick={v.sess.c.wMinus} style={{ width: "44px", height: "44px", flexShrink: "0", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center", background: "rgba(var(--fb-fg,255,255,255),.06)", border: "1px solid rgba(var(--fb-fg,255,255,255),.08)", color: "var(--fb-tx,#f5efe9)" }}>
                    <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px", fontVariationSettings: "'FILL' 0" }}>
                      remove
                    </span>
                  </button>
                  <input type="text" inputMode="decimal" value={v.sess.c.w} onChange={v.sess.c.onW} style={{ flex: "1", minWidth: "0", width: "100%", height: "48px", textAlign: "center", border: "none", background: "transparent", color: "var(--fb-tx,#f5efe9)", font: "700 30px Sora", letterSpacing: "-.02em", outline: "none" }} />
                  <button onClick={v.sess.c.wPlus} style={{ width: "44px", height: "44px", flexShrink: "0", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center", background: "rgba(var(--fb-fg,255,255,255),.06)", border: "1px solid rgba(var(--fb-fg,255,255,255),.08)", color: "var(--fb-tx,#f5efe9)" }}>
                    <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px", fontVariationSettings: "'FILL' 0" }}>
                      add
                    </span>
                  </button>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "12px", borderRadius: "20px", background: "rgba(var(--fb-ink,0,0,0),.32)", border: "1px solid rgba(var(--fb-fg,255,255,255),.06)" }}>
                <div style={{ fontSize: "12px", color: "var(--fb-tx3,#a8978c)", textAlign: "center" }}>
                  Reps
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button onClick={v.sess.c.rMinus} style={{ width: "44px", height: "44px", flexShrink: "0", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center", background: "rgba(var(--fb-fg,255,255,255),.06)", border: "1px solid rgba(var(--fb-fg,255,255,255),.08)", color: "var(--fb-tx,#f5efe9)" }}>
                    <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px", fontVariationSettings: "'FILL' 0" }}>
                      remove
                    </span>
                  </button>
                  <input type="number" inputMode="numeric" value={v.sess.c.r} onChange={v.sess.c.onR} style={{ flex: "1", minWidth: "0", width: "100%", height: "48px", textAlign: "center", border: "none", background: "transparent", color: "var(--fb-tx,#f5efe9)", font: "700 30px Sora", letterSpacing: "-.02em", outline: "none" }} />
                  <button onClick={v.sess.c.rPlus} style={{ width: "44px", height: "44px", flexShrink: "0", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center", background: "rgba(var(--fb-fg,255,255,255),.06)", border: "1px solid rgba(var(--fb-fg,255,255,255),.08)", color: "var(--fb-tx,#f5efe9)" }}>
                    <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px", fontVariationSettings: "'FILL' 0" }}>
                      add
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <button onClick={v.sess.c.validate} style={{ height: "54px", borderRadius: "99px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: v.sess.c.btnBorder, background: v.sess.c.btnBg, color: v.sess.c.btnColor, font: "700 15px Manrope", boxShadow: v.sess.c.btnShadow }}>
              <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px", fontVariationSettings: "'FILL' 0" }}>
                {v.sess.c.btnIcon}
              </span>
              {v.sess.c.validateLabel}
            </button>
          </section>
        </div>
        <div style={{ flex: "1 1 280px", minWidth: "0", display: "flex", flexDirection: "column", gap: "12px" }}>
          <section style={{ borderRadius: "22px", padding: "8px", display: "flex", flexDirection: "column", gap: "4px", background: "linear-gradient(160deg, rgba(var(--fb-s1,58,22,32),.4), rgba(var(--fb-card,22,16,14),.8))", border: "1px solid var(--fb-line,rgba(var(--fb-a3,255,92,124),.10))", boxShadow: "var(--fb-cardsh,none)" }}>
            {v.sess.list.map((e, e_i) => (
              <Fragment key={e_i}>
                <button onClick={e.onClick} style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "10px", borderRadius: "16px", cursor: "pointer", textAlign: "left", background: e.bg, border: e.border, color: "var(--fb-tx,#f5efe9)", fontFamily: "Manrope" }}>
                  <div style={{ width: "34px", height: "34px", flexShrink: "0", borderRadius: "50%", display: "grid", placeItems: "center", background: e.dotBg, color: e.dotColor, boxShadow: e.dotGlow }}>
                    <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>
                      {e.stIcon}
                    </span>
                  </div>
                  <div style={{ flex: "1", minWidth: "0" }}>
                    <div style={{ fontWeight: "700", fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: e.nameColor }}>
                      {e.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--fb-tx3,#a8978c)", marginTop: "1px" }}>
                      {e.sub}
                    </div>
                  </div>
                </button>
            </Fragment>
            ))}
          </section>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={v.cancelSession} style={{ whiteSpace: "nowrap", padding: "12px 18px", borderRadius: "99px", border: "1px solid rgba(var(--fb-fg,255,255,255),.16)", background: "transparent", color: "var(--fb-tx2,#d4c2b6)", font: "600 14px Manrope", cursor: "pointer" }}>
              Abandonner
            </button>
            <button onClick={v.finishSession} style={{ flex: "1", whiteSpace: "nowrap", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "12px 20px", borderRadius: "99px", border: "none", background: "var(--fb-inv,#fff)", color: "#140d0a", font: "700 14px Manrope", cursor: "pointer" }}>
              <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "18px", fontVariationSettings: "'FILL' 0" }}>
                flag
              </span>
              Terminer
            </button>
          </div>
        </div>
      </div>
    </>)}
    </>
  );
}
