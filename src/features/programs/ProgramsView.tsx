// Vue générée depuis le prototype (design/design/FitnessBoii.dc.html), styles à l'identique.
import { Fragment } from 'react';
import type { ProgramsVals } from './programsVals';

export function ProgramsView({ v }: { v: ProgramsVals }) {
  return (
    <>
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <section style={{ borderRadius: "24px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px", background: "linear-gradient(160deg, rgba(var(--fb-s1,58,22,32),.45), rgba(var(--fb-card,22,16,14),.75))", border: "1px solid var(--fb-line,rgba(var(--fb-a3,255,92,124),.10))", boxShadow: "var(--fb-cardsh,none)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "12px", display: "grid", placeItems: "center", background: "rgba(var(--fb-a,236,40,78),.14)", color: "rgb(var(--fb-a4,255,130,154))" }}>
              <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "19px" }}>
                calendar_month
              </span>
            </div>
            <div style={{ fontWeight: "700", fontSize: "14px" }}>
              Planning de la semaine
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0,1fr))", gap: "6px" }}>
          {v.plan.map((d, d_i) => (
            <Fragment key={d_i}>
              <button onClick={d.onClick} style={{ cursor: "pointer", padding: "10px 4px", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", minWidth: "0", background: d.bg, border: d.border, color: "var(--fb-tx,#f5efe9)", fontFamily: "Manrope" }}>
                <span style={{ fontSize: "11px", color: "var(--fb-tx3,#a8978c)" }}>
                  {d.short}
                </span>
                <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px", fontVariationSettings: "'FILL' 1", color: d.iconColor }}>
                  {d.icon}
                </span>
                <span style={{ fontSize: "11px", fontWeight: "700", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: d.nameColor }}>
                  {d.name}
                </span>
              </button>
          </Fragment>
          ))}
        </div>
        {v.hasPlanDay && (<>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", padding: "10px", borderRadius: "16px", background: "rgba(var(--fb-ink,0,0,0),.3)" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", marginRight: "4px" }}>
              {v.planDayName} :
            </span>
            {v.planOptions.map((o, o_i) => (
              <Fragment key={o_i}>
                <button onClick={o.onClick} style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", borderRadius: "99px", cursor: "pointer", font: "600 12px Manrope", background: o.bg, color: o.color, border: o.border }}>
                  <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "15px" }}>
                    {o.icon}
                  </span>
                  {o.name}
                </button>
            </Fragment>
            ))}
          </div>
        </>)}
      </section>
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "2px" }}>
        {v.progTabs.map((t, t_i) => (
          <Fragment key={t_i}>
            <button onClick={t.onClick} style={{ whiteSpace: "nowrap", flexShrink: "0", display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "99px", cursor: "pointer", font: "600 13px Manrope", background: t.bg, color: t.color, border: t.border, boxShadow: t.shadow }}>
              <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "17px", fontVariationSettings: "'FILL' 1" }}>
                {t.icon}
              </span>
              {t.name}
            </button>
        </Fragment>
        ))}
        <button onClick={v.newProgram} style={{ whiteSpace: "nowrap", flexShrink: "0", display: "flex", alignItems: "center", gap: "5px", padding: "9px 16px", borderRadius: "99px", cursor: "pointer", font: "600 13px Manrope", background: "transparent", color: "rgb(var(--fb-a4,255,130,154))", border: "1.5px dashed rgba(var(--fb-a3,255,92,124),.45)" }}>
          <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "17px" }}>
            add
          </span>
          Nouveau
        </button>
      </div>
      {v.noPrograms && (<>
        <div style={{ padding: "40px 20px", borderRadius: "24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", border: "1.5px dashed rgba(var(--fb-fg,255,255,255),.1)" }}>
          <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "40px", color: "rgb(var(--fb-a4,255,130,154))" }}>
            playlist_add
          </span>
          <div style={{ fontWeight: "700" }}>
            Aucun programme
          </div>
          <div style={{ fontSize: "13px", color: "var(--fb-tx3,#a8978c)" }}>
            Choisis un modèle ou pars de zéro, ça prend 30 secondes.
          </div>
          <button onClick={v.newProgram} style={{ marginTop: "6px", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px", padding: "11px 20px", borderRadius: "99px", border: "none", cursor: "pointer", background: "rgb(var(--fb-a,236,40,78))", color: "var(--fb-on,#fff)", font: "700 14px Manrope" }}>
            <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "18px", fontVariationSettings: "'FILL' 0" }}>
              add
            </span>
            Créer un programme
          </button>
        </div>
      </>)}
      {v.hasProg && (<>
        <section style={{ position: "relative", overflow: "hidden", borderRadius: "28px", padding: "clamp(22px,3.5vw,36px)", minHeight: "clamp(280px,38vh,380px)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "24px", background: "radial-gradient(620px 360px at 85% 0%, rgba(var(--fb-a,236,40,78),calc(.45 * var(--fb-gk,1))), transparent 70%), radial-gradient(400px 260px at 0% 100%, rgba(var(--fb-a,236,40,78),calc(.18 * var(--fb-gk,1))), transparent 70%), linear-gradient(160deg, rgb(var(--fb-s2,36,12,20)), rgb(var(--fb-bg2,20,11,15)))", border: "1px solid var(--fb-line,rgba(var(--fb-a3,255,92,124),.16))", boxShadow: "var(--fb-cardsh,none)" }}>
          <span style={{ position: "absolute", right: "clamp(-30px,-2vw,-10px)", top: "50%", transform: "translateY(-50%) rotate(-12deg)", fontFamily: "'Material Symbols Rounded'", fontSize: "clamp(180px,24vw,280px)", fontVariationSettings: "'FILL' 1", color: "rgba(var(--fb-a,236,40,78),calc(.10 * var(--fb-gk,1)))", pointerEvents: "none", lineHeight: "1" }}>
            {v.prog.icon}
          </span>
          <div style={{ position: "relative", display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {v.prog.dayTags.map((d, d_i) => (
              <Fragment key={d_i}>
                <span style={{ fontSize: "12px", fontWeight: "700", padding: "5px 11px", borderRadius: "99px", background: "rgba(var(--fb-a,236,40,78),.18)", color: "rgb(var(--fb-a4,255,130,154))" }}>
                  {d}
                </span>
            </Fragment>
            ))}
            {v.prog.noDays && (<>
              <span style={{ fontSize: "12px", fontWeight: "700", padding: "5px 11px", borderRadius: "99px", background: "rgba(var(--fb-fg,255,255,255),.06)", color: "var(--fb-tx3,#a8978c)" }}>
                Aucun jour assigné
              </span>
            </>)}
          </div>
          <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "20px", display: "grid", placeItems: "center", background: "linear-gradient(135deg,rgb(var(--fb-a3,255,92,124)),rgb(var(--fb-a,236,40,78)))", boxShadow: "0 10px 30px rgba(var(--fb-a,236,40,78),.45)", color: "var(--fb-on,#fff)" }}>
              <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "34px", fontVariationSettings: "'FILL' 1" }}>
                {v.prog.icon}
              </span>
            </div>
            <div style={{ fontFamily: "Sora", fontWeight: "800", fontSize: "clamp(44px,7vw,72px)", letterSpacing: "-.045em", lineHeight: "1" }}>
              {v.prog.name}
            </div>
            <div style={{ fontSize: "15px", color: "var(--fb-tx2,#d4c2b6)" }}>
              {v.prog.subtitle} · {v.prog.exCount} exercices
            </div>
          </div>
          <div style={{ position: "relative", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={v.startSelected} style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "8px", height: "54px", padding: "0 26px", borderRadius: "99px", border: "none", background: "rgb(var(--fb-a,236,40,78))", color: "var(--fb-on,#fff)", font: "700 16px Manrope", cursor: "pointer", boxShadow: "0 10px 30px rgba(var(--fb-a,236,40,78),.45)" }}>
              <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>
                play_arrow
              </span>
              Lancer la séance
            </button>
            <button onClick={v.editProgram} style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px", height: "54px", padding: "0 22px", borderRadius: "99px", border: "1px solid rgba(var(--fb-fg,255,255,255),.2)", background: "rgba(var(--fb-ink,0,0,0),.25)", color: "var(--fb-tx,#f5efe9)", font: "600 15px Manrope", cursor: "pointer" }}>
              <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "18px", fontVariationSettings: "'FILL' 0" }}>
                edit
              </span>
              Modifier
            </button>
          </div>
        </section>
        <section style={{ borderRadius: "22px", padding: "6px 16px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", columnGap: "24px", background: "rgba(var(--fb-fg,255,255,255),.02)", border: "1px solid rgba(var(--fb-fg,255,255,255),.06)" }}>
          {v.prog.exercises.map((e, e_i) => (
            <Fragment key={e_i}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", borderBottom: "1px solid rgba(var(--fb-fg,255,255,255),.05)" }}>
                <span style={{ width: "20px", flexShrink: "0", font: "700 12px Sora", color: "rgb(var(--fb-a4,255,130,154))" }}>
                  {e.num}
                </span>
                <div style={{ flex: "1", minWidth: "0" }}>
                  <div style={{ fontWeight: "600", fontSize: "13px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {e.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--fb-tx3,#a8978c)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {e.machine}
                  </div>
                </div>
                <span style={{ flexShrink: "0", font: "600 12px Sora", color: "var(--fb-tx2,#d4c2b6)" }}>
                  {e.sets}×{e.reps}
                </span>
              </div>
          </Fragment>
          ))}
        </section>
      </>)}
    </div>
    </>
  );
}
