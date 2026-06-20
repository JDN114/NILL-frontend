// src/pages/ArbeitsStationPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import StationExitModal from "../components/StationExitModal";

// ─── Module registry ─────────────────────────────────────────────────────────
// E-Mails and Buchhaltung are intentionally excluded from the ArbeitsStation.
// The station is a shared kiosk display — email access and accounting are
// personal/admin workflows that must only be used from authenticated personal sessions.
const MODULE_META = {
  calendar:     { label: "Kalender",      icon: "▦",  color: "#38f5d0", route: "/station/calendar",        desc: "Termine & Planung" },
  workflow:     { label: "Aufgaben",      icon: "⌘",  color: "#c6ff3c", route: "/station/tasks",           desc: "Tasks & Prozesse" },
  time:         { label: "Zeiterfassung", icon: "⏱",  color: "#ff4d8d", route: "/station/time",            desc: "Arbeitszeiten" },
  hr_docs:      { label: "HR & Listen",   icon: "📄",  color: "#fbbf24", route: "/station/hr-documents",   desc: "Dokumente, Listen & Lieferscheine" },
  shift_plan:   { label: "Schichtplan",   icon: "⬡",  color: "#38f5d0", route: "/station/schichtplan",     desc: "Wochenschichten & Team" },
  delivery:     { label: "Lieferscheine", icon: "📦",  color: "#fb923c", route: "/station/lieferscheine",  desc: "Lieferungen & Bestätigung" },
  inventory:    { label: "Inventur",      icon: "◫",  color: "#a78bfa", route: "/station/inventur",        desc: "Bestand & Lager" },
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
        fontSize: "clamp(1.1rem, 2vw, 1.6rem)",
        fontWeight: 700,
        color: "#efede7",
        letterSpacing: "0.04em",
        lineHeight: 1,
      }}>{timeStr}</div>
      <div style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: "clamp(0.6rem, 0.9vw, 0.75rem)",
        color: "rgba(var(--ink-tint),0.5)",
        marginTop: 3,
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
        background: "rgba(var(--tint),0.04)",
        border: `1px solid rgba(var(--tint),0.08)`,
        borderRadius: 14,
        padding: "12px 16px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        cursor: "pointer",
        transition: "background 0.2s, border-color 0.2s, transform 0.15s",
        textAlign: "left",
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
      onPointerDown={e => { e.currentTarget.style.transform = "scale(0.97)"; }}
      onPointerUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
      onPointerLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "rgba(var(--tint),0.08)";
        e.currentTarget.style.borderColor = `${meta.color}44`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "rgba(var(--tint),0.04)";
        e.currentTarget.style.borderColor = "rgba(var(--tint),0.08)";
      }}
    >
      {/* Accent glow */}
      <div style={{
        position: "absolute",
        top: -30, right: -30,
        width: 80, height: 80,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${meta.color}18, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{
        width: 36, height: 36,
        borderRadius: 10,
        background: `${meta.color}18`,
        border: `1px solid ${meta.color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.05rem",
        flexShrink: 0,
      }}>
        {meta.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: "clamp(0.85rem, 1.4vw, 1.05rem)",
          fontWeight: 400,
          color: "#efede7",
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {meta.label}
        </div>
        <div style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "clamp(0.62rem, 0.9vw, 0.72rem)",
          color: "rgba(var(--ink-tint),0.45)",
          lineHeight: 1.3,
          marginTop: 2,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {meta.desc}
        </div>
      </div>

      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.65rem",
        color: meta.color,
        opacity: 0.7,
        flexShrink: 0,
      }}>
        →
      </div>
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ArbeitsStationPage() {
  const { user, org, isCompanyAdmin } = useAuth();
  const isAdmin = isCompanyAdmin();
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);

  const stationModules = org?.station_modules ?? [];
  const [showExitModal, setShowExitModal] = useState(false);

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

  // Only count modules that are actually renderable (emails/accounting excluded from MODULE_META)
  const visibleModules = stationModules.filter(k => MODULE_META[k]);
  const count = visibleModules.length;
  const cols = count <= 2 ? count : count <= 4 ? 2 : count <= 6 ? 3 : count <= 9 ? 3 : 4;

  return (
    <div style={{
      height: "100vh",
      overflow: "hidden",
      background: "#04070F",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* ── Header ── */}
      <header style={{
        background: "rgba(4,7,15,0.95)",
        borderBottom: "1px solid rgba(var(--ink-tint),0.07)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: "0 clamp(16px, 3vw, 40px)",
        height: "clamp(56px, 7vw, 72px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        flexShrink: 0,
      }}>
        {/* Logo + company */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: "clamp(30px, 3.5vw, 40px)",
            height: "clamp(30px, 3.5vw, 40px)",
            background: "#c5a572",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900,
            fontSize: "clamp(0.8rem, 1.2vw, 1rem)",
            color: "#03060a",
            letterSpacing: "-0.02em",
            flexShrink: 0,
          }}>N</div>
          <div>
            <div style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "clamp(0.9rem, 1.4vw, 1.15rem)",
              fontWeight: 400,
              color: "#efede7",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}>
              {org?.name ?? "Nill"}
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(0.55rem, 0.75vw, 0.65rem)",
              color: "rgba(var(--ink-tint),0.4)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginTop: 2,
            }}>
              ArbeitsStation
            </div>
          </div>
        </div>

        {/* Clock */}
        <Clock />

        {/* Exit */}
        <button
          onClick={() => setShowExitModal(true)}
          style={{
            padding: "0.35rem 0.9rem",
            background: "rgba(var(--tint),0.04)",
            border: "1px solid rgba(var(--tint),0.1)",
            borderRadius: 7,
            color: "rgba(var(--ink-tint),0.6)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(0.58rem, 0.8vw, 0.68rem)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}>
          ✕ Beenden
        </button>
      </header>

      {/* ── Main content ── */}
      <main style={{
        flex: 1,
        overflow: "hidden",
        padding: "clamp(12px, 2vw, 28px) clamp(16px, 3vw, 40px)",
        display: "flex",
        flexDirection: "column",
        gap: "clamp(10px, 1.5vw, 20px)",
        maxWidth: 1400,
        width: "100%",
        margin: "0 auto",
        boxSizing: "border-box",
      }}>
        {/* Greeting */}
        <div style={{ flexShrink: 0 }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(0.55rem, 0.75vw, 0.65rem)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(var(--ink-tint),0.35)",
            marginBottom: 4,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ width: 12, height: 1, background: "currentColor", opacity: 0.5, display: "inline-block" }} />
            Arbeitsstation
          </div>
          <h1 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
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
            gap: 12,
            background: "rgba(var(--tint),0.02)",
            border: "1px solid rgba(var(--tint),0.06)",
            borderRadius: 16,
            textAlign: "center",
          }}>
            <div style={{ fontSize: "2rem", opacity: 0.4 }}>◎</div>
            <div style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "1.1rem",
              fontWeight: 400,
              color: "rgba(var(--ink-tint),0.5)",
            }}>
              Keine Module konfiguriert
            </div>
            {isAdmin && (
              <Link to="/dashboard/settings?tab=station_guide" style={{
                marginTop: 4,
                padding: "0.45rem 1.1rem",
                background: "#c5a572",
                color: "#000",
                borderRadius: 7,
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.78rem",
              }}>
                Module einrichten
              </Link>
            )}
          </div>
        ) : (
          <div style={{
            flex: 1,
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridAutoRows: "1fr",
            gap: "clamp(6px, 1vw, 12px)",
          }}>
            {stationModules.map(key => (
              <ModuleCard key={key} moduleKey={key} onClick={handleModuleClick} />
            ))}
          </div>
        )}
      </main>

      {showExitModal && (
        <StationExitModal
          hasPassword={org?.station_exit_password_set ?? false}
          onClose={() => setShowExitModal(false)}
        />
      )}

      {/* ── Footer bar ── */}
      <footer style={{
        borderTop: "1px solid rgba(var(--ink-tint),0.06)",
        padding: "clamp(8px, 1vw, 12px) clamp(16px, 3vw, 40px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.62rem",
          letterSpacing: "0.1em",
          color: "rgba(var(--ink-tint),0.2)",
          textTransform: "uppercase",
        }}>
          Nill ArbeitsStation
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.62rem",
          letterSpacing: "0.1em",
          color: "rgba(var(--ink-tint),0.2)",
        }}>
          {user?.email}
        </span>
      </footer>
    </div>
  );
}
