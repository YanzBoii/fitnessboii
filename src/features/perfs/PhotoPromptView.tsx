// Vue générée depuis le prototype (design/design/FitnessBoii.dc.html), styles à l'identique.
import type { PhotoPromptVals } from './photoPromptVals';

export function PhotoPromptView({ v }: { v: PhotoPromptVals }) {
  return (
    <>
    {' '}
    <div ref={v.fadeRef} onClick={v.photoLater} style={{ position: "fixed", inset: "0", zIndex: "45", display: "flex", alignItems: v.sheetAlign, justifyContent: "center", padding: v.sheetPad, background: "rgba(5,3,2,.6)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}>
      <div ref={v.popRef} onClick={v.stop} style={{ width: "100%", maxWidth: "380px", borderRadius: v.sheetRadius, padding: "26px 22px 22px", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", textAlign: "center", background: "radial-gradient(340px 200px at 50% 0%, rgba(var(--fb-a,236,40,78),calc(.3 * var(--fb-gk,1))), transparent 75%), rgb(var(--fb-bg2,20,11,15))", border: "1px solid var(--fb-line,rgba(var(--fb-a3,255,92,124),.16))", boxShadow: "var(--fb-popsh,0 30px 80px rgba(0,0,0,.6))" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", display: "grid", placeItems: "center", background: "linear-gradient(135deg,rgb(var(--fb-a3,255,92,124)),rgb(var(--fb-a6,150,14,48)))", boxShadow: "0 0 32px rgba(var(--fb-a,236,40,78),.55)", color: "var(--fb-on,#fff)" }}>
          <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "32px", fontVariationSettings: "'FILL' 1" }}>
            photo_camera
          </span>
        </div>
        <div style={{ fontFamily: "Sora", fontWeight: "700", fontSize: "21px" }}>
          Photo de la semaine
        </div>
        <div style={{ fontSize: "13px", color: "var(--fb-tx2,#d4c2b6)", textWrap: "pretty" }}>
          Première séance de la semaine terminée. Prends ta photo pour suivre ton évolution.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", marginTop: "4px" }}>
          <button onClick={v.pickPhoto} style={{ height: "50px", borderRadius: "99px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "rgb(var(--fb-a,236,40,78))", color: "var(--fb-on,#fff)", font: "700 15px Manrope", boxShadow: "0 10px 28px rgba(var(--fb-a,236,40,78),.45)" }}>
            <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "19px", fontVariationSettings: "'FILL' 1" }}>
              photo_camera
            </span>
            Prendre la photo
          </button>
          <button onClick={v.photoLater} style={{ height: "44px", borderRadius: "99px", border: "none", cursor: "pointer", background: "transparent", color: "var(--fb-tx3,#a8978c)", font: "600 14px Manrope" }}>
            Plus tard
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
