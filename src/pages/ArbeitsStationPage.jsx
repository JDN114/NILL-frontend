// src/pages/ArbeitsStationPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

// ─── Module registry ─────────────────────────────────────────────────────────
const MODULE_META = {
  emails:     { label: "E-Mails",       icon: "✉",  color: "#7a5cff", route: "/dashboard/emails",      desc: "Postfach & Nachrichten" },
  accounting: { label: "Buchhaltung",   icon: "◎",  color: "#c5a572", route: "/dashboard/accounting",  desc: "Rechnungen & Ausgaben" },
  calendar:   { label: "Kalender",      icon: "▦",  color: "#38f5d0", route: "/station/calendar",       desc: "Termine & Planung" },
  workflow:   { label: "Aufgaben",      icon: "⌘",  color: "#c6ff3c", route: "/station/tasks",          desc: "Tasks & Prozesse" },
  time:       { label: "Zeiterfassung", icon: "⏱",  color: "#ff4d8d", route: "/station/time",           desc: "Arbeitszeiten" },
  hr_docs:    { label: "HR Dokumente",  icon: "📄",  color: "#fbbf24", route: "/station/hr-documents",  desc: "Personalunterlagen" },
};

// ─── Clock component ─────────────────────────────────────────────────────────
function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = now.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ textAlign: "right" }}>
      <div style={{
        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
        fontWeight: 700,
        color: "#efede7",
        letterSpacing: "0.04em",
        lineHeight: 1,
      }}>{timeStr}</div>
      <div style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: "clamp(0.72rem, 1.2vw, 0.9rem)",
        color: "rgba(239,237,231,0.5)",
        marginTop: 4,
        letterSpacing: "0.03em",
      }}>{dateStr}</div>
    </div>
  );
}

// ─── Module card ─────────────────────────────────────────────────────────────
function ModuleCard({ moduleKey, onClick }) {
  const meta = MODULE_META[moduleKey];
  if (!meta) return null;

  return (
    <button
      onClick={() => onClick(meta.route)}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid rgba(255,255,255,0.08)`,
        borderRadius: 20,
        padding: "clamp(24px, 3vw, 40px) clamp(20px, 2.5vw, 32px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 12,
        cursor: "pointer",
        transition: "background 0.2s, border-color 0.2s, transform 0.15s",
        textAlign: "left",
        width: "100%",
        minHeight: "clamp(140px, 18vw, 200px)",
        position: "relative",
        overflow: "hidden",
      }}
      onPointerDown={e => { e.currentTarget.style.transform = "scale(0.97)"; }}
      onPointerUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
      onPointerLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
        e.currentTarget.style.borderColor = `${meta.color}44`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      {/* Accent glow */}
      <div style={{
        position: "absolute",
        top: -40, right: -40,
        width: 120, height: 120,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${meta.color}18, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{
        width: 52, height: 52,
        borderRadius: 14,
        background: `${meta.color}18`,
        border: `1px solid ${meta.color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.5rem",
        flexShrink: 0,
      }}>
        {meta.icon}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
          fontWeight: 400,
          color: "#efede7",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          marginBottom: 4,
        }}>
          {meta.label}
        </div>
        <div style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "clamp(0.72rem, 1.2vw, 0.83rem)",
          color: "rgba(239,237,231,0.5)",
          lineHeight: 1.4,
        }}>
          {meta.desc}
        </div>
      </div>

      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.7rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: meta.color,
        opacity: 0.8,
        display: "flex", alignItems: "center", gap: 6,
      }}>
        Öffnen <span style={{ fontSize: "0.85rem" }}>→</span>
      </div>
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ArbeitsStationPage() {
  const { user, org, isCompanyAdmin } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);

  const stationModules = org?.station_modules ?? [];
  const isAdmin = isCompanyAdmin();

  useEffect(() => {
    api.get("/me/profile").then(r => setUserName(r.data.name || null)).catch(() => {});
  }, []);

  const handleModuleClick = (route) => {
    sessionStorage.setItem("nill_from_station", "1");
    navigate(route);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Guten Morgen" : hour < 18 ? "Guten Tag" : "Guten Abend";
  const displayName = org?.name ?? userName ?? null;

  return (
    <div style={{
      height: "100vh",
      overflow: "hidden",
      background: "#04070F",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..900&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .sg-card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(clamp(220px, 28vw, 320px), 1fr));
          gap: clamp(12px, 2vw, 20px);
        }

        @media (max-width: 600px) {
          .sg-card-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      {/* ── Header ── */}
      <header style={{
        background: "rgba(4,7,15,0.95)",
        borderBottom: "1px solid rgba(239,237,231,0.07)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: "0 clamp(20px, 4vw, 48px)",
        height: "clamp(72px, 10vw, 96px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        {/* Logo + company */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: "clamp(36px, 5vw, 48px)",
            height: "clamp(36px, 5vw, 48px)",
            background: "#c5a572",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900,
            fontSize: "clamp(0.9rem, 1.5vw, 1.2rem)",
            color: "#03060a",
            letterSpacing: "-0.02em",
            flexShrink: 0,
          }}>N</div>
          <div>
            <div style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "clamp(1rem, 2vw, 1.4rem)",
              fontWeight: 400,
              color: "#efede7",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}>
              {org?.name ?? "Nill"}
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(0.6rem, 1vw, 0.72rem)",
              color: "rgba(239,237,231,0.4)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginTop: 3,
            }}>
              ArbeitsStation
            </div>
          </div>
        </div>

        {/* Clock */}
        <Clock />

        {/* Exit button (admins) or back link */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isAdmin && (
            <Link to="/dashboard/settings?tab=station_guide"
              style={{
                padding: "0.45rem 1rem",
                background: "rgba(197,165,114,0.08)",
                border: "1px solid rgba(197,165,114,0.2)",
                borderRadius: 8,
                color: "#c5a572",
                textDecoration: "none",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "clamp(0.65rem, 1vw, 0.75rem)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}>
              ⚙ Konfigurieren
            </Link>
          )}
          <Link to="/dashboard"
            style={{
              padding: "0.45rem 1rem",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              color: "rgba(239,237,231,0.6)",
              textDecoration: "none",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(0.65rem, 1vw, 0.75rem)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}>
            ✕ Beenden
          </Link>
        </div>
      </header>

      {/* ── Main content ── */}
      <main style={{
        flex: 1,
        overflow: "auto",
        padding: "clamp(24px, 4vw, 56px) clamp(20px, 4vw, 48px)",
        display: "flex",
        flexDirection: "column",
        gap: "clamp(24px, 3vw, 40px)",
        maxWidth: 1400,
        width: "100%",
        margin: "0 auto",
        boxSizing: "border-box",
      }}>
        {/* Greeting */}
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(0.65rem, 1vw, 0.75rem)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(239,237,231,0.4)",
            marginBottom: 8,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ width: 16, height: 1, background: "currentColor", opacity: 0.5, display: "inline-block" }} />
            Mitarbeiter-Station
          </div>
          <h1 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            fontWeight: 400,
            color: "#efede7",
            letterSpacing: "-0.025em",
            lineHeight: 1,
            margin: 0,
          }}>
            {displayName
              ? <>{greeting}, <span style={{ fontStyle: "italic", color: "#c5a572" }}>{displayName}.</span></>
              : <>{greeting}<span style={{ fontStyle: "italic", color: "#c5a572" }}>.</span></>
            }
          </h1>
        </div>

        {/* Module grid */}
        {stationModules.length === 0 ? (
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: "4rem 2rem",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 20,
            textAlign: "center",
          }}>
            <div style={{ fontSize: "2.5rem", opacity: 0.4 }}>◎</div>
            <div style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "1.3rem",
              fontWeight: 400,
              color: "rgba(239,237,231,0.5)",
            }}>
              Keine Module konfiguriert
            </div>
            {isAdmin && (
              <Link to="/dashboard/settings?tab=station_guide" style={{
                marginTop: 8,
                padding: "0.55rem 1.3rem",
                background: "#c5a572",
                color: "#000",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.82rem",
              }}>
                Module einrichten
              </Link>
            )}
          </div>
        ) : (
          <>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(0.65rem, 1vw, 0.75rem)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(239,237,231,0.35)",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              Module
              <span style={{ flex: 1, height: 1, background: "rgba(239,237,231,0.07)" }} />
            </div>
            <div className="sg-card-grid">
              {stationModules.map(key => (
                <ModuleCard key={key} moduleKey={key} onClick={handleModuleClick} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* ── Footer bar ── */}
      <footer style={{
        borderTop: "1px solid rgba(239,237,231,0.06)",
        padding: "clamp(12px, 2vw, 16px) clamp(20px, 4vw, 48px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.68rem",
          letterSpacing: "0.1em",
          color: "rgba(239,237,231,0.25)",
          textTransform: "uppercase",
        }}>
          Nill ArbeitsStation
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.68rem",
          letterSpacing: "0.1em",
          color: "rgba(239,237,231,0.25)",
        }}>
          {user?.email}
        </span>
      </footer>
    </div>
  );
}
