// Vue générée depuis le prototype (design/design/FitnessBoii.dc.html), styles à l'identique.
import { Fragment } from 'react';
import type { BuilderVals } from './builderVals';

export function BuilderView({ v }: { v: BuilderVals }) {
  return (
    <>
    <div ref={v.fadeRef} onClick={v.bClose} style={{ position: "fixed", inset: "0", zIndex: "50", display: "flex", alignItems: v.sheetAlign, justifyContent: "center", padding: v.sheetPad, background: "rgba(5,3,2,.6)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}>
      <div ref={v.bPanelRef} onClick={v.stop} style={{ width: "100%", maxWidth: "640px", height: v.bH, display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: v.sheetRadius, background: "rgb(var(--fb-bg2,20,11,15))", border: "1px solid var(--fb-line,rgba(var(--fb-a3,255,92,124),.16))", boxShadow: "var(--fb-popsh,0 30px 80px rgba(0,0,0,.6))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", borderBottom: "1px solid rgba(var(--fb-fg,255,255,255),.06)" }}>
          <button onClick={v.bClose} aria-label="Fermer" style={{ width: "40px", height: "40px", flexShrink: "0", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center", background: "rgba(var(--fb-fg,255,255,255),.06)", border: "none", color: "var(--fb-tx2,#d4c2b6)" }}>
            <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px", fontVariationSettings: "'FILL' 0" }}>
              close
            </span>
          </button>
          <div style={{ flex: "1", textAlign: "center", font: "700 16px Sora" }}>
            {v.bld.title}
          </div>
          <div style={{ width: "40px" }}>
          </div>
        </div>
        <div style={{ flex: "1", overflowY: "auto", padding: "18px 16px 24px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "22px", height: "22px", borderRadius: "50%", display: "grid", placeItems: "center", background: "rgba(var(--fb-a,236,40,78),.16)", color: "rgb(var(--fb-a4,255,130,154))", font: "700 11px Sora" }}>
                1
              </span>
              <span style={{ fontWeight: "700", fontSize: "14px" }}>
                Nom
              </span>
            </div>
            <input value={v.bld.name} onChange={v.bld.onName} placeholder="ex. Push, Haut du corps…" style={{ height: "54px", padding: "0 16px", borderRadius: "16px", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)", background: "rgba(var(--fb-ink,0,0,0),.3)", color: "var(--fb-tx,#f5efe9)", font: "600 18px Sora", outline: "none" }} />
            {v.bld.showTpl && (<>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
                  Ou pars d’un modèle (exercices déjà remplis) :
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {v.bld.templates.map((t, t_i) => (
                    <Fragment key={t_i}>
                      <button onClick={t.onClick} style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px", padding: "9px 13px", borderRadius: "99px", cursor: "pointer", font: "600 13px Manrope", background: "rgba(var(--fb-fg,255,255,255),.05)", color: "var(--fb-tx,#f5efe9)", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)" }}>
                        <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "17px", fontVariationSettings: "'FILL' 1", color: "rgb(var(--fb-a4,255,130,154))" }}>
                          {t.icon}
                        </span>
                        {t.name}
                      </button>
                  </Fragment>
                  ))}
                </div>
              </div>
            </>)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "22px", height: "22px", borderRadius: "50%", display: "grid", placeItems: "center", background: "rgba(var(--fb-a,236,40,78),.16)", color: "rgb(var(--fb-a4,255,130,154))", font: "700 11px Sora" }}>
                2
              </span>
              <span style={{ fontWeight: "700", fontSize: "14px" }}>
                Exercices
              </span>
              <span style={{ marginLeft: "auto", fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
                {v.bld.count}
              </span>
            </div>
            {v.bld.empty && (<>
              <div style={{ padding: "14px", borderRadius: "16px", border: "1.5px dashed rgba(var(--fb-fg,255,255,255),.1)", fontSize: "13px", color: "var(--fb-tx3,#a8978c)", textAlign: "center" }}>
                Touche un exercice ci-dessous pour l’ajouter.
              </div>
            </>)}
            {v.bld.rows.map((r, r_i) => (
              <Fragment key={r_i}>
                <div style={{ display: "flex", gap: "10px", padding: "12px", borderRadius: "18px", background: "rgba(var(--fb-fg,255,255,255),.04)", border: "1px solid rgba(var(--fb-fg,255,255,255),.06)" }}>
                  <div style={{ width: "38px", height: "38px", flexShrink: "0", borderRadius: "12px", display: "grid", placeItems: "center", background: "rgba(var(--fb-a,236,40,78),.14)", color: "rgb(var(--fb-a4,255,130,154))" }}>
                    <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>
                      {r.icon}
                    </span>
                  </div>
                  <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                      <div style={{ flex: "1", minWidth: "0" }}>
                        <div style={{ fontWeight: "700", fontSize: "14px" }}>
                          {r.name}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--fb-tx3,#a8978c)" }}>
                          <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "14px", fontVariationSettings: "'FILL' 0" }}>
                            location_on
                          </span>
                          <input value={r.machine} onChange={r.onMachine} placeholder="Machine (optionnel)" style={{ flex: "1", minWidth: "0", border: "none", background: "transparent", color: "var(--fb-tx3,#a8978c)", font: "500 12px Manrope", outline: "none", padding: "2px 0" }} />
                        </div>
                      </div>
                      <button onClick={r.onUp} aria-label="Monter" style={{ width: "32px", height: "32px", flexShrink: "0", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center", background: "transparent", border: "none", color: "var(--fb-tx3,#a8978c)", visibility: r.upVis }}>
                        <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "18px", fontVariationSettings: "'FILL' 0" }}>
                          arrow_upward
                        </span>
                      </button>
                      <button onClick={r.onRemove} aria-label="Retirer" style={{ width: "32px", height: "32px", flexShrink: "0", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center", background: "transparent", border: "none", color: "var(--fb-tx3,#a8978c)" }}>
                        <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "18px", fontVariationSettings: "'FILL' 0" }}>
                          close
                        </span>
                      </button>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "2px", padding: "3px", borderRadius: "99px", background: "rgba(var(--fb-ink,0,0,0),.3)" }}>
                        <button onClick={r.setsM} aria-label="Moins" style={{ width: "34px", height: "34px", borderRadius: "50%", border: "none", cursor: "pointer", display: "grid", placeItems: "center", background: "rgba(var(--fb-fg,255,255,255),.06)", color: "var(--fb-tx,#f5efe9)" }}>
                          <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "17px", fontVariationSettings: "'FILL' 0" }}>
                            remove
                          </span>
                        </button>
                        <span style={{ minWidth: "64px", textAlign: "center", font: "600 12px Manrope", color: "var(--fb-tx3,#a8978c)" }}>
                          <span style={{ font: "700 15px Sora", color: "var(--fb-tx,#f5efe9)" }}>
                            {r.sets}
                          </span>
                          {' '}séries
                        </span>
                        <button onClick={r.setsP} aria-label="Plus" style={{ width: "34px", height: "34px", borderRadius: "50%", border: "none", cursor: "pointer", display: "grid", placeItems: "center", background: "rgba(var(--fb-fg,255,255,255),.06)", color: "var(--fb-tx,#f5efe9)" }}>
                          <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "17px", fontVariationSettings: "'FILL' 0" }}>
                            add
                          </span>
                        </button>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "2px", padding: "3px", borderRadius: "99px", background: "rgba(var(--fb-ink,0,0,0),.3)" }}>
                        <button onClick={r.repsM} aria-label="Moins" style={{ width: "34px", height: "34px", borderRadius: "50%", border: "none", cursor: "pointer", display: "grid", placeItems: "center", background: "rgba(var(--fb-fg,255,255,255),.06)", color: "var(--fb-tx,#f5efe9)" }}>
                          <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "17px", fontVariationSettings: "'FILL' 0" }}>
                            remove
                          </span>
                        </button>
                        <span style={{ minWidth: "64px", textAlign: "center", font: "600 12px Manrope", color: "var(--fb-tx3,#a8978c)" }}>
                          <span style={{ font: "700 15px Sora", color: "var(--fb-tx,#f5efe9)" }}>
                            {r.reps}
                          </span>
                          {' '}reps
                        </span>
                        <button onClick={r.repsP} aria-label="Plus" style={{ width: "34px", height: "34px", borderRadius: "50%", border: "none", cursor: "pointer", display: "grid", placeItems: "center", background: "rgba(var(--fb-fg,255,255,255),.06)", color: "var(--fb-tx,#f5efe9)" }}>
                          <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "17px", fontVariationSettings: "'FILL' 0" }}>
                            add
                          </span>
                        </button>
                      </div>
                      <button onClick={r.onInfo} style={{ whiteSpace: "nowrap", height: "40px", display: "flex", alignItems: "center", gap: "5px", padding: "0 13px", borderRadius: "99px", cursor: "pointer", font: "600 12px Manrope", background: r.infoBg, color: r.infoColor, border: r.infoBorder }}>
                        <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "16px", fontVariationSettings: "'FILL' 0" }}>
                          tune
                        </span>
                        {r.infoLabel}
                      </button>
                    </div>
                    {r.isOpen && (<>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "12px", borderTop: "1px solid rgba(var(--fb-fg,255,255,255),.06)" }}>
                        <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
                          Nom de l’exercice
                          <input value={r.name} onChange={r.onName} style={{ height: "42px", padding: "0 12px", borderRadius: "12px", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)", background: "rgba(var(--fb-ink,0,0,0),.3)", color: "var(--fb-tx,#f5efe9)", font: "500 14px Manrope", outline: "none", width: "100%", minWidth: "0", fontWeight: "700" }} />
                        </label>
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
                          Muscle
                          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                            {r.groups.map((g, g_i) => (
                              <Fragment key={g_i}>
                                <button onClick={g.onClick} style={{ whiteSpace: "nowrap", padding: "6px 11px", borderRadius: "99px", cursor: "pointer", font: "600 12px Manrope", background: g.bg, color: g.color, border: g.border }}>
                                  {g.label}
                                </button>
                            </Fragment>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
                            Poids de départ (kg)
                            <input type="text" inputMode="decimal" value={r.weight} onChange={r.onWeight} placeholder="auto" style={{ height: "42px", padding: "0 12px", borderRadius: "12px", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)", background: "rgba(var(--fb-ink,0,0,0),.3)", color: "var(--fb-tx,#f5efe9)", font: "500 14px Manrope", outline: "none", width: "100%", minWidth: "0", fontFamily: "Sora", fontWeight: "600" }} />
                          </label>
                          <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
                            Repos (secondes)
                            <input type="number" inputMode="numeric" value={r.rest} onChange={r.onRest} placeholder={r.restPh} style={{ height: "42px", padding: "0 12px", borderRadius: "12px", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)", background: "rgba(var(--fb-ink,0,0,0),.3)", color: "var(--fb-tx,#f5efe9)", font: "500 14px Manrope", outline: "none", width: "100%", minWidth: "0", fontFamily: "Sora", fontWeight: "600" }} />
                          </label>
                        </div>
                        <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
                          Notes / réglage machine
                          <input value={r.note} onChange={r.onNote} placeholder="ex. siège cran 4, prise serrée, tempo lent" style={{ height: "42px", padding: "0 12px", borderRadius: "12px", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)", background: "rgba(var(--fb-ink,0,0,0),.3)", color: "var(--fb-tx,#f5efe9)", font: "500 14px Manrope", outline: "none", width: "100%", minWidth: "0" }} />
                        </label>
                      </div>
                    </>)}
                  </div>
                </div>
            </Fragment>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "14px", borderRadius: "20px", background: "rgba(var(--fb-ink,0,0,0),.2)", border: "1px solid rgba(var(--fb-fg,255,255,255),.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", height: "46px", padding: "0 14px", borderRadius: "14px", background: "rgba(var(--fb-ink,0,0,0),.3)", border: "1px solid rgba(var(--fb-fg,255,255,255),.1)" }}>
                <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px", fontVariationSettings: "'FILL' 0", color: "var(--fb-tx3,#a8978c)" }}>
                  search
                </span>
                <input value={v.bld.q} onChange={v.bld.onQ} onKeyDown={v.bld.onQKey} placeholder="Chercher ou créer un exercice" style={{ flex: "1", minWidth: "0", height: "100%", border: "none", background: "transparent", color: "var(--fb-tx,#f5efe9)", font: "500 14px Manrope", outline: "none" }} />
              </div>
              <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "2px" }}>
                {v.bld.groups.map((g, g_i) => (
                  <Fragment key={g_i}>
                    <button onClick={g.onClick} style={{ whiteSpace: "nowrap", flexShrink: "0", padding: "7px 12px", borderRadius: "99px", cursor: "pointer", font: "600 12px Manrope", background: g.bg, color: g.color, border: g.border }}>
                      {g.label}
                    </button>
                </Fragment>
                ))}
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {v.bld.canCreate && (<>
                  <button onClick={v.bld.create} style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px", padding: "9px 13px 9px 10px", borderRadius: "99px", cursor: "pointer", font: "700 13px Manrope", background: "rgb(var(--fb-a,236,40,78))", color: "var(--fb-on,#fff)", border: "none" }}>
                    <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "17px", fontVariationSettings: "'FILL' 0" }}>
                      add
                    </span>
                    {v.bld.createLabel}
                  </button>
                </>)}
                {v.bld.lib.map((l, l_i) => (
                  <Fragment key={l_i}>
                    <button onClick={l.onClick} style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px", padding: "9px 13px 9px 10px", borderRadius: "99px", cursor: "pointer", font: "600 13px Manrope", background: l.bg, color: l.color, border: l.border }}>
                      <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "17px", fontVariationSettings: "'FILL' 0" }}>
                        {l.icon}
                      </span>
                      {l.name}
                    </button>
                </Fragment>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "22px", height: "22px", borderRadius: "50%", display: "grid", placeItems: "center", background: "rgba(var(--fb-a,236,40,78),.16)", color: "rgb(var(--fb-a4,255,130,154))", font: "700 11px Sora" }}>
                3
              </span>
              <span style={{ fontWeight: "700", fontSize: "14px" }}>
                Jours
              </span>
              <span style={{ marginLeft: "auto", fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
                optionnel
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "6px" }}>
              {v.bld.days.map((d, d_i) => (
                <Fragment key={d_i}>
                  <button onClick={d.onClick} title={d.title} style={{ aspectRatio: "1", maxHeight: "48px", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center", font: "700 14px Sora", background: d.bg, border: d.border, color: d.color, boxShadow: d.shadow }}>
                    {d.label}
                  </button>
              </Fragment>
              ))}
            </div>
            <div style={{ fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
              {v.bld.daysHint}
            </div>
          </div>
          {v.bld.isEdit && (<>
            <button onClick={v.bld.del} style={{ alignSelf: "center", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", borderRadius: "99px", border: "1px solid rgba(255,90,70,.35)", background: v.bld.delBg, color: "#ff8a73", font: "600 13px Manrope", cursor: "pointer" }}>
              <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "17px", fontVariationSettings: "'FILL' 0" }}>
                delete
              </span>
              {v.bld.delLabel}
            </button>
          </>)}
        </div>
        <div style={{ padding: "12px 16px 16px", borderTop: "1px solid rgba(var(--fb-fg,255,255,255),.06)" }}>
          <button onClick={v.bld.save} style={{ width: "100%", height: "54px", borderRadius: "99px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "rgb(var(--fb-a,236,40,78))", color: "var(--fb-on,#fff)", font: "700 15px Manrope", boxShadow: "0 10px 28px rgba(var(--fb-a,236,40,78),.4)", opacity: v.bld.saveOp }}>
            <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px", fontVariationSettings: "'FILL' 0" }}>
              check
            </span>
            {v.bld.saveLabel}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
