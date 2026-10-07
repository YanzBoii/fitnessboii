// Vue générée depuis le prototype (design/design/FitnessBoii.dc.html), styles à l'identique.
import { Fragment } from 'react';
import type { AuthVals } from './authVals';

export function AuthView({ v }: { v: AuthVals }) {
  return (
    <>
    <div ref={v.obWrapRef} style={{ position: "fixed", inset: "0", zIndex: "70", overflowY: "auto", display: "flex", background: "rgb(var(--fb-bg,12,8,10))" }}>
      {v.isDesktop && (<>
        <div style={{ flex: "1 1 50%", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "40px", background: "radial-gradient(700px 520px at 30% 20%, rgba(var(--fb-a,236,40,78),calc(.35 * var(--fb-gk,1))), transparent 70%), rgb(var(--fb-s2,36,12,20))", borderRight: "1px solid rgba(var(--fb-fg,255,255,255),.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "10px", display: "grid", placeItems: "center", background: "linear-gradient(135deg,rgb(var(--fb-a3,255,92,124)),rgb(var(--fb-a,236,40,78)))", boxShadow: "0 0 18px rgba(var(--fb-a,236,40,78),.55)", color: "#fff" }}>
              <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>
                fitness_center
              </span>
            </div>
            <div style={{ fontFamily: "Sora", fontWeight: "700", fontSize: "19px", letterSpacing: "-.02em" }}>
              FitnessBoii
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "7px", maxWidth: "440px" }}>
            {v.authDots.map((row, row_i) => (
              <Fragment key={row_i}>
                <div style={{ display: "flex", gap: "7px" }}>
                  {row.map((d, d_i) => (
                    <Fragment key={d_i}>
                      <div style={{ width: "16px", height: "16px", borderRadius: "50%", flexShrink: "0", background: d.bg, border: d.border, boxShadow: d.shadow }}>
                      </div>
                  </Fragment>
                  ))}
                </div>
            </Fragment>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "440px" }}>
            <h2 style={{ margin: "0", fontFamily: "Sora", fontWeight: "700", fontSize: "40px", letterSpacing: "-.035em", lineHeight: "1.05" }}>
              Chaque séance compte.
            </h2>
            <p style={{ margin: "0", fontSize: "15px", color: "var(--fb-tx2,#d4c2b6)" }}>
              Tes programmes, tes perfs et ta régularité au même endroit.
            </p>
          </div>
        </div>
      </>)}
      <div style={{ flex: "1 1 50%", minHeight: "100%", display: "flex", padding: "clamp(24px,5vh,48px) 20px" }}>
        <div ref={v.authFormRef} style={{ margin: "auto", width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "22px" }}>
          {v.isMobile && (<>
            <div style={{ width: "56px", height: "56px", borderRadius: "18px", display: "grid", placeItems: "center", background: "linear-gradient(135deg,rgb(var(--fb-a3,255,92,124)),rgb(var(--fb-a,236,40,78)))", boxShadow: "0 0 36px rgba(var(--fb-a,236,40,78),.55)", color: "#fff" }}>
              <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "30px", fontVariationSettings: "'FILL' 1" }}>
                fitness_center
              </span>
            </div>
          </>)}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <h1 style={{ margin: "0", fontFamily: "Sora", fontWeight: "700", fontSize: "30px", letterSpacing: "-.03em" }}>
              {v.authTitle}
            </h1>
            <p style={{ margin: "0", fontSize: "14px", color: "var(--fb-tx3,#a8978c)" }}>
              {v.authSub}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button onClick={v.authGoogle} style={{ height: "52px", borderRadius: "99px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: "#ffffff", color: "#1f1f1f", border: "1px solid rgba(0,0,0,.08)", font: "700 14px Manrope" }}>
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
              </svg>
              Continuer avec Google
            </button>
            {v.showApple && (
            <button onClick={v.authApple} style={{ height: "52px", borderRadius: "99px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: "#000000", color: "#ffffff", border: "1px solid rgba(var(--fb-fg,255,255,255),.14)", font: "700 14px Manrope" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.27-1.6 2.78-.41 6.9 1.15 9.15.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.23-.02 2.01-1.12 2.76-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.42-3.67zM14.1 5.84c.63-.77 1.06-1.83.94-2.89-.91.04-2.01.61-2.66 1.37-.58.67-1.09 1.75-.96 2.79 1.02.08 2.05-.52 2.68-1.27z" />
              </svg>
              Continuer avec Apple
            </button>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", color: "var(--fb-tx3,#a8978c)" }}>
            <div style={{ flex: "1", height: "1px", background: "rgba(var(--fb-fg,255,255,255),.1)" }}>
            </div>
            ou avec ton email
            <div style={{ flex: "1", height: "1px", background: "rgba(var(--fb-fg,255,255,255),.1)" }}>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", height: "54px", padding: "0 14px", borderRadius: "16px", background: "rgba(var(--fb-ink,0,0,0),.3)", border: `1px solid ${v.authBorder}` }}>
              <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px", fontVariationSettings: "'FILL' 0", color: "var(--fb-tx3,#a8978c)" }}>
                mail
              </span>
              <input type="email" value={v.auth.email} onChange={v.authEmail} onKeyDown={v.authKey} placeholder="Email" style={{ flex: "1", minWidth: "0", height: "100%", border: "none", background: "transparent", color: "var(--fb-tx,#f5efe9)", font: "500 15px Manrope", outline: "none" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", height: "54px", padding: "0 14px", borderRadius: "16px", background: "rgba(var(--fb-ink,0,0,0),.3)", border: `1px solid ${v.authBorder}` }}>
              <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px", fontVariationSettings: "'FILL' 0", color: "var(--fb-tx3,#a8978c)" }}>
                lock
              </span>
              <input type={v.pwType} value={v.auth.pw} onChange={v.authPw} onKeyDown={v.authKey} placeholder="Mot de passe" style={{ flex: "1", minWidth: "0", height: "100%", border: "none", background: "transparent", color: "var(--fb-tx,#f5efe9)", font: "500 15px Manrope", outline: "none" }} />
              <button onClick={v.togglePw} aria-label="Afficher le mot de passe" style={{ width: "36px", height: "36px", borderRadius: "50%", border: "none", cursor: "pointer", display: "grid", placeItems: "center", background: "transparent", color: "var(--fb-tx3,#a8978c)" }}>
                <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "20px", fontVariationSettings: "'FILL' 0" }}>
                  {v.pwIcon}
                </span>
              </button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", minHeight: "18px" }}>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#ff6b6b" }}>
                {v.auth.err}
              </span>
              {v.isLogin && (<>
                <button onClick={v.forgotPw} style={{ border: "none", background: "none", padding: "0", cursor: "pointer", color: "rgb(var(--fb-a4,255,130,154))", font: "600 12px Manrope", whiteSpace: "nowrap" }}>
                  Mot de passe oublié ?
                </button>
              </>)}
            </div>
          </div>
          <button onClick={v.authSubmit} style={{ height: "56px", borderRadius: "99px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: "rgb(var(--fb-a,236,40,78))", color: "var(--fb-on,#fff)", font: "700 16px Manrope", boxShadow: "0 12px 32px rgba(var(--fb-a,236,40,78),.45)" }}>
            {v.authLoading && (<>
              <span ref={v.spinRef} style={{ width: "18px", height: "18px", borderRadius: "50%", border: "2.5px solid currentColor", borderRightColor: "transparent", display: "block" }}>
              </span>
            </>)}
            {v.authCta}
          </button>
          <div style={{ display: "flex", justifyContent: "center", gap: "6px", fontSize: "14px", color: "var(--fb-tx3,#a8978c)" }}>
            {v.authSwitchText}
            <button onClick={v.authSwitch} style={{ border: "none", background: "none", padding: "0", cursor: "pointer", color: "rgb(var(--fb-a4,255,130,154))", font: "700 14px Manrope" }}>
              {v.authSwitchCta}
            </button>
          </div>
          {v.isSignup && (<>
            <p style={{ margin: "0", fontSize: "12px", color: "var(--fb-tx3,#a8978c)", textAlign: "center", textWrap: "pretty" }}>
              En créant un compte, tu acceptes les conditions d’utilisation et la politique de confidentialité.
            </p>
          </>)}
        </div>
      </div>
    </div>
    </>
  );
}
