import { useState, useEffect } from "react";
import { grantAnalytics, denyAnalytics } from "../utils/analytics";
import api from "../services/api";

const KEY = "nill_cookie_v1";

// Deterministic star positions (golden-angle distribution)
const STARS = Array.from({ length: 70 }, (_, i) => ({
  x:   ((i * 47 + 11) % 97) + 1.5,
  y:   ((i * 73 + 29) % 93) + 3.5,
  r:   i % 5 === 0 ? 1.1 : 0.65,
  o:   0.12 + (i % 7) * 0.045,
  dur: 2.4 + (i % 5) * 0.7,
  del: (i % 4) * 0.6,
}));

export function openCookieSettings() {
  window.dispatchEvent(new CustomEvent("nill:cookie-settings"));
}

function _applyConsent(withAnalytics) {
  if (withAnalytics) grantAnalytics();
  else denyAnalytics();
}

function _saveLocal(withAnalytics) {
  localStorage.setItem(KEY, JSON.stringify({
    analytics: withAnalytics,
    ts: new Date().toISOString(),
  }));
}

export default function CookieBanner() {
  const [show,      setShow]     = useState(false);
  const [expanded,  setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const reopen = () => { setShow(true); setExpanded(false); };
    window.addEventListener("nill:cookie-settings", reopen);

    let cancelled = false;

    // Try server-side consent first (logged-in users → cross-device sync)
    api.get("/me/consent")
      .then(({ data }) => {
        if (cancelled) return;
        const serverConsent = data?.analytics_consent;
        if (serverConsent !== null && serverConsent !== undefined) {
          // Server record exists — apply it and don't show banner
          _saveLocal(serverConsent);
          _applyConsent(serverConsent);
          return;
        }
        // Logged in but no server consent recorded yet → check localStorage
        _loadFromLocal();
      })
      .catch(() => {
        if (cancelled) return;
        // Not logged in or network error → localStorage only
        _loadFromLocal();
      });

    function _loadFromLocal() {
      const saved = localStorage.getItem(KEY);
      if (!saved) {
        const t = setTimeout(() => { if (!cancelled) setShow(true); }, 700);
        // Store t in a ref-like var via closure; cleaned up in return
        timeoutRef = t;
        return;
      }
      try {
        const c = JSON.parse(saved);
        _applyConsent(c.analytics);
      } catch {
        setShow(true);
      }
    }

    let timeoutRef = null;
    return () => {
      cancelled = true;
      if (timeoutRef) clearTimeout(timeoutRef);
      window.removeEventListener("nill:cookie-settings", reopen);
    };
  }, []);

  const save = (withAnalytics) => {
    _saveLocal(withAnalytics);
    _applyConsent(withAnalytics);
    // Persist server-side for logged-in users (TTDSG §25) — fire-and-forget
    api.post("/me/consent", { analytics: withAnalytics }).catch(() => {});
    setShow(false);
  };

  if (!show) return null;

  return (
    <>
      <style>{`
        @keyframes cb-rise {
          from { transform: translateY(110%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes cb-twinkle {
          0%,100% { opacity: var(--so); }
          50%      { opacity: calc(var(--so) * 0.25); }
        }
        .cb-root { animation: cb-rise .5s cubic-bezier(.16,1,.3,1) both; }
        .cb-star { animation: cb-twinkle var(--sd) ease-in-out var(--sdel) infinite; }
        .cb-btn-ghost {
          padding: .5rem 1rem; border-radius: 8px;
          border: 1px solid rgba(239,237,231,0.13);
          background: transparent; color: rgba(239,237,231,0.5);
          font-size: .8rem; cursor: pointer;
          transition: border-color .15s, color .15s;
        }
        .cb-btn-ghost:hover {
          border-color: rgba(239,237,231,0.28);
          color: rgba(239,237,231,0.85);
        }
        .cb-btn-gold {
          padding: .5rem 1.1rem; border-radius: 8px;
          background: #C5A572;
          border: 1px solid rgba(197,165,114,0.55);
          color: #030406; font-size: .8rem; font-weight: 700;
          cursor: pointer; white-space: nowrap;
          transition: background .15s;
        }
        .cb-btn-gold:hover { background: #d4b882; }
        .cb-btn-text {
          background: none; border: none; padding: 0;
          color: rgba(197,165,114,0.75); font-size: .82rem;
          cursor: pointer; text-decoration: underline;
          text-underline-offset: 3px;
        }
        .cb-btn-text:hover { color: #C5A572; }
        .cb-toggle {
          position: relative; width: 40px; height: 22px;
          border-radius: 99px; cursor: pointer; flex-shrink: 0;
          border: none; transition: background .2s;
        }
        .cb-toggle-thumb {
          position: absolute; top: 2px;
          width: 18px; height: 18px; border-radius: 50%;
          transition: left .2s;
        }
        .cb-save-row {
          margin-top: .9rem; display: flex; justify-content: flex-end;
        }
        .cb-save-btn {
          padding: .42rem .95rem; border-radius: 8px;
          background: rgba(197,165,114,0.1);
          border: 1px solid rgba(197,165,114,0.22);
          color: #C5A572; font-size: .78rem; font-weight: 600;
          cursor: pointer; transition: background .15s;
        }
        .cb-save-btn:hover { background: rgba(197,165,114,0.18); }
      `}</style>

      <div
        className="cb-root"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
          background:
            "radial-gradient(ellipse 40% 120% at 8% 50%,  rgba(122,92,255,.055) 0%, transparent 70%)," +
            "radial-gradient(ellipse 30% 110% at 92% 50%,  rgba(56,245,208,.04) 0%, transparent 70%)," +
            "radial-gradient(ellipse 60% 100% at 50% 100%, rgba(197,165,114,.04) 0%, transparent 60%)," +
            "rgba(4,4,7,.97)",
          borderTop: "1px solid rgba(197,165,114,.14)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 -24px 64px rgba(0,0,0,.55)",
          overflow: "hidden",
        }}
      >
        {/* Star field */}
        <svg
          aria-hidden
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }}
        >
          <defs>
            <radialGradient id="cb-nebula-l" cx="8%"  cy="50%" r="25%"><stop offset="0%" stopColor="#7a5cff" stopOpacity=".06"/><stop offset="100%" stopColor="#7a5cff" stopOpacity="0"/></radialGradient>
            <radialGradient id="cb-nebula-r" cx="92%" cy="50%" r="20%"><stop offset="0%" stopColor="#38f5d0" stopOpacity=".045"/><stop offset="100%" stopColor="#38f5d0" stopOpacity="0"/></radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#cb-nebula-l)"/>
          <rect width="100%" height="100%" fill="url(#cb-nebula-r)"/>
          {STARS.map((s, i) => (
            <circle
              key={i}
              className="cb-star"
              cx={`${s.x}%`}
              cy={`${s.y}%`}
              r={s.r}
              fill="white"
              style={{ "--so": s.o, "--sd": `${s.dur}s`, "--sdel": `${s.del}s`, opacity: s.o }}
            />
          ))}
          <line x1="0" y1="0" x2="100%" y2="0" stroke="rgba(197,165,114,.18)" strokeWidth="1"/>
        </svg>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.2rem 1.5rem", position: "relative" }}>

          {/* Main row */}
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"1.5rem", flexWrap:"wrap" }}>

            {/* Left: logo + text */}
            <div style={{ flex:1, minWidth:260 }}>
              <div style={{ display:"flex", alignItems:"center", gap:".6rem", marginBottom:".35rem" }}>
                <div style={{
                  width:20, height:20, borderRadius:5,
                  background:"conic-gradient(from 210deg, #c6ff3c, #38f5d0, #7a5cff, #ff4d8d, #c6ff3c)",
                  position:"relative", overflow:"hidden", flexShrink:0,
                }}>
                  <div style={{ position:"absolute", inset:3, borderRadius:3, background:"#040407" }}/>
                </div>
                <span style={{ fontSize:".88rem", fontWeight:700, color:"#efede7", letterSpacing:".01em" }}>
                  Cookies &amp; Datenschutz
                </span>
              </div>
              <p style={{ fontSize:".8rem", color:"rgba(239,237,231,.52)", lineHeight:1.6, maxWidth:600 }}>
                Wir verwenden Cookies für anonyme Nutzungsanalysen — Seitenaufrufe, Verweildauer, Länder und Interaktionen.
                Du entscheidest, was du erlaubst.{" "}
                <button className="cb-btn-text" onClick={() => setExpanded(v => !v)}>
                  {expanded ? "Weniger ▲" : "Details ▼"}
                </button>
              </p>
            </div>

            {/* Right: action buttons */}
            <div style={{ display:"flex", alignItems:"center", gap:".55rem", flexShrink:0, flexWrap:"wrap", paddingTop:".1rem" }}>
              <button className="cb-btn-ghost" onClick={() => save(false)}>
                Nur notwendige
              </button>
              <button className="cb-btn-gold" onClick={() => save(true)}>
                Alle akzeptieren ✓
              </button>
            </div>
          </div>

          {/* Expanded settings */}
          {expanded && (
            <div style={{ marginTop:".9rem", paddingTop:".9rem", borderTop:"1px solid rgba(239,237,231,.06)" }}>

              {/* Essential — always on */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:".55rem 0", borderBottom:"1px solid rgba(239,237,231,.05)" }}>
                <div>
                  <div style={{ fontSize:".82rem", fontWeight:600, color:"#efede7" }}>Notwendige Cookies</div>
                  <div style={{ fontSize:".73rem", color:"rgba(239,237,231,.38)", marginTop:2 }}>
                    Session · Authentifizierung · Sicherheit — immer aktiv.
                    Dazu gehören Stripe-Cookies (<code>__stripe_mid</code>, <code>__stripe_sid</code>)
                    für die sichere Zahlungsabwicklung.
                  </div>
                </div>
                <span style={{
                  fontSize:".7rem", padding:"3px 10px", borderRadius:99,
                  background:"rgba(197,165,114,.08)",
                  border:"1px solid rgba(197,165,114,.18)",
                  color:"rgba(197,165,114,.65)",
                }}>immer aktiv</span>
              </div>

              {/* Analytics toggle */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:".55rem 0" }}>
                <div>
                  <div style={{ fontSize:".82rem", fontWeight:600, color:"#efede7" }}>Analyse-Cookies</div>
                  <div style={{ fontSize:".73rem", color:"rgba(239,237,231,.38)", marginTop:2 }}>
                    Anonyme Statistiken — Seiten, Verweildauer, Länder, Gerät, Interaktionen
                  </div>
                </div>
                <button
                  role="switch"
                  aria-checked={analytics}
                  className="cb-toggle"
                  onClick={() => setAnalytics(v => !v)}
                  style={{ background: analytics ? "#C5A572" : "rgba(239,237,231,.1)" }}
                >
                  <span
                    className="cb-toggle-thumb"
                    style={{
                      left: analytics ? 20 : 2,
                      background: analytics ? "#030406" : "rgba(239,237,231,.38)",
                    }}
                  />
                </button>
              </div>

              <div className="cb-save-row">
                <button className="cb-save-btn" onClick={() => save(analytics)}>
                  Auswahl speichern
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
