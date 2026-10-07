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
        <button onClick={v.addProgram} style={{ whiteSpace: "nowrap", flexShrink: "0", display: "flex", alignItems: "center", gap: "5px", padding: "9px 16px", borderRadius: "99px", cursor: "pointer", font: "600 13px Manrope", background: "transparent", color: "rgb(var(--fb-a4,255,130,154))", border: "1.5px dashed rgba(var(--fb-a3,255,92,124),.45)" }}>
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
            Crée ton premier programme avec le bouton « Nouveau ».
          </div>
        </div>
      </>)}
      {v.hasProg && (<>
        <section style={{ borderRadius: "24px", padding: "18px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "18px", background: "radial-gradient(500px 260px at 0% 0%, rgba(var(--fb-a,236,40,78),calc(.32 * var(--fb-gk,1))), transparent 70%), linear-gradient(160deg, rgb(var(--fb-s2,36,12,20)), rgb(var(--fb-bg2,20,11,15)))", border: "1px solid var(--fb-line,rgba(var(--fb-a3,255,92,124),.16))", boxShadow: "var(--fb-cardsh,none)" }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px", padding: "4px" }}>
            {v.notEditing && (<>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                  {v.prog.dayTags.map((d, d_i) => (
                    <Fragment key={d_i}>
                      <span style={{ fontSize: "11px", fontWeight: "700", padding: "4px 9px", borderRadius: "99px", background: "rgba(var(--fb-a,236,40,78),.18)", color: "rgb(var(--fb-a4,255,130,154))" }}>
                        {d}
                      </span>
                  </Fragment>
                  ))}
                  {v.prog.noDays && (<>
                    <span style={{ fontSize: "11px", fontWeight: "700", padding: "4px 9px", borderRadius: "99px", background: "rgba(var(--fb-fg,255,255,255),.06)", color: "var(--fb-tx3,#a8978c)" }}>
                      Aucun jour assigné
                    </span>
                  </>)}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "16px", display: "grid", placeItems: "center", background: "linear-gradient(135deg,rgb(var(--fb-a3,255,92,124)),rgb(var(--fb-a2,220,30,96)))", boxShadow: "0 8px 24px rgba(var(--fb-a,236,40,78),.4)", color: "#fff" }}>
                    <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "26px", fontVariationSettings: "'FILL' 1", color: "var(--fb-on,#fff)" }}>
                      {v.prog.icon}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "Sora", fontWeight: "700", fontSize: "clamp(26px,3.4vw,34px)", letterSpacing: "-.03em", lineHeight: "1.1" }}>
                      {v.prog.name}
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--fb-tx2,#e8d6ca)" }}>
                      {v.prog.subtitle}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button onClick={v.startSelected} style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px", padding: "11px 20px", borderRadius: "99px", border: "none", background: "rgb(var(--fb-a,236,40,78))", color: "var(--fb-on,#fff)", font: "700 14px Manrope", cursor: "pointer", boxShadow: "0 8px 24px rgba(var(--fb-a,236,40,78),.4)" }}>
                  <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>
                    play_arrow
                  </span>
                  Lancer la séance
                </button>
                <button onClick={v.toggleEdit} style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px", padding: "11px 18px", borderRadius: "99px", border: "1px solid rgba(var(--fb-fg,255,255,255),.2)", background: "rgba(var(--fb-ink,0,0,0),.25)", color: "var(--fb-tx,#f5efe9)", font: "600 14px Manrope", cursor: "pointer" }}>
                  <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "17px" }}>
                    edit
                  </span>
                  Modifier
                </button>
              </div>
            </>)}
            {v.isEditing && (<>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
                  Nom du programme
                  <input value={v.prog.name} onChange={v.onProgName} style={{ height: "42px", padding: "0 12px", borderRadius: "12px", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)", background: "rgba(var(--fb-ink,0,0,0),.35)", color: "var(--fb-tx,#f5efe9)", font: "600 16px Sora", outline: "none" }} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
                  Muscles ciblés
                  <input value={v.prog.subtitle} onChange={v.onProgSub} placeholder="Pecs · Épaules · Triceps" style={{ height: "40px", padding: "0 12px", borderRadius: "12px", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)", background: "rgba(var(--fb-ink,0,0,0),.35)", color: "var(--fb-tx,#f5efe9)", fontSize: "14px", outline: "none" }} />
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
                  Icône
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {v.iconPicker.map((i, i_i) => (
                      <Fragment key={i_i}>
                        <button onClick={i.onClick} style={{ width: "38px", height: "38px", borderRadius: "12px", cursor: "pointer", display: "grid", placeItems: "center", background: i.bg, border: i.border, color: "var(--fb-on,#fff)" }}>
                          <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>
                            {i.icon}
                          </span>
                        </button>
                    </Fragment>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
                  Jours
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {v.dayPicker.map((d, d_i) => (
                      <Fragment key={d_i}>
                        <button onClick={d.onClick} style={{ width: "38px", height: "38px", borderRadius: "50%", cursor: "pointer", font: "700 13px Manrope", background: d.bg, border: d.border, color: d.color, boxShadow: d.shadow }}>
                          {d.label}
                        </button>
                    </Fragment>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button onClick={v.toggleEdit} style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px", padding: "11px 20px", borderRadius: "99px", border: "none", background: "var(--fb-inv,#fff)", color: "rgb(var(--fb-bg2,20,11,15))", font: "700 14px Manrope", cursor: "pointer" }}>
                  <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "18px" }}>
                    check
                  </span>
                  Terminé
                </button>
                <button onClick={v.deleteProgram} style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px", padding: "11px 18px", borderRadius: "99px", border: "1px solid rgba(255,90,70,.4)", background: v.delBg, color: "#ff8a73", font: "600 14px Manrope", cursor: "pointer" }}>
                  <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "17px" }}>
                    delete
                  </span>
                  {v.delLabel}
                </button>
              </div>
            </>)}
          </div>
        </section>
        {v.notEditing && (<>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: "10px" }}>
            {v.prog.exercises.map((e, e_i) => (
              <Fragment key={e_i}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center", padding: "14px", borderRadius: "20px", background: "linear-gradient(160deg, rgba(var(--fb-s1,58,22,32),.45), rgba(var(--fb-card,22,16,14),.75))", border: "1px solid var(--fb-line,rgba(var(--fb-a3,255,92,124),.10))", boxShadow: "var(--fb-cardsh,none)" }}>
                  <div style={{ position: "relative", width: "44px", height: "44px", flexShrink: "0", borderRadius: "14px", display: "grid", placeItems: "center", background: "rgba(var(--fb-a,236,40,78),.14)", color: "rgb(var(--fb-a4,255,130,154))" }}>
                    <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>
                      {e.icon}
                    </span>
                    <span style={{ position: "absolute", top: "-5px", right: "-5px", minWidth: "18px", height: "18px", padding: "0 4px", borderRadius: "99px", background: "rgb(var(--fb-a,236,40,78))", color: "var(--fb-on,#fff)", font: "700 10px Sora", display: "grid", placeItems: "center" }}>
                      {e.num}
                    </span>
                  </div>
                  <div style={{ flex: "1", minWidth: "0" }}>
                    <div style={{ fontWeight: "700", fontSize: "14px" }}>
                      {e.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--fb-tx3,#a8978c)", marginTop: "3px" }}>
                      <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "14px" }}>
                        location_on
                      </span>
                      {e.machine}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: "0" }}>
                    <div style={{ fontFamily: "Sora", fontWeight: "600", fontSize: "15px" }}>
                      {e.sets} × {e.reps}
                    </div>
                    <div style={{ fontSize: "12px", color: "rgb(var(--fb-a4,255,130,154))", marginTop: "2px" }}>
                      {e.weightLabel}
                    </div>
                  </div>
                </div>
            </Fragment>
            ))}
          </div>
        </>)}
        {v.isEditing && (<>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap: "10px" }}>
            {v.prog.exercises.map((e, e_i) => (
              <Fragment key={e_i}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "14px", borderRadius: "20px", background: "linear-gradient(160deg, rgba(var(--fb-s1,58,22,32),.45), rgba(var(--fb-card,22,16,14),.75))", border: "1px solid var(--fb-line,rgba(var(--fb-a3,255,92,124),.14))", boxShadow: "var(--fb-cardsh,none)" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <div style={{ width: "38px", height: "38px", flexShrink: "0", borderRadius: "12px", display: "grid", placeItems: "center", background: "rgba(var(--fb-a,236,40,78),.14)", color: "rgb(var(--fb-a4,255,130,154))" }}>
                      <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>
                        {e.icon}
                      </span>
                    </div>
                    <input value={e.name} onChange={e.onName} placeholder="Nom de l'exercice" style={{ flex: "1", minWidth: "0", height: "38px", padding: "0 10px", borderRadius: "10px", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)", background: "rgba(var(--fb-ink,0,0,0),.35)", color: "var(--fb-tx,#f5efe9)", font: "700 14px Manrope", outline: "none" }} />
                    <button onClick={e.onDelete} aria-label="Supprimer" style={{ width: "38px", height: "38px", flexShrink: "0", borderRadius: "10px", cursor: "pointer", display: "grid", placeItems: "center", background: "rgba(255,90,70,.1)", border: "1px solid rgba(255,90,70,.25)", color: "#ff8a73" }}>
                      <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "19px" }}>
                        delete
                      </span>
                    </button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: "8px" }}>
                    <input value={e.machine} onChange={e.onMachine} placeholder="Machine / emplacement" style={{ minWidth: "0", height: "36px", padding: "0 10px", borderRadius: "10px", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)", background: "rgba(var(--fb-ink,0,0,0),.35)", color: "var(--fb-tx,#f5efe9)", fontSize: "13px", outline: "none" }} />
                    <select value={e.group} onChange={e.onGroup} style={{ height: "36px", padding: "0 8px", borderRadius: "10px", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)", background: "rgba(var(--fb-ink,0,0,0),.35)", color: "var(--fb-tx,#f5efe9)", fontSize: "13px", outline: "none" }}>
                      <option value="pecs">
                        Pecs
                      </option>
                      <option value="dos">
                        Dos
                      </option>
                      <option value="epaules">
                        Épaules
                      </option>
                      <option value="bras">
                        Bras
                      </option>
                      <option value="jambes">
                        Jambes
                      </option>
                      <option value="abdos">
                        Abdos
                      </option>
                      <option value="cardio">
                        Cardio
                      </option>
                    </select>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "11px", color: "var(--fb-tx3,#a8978c)" }}>
                      Séries
                      <input type="number" value={e.sets} onChange={e.onSets} style={{ height: "36px", padding: "0 10px", borderRadius: "10px", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)", background: "rgba(var(--fb-ink,0,0,0),.35)", color: "var(--fb-tx,#f5efe9)", font: "600 14px Sora", outline: "none", width: "100%" }} />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "11px", color: "var(--fb-tx3,#a8978c)" }}>
                      Reps
                      <input type="number" value={e.reps} onChange={e.onReps} style={{ height: "36px", padding: "0 10px", borderRadius: "10px", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)", background: "rgba(var(--fb-ink,0,0,0),.35)", color: "var(--fb-tx,#f5efe9)", font: "600 14px Sora", outline: "none", width: "100%" }} />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "11px", color: "var(--fb-tx3,#a8978c)" }}>
                      Poids (kg)
                      <input type="text" inputMode="decimal" value={e.weight} onChange={e.onWeight} style={{ height: "36px", padding: "0 10px", borderRadius: "10px", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)", background: "rgba(var(--fb-ink,0,0,0),.35)", color: "var(--fb-tx,#f5efe9)", font: "600 14px Sora", outline: "none", width: "100%" }} />
                    </label>
                  </div>
                </div>
            </Fragment>
            ))}
            <button onClick={v.addExercise} style={{ minHeight: "120px", borderRadius: "20px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", background: "transparent", border: "1.5px dashed rgba(var(--fb-a3,255,92,124),.4)", color: "rgb(var(--fb-a4,255,130,154))", font: "600 14px Manrope" }}>
              <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "28px" }}>
                add_circle
              </span>
              Ajouter un exercice
            </button>
          </div>
        </>)}
      </>)}
    </div>
    </>
  );
}
