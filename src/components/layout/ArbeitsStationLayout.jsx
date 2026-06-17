import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..900&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');`;

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "clamp(1.1rem, 2.2vw, 1.6rem)",
        fontWeight: 700,
        color: "#efede7",
        letterSpacing: "0.06em",
        lineHeight: 1,
      }}>
        {now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </div>
      <div style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: "0.65rem",
        color: "rgba(var(--ink-tint),0.4)",
        letterSpacing: "0.04em",
        marginTop: 3,
      }}>
        {now.toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" })}
      </div>
    </div>
  );
}

export default function ArbeitsStationLayout({ children, title, icon, accent = "#c5a572", maxWidth = 900 }) {
  const { org } = useAuth();

  return (
    <div style={{
      height: "100vh",
      overflow: "hidden",
      background: "#04070F",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <style>{FONTS}</style>

      <header style={{
        background: "rgba(4,7,15,0.96)",
        borderBottom: "1px solid rgba(var(--ink-tint),0.07)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        padding: "0 clamp(20px, 4vw, 48px)",
        height: "clamp(60px, 8vw, 76px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link to="/station" style={{
            width: 34, height: 34,
            borderRadius: 9,
            background: "rgba(var(--tint),0.04)",
            border: "1px solid rgba(var(--tint),0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(var(--ink-tint),0.55)",
            textDecoration: "none",
            fontSize: "0.95rem",
            flexShrink: 0,
            transition: "background 0.2s, border-color 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(var(--tint),0.08)"; e.currentTarget.style.borderColor = "rgba(var(--tint),0.18)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(var(--tint),0.04)"; e.currentTarget.style.borderColor = "rgba(var(--tint),0.08)"; }}
          >←</Link>

          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              color: "rgba(var(--ink-tint),0.35)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: 2,
            }}>ArbeitsStation</div>
            <div style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              fontWeight: 400,
              color: "#efede7",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              display: "flex", alignItems: "center", gap: 7,
            }}>
              {icon && <span style={{ color: accent, fontSize: "0.9em" }}>{icon}</span>}
              {title}
            </div>
          </div>
        </div>

        <Clock />

        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.65rem",
          color: "rgba(var(--ink-tint),0.3)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          textAlign: "right",
        }}>
          {org?.name ?? "Nill"}
        </div>
      </header>

      <main style={{
        flex: 1,
        overflow: "auto",
        padding: "clamp(20px, 3vw, 40px) clamp(20px, 4vw, 48px)",
        maxWidth,
        width: "100%",
        margin: "0 auto",
        boxSizing: "border-box",
      }}>
        {children}
      </main>
    </div>
  );
}
