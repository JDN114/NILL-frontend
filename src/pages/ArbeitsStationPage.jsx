// src/pages/ArbeitsStationPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import StationExitModal from "../components/StationExitModal";

/* ─── Design tokens ─────────────────────────────────────────────────────────
   Dark is the default; html[data-theme="light"] .as-root flips all tokens.
   Dynamic values (per-module accent colors) stay as inline styles below.    */
const S = `
  .as-root {
    --as-bg:        #040817;
    --as-hdr-bg:    rgba(4,8,23,.95);
    --as-ink:       #efede7;
    --as-ink-sub:   rgba(var(--ink-tint),.48);
    --as-ink-faint: rgba(var(--ink-tint),.18);
    --as-line:      rgba(var(--ink-tint),.07);
    --as-glass:     rgba(var(--tint),.04);
    --as-glass-hov: rgba(var(--tint),.08);
    --as-accent:    #c5a572;
    --as-logo-fg:   #03060a;
    --as-serif:     "Fraunces",Georgia,serif;
    --as-sans:      "Inter",system-ui,sans-serif;
    --as-mono:      "JetBrains Mono",monospace;

    height: 100vh; overflow: hidden;
    background: var(--as-bg);
    display: flex; flex-direction: column;
    font-family: var(--as-sans);
    color: var(--as-ink);
  }

  html[data-theme="light"] .as-root {
    --as-bg:        #eae3d4;
    --as-hdr-bg:    rgba(234,227,212,.97);
    --as-ink:       #201d15;
    --as-ink-sub:   rgba(var(--ink-tint),.58);
    --as-ink-faint: rgba(var(--ink-tint),.22);
    --as-line:      rgba(var(--ink-tint),.14);
    --as-glass:     rgba(var(--tint),.045);
    --as-glass-hov: rgba(var(--tint),.085);
    --as-accent:    #806228;
    --as-logo-fg:   #fff;
  }

  /* Header */
  .as-hdr {
    background: var(--as-hdr-bg);
    border-bottom: 1px solid var(--as-line);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    padding: 0 clamp(16px,3vw,40px);
    height: clamp(56px,7vw,72px);
    display: flex; align-items: center; justify-content: space-between; gap: 20px;
    flex-shrink: 0;
  }
  .as-hdr-brand { display:flex; align-items:center; gap:12px; }
  .as-logo-box {
    width: clamp(30px,3.5vw,40px); height: clamp(30px,3.5vw,40px);
    background: var(--as-accent); border-radius: 8px;
    display:flex; align-items:center; justify-content:center;
    font-weight:900; font-size:clamp(0.8rem,1.2vw,1rem);
    color: var(--as-logo-fg); letter-spacing:-0.02em; flex-shrink:0;
  }
  .as-logo-name {
    font-family: var(--as-serif); font-size:clamp(0.9rem,1.4vw,1.15rem);
    font-weight:400; color:var(--as-ink); letter-spacing:-0.02em; line-height:1;
  }
  .as-logo-tag {
    font-family: var(--as-mono); font-size:clamp(0.55rem,0.75vw,0.65rem);
    color:var(--as-ink-sub); letter-spacing:0.15em; text-transform:uppercase; margin-top:2px;
  }

  /* Clock */
  .as-clock { text-align:right; }
  .as-clock-time {
    font-family: var(--as-mono); font-size:clamp(1.1rem,2vw,1.6rem);
    font-weight:700; color:var(--as-ink); letter-spacing:0.04em; line-height:1;
  }
  .as-clock-date {
    font-family: var(--as-sans); font-size:clamp(0.6rem,0.9vw,0.75rem);
    color:var(--as-ink-sub); margin-top:3px; letter-spacing:0.03em;
  }

  /* Exit button */
  .as-exit-btn {
    padding: 0.35rem 0.9rem;
    background: var(--as-glass); border: 1px solid var(--as-line); border-radius:7px;
    color: var(--as-ink-sub);
    font-family: var(--as-mono); font-size:clamp(0.58rem,0.8vw,0.68rem);
    letter-spacing:0.1em; text-transform:uppercase; white-space:nowrap; cursor:pointer;
    transition: background .2s, border-color .2s, color .2s;
  }
  .as-exit-btn:hover {
    background: var(--as-glass-hov); border-color:var(--as-ink-faint); color:var(--as-ink);
  }

  /* Main */
  .as-main {
    flex:1; overflow:hidden;
    padding: clamp(12px,2vw,28px) clamp(16px,3vw,40px);
    display:flex; flex-direction:column; gap:clamp(10px,1.5vw,20px);
    max-width:1400px; width:100%; margin:0 auto; box-sizing:border-box;
  }

  /* Greeting */
  .as-eyebrow {
    font-family: var(--as-mono); font-size:clamp(0.55rem,0.75vw,0.65rem);
    letter-spacing:0.2em; text-transform:uppercase; color:var(--as-ink-sub);
    margin-bottom:4px; display:flex; align-items:center; gap:8px;
  }
  .as-eyebrow-line { width:12px; height:1px; background:currentColor; opacity:.5; display:inline-block; }
  .as-h1 {
    font-family: var(--as-serif); font-size:clamp(1.2rem,2.5vw,2rem);
    font-weight:400; color:var(--as-ink); letter-spacing:-0.025em; line-height:1; margin:0;
  }
  .as-h1 em { font-style:italic; color:var(--as-accent); }

  /* Empty state */
  .as-empty {
    flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:12px; background:var(--as-glass); border:1px solid var(--as-line);
    border-radius:16px; text-align:center;
  }
  .as-empty-icon { font-size:2rem; opacity:.35; color:var(--as-ink-sub); }
  .as-empty-label {
    font-family:var(--as-serif); font-size:1.1rem; font-weight:400; color:var(--as-ink-sub);
  }
  .as-setup-link {
    margin-top:4px; padding:0.45rem 1.1rem;
    background:var(--as-accent); border-radius:7px;
    text-decoration:none; font-weight:700; font-size:0.78rem;
    color:var(--as-logo-fg); transition:opacity .2s;
  }
  .as-setup-link:hover { opacity:.85; }

  /* Module grid */
  .as-grid { flex:1; overflow:hidden; display:grid; gap:clamp(6px,1vw,12px); }

  /* Module card */
  .as-card {
    background: var(--as-glass); border:1px solid var(--as-line); border-radius:14px;
    padding:12px 16px; display:flex; flex-direction:row; align-items:center; gap:12px;
    cursor:pointer; transition:background .2s, border-color .2s, transform .15s;
    text-align:left; width:100%; height:100%; position:relative; overflow:hidden;
    box-sizing:border-box;
  }
  .as-card:hover { background:var(--as-glass-hov); }
  .as-card:active { transform:scale(0.97); }
  .as-card-body { flex:1; min-width:0; }
  .as-card-label {
    font-family:var(--as-serif); font-size:clamp(0.85rem,1.4vw,1.05rem);
    font-weight:400; color:var(--as-ink); letter-spacing:-0.02em; line-height:1.15;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .as-card-desc {
    font-family:var(--as-sans); font-size:clamp(0.62rem,0.9vw,0.72rem);
    color:var(--as-ink-sub); line-height:1.3; margin-top:2px;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .as-card-arrow { font-family:var(--as-mono); font-size:0.65rem; opacity:.65; flex-shrink:0; }

  /* Footer */
  .as-footer {
    border-top:1px solid var(--as-line);
    padding:clamp(8px,1vw,12px) clamp(16px,3vw,40px);
    display:flex; align-items:center; justify-content:space-between; flex-shrink:0;
  }
  .as-footer-text {
    font-family:var(--as-mono); font-size:0.62rem;
    letter-spacing:0.1em; color:var(--as-ink-faint); text-transform:uppercase;
  }
`;

// ─── Module registry ─────────────────────────────────────────────────────────
const MODULE_META = {
  calendar:   { label: "Kalender",      icon: "▦",  color: "#38f5d0", route: "/station/calendar",       desc: "Termine & Planung" },
  workflow:   { label: "Aufgaben",      icon: "⌘",  color: "#c6ff3c", route: "/station/tasks",          desc: "Tasks & Prozesse" },
  time:       { label: "Zeiterfassung", icon: "⏱",  color: "#ff4d8d", route: "/station/time",           desc: "Arbeitszeiten" },
  hr_docs:    { label: "HR & Listen",   icon: "📄",  color: "#fbbf24", route: "/station/hr-documents",  desc: "Dokumente, Listen & Lieferscheine" },
  shift_plan: { label: "Schichtplan",   icon: "⬡",  color: "#38f5d0", route: "/station/schichtplan",    desc: "Wochenschichten & Team" },
  delivery:   { label: "Lieferscheine", icon: "📦",  color: "#fb923c", route: "/station/lieferscheine", desc: "Lieferungen & Bestätigung" },
  inventory:  { label: "Inventur",      icon: "◫",  color: "#a78bfa", route: "/station/inventur",       desc: "Bestand & Lager" },
};

// ─── Clock ───────────────────────────────────────────────────────────────────
function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="as-clock">
      <div className="as-clock-time">
        {now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </div>
      <div className="as-clock-date">
        {now.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      </div>
    </div>
  );
}

// ─── Module card ─────────────────────────────────────────────────────────────
function ModuleCard({ moduleKey, onClick }) {
  const meta = MODULE_META[moduleKey];
  if (!meta) return null;

  return (
    <button
      className="as-card"
      onClick={() => onClick(meta.route)}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${meta.color}55`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = ""; }}
    >
      {/* Per-module accent glow — stays inline (dynamic color) */}
      <div style={{
        position: "absolute", top: -30, right: -30,
        width: 80, height: 80, borderRadius: "50%",
        background: `radial-gradient(circle, ${meta.color}18, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: `${meta.color}18`, border: `1px solid ${meta.color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.05rem", flexShrink: 0,
      }}>
        {meta.icon}
      </div>

      <div className="as-card-body">
        <div className="as-card-label">{meta.label}</div>
        <div className="as-card-desc">{meta.desc}</div>
      </div>

      <div className="as-card-arrow" style={{ color: meta.color }}>→</div>
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ArbeitsStationPage() {
  const { user, org, isCompanyAdmin } = useAuth();
  const isAdmin = isCompanyAdmin();
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [showExitModal, setShowExitModal] = useState(false);

  const stationModules = org?.station_modules ?? [];

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

  const visibleModules = stationModules.filter(k => MODULE_META[k]);
  const count = visibleModules.length;
  const cols = count <= 2 ? count : count <= 4 ? 2 : count <= 6 ? 3 : count <= 9 ? 3 : 4;

  return (
    <>
      <style>{S}</style>

      <div className="as-root">
        {/* ── Header ── */}
        <header className="as-hdr">
          <div className="as-hdr-brand">
            <div className="as-logo-box">N</div>
            <div>
              <div className="as-logo-name">{org?.name ?? "Nill"}</div>
              <div className="as-logo-tag">ArbeitsStation</div>
            </div>
          </div>

          <Clock />

          <button className="as-exit-btn" onClick={() => setShowExitModal(true)}>
            ✕ Beenden
          </button>
        </header>

        {/* ── Main ── */}
        <main className="as-main">
          {/* Greeting */}
          <div style={{ flexShrink: 0 }}>
            <div className="as-eyebrow">
              <span className="as-eyebrow-line" />
              Arbeitsstation
            </div>
            <h1 className="as-h1">
              {displayName
                ? <>{greeting}, <em>{displayName}.</em></>
                : <>{greeting}<em>.</em></>
              }
            </h1>
          </div>

          {/* Module grid */}
          {stationModules.length === 0 ? (
            <div className="as-empty">
              <div className="as-empty-icon">◎</div>
              <div className="as-empty-label">Keine Module konfiguriert</div>
              {isAdmin && (
                <Link to="/dashboard/settings?tab=station_guide" className="as-setup-link">
                  Module einrichten
                </Link>
              )}
            </div>
          ) : (
            <div
              className="as-grid"
              style={{
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridAutoRows: "1fr",
              }}
            >
              {stationModules.map(key => (
                <ModuleCard key={key} moduleKey={key} onClick={handleModuleClick} />
              ))}
            </div>
          )}
        </main>

        {/* ── Footer ── */}
        <footer className="as-footer">
          <span className="as-footer-text">Nill ArbeitsStation</span>
          <span className="as-footer-text">{user?.email}</span>
        </footer>
      </div>

      {showExitModal && (
        <StationExitModal
          hasPassword={org?.station_exit_password_set ?? false}
          onClose={() => setShowExitModal(false)}
        />
      )}
    </>
  );
}
