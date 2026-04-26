// src/pages/CallsModule.jsx
//
// NILL — KI-Empfangsdienst (Anrufe).
// Standalone-Page im Stil von NILLModule.jsx. Du kannst sie:
//   (a) als eigene Route einbinden, oder
//   (b) das innere <CallsBoard /> in NILLModule.jsx als achten Sub-Tab
//       (z.B. "08 · Anrufe") einsetzen.
//
// Backend-Routen (vom voice_agent-Modul):
//   GET    /calls?status=&escalated_only=&limit=&offset=
//   GET    /calls/escalated?include_resolved=
//   GET    /calls/{id}                — Detail mit turns
//   POST   /calls/{id}/resolve

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "../components/layout/PageLayout";
import api from "../services/api";

// ─── Design Tokens (mirrored from NILLModule) ────────────────────────────────
const T = {
  bg0:       "#0a0a0c",
  bg1:       "#111114",
  bg2:       "#18181c",
  bg3:       "#222228",
  border:    "#2e2e36",
  borderHi:  "#44444f",
  textPri:   "#f0f0f2",
  textSec:   "#8a8a96",
  textTer:   "#55555f",
  accent:    "#00d97e",
  accentDim: "#00d97e22",
  warn:      "#f5a623",
  warnDim:   "#f5a62320",
  danger:    "#ff4d4d",
  dangerDim: "#ff4d4d18",
  info:      "#4d9fff",
  infoDim:   "#4d9fff18",
  purple:    "#a78bfa",
  purpleDim: "#a78bfa18",
};
const FONT_DISPLAY = "'Syne', sans-serif";
const FONT_MONO    = "'DM Mono', monospace";
const FONT_BODY    = "'Syne', sans-serif";
const FM = FONT_MONO;
const FB = FONT_BODY;
const FD = FONT_DISPLAY;
const GOOGLE_FONTS = "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap";

// ─── Global styles (idempotent) ──────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('${GOOGLE_FONTS}');
.nill-root * { box-sizing: border-box; }
.nill-root input, .nill-root textarea, .nill-root select {
  background: ${T.bg2}; color: ${T.textPri};
  border: 1px solid ${T.border}; border-radius: 6px;
  padding: 10px 14px; font-family: ${FONT_BODY}; font-size: 13px;
  width: 100%; outline: none; transition: border-color 0.15s;
}
.nill-root input::placeholder, .nill-root textarea::placeholder { color: ${T.textSec}; opacity: 1; }
.nill-root input:focus, .nill-root textarea:focus { border-color: ${T.borderHi}; }
.nill-root label {
  display: block; font-family: ${FONT_MONO}; font-size: 11px; color: ${T.textSec};
  letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px;
}
.nill-scrollbar::-webkit-scrollbar { width: 4px; }
.nill-scrollbar::-webkit-scrollbar-track { background: transparent; }
.nill-scrollbar::-webkit-scrollbar-thumb { background: ${T.bg3}; border-radius: 4px; }
.nill-card-hover { transition: border-color 0.15s, background 0.15s; }
.nill-card-hover:hover { border-color: ${T.borderHi} !important; background: ${T.bg2} !important; }
@keyframes nill-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.4; transform: scale(0.85); }
}
.nill-live-dot { animation: nill-pulse 1.6s ease-in-out infinite; }
`;

function GlobalStyles() {
  useEffect(() => {
    if (document.getElementById("nill-global-styles")) return;
    const el = document.createElement("style");
    el.id = "nill-global-styles";
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
  }, []);
  return null;
}

// ─── Status & intent configs ─────────────────────────────────────────────────
const CALL_STATUS = {
  in_progress: { label: "AKTIV",      color: T.info,    dim: T.infoDim   },
  completed:   { label: "BEENDET",    color: T.accent,  dim: T.accentDim },
  failed:      { label: "FEHLER",     color: T.danger,  dim: T.dangerDim },
  no_input:    { label: "KEIN INPUT", color: T.textTer, dim: T.bg3       },
  busy:        { label: "BESETZT",    color: T.textTer, dim: T.bg3       },
  canceled:    { label: "ABGEBROCHEN",color: T.textTer, dim: T.bg3       },
  "no-answer": { label: "KEINE ANTW.",color: T.textTer, dim: T.bg3       },
};

const INTENT_CFG = {
  appointment: { label: "Termin",     short: "TERMIN",    color: T.accent, dim: T.accentDim },
  question:    { label: "Frage",      short: "FRAGE",     color: T.info,   dim: T.infoDim   },
  message:     { label: "Nachricht",  short: "NACHRICHT", color: T.purple, dim: T.purpleDim },
  escalate:    { label: "Eskalation", short: "ESKALAT.",  color: T.warn,   dim: T.warnDim   },
  other:       { label: "Sonstiges",  short: "SONSTIGE",  color: T.textTer,dim: T.bg3       },
};

const URGENCY_CFG = {
  low:    { label: "NIEDRIG",  color: T.accent, dim: T.accentDim },
  normal: { label: "NORMAL",   color: T.warn,   dim: T.warnDim   },
  high:   { label: "DRINGEND", color: T.danger, dim: T.dangerDim },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDuration(s) {
  if (s == null) return "—";
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

function formatPhone(p) {
  if (!p) return "Unbekannt";
  return p;
}

function formatTimeAgo(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60)       return "gerade eben";
  if (diff < 3600)     return `vor ${Math.floor(diff / 60)} Min.`;
  if (diff < 86400)    return `vor ${Math.floor(diff / 3600)} Std.`;
  if (diff < 86400 * 2) return "gestern";
  if (diff < 86400 * 7) return `vor ${Math.floor(diff / 86400)} Tagen`;
  return d.toLocaleDateString("de-DE");
}

function formatDateTime(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" });
}

function rangeStartTs(range) {
  const now = new Date();
  const start = new Date(now);
  if (range === "today") {
    start.setHours(0, 0, 0, 0);
  } else if (range === "week") {
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);
  } else if (range === "month") {
    start.setDate(now.getDate() - 29);
    start.setHours(0, 0, 0, 0);
  } else {
    start.setFullYear(2000);
  }
  return start.getTime();
}

function inRange(call, range) {
  const t = call.started_at ? new Date(call.started_at).getTime() : 0;
  return t >= rangeStartTs(range);
}

// ─── Stats ───────────────────────────────────────────────────────────────────
function computeStats(calls, range) {
  const inWin = calls.filter(c => inRange(c, range));
  const total = inWin.length;
  const active = calls.filter(c => c.status === "in_progress").length;
  const escalated = inWin.filter(c => c.escalated).length;
  const completedClean = inWin.filter(
    c => c.status === "completed" && !c.escalated
  ).length;

  const durations = inWin
    .map(c => c.duration_seconds)
    .filter(d => d != null && d > 0);
  const avgDuration = durations.length
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    : null;

  // Intent breakdown
  const intentCounts = {};
  inWin.forEach(c => {
    const key = c.intent || "other";
    intentCounts[key] = (intentCounts[key] || 0) + 1;
  });
  const intents = Object.entries(intentCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => ({ key: k, count: v, pct: total ? v / total : 0 }));

  // 14-day activity buckets (oldest → newest)
  const days = 14;
  const buckets = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (days - 1 - i));
    return { date: d, count: 0, escalated: 0 };
  });
  calls.forEach(c => {
    if (!c.started_at) return;
    const d = new Date(c.started_at);
    d.setHours(0, 0, 0, 0);
    const idx = buckets.findIndex(b => b.date.getTime() === d.getTime());
    if (idx >= 0) {
      buckets[idx].count++;
      if (c.escalated) buckets[idx].escalated++;
    }
  });

  return {
    total, active, escalated, completedClean, avgDuration, intents, buckets,
  };
}

// ─── Primitives ──────────────────────────────────────────────────────────────
function Tag({ children, color = T.textSec, dim = T.bg3 }) {
  return (
    <span style={{
      display: "inline-block", background: dim, color,
      border: `1px solid ${color}40`, borderRadius: 3, padding: "2px 8px",
      fontFamily: FM, fontSize: 10, fontWeight: 500, letterSpacing: "0.1em",
    }}>{children}</span>
  );
}

function MonoLabel({ children, color = T.textTer }) {
  return (
    <p style={{
      margin: "0 0 6px", fontFamily: FM, fontSize: 10, fontWeight: 500,
      color, letterSpacing: "0.12em", textTransform: "uppercase",
    }}>{children}</p>
  );
}

function SectionTitle({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
      <div>
        <h2 style={{ margin: 0, fontFamily: FD, fontSize: 22, fontWeight: 700, color: T.textPri, letterSpacing: "-0.02em" }}>{title}</h2>
        {subtitle && <p style={{ margin: "5px 0 0", fontFamily: FM, fontSize: 11, color: T.textSec }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function GhostBtn({ onClick, children, active }) {
  return (
    <button onClick={onClick} style={{
      background: active ? T.bg3 : "none",
      color: active ? T.textPri : T.textSec,
      border: `1px solid ${active ? T.borderHi : T.border}`,
      borderRadius: 6, padding: "7px 16px",
      fontFamily: FM, fontSize: 11, letterSpacing: "0.06em", cursor: "pointer",
      transition: "color 0.15s, border-color 0.15s, background 0.15s",
    }}>{children}</button>
  );
}

function PrimaryBtn({ onClick, disabled, children, color = T.accent }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: color + "18", color,
      border: `1px solid ${color}60`, borderRadius: 6, padding: "9px 20px",
      fontFamily: FM, fontSize: 11, fontWeight: 500, letterSpacing: "0.06em",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "background 0.15s, border-color 0.15s",
      opacity: disabled ? 0.5 : 1, whiteSpace: "nowrap",
    }}>{children}</button>
  );
}

function EmptySlate({ title, body }) {
  return (
    <div style={{ textAlign: "center", padding: "52px 24px", border: `1px dashed ${T.border}`, borderRadius: 8 }}>
      <div style={{ width: 1, height: 40, background: T.border, margin: "0 auto 20px" }} />
      <p style={{ margin: "0 0 8px", fontFamily: FD, fontSize: 15, fontWeight: 600, color: T.textSec }}>{title}</p>
      {body && <p style={{ margin: 0, fontFamily: FM, fontSize: 11, color: T.textTer }}>{body}</p>}
    </div>
  );
}

function ErrorBanner({ message }) {
  return (
    <div style={{ background: T.dangerDim, border: `1px solid ${T.danger}40`, borderRadius: 6, padding: "10px 14px", marginBottom: 14 }}>
      <p style={{ margin: 0, fontFamily: FM, fontSize: 11, color: T.danger }}>{message}</p>
    </div>
  );
}

function Drawer({ onClose, title, subtitle, maxWidth = 680, children }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={{ duration: 0.18 }}
        className="nill-scrollbar"
        style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 10, width: "100%", maxWidth, maxHeight: "88vh", overflowY: "auto", padding: "28px 32px" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: 0, fontFamily: FD, fontSize: 18, fontWeight: 700, color: T.textPri, letterSpacing: "-0.02em" }}>{title}</h2>
            {subtitle && <p style={{ margin: "4px 0 0", fontFamily: FM, fontSize: 11, color: T.textSec }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.textTer, fontSize: 18, cursor: "pointer", lineHeight: 1, padding: 4, marginLeft: 16 }}>✕</button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

function InfoBlock({ label, children, color = T.textSec, accent }) {
  return (
    <div style={{
      background: T.bg2, border: `1px solid ${T.border}`,
      borderLeft: accent ? `2px solid ${accent}` : undefined,
      borderRadius: accent ? "0 6px 6px 0" : 6,
      padding: "12px 16px", marginBottom: 12,
    }}>
      <MonoLabel>{label}</MonoLabel>
      <div style={{ fontFamily: FB, fontSize: 13, color, lineHeight: 1.65 }}>{children}</div>
    </div>
  );
}

// ─── Stats grid ──────────────────────────────────────────────────────────────
function StatsGrid({ stats, range }) {
  const items = [
    { label: range === "today" ? "ANRUFE HEUTE" : range === "week" ? "ANRUFE / WOCHE" : "ANRUFE / MONAT",
      value: stats.total },
    { label: "ESKALIERT", value: stats.escalated, hint: stats.escalated > 0 ? T.warn : null },
    { label: "Ø DAUER", value: stats.avgDuration != null ? formatDuration(stats.avgDuration) : "—" },
    { label: "AKTIV", value: stats.active, live: stats.active > 0 },
    { label: "AUTOM. GELÖST", value: stats.completedClean, hint: T.accent },
  ];
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gap: 1, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden",
      marginBottom: 28,
    }}>
      {items.map((s, i) => (
        <div key={i} style={{
          background: T.bg2, padding: "18px 20px",
          borderRight: i < items.length - 1 ? `1px solid ${T.border}` : "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <p style={{ margin: 0, fontFamily: FM, fontSize: 9, color: T.textTer, letterSpacing: "0.12em" }}>{s.label}</p>
            {s.live && (
              <span className="nill-live-dot" style={{
                width: 6, height: 6, borderRadius: "50%", background: T.info,
              }} />
            )}
          </div>
          <p style={{
            margin: 0, fontFamily: FM, fontSize: 28, fontWeight: 500,
            color: s.hint || T.textPri, lineHeight: 1,
          }}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Insights row: intents + activity ────────────────────────────────────────
function IntentBars({ intents }) {
  if (!intents.length) {
    return (
      <p style={{ margin: 0, fontFamily: FM, fontSize: 11, color: T.textTer }}>Keine Daten.</p>
    );
  }
  const max = intents[0].count;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {intents.map(it => {
        const cfg = INTENT_CFG[it.key] || INTENT_CFG.other;
        const w = max > 0 ? (it.count / max) * 100 : 0;
        return (
          <div key={it.key}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontFamily: FM, fontSize: 10, color: T.textSec, letterSpacing: "0.08em" }}>{cfg.short}</span>
              <span style={{ fontFamily: FM, fontSize: 11, color: T.textPri }}>
                {it.count} <span style={{ color: T.textTer }}>· {Math.round(it.pct * 100)}%</span>
              </span>
            </div>
            <div style={{ height: 4, background: T.bg2, borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${w}%`, background: cfg.color,
                transition: "width 0.4s",
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ActivitySparkline({ buckets }) {
  const max = Math.max(1, ...buckets.map(b => b.count));
  return (
    <div>
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${buckets.length}, 1fr)`,
        alignItems: "end", gap: 3, height: 80,
      }}>
        {buckets.map((b, i) => {
          const h = (b.count / max) * 100;
          const escalatedH = b.escalated ? (b.escalated / max) * 100 : 0;
          return (
            <div key={i} title={`${b.date.toLocaleDateString("de-DE")} · ${b.count} Anrufe${b.escalated ? ` · ${b.escalated} eskaliert` : ""}`}
              style={{ position: "relative", height: "100%", display: "flex", alignItems: "flex-end" }}>
              <div style={{
                width: "100%",
                height: `${Math.max(h, b.count > 0 ? 4 : 0)}%`,
                background: T.borderHi, borderRadius: "2px 2px 0 0",
                transition: "height 0.3s",
              }}>
                {escalatedH > 0 && (
                  <div style={{
                    width: "100%",
                    height: `${(b.escalated / Math.max(b.count, 1)) * 100}%`,
                    background: T.warn, borderRadius: "2px 2px 0 0",
                  }} />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <span style={{ fontFamily: FM, fontSize: 9, color: T.textTer }}>{buckets[0]?.date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}</span>
        <span style={{ fontFamily: FM, fontSize: 9, color: T.textTer }}>HEUTE</span>
      </div>
    </div>
  );
}

function InsightsRow({ stats }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 14, marginBottom: 28,
    }}>
      <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 8, padding: "18px 22px" }}>
        <MonoLabel>Anliegen-Verteilung</MonoLabel>
        <div style={{ marginTop: 14 }}>
          <IntentBars intents={stats.intents} />
        </div>
      </div>
      <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 8, padding: "18px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <MonoLabel>Aktivität · 14 Tage</MonoLabel>
          <div style={{ display: "flex", gap: 12, fontFamily: FM, fontSize: 9, color: T.textTer, letterSpacing: "0.08em" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 8, height: 8, background: T.borderHi, borderRadius: 1 }} />ANRUFE
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 8, height: 8, background: T.warn, borderRadius: 1 }} />ESKALIERT
            </span>
          </div>
        </div>
        <ActivitySparkline buckets={stats.buckets} />
      </div>
    </div>
  );
}

// ─── Filter tabs ─────────────────────────────────────────────────────────────
function FilterTabs({ value, onChange, counts }) {
  const tabs = [
    { key: "all",        label: "ALLE",        count: counts.all },
    { key: "active",     label: "AKTIV",       count: counts.active },
    { key: "escalated",  label: "ESKALIERT",   count: counts.escalated },
    { key: "unresolved", label: "OFFEN",       count: counts.unresolved },
    { key: "completed",  label: "BEENDET",     count: counts.completed },
  ];
  return (
    <div style={{
      display: "flex", gap: 2, marginBottom: 14, background: T.bg2,
      borderRadius: 6, padding: 3, border: `1px solid ${T.border}`,
    }}>
      {tabs.map(t => {
        const active = value === t.key;
        return (
          <button key={t.key} onClick={() => onChange(t.key)} style={{
            flex: 1, padding: "8px 4px",
            background: active ? T.bg3 : "none",
            border: active ? `1px solid ${T.border}` : "1px solid transparent",
            borderRadius: 4,
            fontFamily: FM, fontSize: 10, letterSpacing: "0.08em",
            color: active ? T.textPri : T.textTer, cursor: "pointer",
            transition: "all 0.12s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <span>{t.label}</span>
            {t.count > 0 && (
              <span style={{
                background: active ? T.borderHi : T.bg3,
                color: active ? T.textPri : T.textTer,
                borderRadius: 99, padding: "1px 7px", fontSize: 9,
              }}>{t.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Calls list ──────────────────────────────────────────────────────────────
function CallRow({ call, onClick, isFirst, isLast }) {
  const status = CALL_STATUS[call.status] || CALL_STATUS.completed;
  const intent = INTENT_CFG[call.intent] || INTENT_CFG.other;
  const urgency = call.escalated ? URGENCY_CFG[call.escalation_urgency] || URGENCY_CFG.normal : null;
  const resolved = call.escalated && call.extra && call.extra.resolved;

  return (
    <div
      className="nill-card-hover"
      onClick={onClick}
      style={{
        background: T.bg1, border: `1px solid ${T.border}`,
        borderRadius:
          isFirst && isLast ? 8 :
          isFirst ? "8px 8px 2px 2px" :
          isLast  ? "2px 2px 8px 8px" : 2,
        padding: "14px 20px", cursor: "pointer",
        display: "flex", gap: 16, alignItems: "center",
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: "50%",
        background: status.dim,
        border: `1px solid ${status.color}40`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {call.status === "in_progress" ? (
          <span className="nill-live-dot" style={{
            width: 8, height: 8, borderRadius: "50%", background: T.info,
          }} />
        ) : (
          <span style={{ fontFamily: FM, fontSize: 11, color: status.color }}>
            {call.escalated ? "!" : "✓"}
          </span>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontFamily: FD, fontSize: 14, fontWeight: 600, color: T.textPri }}>
            {call.caller_name || formatPhone(call.from_number)}
          </span>
          <Tag color={intent.color} dim={intent.dim}>{intent.short}</Tag>
          {urgency && (
            <Tag color={urgency.color} dim={urgency.dim}>
              {urgency.label}
            </Tag>
          )}
          {resolved && <Tag color={T.accent} dim={T.accentDim}>GELÖST</Tag>}
        </div>
        <p style={{
          margin: 0, fontFamily: FB, fontSize: 12, color: T.textSec,
          lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {call.summary
            ? call.summary
            : call.escalation_reason
            ? `Eskaliert: ${call.escalation_reason}`
            : call.caller_name && call.callback_number
            ? `${call.callback_number}`
            : <span style={{ color: T.textTer, fontStyle: "italic" }}>
                {call.status === "in_progress" ? "Läuft gerade …" : "Keine Zusammenfassung"}
              </span>}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
        <Tag color={status.color} dim={status.dim}>{status.label}</Tag>
        <span style={{ fontFamily: FM, fontSize: 9, color: T.textTer }}>
          {formatDuration(call.duration_seconds)} · {formatTimeAgo(call.started_at)}
        </span>
      </div>
    </div>
  );
}

function CallsList({ calls, onSelect }) {
  if (!calls.length) {
    return <EmptySlate title="Keine Anrufe in diesem Filter" body="Wähle einen anderen Zeitraum oder Filter" />;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {calls.map((c, i) => (
        <CallRow
          key={c.id}
          call={c}
          onClick={() => onSelect(c.id)}
          isFirst={i === 0}
          isLast={i === calls.length - 1}
        />
      ))}
    </div>
  );
}

// ─── Transcript view ─────────────────────────────────────────────────────────
function TurnBubble({ turn }) {
  const isUser = turn.role === "user";
  const isTool = turn.role === "tool";

  if (isTool) {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 8, margin: "8px 0",
        fontFamily: FM, fontSize: 10, color: T.textTer, letterSpacing: "0.06em",
      }}>
        <div style={{ flex: 1, height: 1, background: T.border }} />
        <span style={{
          background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 99,
          padding: "3px 10px", color: T.textSec,
        }}>
          ⚙ {turn.tool_name?.toUpperCase().replace(/_/g, " ")}
          {turn.tool_result && turn.tool_result.ok === false && (
            <span style={{ color: T.danger, marginLeft: 6 }}>FEHLER</span>
          )}
        </span>
        <div style={{ flex: 1, height: 1, background: T.border }} />
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: 10,
    }}>
      <div style={{
        maxWidth: "78%",
        background: isUser ? T.bg3 : T.bg2,
        border: `1px solid ${T.border}`,
        borderRadius: isUser ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
        padding: "10px 14px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <span style={{
            fontFamily: FM, fontSize: 9, letterSpacing: "0.1em",
            color: isUser ? T.info : T.accent,
          }}>
            {isUser ? "ANRUFER" : "NILL"}
          </span>
          <span style={{ fontFamily: FM, fontSize: 9, color: T.textTer }}>
            {turn.created_at && new Date(turn.created_at).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </div>
        <p style={{
          margin: 0, fontFamily: FB, fontSize: 13, color: T.textPri,
          lineHeight: 1.55, whiteSpace: "pre-wrap",
        }}>{turn.content || <span style={{ color: T.textTer, fontStyle: "italic" }}>(leer)</span>}</p>
      </div>
    </div>
  );
}

function TranscriptView({ turns }) {
  // Filter out empty assistant messages that only carried tool_calls — their
  // tool turns will render inline anyway. Keep tool turns as separators.
  const visible = (turns || []).filter(t => {
    if (t.role === "assistant" && !t.content) return false;
    if (t.role === "system") return false;
    return true;
  });
  if (!visible.length) {
    return <p style={{ margin: 0, fontFamily: FM, fontSize: 11, color: T.textTer }}>KEIN GESPRÄCH AUFGEZEICHNET</p>;
  }
  return (
    <div style={{
      background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 8,
      padding: "16px 18px", maxHeight: 420, overflowY: "auto",
    }} className="nill-scrollbar">
      {visible.map(t => <TurnBubble key={t.id} turn={t} />)}
    </div>
  );
}

// ─── Call drawer ─────────────────────────────────────────────────────────────
function CallDrawer({ call, onClose, onResolve, resolving }) {
  if (!call) return null;
  const status = CALL_STATUS[call.status] || CALL_STATUS.completed;
  const intent = INTENT_CFG[call.intent] || INTENT_CFG.other;
  const urgency = call.escalated ? URGENCY_CFG[call.escalation_urgency] || URGENCY_CFG.normal : null;
  const resolved = call.escalated && call.extra && call.extra.resolved;

  // Tool actions surfaced as a quick log
  const toolEvents = (call.turns || []).filter(t => t.role === "tool");

  return (
    <Drawer
      onClose={onClose}
      title={call.caller_name || formatPhone(call.from_number)}
      subtitle={`${formatDateTime(call.started_at)} · ${formatDuration(call.duration_seconds)} · ${intent.label}`}
      maxWidth={720}
    >
      {/* Status / actions row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Tag color={status.color} dim={status.dim}>{status.label}</Tag>
          <Tag color={intent.color} dim={intent.dim}>{intent.short}</Tag>
          {urgency && <Tag color={urgency.color} dim={urgency.dim}>{urgency.label}</Tag>}
          {resolved && <Tag color={T.accent} dim={T.accentDim}>GELÖST</Tag>}
        </div>
        {call.escalated && !resolved && (
          <PrimaryBtn onClick={() => onResolve(call.id)} disabled={resolving} color={T.accent}>
            {resolving ? "MARKIERE …" : "Als gelöst markieren"}
          </PrimaryBtn>
        )}
      </div>

      {/* Caller info row */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16,
      }}>
        <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 6, padding: "10px 14px" }}>
          <MonoLabel>Anrufer</MonoLabel>
          <p style={{ margin: 0, fontFamily: FB, fontSize: 13, color: T.textPri }}>
            {call.caller_name || <span style={{ color: T.textTer }}>Nicht erfasst</span>}
          </p>
        </div>
        <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 6, padding: "10px 14px" }}>
          <MonoLabel>Rückrufnummer</MonoLabel>
          <p style={{ margin: 0, fontFamily: FM, fontSize: 13, color: T.textPri }}>
            {call.callback_number || call.from_number || <span style={{ color: T.textTer, fontFamily: FB }}>—</span>}
          </p>
        </div>
        <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 6, padding: "10px 14px" }}>
          <MonoLabel>Eingang</MonoLabel>
          <p style={{ margin: 0, fontFamily: FM, fontSize: 13, color: T.textPri }}>
            {formatPhone(call.to_number)}
          </p>
        </div>
      </div>

      {/* Escalation block */}
      {call.escalated && (
        <InfoBlock label="Eskalation" accent={urgency?.color || T.warn} color={T.textPri}>
          <p style={{ margin: 0 }}>{call.escalation_reason || "Kein Grund angegeben."}</p>
          {urgency && (
            <p style={{ margin: "6px 0 0", fontFamily: FM, fontSize: 10, color: urgency.color, letterSpacing: "0.1em" }}>
              DRINGLICHKEIT: {urgency.label}
            </p>
          )}
        </InfoBlock>
      )}

      {/* Summary */}
      {call.summary
        ? <InfoBlock label="Zusammenfassung" accent={T.accent} color={T.textPri}>{call.summary}</InfoBlock>
        : call.status === "in_progress"
          ? <InfoBlock label="Zusammenfassung" color={T.textTer}>Wird nach Gesprächsende erstellt …</InfoBlock>
          : <InfoBlock label="Zusammenfassung" color={T.textTer}>Noch nicht verfügbar.</InfoBlock>
      }

      {/* Tool actions log */}
      {toolEvents.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <MonoLabel>NILL-Aktionen</MonoLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            {toolEvents.map(t => {
              const ok = !t.tool_result || t.tool_result.ok !== false;
              return (
                <div key={t.id} style={{
                  background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 6,
                  padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: ok ? T.accent : T.danger, flexShrink: 0,
                    }} />
                    <span style={{ fontFamily: FM, fontSize: 11, color: T.textPri, letterSpacing: "0.04em" }}>
                      {t.tool_name?.replace(/_/g, " ")}
                    </span>
                    {t.tool_args && Object.keys(t.tool_args).length > 0 && (
                      <span style={{
                        fontFamily: FM, fontSize: 10, color: T.textTer,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {Object.entries(t.tool_args).slice(0, 3).map(([k, v]) =>
                          `${k}=${typeof v === "string" ? v.slice(0, 30) : JSON.stringify(v).slice(0, 30)}`
                        ).join(" · ")}
                      </span>
                    )}
                  </div>
                  <span style={{ fontFamily: FM, fontSize: 9, color: T.textTer, flexShrink: 0 }}>
                    {t.created_at && new Date(t.created_at).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transcript */}
      <div style={{ marginTop: 4 }}>
        <MonoLabel>Gesprächsverlauf</MonoLabel>
        <div style={{ marginTop: 8 }}>
          <TranscriptView turns={call.turns} />
        </div>
      </div>
    </Drawer>
  );
}

// ─── Inner board (extract me into NILLModule.jsx if you want) ────────────────
export function CallsBoard() {
  const [calls,    setCalls]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [range,    setRange]    = useState("today");
  const [filter,   setFilter]   = useState("all");
  const [selected, setSelected] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [resolving, setResolving] = useState(false);

  useEffect(() => { fetchCalls(); }, []);
  // Polling: refresh list every 20s so live calls show up.
  useEffect(() => {
    const id = setInterval(fetchCalls, 20_000);
    return () => clearInterval(id);
  }, []);

  async function fetchCalls() {
    try {
      const r = await api.get("/calls?limit=200");
      setCalls(Array.isArray(r.data) ? r.data : []);
      setError(null);
    } catch {
      setError("Anrufdaten konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }

  async function loadDetail(id) {
    setLoadingDetail(true);
    try {
      const r = await api.get(`/calls/${id}`);
      setSelected(r.data);
    } catch {
      setError("Anrufdetails konnten nicht geladen werden.");
    } finally {
      setLoadingDetail(false);
    }
  }

  async function handleResolve(id) {
    setResolving(true);
    try {
      const r = await api.post(`/calls/${id}/resolve`);
      setCalls(p => p.map(c => c.id === id ? { ...c, ...r.data } : c));
      if (selected?.id === id) setSelected(s => ({ ...s, ...r.data }));
    } catch {
      setError("Konnte nicht als gelöst markiert werden.");
    } finally {
      setResolving(false);
    }
  }

  // Stats over the full dataset, restricted to the selected window.
  const stats = useMemo(() => computeStats(calls, range), [calls, range]);

  // Filtered list
  const filtered = useMemo(() => {
    const inWin = calls.filter(c => inRange(c, range));
    switch (filter) {
      case "active":     return inWin.filter(c => c.status === "in_progress");
      case "escalated":  return inWin.filter(c => c.escalated);
      case "unresolved": return inWin.filter(c => c.escalated && !(c.extra && c.extra.resolved));
      case "completed":  return inWin.filter(c => c.status === "completed");
      default:           return inWin;
    }
  }, [calls, filter, range]);

  const counts = useMemo(() => {
    const inWin = calls.filter(c => inRange(c, range));
    return {
      all: inWin.length,
      active: inWin.filter(c => c.status === "in_progress").length,
      escalated: inWin.filter(c => c.escalated).length,
      unresolved: inWin.filter(c => c.escalated && !(c.extra && c.extra.resolved)).length,
      completed: inWin.filter(c => c.status === "completed").length,
    };
  }, [calls, range]);

  return (
    <div>
      <SectionTitle
        title="Anrufe"
        subtitle="NILL nimmt Anrufe entgegen, beantwortet Fragen und meldet sich, wenn ein Mensch ran muss."
        action={
          <div style={{ display: "flex", gap: 6 }}>
            <GhostBtn active={range === "today"} onClick={() => setRange("today")}>HEUTE</GhostBtn>
            <GhostBtn active={range === "week"}  onClick={() => setRange("week")}>WOCHE</GhostBtn>
            <GhostBtn active={range === "month"} onClick={() => setRange("month")}>MONAT</GhostBtn>
          </div>
        }
      />

      {error && <ErrorBanner message={error} />}

      <StatsGrid stats={stats} range={range} />
      <InsightsRow stats={stats} />

      <FilterTabs value={filter} onChange={setFilter} counts={counts} />

      {loading
        ? <p style={{ textAlign: "center", padding: 40, fontFamily: FM, fontSize: 11, color: T.textTer }}>LADE …</p>
        : calls.length === 0
        ? <EmptySlate title="Noch keine Anrufe" body="Sobald NILL den ersten Anruf entgegennimmt, erscheint er hier." />
        : <CallsList calls={filtered} onSelect={loadDetail} />
      }

      <AnimatePresence>
        {selected && (
          <CallDrawer
            call={selected}
            onClose={() => setSelected(null)}
            onResolve={handleResolve}
            resolving={resolving}
          />
        )}
        {loadingDetail && !selected && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            zIndex: 250, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <p style={{ fontFamily: FM, fontSize: 12, color: T.textPri, letterSpacing: "0.08em" }}>LADE …</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Default export: standalone page ─────────────────────────────────────────
export default function CallsModule() {
  return (
    <PageLayout>
      <GlobalStyles />
      <div className="nill-root" style={{
        maxWidth: 1180, margin: "0 auto",
        background: T.bg1, border: `1px solid ${T.border}`,
        borderRadius: 10, padding: "32px 36px",
        fontFamily: FONT_BODY, minHeight: "80vh",
      }}>
        <CallsBoard />
      </div>
    </PageLayout>
  );
}
