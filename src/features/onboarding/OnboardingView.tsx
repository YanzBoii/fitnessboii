// Vue générée depuis le prototype (design/design/FitnessBoii.dc.html), styles à l'identique.
import { Fragment } from 'react';
import type { OnboardingVals } from './onboardingVals';

export function OnboardingView({ v }: { v: OnboardingVals }) {
  return (
    <>
    <div ref={v.obWrapRef} style={{ position: "fixed", inset: "0", zIndex: "60", overflowY: "auto", background: "radial-gradient(800px 500px at 50% -10%, rgba(var(--fb-a,236,40,78),calc(.22 * var(--fb-gk,1))), transparent 70%), rgb(var(--fb-bg,12,8,10))" }}>
      <div style={{ minHeight: "100%", maxWidth: "520px", margin: "0 auto", padding: "clamp(18px,4vh,40px) 20px 24px", display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "40px" }}>
          <button onClick={v.obBack} aria-label="Retour" style={{ width: "40px", height: "40px", flexShrink: "0", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center", background: "rgba(var(--fb-fg,255,255,255),.05)", border: "1px solid rgba(var(--fb-fg,255,255,255),.08)", color: "var(--fb-tx,#f5efe9)", visibility: v.obBackVis }}>
            <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px", fontVariationSettings: "'FILL' 0" }}>
              arrow_back
            </span>
          </button>
          <div style={{ flex: "1", display: "flex", gap: "5px", visibility: v.obBarVis }}>
            {v.obBar.map((s, s_i) => (
              <Fragment key={s_i}>
                <div style={{ flex: "1", height: "5px", borderRadius: "99px", background: s.bg, boxShadow: s.glow, transition: "background .4s, box-shadow .4s" }}>
                </div>
            </Fragment>
            ))}
          </div>
          <span style={{ width: "40px", textAlign: "right", fontSize: "12px", color: "var(--fb-tx3,#a8978c)", visibility: v.obBarVis }}>
            {v.obCount}
          </span>
        </div>
        <div ref={v.obRef} style={{ flex: "1", display: "flex", flexDirection: "column", gap: "22px" }}>
          {v.ob0 && (<>
            <div style={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: "22px", paddingTop: "6vh" }}>
              <div style={{ width: "76px", height: "76px", borderRadius: "24px", display: "grid", placeItems: "center", background: "linear-gradient(135deg,rgb(var(--fb-a3,255,92,124)),rgb(var(--fb-a,236,40,78)))", boxShadow: "0 0 50px rgba(var(--fb-a,236,40,78),.55)", color: "var(--fb-on,#fff)" }}>
                <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "42px", fontVariationSettings: "'FILL' 1" }}>
                  fitness_center
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <h2 style={{ margin: "0", fontFamily: "Sora", fontWeight: "700", fontSize: "clamp(26px,5vw,32px)", letterSpacing: "-.03em", lineHeight: "1.15", textWrap: "balance" }}>
                  Bienvenue sur FitnessBoii
                </h2>
                <p style={{ margin: "0", fontSize: "14px", color: "var(--fb-tx3,#a8978c)", textWrap: "pretty" }}>
                  Quelques questions pour créer ton profil et caler tes programmes. Ça prend une minute.
                </p>
              </div>
            </div>
          </>)}
          {v.ob1 && (<>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <h2 style={{ margin: "0", fontFamily: "Sora", fontWeight: "700", fontSize: "clamp(26px,5vw,32px)", letterSpacing: "-.03em", lineHeight: "1.15", textWrap: "balance" }}>
                Comment tu t’appelles ?
              </h2>
            </div>
            <input value={v.obd.name} onChange={v.obName} onKeyDown={v.obKey} autoFocus placeholder="Ton prénom" style={{ height: "62px", padding: "0 20px", borderRadius: "20px", border: "1.5px solid rgba(var(--fb-a,236,40,78),.35)", background: "rgba(var(--fb-ink,0,0,0),.35)", color: "var(--fb-tx,#f5efe9)", font: "600 22px Sora", outline: "none" }} />
          </>)}
          {v.ob2 && (<>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <h2 style={{ margin: "0", fontFamily: "Sora", fontWeight: "700", fontSize: "clamp(26px,5vw,32px)", letterSpacing: "-.03em", lineHeight: "1.15", textWrap: "balance" }}>
                Ton objectif principal ?
              </h2>
              <p style={{ margin: "0", fontSize: "14px", color: "var(--fb-tx3,#a8978c)", textWrap: "pretty" }}>
                On adapte les conseils et les comparatifs en fonction.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
              {v.obGoals.map((o, o_i) => (
                <Fragment key={o_i}>
                  <button onClick={o.onClick} style={{ cursor: "pointer", padding: "16px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "14px", textAlign: "left", background: o.bg, border: o.border, color: "var(--fb-tx,#f5efe9)", fontFamily: "Manrope", boxShadow: o.shadow }}>
                    <div style={{ width: "44px", height: "44px", flexShrink: "0", borderRadius: "14px", display: "grid", placeItems: "center", background: o.iconBg, color: o.iconColor }}>
                      <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "24px", fontVariationSettings: "'FILL' 1" }}>
                        {o.icon}
                      </span>
                    </div>
                    <div style={{ flex: "1", minWidth: "0" }}>
                      <div style={{ fontWeight: "700", fontSize: "15px" }}>
                        {o.label}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--fb-tx3,#a8978c)", marginTop: "2px" }}>
                        {o.desc}
                      </div>
                    </div>
                    <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "22px", fontVariationSettings: "'FILL' 1", color: "rgb(var(--fb-a,236,40,78))", opacity: o.checkOp }}>
                      check_circle
                    </span>
                  </button>
              </Fragment>
              ))}
            </div>
          </>)}
          {v.ob3 && (<>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <h2 style={{ margin: "0", fontFamily: "Sora", fontWeight: "700", fontSize: "clamp(26px,5vw,32px)", letterSpacing: "-.03em", lineHeight: "1.15", textWrap: "balance" }}>
                Ton niveau à la salle ?
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
              {v.obLevels.map((o, o_i) => (
                <Fragment key={o_i}>
                  <button onClick={o.onClick} style={{ cursor: "pointer", padding: "16px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "14px", textAlign: "left", background: o.bg, border: o.border, color: "var(--fb-tx,#f5efe9)", fontFamily: "Manrope", boxShadow: o.shadow }}>
                    <div style={{ width: "44px", height: "44px", flexShrink: "0", borderRadius: "14px", display: "grid", placeItems: "center", background: o.iconBg, color: o.iconColor }}>
                      <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "24px", fontVariationSettings: "'FILL' 1" }}>
                        {o.icon}
                      </span>
                    </div>
                    <div style={{ flex: "1", minWidth: "0" }}>
                      <div style={{ fontWeight: "700", fontSize: "15px" }}>
                        {o.label}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--fb-tx3,#a8978c)", marginTop: "2px" }}>
                        {o.desc}
                      </div>
                    </div>
                    <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "22px", fontVariationSettings: "'FILL' 1", color: "rgb(var(--fb-a,236,40,78))", opacity: o.checkOp }}>
                      check_circle
                    </span>
                  </button>
              </Fragment>
              ))}
            </div>
          </>)}
          {v.ob4 && (<>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <h2 style={{ margin: "0", fontFamily: "Sora", fontWeight: "700", fontSize: "clamp(26px,5vw,32px)", letterSpacing: "-.03em", lineHeight: "1.15", textWrap: "balance" }}>
                Tes mensurations
              </h2>
              <p style={{ margin: "0", fontSize: "14px", color: "var(--fb-tx3,#a8978c)", textWrap: "pretty" }}>
                Pour suivre ton évolution. Tu pourras les changer plus tard.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px", borderRadius: "22px", background: "rgba(var(--fb-fg,255,255,255),.04)", border: "1px solid rgba(var(--fb-fg,255,255,255),.07)" }}>
              <div style={{ fontSize: "13px", color: "var(--fb-tx3,#a8978c)" }}>
                Poids
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button onClick={v.obBwM} style={{ width: "48px", height: "48px", flexShrink: "0", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center", background: "rgba(var(--fb-fg,255,255,255),.06)", border: "1px solid rgba(var(--fb-fg,255,255,255),.08)", color: "var(--fb-tx,#f5efe9)" }}>
                  <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "22px", fontVariationSettings: "'FILL' 0" }}>
                    remove
                  </span>
                </button>
                <div style={{ flex: "1", display: "flex", alignItems: "baseline", justifyContent: "center", gap: "6px" }}>
                  <input type="text" inputMode="decimal" value={v.obd.bodyWeight} onChange={v.obBw} style={{ width: "110px", textAlign: "center", border: "none", background: "transparent", color: "var(--fb-tx,#f5efe9)", font: "700 38px Sora", letterSpacing: "-.03em", outline: "none" }} />
                  <span style={{ fontSize: "14px", color: "var(--fb-tx3,#a8978c)" }}>
                    kg
                  </span>
                </div>
                <button onClick={v.obBwP} style={{ width: "48px", height: "48px", flexShrink: "0", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center", background: "rgba(var(--fb-fg,255,255,255),.06)", border: "1px solid rgba(var(--fb-fg,255,255,255),.08)", color: "var(--fb-tx,#f5efe9)" }}>
                  <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "22px", fontVariationSettings: "'FILL' 0" }}>
                    add
                  </span>
                </button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px", borderRadius: "22px", background: "rgba(var(--fb-fg,255,255,255),.04)", border: "1px solid rgba(var(--fb-fg,255,255,255),.07)" }}>
              <div style={{ fontSize: "13px", color: "var(--fb-tx3,#a8978c)" }}>
                Taille
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button onClick={v.obHtM} style={{ width: "48px", height: "48px", flexShrink: "0", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center", background: "rgba(var(--fb-fg,255,255,255),.06)", border: "1px solid rgba(var(--fb-fg,255,255,255),.08)", color: "var(--fb-tx,#f5efe9)" }}>
                  <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "22px", fontVariationSettings: "'FILL' 0" }}>
                    remove
                  </span>
                </button>
                <div style={{ flex: "1", display: "flex", alignItems: "baseline", justifyContent: "center", gap: "6px" }}>
                  <input type="number" inputMode="numeric" value={v.obd.height} onChange={v.obHt} style={{ width: "110px", textAlign: "center", border: "none", background: "transparent", color: "var(--fb-tx,#f5efe9)", font: "700 38px Sora", letterSpacing: "-.03em", outline: "none" }} />
                  <span style={{ fontSize: "14px", color: "var(--fb-tx3,#a8978c)" }}>
                    cm
                  </span>
                </div>
                <button onClick={v.obHtP} style={{ width: "48px", height: "48px", flexShrink: "0", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center", background: "rgba(var(--fb-fg,255,255,255),.06)", border: "1px solid rgba(var(--fb-fg,255,255,255),.08)", color: "var(--fb-tx,#f5efe9)" }}>
                  <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "22px", fontVariationSettings: "'FILL' 0" }}>
                    add
                  </span>
                </button>
              </div>
            </div>
          </>)}
          {v.ob5 && (<>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <h2 style={{ margin: "0", fontFamily: "Sora", fontWeight: "700", fontSize: "clamp(26px,5vw,32px)", letterSpacing: "-.03em", lineHeight: "1.15", textWrap: "balance" }}>
                Quel type de programme ?
              </h2>
              <p style={{ margin: "0", fontSize: "14px", color: "var(--fb-tx3,#a8978c)", textWrap: "pretty" }}>
                On crée tes séances avec des exercices sur machines. Tu pourras tout modifier ensuite.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
              {v.obSplits.map((o, o_i) => (
                <Fragment key={o_i}>
                  <button onClick={o.onClick} style={{ cursor: "pointer", padding: "16px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "14px", textAlign: "left", background: o.bg, border: o.border, color: "var(--fb-tx,#f5efe9)", fontFamily: "Manrope", boxShadow: o.shadow }}>
                    <div style={{ width: "44px", height: "44px", flexShrink: "0", borderRadius: "14px", display: "grid", placeItems: "center", background: o.iconBg, color: o.iconColor }}>
                      <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "24px", fontVariationSettings: "'FILL' 1" }}>
                        {o.icon}
                      </span>
                    </div>
                    <div style={{ flex: "1", minWidth: "0" }}>
                      <div style={{ fontWeight: "700", fontSize: "15px" }}>
                        {o.label}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--fb-tx3,#a8978c)", marginTop: "2px" }}>
                        {o.desc}
                      </div>
                    </div>
                    <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "22px", fontVariationSettings: "'FILL' 1", color: "rgb(var(--fb-a,236,40,78))", opacity: o.checkOp }}>
                      check_circle
                    </span>
                  </button>
              </Fragment>
              ))}
            </div>
          </>)}
          {v.ob6 && (<>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <h2 style={{ margin: "0", fontFamily: "Sora", fontWeight: "700", fontSize: "clamp(26px,5vw,32px)", letterSpacing: "-.03em", lineHeight: "1.15", textWrap: "balance" }}>
                Quels jours tu t’entraînes ?
              </h2>
              <p style={{ margin: "0", fontSize: "14px", color: "var(--fb-tx3,#a8978c)", textWrap: "pretty" }}>
                Tes programmes seront répartis sur ces jours.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "6px" }}>
              {v.obDays.map((d, d_i) => (
                <Fragment key={d_i}>
                  <button onClick={d.onClick} style={{ aspectRatio: "1", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center", font: "700 15px Sora", background: d.bg, border: d.border, color: d.color, boxShadow: d.shadow }}>
                    {d.label}
                  </button>
              </Fragment>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 16px", borderRadius: "18px", background: "rgba(var(--fb-fg,255,255,255),.04)", fontSize: "14px", color: "var(--fb-tx2,#d4c2b6)" }}>
              <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px", fontVariationSettings: "'FILL' 0", color: "rgb(var(--fb-a4,255,130,154))" }}>
                event_repeat
              </span>
              {v.obDaysLabel}
            </div>
          </>)}
          {v.ob7 && (<>
            <div style={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: "20px", paddingTop: "4vh" }}>
              <div style={{ width: "76px", height: "76px", borderRadius: "50%", display: "grid", placeItems: "center", background: "linear-gradient(135deg,rgb(var(--fb-a3,255,92,124)),rgb(var(--fb-a6,150,14,48)))", boxShadow: "0 0 50px rgba(var(--fb-a,236,40,78),.55)", color: "var(--fb-on,#fff)" }}>
                <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "42px", fontVariationSettings: "'FILL' 0" }}>
                  check
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <h2 style={{ margin: "0", fontFamily: "Sora", fontWeight: "700", fontSize: "clamp(26px,5vw,32px)", letterSpacing: "-.03em", lineHeight: "1.15", textWrap: "balance" }}>
                  C’est parti, {v.obd.name} !
                </h2>
                <p style={{ margin: "0", fontSize: "14px", color: "var(--fb-tx3,#a8978c)", textWrap: "pretty" }}>
                  Ton profil est prêt et tes programmes sont calés sur tes jours.
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {v.obSummary.map((s, s_i) => (
                  <Fragment key={s_i}>
                    <span style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600", padding: "8px 13px", borderRadius: "99px", background: "rgba(var(--fb-fg,255,255,255),.06)", border: "1px solid rgba(var(--fb-fg,255,255,255),.08)" }}>
                      <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "17px", fontVariationSettings: "'FILL' 1", color: "rgb(var(--fb-a4,255,130,154))" }}>
                        {s.icon}
                      </span>
                      {s.label}
                    </span>
                </Fragment>
                ))}
              </div>
            </div>
          </>)}
        </div>
        <button onClick={v.obNext} style={{ height: "56px", borderRadius: "99px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "rgb(var(--fb-a,236,40,78))", color: "var(--fb-on,#fff)", font: "700 16px Manrope", boxShadow: "0 12px 32px rgba(var(--fb-a,236,40,78),.45)", opacity: v.obCtaOp }}>
          {v.obCta}
          <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px", fontVariationSettings: "'FILL' 0" }}>
            arrow_forward
          </span>
        </button>
      </div>
    </div>
    </>
  );
}
