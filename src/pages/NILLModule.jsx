// src/pages/NILLModule.jsx
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "../components/layout/PageLayout";
import api from "../services/api";

// ─── Design Tokens ────────────────────────────────────────────────────────────
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

const GOOGLE_FONTS = "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap";

// ─── Global Styles injected once ─────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('${GOOGLE_FONTS}');
.nill-root * { box-sizing: border-box; }
.nill-root input, .nill-root textarea, .nill-root select {
  background: ${T.bg2};
  color: ${T.textPri};
  border: 1px solid ${T.border};
  border-radius: 6px;
  padding: 10px 14px;
  font-family: ${FONT_BODY};
  font-size: 13px;
  width: 100%;
  outline: none;
  transition: border-color 0.15s;
}
.nill-root input::placeholder, .nill-root textarea::placeholder {
  color: ${T.textSec};
  opacity: 1;
}
.nill-root input:focus, .nill-root textarea:focus {
  border-color: ${T.borderHi};
}
.nill-root label {
  display: block;
  font-family: ${FONT_MONO};
  font-size: 11px;
  color: ${T.textSec};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.nill-scrollbar::-webkit-scrollbar { width: 4px; }
.nill-scrollbar::-webkit-scrollbar-track { background: transparent; }
.nill-scrollbar::-webkit-scrollbar-thumb { background: ${T.bg3}; border-radius: 4px; }
.nill-card-hover { transition: border-color 0.15s, background 0.15s; }
.nill-card-hover:hover { border-color: ${T.borderHi} !important; background: ${T.bg2} !important; }
.nill-upload-zone { transition: border-color 0.15s, background 0.15s; }
.nill-upload-zone:hover { border-color: ${T.borderHi} !important; background: ${T.bg2} !important; cursor: pointer; }
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

// ─── Module config ────────────────────────────────────────────────────────────
const MODULES = [
  { id: "overview",     label: "Übersicht",           tag: "01" },
  { id: "applications", label: "Bewerbungen",          tag: "02" },
  { id: "travel",       label: "Geschäftsreisen",      tag: "03" },
  { id: "contracts",    label: "Verträge",             tag: "04" },
  { id: "onboarding",   label: "Onboarding",           tag: "05" },
  { id: "competitors",  label: "Wettbewerber",         tag: "06" },
  { id: "meetings",     label: "Meeting-Vorbereitung", tag: "07" },
];

const STATUS_APP = {
  new:         { label: "NEU",         color: T.info,   dim: T.infoDim   },
  interesting: { label: "INTERESSANT", color: T.accent, dim: T.accentDim },
  interview:   { label: "INTERVIEW",   color: T.purple, dim: T.purpleDim },
  rejected:    { label: "ABGELEHNT",   color: T.danger, dim: T.dangerDim },
  hired:       { label: "EINGESTELLT", color: T.accent, dim: T.accentDim },
};

// ─── Shared primitives ────────────────────────────────────────────────────────

function Tag2({ children, color = T.textSec, dim = T.bg3 }) {
  return (
    <span style={{
      display: "inline-block",
      background: dim,
      color,
      border: `1px solid ${color}40`,
      borderRadius: 3,
      padding: "2px 8px",
      fontFamily: FONT_MONO,
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: "0.1em",
    }}>{children}</span>
  );
}

function ScoreRing({ score }) {
  const color =
    score >= 90 ? T.accent :
    score >= 75 ? T.info :
    score >= 60 ? T.warn :
    score >= 40 ? T.warn : T.danger;
  return (
    <div style={{
      width: 46, height: 46, borderRadius: "50%",
      border: `2px solid ${color}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <span style={{ fontFamily: FONT_MONO, fontSize: 13, fontWeight: 500, color }}>{Math.round(score)}</span>
    </div>
  );
}

function StatusPill({ status, onChange }) {
  const cfg = STATUS_APP[status] || STATUS_APP.new;
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button onClick={e => { e.stopPropagation(); setOpen(o => !o); }} style={{
        background: cfg.dim, color: cfg.color,
        border: `1px solid ${cfg.color}50`,
        borderRadius: 3, padding: "3px 10px",
        fontFamily: FONT_MONO, fontSize: 10, fontWeight: 500,
        letterSpacing: "0.08em", cursor: "pointer",
      }}>{cfg.label} ↓</button>
      {open && (
        <div onClick={e => e.stopPropagation()} style={{
          position: "absolute", top: "110%", left: 0, zIndex: 200,
          background: T.bg2, border: `1px solid ${T.border}`,
          borderRadius: 6, overflow: "hidden", minWidth: 160,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}>
          {Object.entries(STATUS_APP).map(([k, v]) => (
            <button key={k} onClick={() => { onChange(k); setOpen(false); }} style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "9px 14px", background: "none", border: "none",
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.08em",
              color: status === k ? v.color : T.textSec, cursor: "pointer",
              borderBottom: `1px solid ${T.border}`,
            }}>{v.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: T.border, margin: "24px 0" }} />;
}

function MonoLabel2({ children }) {
  return (
    <p style={{
      margin: "0 0 6px",
      fontFamily: FONT_MONO, fontSize: 10, fontWeight: 500,
      color: T.textTer, letterSpacing: "0.12em", textTransform: "uppercase",
    }}>{children}</p>
  );
}

function SectionTitle({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
      <div>
        <h2 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, color: T.textPri, letterSpacing: "-0.02em" }}>{title}</h2>
        {subtitle && <p style={{ margin: "5px 0 0", fontFamily: FONT_MONO, fontSize: 11, color: T.textSec }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function PrimaryBtn2({ onClick, disabled, children, color = T.accent }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: color + "18",
      color,
      border: `1px solid ${color}60`,
      borderRadius: 6, padding: "9px 20px",
      fontFamily: FONT_MONO, fontSize: 11, fontWeight: 500,
      letterSpacing: "0.06em", cursor: "pointer",
      transition: "background 0.15s, border-color 0.15s",
      opacity: disabled ? 0.5 : 1,
      whiteSpace: "nowrap",
    }}
      onMouseEnter={e => { e.currentTarget.style.background = color + "30"; e.currentTarget.style.borderColor = color + "99"; }}
      onMouseLeave={e => { e.currentTarget.style.background = color + "18"; e.currentTarget.style.borderColor = color + "60"; }}
    >{children}</button>
  );
}

function GhostBtn2({ onClick, children }) {
  return (
    <button onClick={onClick} style={{
      background: "none", color: T.textSec,
      border: `1px solid ${T.border}`,
      borderRadius: 6, padding: "9px 20px",
      fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.06em", cursor: "pointer",
      transition: "color 0.15s, border-color 0.15s",
    }}
      onMouseEnter={e => { e.currentTarget.style.color = T.textPri; e.currentTarget.style.borderColor = T.borderHi; }}
      onMouseLeave={e => { e.currentTarget.style.color = T.textSec; e.currentTarget.style.borderColor = T.border; }}
    >{children}</button>
  );
}

function Card({ onClick, children, style = {} }) {
  return (
    <div
      onClick={onClick}
      className={onClick ? "nill-card-hover" : ""}
      style={{
        background: T.bg1, border: `1px solid ${T.border}`,
        borderRadius: 8, padding: "18px 22px",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >{children}</div>
  );
}

function FormGrid({ children, cols = 2 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 14 }}>
      {children}
    </div>
  );
}

function FormField2({ label, value, onChange, type = "text", placeholder = "", rows }) {
  return (
    <div>
      <label>{label}</label>
      {rows
        ? <textarea rows={rows} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
        : <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
      }
    </div>
  );
}

function UploadZone({ onFiles, loading, accept = ".pdf", label, sublabel }) {
  const ref = useRef();
  return (
    <div
      ref={ref}
      className="nill-upload-zone"
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); Array.from(e.dataTransfer.files).forEach(onFiles); }}
      onClick={() => ref.current?.querySelector("input")?.click()}
      style={{
        border: `1px dashed ${T.border}`,
        borderRadius: 8, padding: "28px 24px",
        textAlign: "center", background: T.bg1, marginBottom: 20,
      }}
    >
      <input type="file" accept={accept} multiple style={{ display: "none" }} onChange={e => Array.from(e.target.files).forEach(onFiles)} />
      {loading ? (
        <p style={{ margin: 0, fontFamily: FONT_MONO, fontSize: 12, color: T.accent, letterSpacing: "0.06em" }}>NILL ANALYSIERT ...</p>
      ) : (
        <>
          <p style={{ margin: "0 0 4px", fontFamily: FONT_MONO, fontSize: 12, color: T.textPri, letterSpacing: "0.04em" }}>{label || "DATEI ABLEGEN ODER KLICKEN"}</p>
          {sublabel && <p style={{ margin: 0, fontFamily: FONT_MONO, fontSize: 10, color: T.textTer }}>{sublabel}</p>}
        </>
      )}
    </div>
  );
}

function EmptySlate({ title, body }) {
  return (
    <div style={{ textAlign: "center", padding: "52px 24px", border: `1px dashed ${T.border}`, borderRadius: 8 }}>
      <div style={{ width: 1, height: 40, background: T.border, margin: "0 auto 20px" }} />
      <p style={{ margin: "0 0 8px", fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 600, color: T.textSec }}>{title}</p>
      {body && <p style={{ margin: 0, fontFamily: FONT_MONO, fontSize: 11, color: T.textTer }}>{body}</p>}
    </div>
  );
}

function ErrorBanner({ message }) {
  return (
    <div style={{ background: T.dangerDim, border: `1px solid ${T.danger}40`, borderRadius: 6, padding: "10px 14px", marginBottom: 14 }}>
      <p style={{ margin: 0, fontFamily: FONT_MONO, fontSize: 11, color: T.danger }}>{message}</p>
    </div>
  );
}

function Drawer2({ onClose, title, subtitle, maxWidth = 580, children }) {
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
            <h2 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, color: T.textPri, letterSpacing: "-0.02em" }}>{title}</h2>
            {subtitle && <p style={{ margin: "4px 0 0", fontFamily: FONT_MONO, fontSize: 11, color: T.textSec }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.textTer, fontSize: 18, cursor: "pointer", lineHeight: 1, padding: 4, marginLeft: 16 }}>✕</button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

function InfoBlock({ label, children, color = T.textSec }) {
  return (
    <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 6, padding: "12px 16px", marginBottom: 12 }}>
      <MonoLabel>{label}</MonoLabel>
      <div style={{ fontFamily: FONT_BODY, fontSize: 13, color, lineHeight: 1.65 }}>{children}</div>
    </div>
  );
}

function TwoCol({ left, right }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
      {left}
      {right}
    </div>
  );
}

function FormPanel({ title, onSubmit, onCancel, submitLabel, submitColor = T.accent, children }) {
  return (
    <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "20px 24px", marginBottom: 20 }}>
      <p style={{ margin: "0 0 18px", fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 600, color: T.textPri }}>{title}</p>
      {children}
      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <PrimaryBtn onClick={onSubmit} color={submitColor}>{submitLabel}</PrimaryBtn>
        <GhostBtn onClick={onCancel}>Abbrechen</GhostBtn>
      </div>
    </div>
  );
}

// ─── Overview ─────────────────────────────────────────────────────────────────

function OverviewModule({ nillNotifications, dailySummary }) {
  const pending = nillNotifications.filter(n => n.requires_action);
  const stats = [
    { label: "OFFENE AKTIONEN",   value: pending.length },
    { label: "BEWERBUNGEN HEUTE", value: dailySummary?.applications?.total_received ?? "—" },
    { label: "Ø BEWERBER-SCORE",  value: dailySummary?.applications?.average_score  ?? "—" },
    { label: "REISEN AUSSTEHEND", value: dailySummary?.travel?.pending              ?? "—" },
  ];
  return (
    <div>
      <SectionTitle title="Übersicht" subtitle={`Stand: ${new Date().toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "long" })}`} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 1, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: T.bg2, padding: "18px 20px", borderRight: i < stats.length - 1 ? `1px solid ${T.border}` : "none" }}>
            <p style={{ margin: "0 0 8px", fontFamily: FONT_MONO, fontSize: 9, color: T.textTer, letterSpacing: "0.12em" }}>{s.label}</p>
            <p style={{ margin: 0, fontFamily: FONT_MONO, fontSize: 28, fontWeight: 500, color: T.textPri, lineHeight: 1 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {dailySummary?.message && (
        <>
          <MonoLabel>Tagesabschluss</MonoLabel>
          <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.accent}`, borderRadius: "0 6px 6px 0", padding: "14px 18px", marginBottom: 28 }}>
            <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 13, color: T.textPri, lineHeight: 1.65 }}>{dailySummary.message}</p>
          </div>
        </>
      )}

      <MonoLabel>Offene Aktionen</MonoLabel>
      {pending.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {pending.map((n, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, background: T.warnDim, border: `1px solid ${T.warn}40`, borderRadius: 6, padding: "12px 16px" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.warn, flexShrink: 0 }} />
              <p style={{ flex: 1, margin: 0, fontFamily: FONT_BODY, fontSize: 13, color: T.textPri }}>{n.message}</p>
              <Tag color={T.warn} dim={T.warnDim}>AKTION</Tag>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 6, padding: "14px 18px" }}>
          <p style={{ margin: 0, fontFamily: FONT_MONO, fontSize: 11, color: T.textTer }}>KEINE OFFENEN AKTIONEN</p>
        </div>
      )}
    </div>
  );
}

// ─── Applications ─────────────────────────────────────────────────────────────

function ApplicationsModule() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => { fetchApps(); }, [filterStatus]);

  async function fetchApps() {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (filterStatus) p.set("status", filterStatus);
      const res = await api.get(`/nill/applications?${p}`);
      setApplications(res.data);
    } catch { setError("Fehler beim Laden."); }
    finally { setLoading(false); }
  }

  async function handleUpload(file) {
    setUploading(true); setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      if (position) form.append("position", position);
      const res = await api.post("/nill/applications/upload", form, { headers: { "Content-Type": "multipart/form-data" } });
      setApplications(prev => [res.data, ...prev]);
    } catch { setError("Upload fehlgeschlagen."); }
    finally { setUploading(false); }
  }

  async function handleStatusChange(id, status) {
    try {
      const res = await api.patch(`/nill/applications/${id}/status`, { status });
      setApplications(prev => prev.map(a => a.id === id ? res.data : a));
      if (selected?.id === id) setSelected(res.data);
    } catch {}
  }

  const filters = ["", "new", "interesting", "interview", "rejected", "hired"];
  const filterLabels = { "": "ALLE", new: "NEU", interesting: "INTERESSANT", interview: "INTERVIEW", rejected: "ABGELEHNT", hired: "EINGESTELLT" };

  return (
    <div>
      <SectionTitle title="Bewerbungen" subtitle={`${applications.length} Eingang${applications.length !== 1 ? "änge" : ""} gesamt`} />

      {/* Filter row */}
      <div style={{ display: "flex", gap: 2, marginBottom: 20, background: T.bg2, borderRadius: 6, padding: 3, border: `1px solid ${T.border}` }}>
        {filters.map(s => {
          const active = filterStatus === s;
          return (
            <button key={s} onClick={() => setFilterStatus(s)} style={{
              flex: 1, padding: "7px 4px",
              background: active ? T.bg3 : "none",
              border: active ? `1px solid ${T.border}` : "1px solid transparent",
              borderRadius: 4,
              fontFamily: FONT_MONO, fontSize: 9, letterSpacing: "0.08em",
              color: active ? T.textPri : T.textTer, cursor: "pointer",
              transition: "all 0.12s",
            }}>{filterLabels[s]}</button>
          );
        })}
      </div>

      <UploadZone onFiles={handleUpload} loading={uploading} sublabel="PDF · Lebenslauf oder Anschreiben" />
      <div style={{ marginTop: -12, marginBottom: 20 }}>
        <input
          type="text" placeholder="Stelle (optional)"
          value={position} onChange={e => setPosition(e.target.value)}
          style={{ background: T.bg2, color: T.textPri, border: `1px solid ${T.border}`, borderRadius: 6, padding: "9px 14px", fontFamily: FONT_BODY, fontSize: 13, width: "100%", outline: "none" }}
        />
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <p style={{ textAlign: "center", padding: 40, fontFamily: FONT_MONO, fontSize: 11, color: T.textTer }}>LADE ...</p>
      ) : applications.length === 0 ? (
        <EmptySlate title="Keine Bewerbungen" body="PDF hochladen — NILL analysiert und bewertet automatisch" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {applications.map((app, i) => {
            const cfg = STATUS_APP[app.status] || STATUS_APP.new;
            return (
              <div
                key={app.id}
                className="nill-card-hover"
                onClick={() => setSelected(app)}
                style={{
                  background: T.bg1, border: `1px solid ${T.border}`,
                  borderRadius: i === 0 ? "8px 8px 2px 2px" : i === applications.length - 1 ? "2px 2px 8px 8px" : 2,
                  padding: "16px 20px", cursor: "pointer", display: "flex", gap: 16, alignItems: "center",
                }}
              >
                <ScoreRing score={app.ai_score ?? 0} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                    <span style={{ fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 600, color: T.textPri }}>{app.candidate_name}</span>
                    {app.position && <Tag>{app.position}</Tag>}
                  </div>
                  <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 12, color: T.textSec, lineHeight: 1.5 }}>
                    {app.ai_summary?.slice(0, 120)}{app.ai_summary?.length > 120 ? "…" : ""}
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                  <StatusPill status={app.status} onChange={s => handleStatusChange(app.id, s)} />
                  <span style={{ fontFamily: FONT_MONO, fontSize: 9, color: T.textTer }}>
                    {app.uploaded_at ? new Date(app.uploaded_at).toLocaleDateString("de-DE") : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <Drawer onClose={() => setSelected(null)} title={selected.candidate_name} subtitle={selected.position ? `Bewerbung · ${selected.position}` : "Bewerbung"} maxWidth={600}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <ScoreRing score={selected.ai_score ?? 0} />
              <div>
                {selected.email && <p style={{ margin: 0, fontFamily: FONT_MONO, fontSize: 11, color: T.textSec }}>{selected.email}</p>}
                <StatusPill status={selected.status} onChange={s => handleStatusChange(selected.id, s)} />
              </div>
            </div>
            <InfoBlock label="Zusammenfassung" color={T.textPri}>{selected.ai_summary}</InfoBlock>
            <TwoCol
              left={
                <InfoBlock label="Stärken" color={T.accent}>
                  <ul style={{ margin: 0, padding: "0 0 0 14px" }}>
                    {(selected.ai_strengths || []).map((s, i) => <li key={i} style={{ marginBottom: 4 }}>{s}</li>)}
                  </ul>
                </InfoBlock>
              }
              right={
                <InfoBlock label="Schwächen" color={T.danger}>
                  <ul style={{ margin: 0, padding: "0 0 0 14px" }}>
                    {(selected.ai_weaknesses || []).map((w, i) => <li key={i} style={{ marginBottom: 4 }}>{w}</li>)}
                  </ul>
                </InfoBlock>
              }
            />
            <InfoBlock label="NILL-Empfehlung" color={T.info}>{selected.ai_recommendation}</InfoBlock>
          </Drawer>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Travel ───────────────────────────────────────────────────────────────────

const TRAVEL_STATUS = {
  pending_approval: { label: "WARTET",    color: T.warn,   dim: T.warnDim   },
  approved:         { label: "GENEHMIGT", color: T.accent, dim: T.accentDim },
  booked:           { label: "GEBUCHT",   color: T.info,   dim: T.infoDim   },
  cancelled:        { label: "ABGELEHNT", color: T.danger, dim: T.dangerDim },
};

// ─── Primitive components ─────────────────────────────────────────────────────

function Tag2({ children, color = T.textSec, dim = T.bg3 }) {
  return (
    <span style={{ display: "inline-block", background: dim, color, border: `1px solid ${color}40`, borderRadius: 3, padding: "2px 8px", fontFamily: FM, fontSize: 10, fontWeight: 500, letterSpacing: "0.1em" }}>
      {children}
    </span>
  );
}

function MonoLabel2({ children, color = T.textTer }) {
  return <p style={{ margin: "0 0 6px", fontFamily: FM, fontSize: 10, fontWeight: 500, color, letterSpacing: "0.12em", textTransform: "uppercase" }}>{children}</p>;
}

function Row({ label, value, valueColor = T.textPri, mono = false }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "6px 0", borderBottom: `1px solid ${T.border}` }}>
      <span style={{ fontFamily: FM, fontSize: 11, color: T.textTer }}>{label}</span>
      <span style={{ fontFamily: mono ? FM : FB, fontSize: mono ? 12 : 13, color: valueColor, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function PrimaryBtn2({ onClick, disabled, color = T.accent, children, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ background: color + "18", color, border: `1px solid ${color}60`, borderRadius: 6, padding: "9px 20px", fontFamily: FM, fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, transition: "all 0.15s", ...style }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = color + "30"; e.currentTarget.style.borderColor = color + "99"; } }}
      onMouseLeave={e => { e.currentTarget.style.background = color + "18"; e.currentTarget.style.borderColor = color + "60"; }}
    >{children}</button>
  );
}

function GhostBtn2({ onClick, children }) {
  return (
    <button onClick={onClick} style={{ background: "none", color: T.textSec, border: `1px solid ${T.border}`, borderRadius: 6, padding: "9px 20px", fontFamily: FM, fontSize: 11, letterSpacing: "0.06em", cursor: "pointer", transition: "all 0.15s" }}
      onMouseEnter={e => { e.currentTarget.style.color = T.textPri; e.currentTarget.style.borderColor = T.borderHi; }}
      onMouseLeave={e => { e.currentTarget.style.color = T.textSec; e.currentTarget.style.borderColor = T.border; }}
    >{children}</button>
  );
}

function Block({ label, children, accent }) {
  return (
    <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderLeft: accent ? `2px solid ${accent}` : undefined, borderRadius: accent ? "0 6px 6px 0" : 6, padding: "14px 16px", marginBottom: 12 }}>
      {label && <MonoLabel>{label}</MonoLabel>}
      {children}
    </div>
  );
}

function Drawer2({ onClose, title, subtitle, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 10, width: "100%", maxWidth: 720, maxHeight: "90vh", overflowY: "auto", padding: "28px 32px" }}
        className="nill-scrollbar">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: 0, fontFamily: FB, fontSize: 18, fontWeight: 700, color: T.textPri, letterSpacing: "-0.02em" }}>{title}</h2>
            {subtitle && <p style={{ margin: "4px 0 0", fontFamily: FM, fontSize: 11, color: T.textSec }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.textTer, fontSize: 18, cursor: "pointer", padding: 4, marginLeft: 16 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Travel Plan Sections ─────────────────────────────────────────────────────

function TransportLeg({ leg, title }) {
  if (!leg?.options?.length) return null;
  const [selectedIdx, setSelectedIdx] = useState(0);
  const opt = leg.options[selectedIdx];

  return (
    <Block label={title} accent={T.info}>
      {/* Option selector */}
      {leg.options.length > 1 && (
        <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
          {leg.options.map((o, i) => (
            <button key={i} onClick={() => setSelectedIdx(i)} style={{ padding: "4px 12px", fontFamily: FM, fontSize: 10, letterSpacing: "0.06em", borderRadius: 4, cursor: "pointer", border: `1px solid ${i === selectedIdx ? T.info : T.border}`, background: i === selectedIdx ? T.infoDim : "none", color: i === selectedIdx ? T.info : T.textTer, transition: "all 0.12s" }}>
              {o.label}
            </button>
          ))}
        </div>
      )}

      {/* Selected option detail */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div>
          <p style={{ margin: 0, fontFamily: FM, fontSize: 11, color: T.textTer }}>Abfahrt</p>
          <p style={{ margin: "2px 0 0", fontFamily: FM, fontSize: 20, fontWeight: 500, color: T.textPri }}>{opt.departure_time}</p>
          <p style={{ margin: "2px 0 0", fontFamily: FB, fontSize: 12, color: T.textSec }}>{opt.departure_station}</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ margin: 0, fontFamily: FM, fontSize: 10, color: T.textTer }}>{Math.floor(opt.duration_minutes / 60)}h {opt.duration_minutes % 60}min</p>
          <div style={{ height: 1, background: T.border, margin: "6px 0", position: "relative" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: T.bg2, padding: "0 6px", fontFamily: FM, fontSize: 9, color: T.textTer }}>
              {opt.changes === 0 ? "DIREKT" : `${opt.changes}× UMSTIEG`}
            </div>
          </div>
          <p style={{ margin: 0, fontFamily: FM, fontSize: 10, color: T.accent, fontWeight: 500 }}>{opt.carrier}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontFamily: FM, fontSize: 11, color: T.textTer }}>Ankunft</p>
          <p style={{ margin: "2px 0 0", fontFamily: FM, fontSize: 20, fontWeight: 500, color: T.textPri }}>{opt.arrival_time}</p>
          <p style={{ margin: "2px 0 0", fontFamily: FB, fontSize: 12, color: T.textSec }}>{opt.arrival_station}</p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: FM, fontSize: 11, color: T.textSec }}>{opt.price_type}</span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontFamily: FM, fontSize: 22, fontWeight: 500, color: T.textPri }}>{opt.price_eur?.toFixed(2)} EUR</span>
          {opt.booking_url && (
            <a href={opt.booking_url} target="_blank" rel="noreferrer" style={{ fontFamily: FM, fontSize: 10, color: T.info, textDecoration: "none", border: `1px solid ${T.info}40`, borderRadius: 3, padding: "2px 8px" }}>BUCHEN</a>
          )}
        </div>
      </div>
    </Block>
  );
}

function HotelSection({ hotels }) {
  if (!hotels?.length) return null;
  const [selectedIdx, setSelectedIdx] = useState(0);
  const h = hotels[selectedIdx];

  return (
    <Block label="Hotel" accent={T.purple}>
      {hotels.length > 1 && (
        <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
          {hotels.map((hotel, i) => (
            <button key={i} onClick={() => setSelectedIdx(i)} style={{ padding: "4px 12px", fontFamily: FM, fontSize: 10, letterSpacing: "0.06em", borderRadius: 4, cursor: "pointer", border: `1px solid ${i === selectedIdx ? T.purple : T.border}`, background: i === selectedIdx ? T.purpleDim : "none", color: i === selectedIdx ? T.purple : T.textTer, transition: "all 0.12s" }}>
              {hotel.name}
            </button>
          ))}
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <div>
            <p style={{ margin: 0, fontFamily: FB, fontSize: 15, fontWeight: 600, color: T.textPri }}>{h.name}</p>
            <p style={{ margin: "3px 0 0", fontFamily: FM, fontSize: 11, color: T.textSec }}>{h.address}</p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
            <p style={{ margin: 0, fontFamily: FM, fontSize: 18, fontWeight: 500, color: T.textPri }}>{h.total_price_eur?.toFixed(0)} EUR</p>
            <p style={{ margin: "2px 0 0", fontFamily: FM, fontSize: 10, color: T.textTer }}>{h.nights} Nächte · {h.price_per_night_eur?.toFixed(0)} EUR/Nacht</p>
          </div>
        </div>

        {h.distance_to_venue && (
          <p style={{ margin: "0 0 8px", fontFamily: FM, fontSize: 10, color: T.accent }}>{h.distance_to_venue}</p>
        )}

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
          {(h.amenities || []).map((a, i) => <Tag key={i} color={T.textSec} dim={T.bg3}>{a}</Tag>)}
          {h.breakfast_included
            ? <Tag color={T.accent} dim={T.accentDim}>Frühstück inklusive</Tag>
            : h.breakfast_price_eur
              ? <Tag color={T.textTer} dim={T.bg3}>Frühstück +{h.breakfast_price_eur?.toFixed(2)} EUR</Tag>
              : null
          }
        </div>

        {h.booking_url && (
          <a href={h.booking_url} target="_blank" rel="noreferrer" style={{ fontFamily: FM, fontSize: 10, color: T.info, textDecoration: "none", border: `1px solid ${T.info}40`, borderRadius: 3, padding: "3px 10px", display: "inline-block" }}>HOTEL BUCHEN</a>
        )}
      </div>
    </Block>
  );
}

function TransferSection({ transfers }) {
  if (!transfers?.length) return null;
  return (
    <Block label="Transfer">
      {transfers.map((t, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < transfers.length - 1 ? `1px solid ${T.border}` : "none" }}>
          <div>
            <p style={{ margin: 0, fontFamily: FB, fontSize: 13, color: T.textPri }}>{t.type}</p>
            <p style={{ margin: "2px 0 0", fontFamily: FM, fontSize: 10, color: T.textTer }}>
              {t.from_ || t.from} → {t.to}
              {t.line ? ` · ${t.line}` : ""}
              {t.notes ? ` · ${t.notes}` : ""}
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
            <p style={{ margin: 0, fontFamily: FM, fontSize: 13, fontWeight: 500, color: T.textPri }}>{t.price_eur?.toFixed(2)} EUR</p>
            <p style={{ margin: "2px 0 0", fontFamily: FM, fontSize: 10, color: T.textTer }}>{t.duration_minutes} Min.</p>
          </div>
        </div>
      ))}
    </Block>
  );
}

function RestaurantSection({ restaurants }) {
  if (!restaurants?.length) return null;
  return (
    <Block label="Verpflegung">
      {restaurants.map((r, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "8px 0", borderBottom: i < restaurants.length - 1 ? `1px solid ${T.border}` : "none" }}>
          <div>
            <p style={{ margin: 0, fontFamily: FB, fontSize: 13, color: T.textPri }}>{r.name}</p>
            <p style={{ margin: "2px 0 0", fontFamily: FM, fontSize: 10, color: T.textTer }}>{r.cuisine}{r.address ? ` · ${r.address}` : ""}</p>
            {r.notes && <p style={{ margin: "3px 0 0", fontFamily: FB, fontSize: 12, color: T.textSec }}>{r.notes}</p>}
          </div>
          <div style={{ flexShrink: 0, marginLeft: 12, textAlign: "right" }}>
            <Tag color={T.warn} dim={T.warnDim}>{r.price_range}</Tag>
            {r.avg_price_per_person_eur && <p style={{ margin: "4px 0 0", fontFamily: FM, fontSize: 10, color: T.textTer }}>~{r.avg_price_per_person_eur?.toFixed(0)} EUR/P.</p>}
          </div>
        </div>
      ))}
    </Block>
  );
}

function CostSection({ breakdown }) {
  if (!breakdown) return null;
  const rows = [
    { label: "Hinreise",     min: breakdown.transport_outbound_min, max: breakdown.transport_outbound_max },
    { label: "Rückreise",    min: breakdown.transport_return_min,   max: breakdown.transport_return_max   },
    { label: "Hotel",        min: breakdown.hotel_min,              max: breakdown.hotel_max              },
    { label: "Transfers",    min: breakdown.transfers_estimated,    max: breakdown.transfers_estimated    },
    { label: "Verpflegung",  min: breakdown.meals_estimated,        max: breakdown.meals_estimated        },
  ];

  return (
    <Block label="Kostenzusammenfassung" accent={breakdown.within_budget ? T.accent : T.danger}>
      {rows.map(r => (
        <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontFamily: FM, fontSize: 11, color: T.textTer }}>{r.label}</span>
          <span style={{ fontFamily: FM, fontSize: 11, color: T.textSec }}>
            {r.min === r.max ? `${r.min?.toFixed(2)} EUR` : `${r.min?.toFixed(2)} – ${r.max?.toFixed(2)} EUR`}
          </span>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 4px" }}>
        <span style={{ fontFamily: FM, fontSize: 12, fontWeight: 500, color: T.textPri }}>GESAMT</span>
        <span style={{ fontFamily: FM, fontSize: 14, fontWeight: 500, color: T.textPri }}>
          {breakdown.total_min?.toFixed(0)} – {breakdown.total_max?.toFixed(0)} EUR
        </span>
      </div>
      {breakdown.budget_eur && (
        <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 4 }}>
          <span style={{ fontFamily: FM, fontSize: 11, color: T.textTer }}>BUDGET</span>
          <span style={{ fontFamily: FM, fontSize: 11, color: T.textTer }}>{breakdown.budget_eur?.toFixed(0)} EUR</span>
        </div>
      )}
      {breakdown.buffer_eur !== undefined && (
        <div style={{ marginTop: 8, background: breakdown.within_budget ? T.accentDim : T.dangerDim, border: `1px solid ${breakdown.within_budget ? T.accent : T.danger}40`, borderRadius: 4, padding: "6px 10px" }}>
          <p style={{ margin: 0, fontFamily: FM, fontSize: 10, color: breakdown.within_budget ? T.accent : T.danger }}>
            {breakdown.within_budget
              ? `PUFFER: ${breakdown.buffer_eur?.toFixed(0)} EUR · Im Budget`
              : `BUDGET-ÜBERSCHREITUNG: ~${Math.abs(breakdown.buffer_eur)?.toFixed(0)} EUR`
            }
          </p>
        </div>
      )}
    </Block>
  );
}

// ─── Reject Modal ─────────────────────────────────────────────────────────────

function RejectModal({ onConfirm, onCancel }) {
  const [reason, setReason] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}>
      <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 10, width: "100%", maxWidth: 420, padding: "24px 28px" }}>
        <p style={{ margin: "0 0 16px", fontFamily: FB, fontSize: 16, fontWeight: 600, color: T.textPri }}>Reiseplan ablehnen</p>
        <label style={{ display: "block", fontFamily: FM, fontSize: 10, color: T.textTer, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Ablehnungsgrund (optional)</label>
        <textarea
          rows={3}
          placeholder="z.B. Budget zu hoch, falsches Hotel, anderer Termin ..."
          value={reason}
          onChange={e => setReason(e.target.value)}
          style={{ width: "100%", background: T.bg2, color: T.textPri, border: `1px solid ${T.border}`, borderRadius: 6, padding: "9px 12px", fontFamily: FB, fontSize: 13, resize: "vertical", outline: "none", boxSizing: "border-box" }}
        />
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <PrimaryBtn onClick={() => onConfirm(reason)} color={T.danger}>Ablehnen</PrimaryBtn>
          <GhostBtn onClick={onCancel}>Abbrechen</GhostBtn>
        </div>
      </div>
    </div>
  );
}

// ─── Plan Detail Drawer ───────────────────────────────────────────────────────

function TravelPlanDrawer({ trip, onClose, onConfirm, onReject, onRegenerate }) {
  const plan    = trip.ai_plan;
  const cfg     = TRAVEL_STATUS[trip.status] || TRAVEL_STATUS.pending_approval;
  const isPending = trip.status === "pending_approval";

  return (
    <Drawer onClose={onClose} title={`${trip.destination}`} subtitle={`${trip.departure_date || "—"} → ${trip.return_date || "—"} · ${trip.purpose || ""}`}>

      {/* Status + Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Tag color={cfg.color} dim={cfg.dim}>{cfg.label}</Tag>
        <div style={{ display: "flex", gap: 8 }}>
          {isPending && (
            <>
              <PrimaryBtn onClick={onReject} color={T.danger}>Ablehnen</PrimaryBtn>
              <PrimaryBtn onClick={onConfirm} color={T.accent}>Bestätigen</PrimaryBtn>
            </>
          )}
          <GhostBtn onClick={onRegenerate}>Plan neu generieren</GhostBtn>
        </div>
      </div>

      {trip.rejection_reason && (
        <div style={{ background: T.dangerDim, border: `1px solid ${T.danger}40`, borderRadius: 6, padding: "10px 14px", marginBottom: 16 }}>
          <MonoLabel color={T.danger}>Ablehnungsgrund</MonoLabel>
          <p style={{ margin: 0, fontFamily: FB, fontSize: 13, color: T.textPri }}>{trip.rejection_reason}</p>
        </div>
      )}

      {!plan ? (
        <div style={{ background: T.warnDim, border: `1px solid ${T.warn}40`, borderRadius: 6, padding: "14px 18px" }}>
          <p style={{ margin: 0, fontFamily: FM, fontSize: 11, color: T.warn }}>
            KEIN PLAN VERFÜGBAR — Plan neu generieren um aktuelle Verbindungen und Preise zu laden.
          </p>
        </div>
      ) : (
        <>
          {/* NILL Summary */}
          {plan.summary && (
            <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderLeft: `2px solid ${T.accent}`, borderRadius: "0 6px 6px 0", padding: "12px 16px", marginBottom: 16 }}>
              <MonoLabel>NILL-Zusammenfassung</MonoLabel>
              <p style={{ margin: 0, fontFamily: FB, fontSize: 13, color: T.textPri, lineHeight: 1.65 }}>{plan.summary}</p>
            </div>
          )}

          {/* Transport */}
          <TransportLeg leg={plan.outbound}        title="Hinreise" />
          <TransportLeg leg={plan.return_journey}  title="Rückreise" />

          {/* Hotel */}
          <HotelSection hotels={plan.hotels} />

          {/* Transfer */}
          <TransferSection transfers={plan.transfers} />

          {/* Restaurants */}
          <RestaurantSection restaurants={plan.restaurants} />

          {/* Cost Breakdown */}
          <CostSection breakdown={plan.cost_breakdown} />

          {/* NILL Recommendation */}
          {plan.nill_recommendation && (
            <Block label="NILL-Empfehlung" accent={T.accent}>
              <p style={{ margin: 0, fontFamily: FB, fontSize: 13, color: T.textPri, lineHeight: 1.65 }}>{plan.nill_recommendation}</p>
            </Block>
          )}
        </>
      )}
    </Drawer>
  );
}

  const [loading,     setLoading]     = useState(true);
  const [showForm,    setShowForm]    = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [selected,    setSelected]    = useState(null);
  const [showReject,  setShowReject]  = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [form, setForm] = useState({ destination: "", origin: "", purpose: "", departure_date: "", return_date: "", budget: "", notes: "" });

  useEffect(() => {
    api.get("/nill/travel").then(r => setTrips(r.data)).finally(() => setLoading(false));
  }, []);

  const f = k => v => setForm(p => ({ ...p, [k]: v }));

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const r = await api.post("/nill/travel", form);
      setTrips(p => [r.data, ...p]);
      setShowForm(false);
      setForm({ destination: "", origin: "", purpose: "", departure_date: "", return_date: "", budget: "", notes: "" });
      setSelected(r.data);  // open the new plan immediately
    } catch (e) {
      alert("Fehler beim Erstellen der Reiseanfrage.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirm() {
    if (!selected) return;
    const r = await api.patch(`/nill/travel/${selected.id}/confirm`);
    const updated = r.data;
    setTrips(p => p.map(t => t.id === selected.id ? updated : t));
    setSelected(updated);
  }

  async function handleReject(reason) {
    if (!selected) return;
    const r = await api.patch(`/nill/travel/${selected.id}/reject`, { reason, cancelled_by: "user" });
    const updated = r.data;
    setTrips(p => p.map(t => t.id === selected.id ? updated : t));
    setSelected(updated);
    setShowReject(false);
  }

  async function handleRegenerate() {
    if (!selected) return;
    setRegenerating(true);
    try {
      const r = await api.post(`/nill/travel/${selected.id}/regenerate`);
      const updated = r.data;
      setTrips(p => p.map(t => t.id === selected.id ? updated : t));
      setSelected(updated);
    } catch {
      alert("Plan-Generierung fehlgeschlagen.");
    } finally {
      setRegenerating(false);
function TravelModule() {
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: FB, fontSize: 22, fontWeight: 700, color: T.textPri, letterSpacing: "-0.02em" }}>Geschäftsreisen</h2>
          <p style={{ margin: "5px 0 0", fontFamily: FM, fontSize: 11, color: T.textSec }}>NILL plant konkret — du bestätigst</p>
        </div>
        <PrimaryBtn onClick={() => setShowForm(v => !v)} color={T.accent}>+ Neue Reise</PrimaryBtn>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "20px 24px", marginBottom: 20 }}>
          <p style={{ margin: "0 0 18px", fontFamily: FB, fontSize: 14, fontWeight: 600, color: T.textPri }}>Reiseanfrage</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <FormField label="Reiseziel"    value={form.destination}    onChange={f("destination")}    placeholder="z.B. Berlin" />
            <FormField label="Abfahrtsort"  value={form.origin}         onChange={f("origin")}         placeholder="z.B. München Hbf" />
            <FormField label="Zweck"        value={form.purpose}        onChange={f("purpose")}        placeholder="z.B. Kundengespräch" />
            <FormField label="Budget (EUR)" value={form.budget}         onChange={f("budget")}         placeholder="z.B. 800" />
            <FormField label="Abreise"      value={form.departure_date} onChange={f("departure_date")} type="date" />
            <FormField label="Rückkehr"     value={form.return_date}    onChange={f("return_date")}    type="date" />
          </div>
          <FormField label="Notizen" value={form.notes} onChange={f("notes")} rows={2} placeholder="Präferenzen, besondere Anforderungen ..." />
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <PrimaryBtn onClick={handleSubmit} disabled={submitting} color={T.accent}>
              {submitting ? "NILL RECHERCHIERT ..." : "Reiseplan anfordern"}
            </PrimaryBtn>
            <GhostBtn onClick={() => setShowForm(false)}>Abbrechen</GhostBtn>
          </div>
          {submitting && (
            <p style={{ margin: "10px 0 0", fontFamily: FM, fontSize: 10, color: T.textTer }}>
              NILL recherchiert Verbindungen, Hotels und Preise — dies kann 10–20 Sekunden dauern.
            </p>
          )}
        </div>
      )}

      {/* List */}
      {loading
        ? <p style={{ textAlign: "center", padding: 40, fontFamily: FM, fontSize: 11, color: T.textTer }}>LADE ...</p>
        : trips.length === 0
        ? (
          <div style={{ textAlign: "center", padding: "52px 24px", border: `1px dashed ${T.border}`, borderRadius: 8 }}>
            <div style={{ width: 1, height: 40, background: T.border, margin: "0 auto 20px" }} />
            <p style={{ margin: "0 0 8px", fontFamily: FB, fontSize: 15, fontWeight: 600, color: T.textSec }}>Keine Reisen geplant</p>
            <p style={{ margin: 0, fontFamily: FM, fontSize: 11, color: T.textTer }}>Reiseanfrage stellen — NILL recherchiert konkrete Verbindungen und Preise</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {trips.map((t, i) => {
              const cfg = TRAVEL_STATUS[t.status] || TRAVEL_STATUS.pending_approval;
              const plan = t.ai_plan;
              const costMin = plan?.cost_breakdown?.total_min;
              const costMax = plan?.cost_breakdown?.total_max;

              return (
                <div key={t.id}
                  onClick={() => setSelected(t)}
                  style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: i === 0 ? "8px 8px 2px 2px" : i === trips.length - 1 ? "2px 2px 8px 8px" : 2, padding: "14px 20px", cursor: "pointer", transition: "all 0.12s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHi; e.currentTarget.style.background = T.bg2; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border;   e.currentTarget.style.background = T.bg1; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div>
                      <p style={{ margin: 0, fontFamily: FB, fontSize: 15, fontWeight: 600, color: T.textPri }}>{t.destination}</p>
                      <p style={{ margin: "3px 0 0", fontFamily: FM, fontSize: 10, color: T.textTer }}>
                        {t.departure_date || "—"} → {t.return_date || "—"}
                        {t.purpose ? ` · ${t.purpose}` : ""}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0, marginLeft: 12 }}>
                      {costMin !== undefined && (
                        <span style={{ fontFamily: FM, fontSize: 12, color: T.textSec }}>
                          {costMin?.toFixed(0)}–{costMax?.toFixed(0)} EUR
                        </span>
                      )}
                      <Tag color={cfg.color} dim={cfg.dim}>{cfg.label}</Tag>
                    </div>
                  </div>

                  {t.ai_suggestion && (
                    <p style={{ margin: 0, fontFamily: FB, fontSize: 12, color: T.textSec, lineHeight: 1.5 }}>
                      {t.ai_suggestion.slice(0, 120)}{t.ai_suggestion.length > 120 ? "…" : ""}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )
      }

      {/* Detail Drawer */}
      {selected && !showReject && (
        <TravelPlanDrawer
          trip         = {selected}
          onClose      = {() => setSelected(null)}
          onConfirm    = {handleConfirm}
          onReject     = {() => setShowReject(true)}
          onRegenerate = {handleRegenerate}
        />
      )}

      {/* Reject Modal */}
      {showReject && (
        <RejectModal
          onConfirm = {handleReject}
          onCancel  = {() => setShowReject(false)}
        />
      )}
    </div>
}
  );

// ─── Contracts ────────────────────────────────────────────────────────────────

function ContractsModule() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => { api.get("/nill/contracts").then(r => setContracts(r.data)).finally(() => setLoading(false)); }, []);

  async function handleUpload(file) {
    setUploading(true);
    try {
      const form = new FormData(); form.append("file", file);
      const r = await api.post("/nill/contracts/upload", form, { headers: { "Content-Type": "multipart/form-data" } });
      setContracts(p => [r.data, ...p]);
    } catch {} finally { setUploading(false); }
  }

  const URGENCY = {
    high:   { label: "DRINGEND", color: T.danger, dim: T.dangerDim },
    medium: { label: "NORMAL",   color: T.warn,   dim: T.warnDim   },
    low:    { label: "NIEDRIG",  color: T.accent, dim: T.accentDim },
  };

  return (
    <div>
      <SectionTitle title="Verträge" subtitle="NILL liest, fasst zusammen, warnt vor Fristen" />
      <UploadZone onFiles={handleUpload} loading={uploading} accept=".pdf,.docx" label="VERTRAG ABLEGEN" sublabel="PDF oder DOCX" color={T.purple} />

      {loading ? <p style={{ textAlign: "center", padding: 40, fontFamily: FONT_MONO, fontSize: 11, color: T.textTer }}>LADE ...</p>
      : contracts.length === 0 ? <EmptySlate title="Keine Verträge" body="Vertrag hochladen — NILL fasst zusammen und überwacht Fristen" />
      : (
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {contracts.map(c => {
            const urg = URGENCY[c.urgency] || URGENCY.low;
            return (
              <Card key={c.id} onClick={() => setSelected(c)} style={{ borderRadius: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <p style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 600, color: T.textPri }}>{c.title || c.filename}</p>
                  <Tag color={urg.color} dim={urg.dim}>{urg.label}</Tag>
                </div>
                {c.ai_summary && <p style={{ margin: "0 0 8px", fontFamily: FONT_BODY, fontSize: 12, color: T.textSec, lineHeight: 1.5 }}>{c.ai_summary.slice(0, 130)}…</p>}
                {c.deadline && <p style={{ margin: 0, fontFamily: FONT_MONO, fontSize: 10, color: T.danger }}>FRIST: {c.deadline}</p>}
              </Card>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <Drawer onClose={() => setSelected(null)} title={selected.title || selected.filename} maxWidth={560}>
            {selected.ai_summary && <InfoBlock label="Zusammenfassung" color={T.textPri}>{selected.ai_summary}</InfoBlock>}
            {(selected.key_points || []).length > 0 && (
              <InfoBlock label="Kernpunkte">
                <ul style={{ margin: 0, padding: "0 0 0 14px" }}>
                  {selected.key_points.map((k, i) => <li key={i} style={{ fontFamily: FONT_BODY, fontSize: 13, color: T.textSec, marginBottom: 4 }}>{k}</li>)}
                </ul>
              </InfoBlock>
            )}
            {selected.deadline && (
              <div style={{ background: T.dangerDim, border: `1px solid ${T.danger}40`, borderRadius: 6, padding: "10px 14px" }}>
                <p style={{ margin: 0, fontFamily: FONT_MONO, fontSize: 11, color: T.danger }}>FRIST: {selected.deadline}</p>
              </div>
            )}
          </Drawer>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

function OnboardingModule() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", start_date: "", email: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { api.get("/nill/onboarding").then(r => setEmployees(r.data)).finally(() => setLoading(false)); }, []);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const r = await api.post("/nill/onboarding", form);
      setEmployees(p => [r.data, ...p]);
      setShowForm(false); setForm({ name: "", role: "", start_date: "", email: "" });
    } catch {} finally { setSubmitting(false); }
  }

  async function toggleTask(eid, tid) {
    try { const r = await api.patch(`/nill/onboarding/${eid}/tasks/${tid}/toggle`); setEmployees(p => p.map(e => e.id === eid ? r.data : e)); }
    catch {}
  }

  return (
    <div>
      <SectionTitle
        title="Onboarding"
        subtitle="NILL erstellt Checklisten automatisch"
        action={<PrimaryBtn onClick={() => setShowForm(v => !v)} color={T.purple}>+ Neuer Mitarbeiter</PrimaryBtn>}
      />

      {showForm && (
        <FormPanel title="Mitarbeiter anlegen" onSubmit={handleSubmit} onCancel={() => setShowForm(false)} submitLabel={submitting ? "NILL ERSTELLT CHECKLISTE ..." : "Anlegen"} submitColor={T.purple}>
          <FormGrid>
            <FormField label="Name" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} placeholder="Vollständiger Name" />
            <FormField label="Stelle" value={form.role} onChange={v => setForm(p => ({ ...p, role: v }))} placeholder="z.B. Frontend Developer" />
            <FormField label="E-Mail" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} type="email" placeholder="name@unternehmen.de" />
            <FormField label="Startdatum" value={form.start_date} onChange={v => setForm(p => ({ ...p, start_date: v }))} type="date" />
          </FormGrid>
        </FormPanel>
      )}

      {loading ? <p style={{ textAlign: "center", padding: 40, fontFamily: FONT_MONO, fontSize: 11, color: T.textTer }}>LADE ...</p>
      : employees.length === 0 ? <EmptySlate title="Kein Onboarding aktiv" body="Neuen Mitarbeiter anlegen — NILL erstellt die Checkliste automatisch" />
      : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {employees.map(emp => {
            const tasks = emp.tasks || [];
            const done = tasks.filter(t => t.done).length;
            const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
            return (
              <Card key={emp.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <p style={{ margin: "0 0 2px", fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 600, color: T.textPri }}>{emp.name}</p>
                    <p style={{ margin: 0, fontFamily: FONT_MONO, fontSize: 10, color: T.textTer }}>{emp.role} · START: {emp.start_date}</p>
                  </div>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 13, fontWeight: 500, color: pct === 100 ? T.accent : T.textSec }}>{pct}%</span>
                </div>
                <div style={{ background: T.bg2, borderRadius: 99, height: 2, marginBottom: 14, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: pct === 100 ? T.accent : T.borderHi, width: `${pct}%`, transition: "width 0.4s" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {tasks.map(task => (
                    <label key={task.id} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                      <input type="checkbox" checked={task.done} onChange={() => toggleTask(emp.id, task.id)}
                        style={{ width: 14, height: 14, accentColor: T.accent, cursor: "pointer", flexShrink: 0 }} />
                      <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: task.done ? T.textTer : T.textPri, textDecoration: task.done ? "line-through" : "none" }}>{task.label}</span>
                    </label>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Competitors ──────────────────────────────────────────────────────────────

function CompetitorsModule() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => { api.get("/nill/competitors").then(r => setReports(r.data)).finally(() => setLoading(false)); }, []);

  async function triggerRefresh() {
    setRefreshing(true);
    try { const r = await api.post("/nill/competitors/refresh"); setReports(r.data); }
    catch {} finally { setRefreshing(false); }
  }

  const SENT = {
    positive: { label: "POSITIV",  color: T.accent, dim: T.accentDim },
    neutral:  { label: "NEUTRAL",  color: T.warn,   dim: T.warnDim   },
    negative: { label: "KRITISCH", color: T.danger, dim: T.dangerDim },
  };

  return (
    <div>
      <SectionTitle
        title="Wettbewerber"
        subtitle="Tägliches Monitoring durch NILL"
        action={<PrimaryBtn onClick={triggerRefresh} disabled={refreshing} color={T.warn}>{refreshing ? "AKTUALISIERE ..." : "Jetzt aktualisieren"}</PrimaryBtn>}
      />

      {loading ? <p style={{ textAlign: "center", padding: 40, fontFamily: FONT_MONO, fontSize: 11, color: T.textTer }}>LADE ...</p>
      : reports.length === 0 ? <EmptySlate title="Keine Berichte" body="NILL sammelt täglich neue Informationen über deine Wettbewerber" />
      : (
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {reports.map(r => {
            const sent = SENT[r.sentiment] || SENT.neutral;
            return (
              <Card key={r.id} onClick={() => setSelected(r)} style={{ borderRadius: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 7 }}>
                  <p style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 600, color: T.textPri }}>{r.competitor_name}</p>
                  <Tag color={sent.color} dim={sent.dim}>{sent.label}</Tag>
                </div>
                <p style={{ margin: "0 0 8px", fontFamily: FONT_BODY, fontSize: 12, color: T.textSec, lineHeight: 1.5 }}>{r.summary?.slice(0, 140)}…</p>
                <p style={{ margin: 0, fontFamily: FONT_MONO, fontSize: 9, color: T.textTer }}>{r.updated_at ? new Date(r.updated_at).toLocaleDateString("de-DE") : ""}</p>
              </Card>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <Drawer onClose={() => setSelected(null)} title={selected.competitor_name} maxWidth={540}>
            {selected.summary && <InfoBlock label="Zusammenfassung" color={T.textPri}>{selected.summary}</InfoBlock>}
            {(selected.highlights || []).length > 0 && (
              <InfoBlock label="Highlights">
                <ul style={{ margin: 0, padding: "0 0 0 14px" }}>
                  {selected.highlights.map((h, i) => <li key={i} style={{ fontFamily: FONT_BODY, fontSize: 13, color: T.textSec, marginBottom: 4 }}>{h}</li>)}
                </ul>
              </InfoBlock>
            )}
            {(selected.sources || []).length > 0 && (
              <div style={{ marginTop: 12 }}>
                <MonoLabel>Quellen</MonoLabel>
                {selected.sources.map((s, i) => <a key={i} href={s} target="_blank" rel="noreferrer" style={{ display: "block", fontFamily: FONT_MONO, fontSize: 11, color: T.info, marginBottom: 4 }}>{s}</a>)}
              </div>
            )}
          </Drawer>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Meetings ─────────────────────────────────────────────────────────────────

function MeetingsModule() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", participants: "", agenda: "", context: "" });
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => { api.get("/nill/meetings").then(r => setMeetings(r.data)).finally(() => setLoading(false)); }, []);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const r = await api.post("/nill/meetings", form);
      setMeetings(p => [r.data, ...p]);
      setShowForm(false); setForm({ title: "", date: "", participants: "", agenda: "", context: "" });
    } catch {} finally { setSubmitting(false); }
  }

  return (
    <div>
      <SectionTitle
        title="Meeting-Vorbereitung"
        subtitle="NILL erstellt vollständige Briefings"
        action={<PrimaryBtn onClick={() => setShowForm(v => !v)} color={T.danger}>+ Meeting anlegen</PrimaryBtn>}
      />

      {showForm && (
        <FormPanel title="Briefing anfordern" onSubmit={handleSubmit} onCancel={() => setShowForm(false)} submitLabel={submitting ? "NILL ERSTELLT BRIEFING ..." : "Briefing erstellen"} submitColor={T.danger}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <FormField label="Titel" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} placeholder="z.B. Quartalsgespräch mit Kunde XY" />
            <FormGrid>
              <FormField label="Datum und Uhrzeit" value={form.date} onChange={v => setForm(p => ({ ...p, date: v }))} type="datetime-local" />
              <FormField label="Teilnehmer" value={form.participants} onChange={v => setForm(p => ({ ...p, participants: v }))} placeholder="Namen oder E-Mails" />
            </FormGrid>
            <FormField label="Agenda" value={form.agenda} onChange={v => setForm(p => ({ ...p, agenda: v }))} rows={2} placeholder="Was soll besprochen werden?" />
            <FormField label="Kontext für NILL" value={form.context} onChange={v => setForm(p => ({ ...p, context: v }))} rows={2} placeholder="Hintergrundinfos, bisherige Zusammenarbeit ..." />
          </div>
        </FormPanel>
      )}

      {loading ? <p style={{ textAlign: "center", padding: 40, fontFamily: FONT_MONO, fontSize: 11, color: T.textTer }}>LADE ...</p>
      : meetings.length === 0 ? <EmptySlate title="Kein Meeting vorbereitet" body="Meeting anlegen — NILL liefert ein vollständiges Briefing" />
      : (
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {meetings.map(m => (
            <Card key={m.id} onClick={() => setSelected(m)} style={{ borderRadius: 6 }}>
              <p style={{ margin: "0 0 4px", fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 600, color: T.textPri }}>{m.title}</p>
              <p style={{ margin: "0 0 8px", fontFamily: FONT_MONO, fontSize: 10, color: T.textTer }}>
                {m.date ? new Date(m.date).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" }) : "—"}
              </p>
              {m.ai_briefing && <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 12, color: T.textSec, lineHeight: 1.5 }}>{m.ai_briefing.slice(0, 130)}…</p>}
            </Card>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <Drawer onClose={() => setSelected(null)} title={selected.title} subtitle={selected.date ? new Date(selected.date).toLocaleString("de-DE", { dateStyle: "full", timeStyle: "short" }) : ""} maxWidth={580}>
            {selected.ai_briefing && <InfoBlock label="Briefing" color={T.textPri}><span style={{ whiteSpace: "pre-wrap" }}>{selected.ai_briefing}</span></InfoBlock>}
            {(selected.talking_points || []).length > 0 && (
              <InfoBlock label="Gesprächspunkte">
                <ul style={{ margin: 0, padding: "0 0 0 14px" }}>
                  {selected.talking_points.map((pt, i) => <li key={i} style={{ fontFamily: FONT_BODY, fontSize: 13, color: T.textSec, marginBottom: 4 }}>{pt}</li>)}
                </ul>
              </InfoBlock>
            )}
          </Drawer>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function NILLModule() {
  const [searchParams] = useSearchParams();
  const [active, setActive] = useState(searchParams.get("module") || "overview");
  const [nillNotifications, setNillNotifications] = useState([]);
  const [dailySummary, setDailySummary] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get("/nill/notifications/dashboard"),
      api.get("/nill/summary/daily"),
    ]).then(([nr, sr]) => {
      setNillNotifications(nr.data || []);
      setDailySummary(sr.data || null);
    }).catch(() => {});
  }, []);

  const pendingCount = nillNotifications.filter(n => n.requires_action).length;

  return (
    <PageLayout>
      <GlobalStyles />
      <div className="nill-root" style={{ display: "flex", gap: 20, minHeight: "80vh", fontFamily: FONT_BODY }}>

        {/* Sidebar */}
        <aside style={{
          width: 210, flexShrink: 0, alignSelf: "flex-start", position: "sticky", top: 24,
          background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 10,
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          {/* Wordmark */}
          <div style={{ padding: "22px 20px 18px", borderBottom: `1px solid ${T.border}` }}>
            <p style={{ margin: "0 0 2px", fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 800, color: T.textPri, letterSpacing: "-0.04em" }}>NILL</p>
            <p style={{ margin: 0, fontFamily: FONT_MONO, fontSize: 9, color: T.textTer, letterSpacing: "0.12em" }}>KI-SEKRETÄRIN</p>
          </div>

          {/* Nav */}
          <nav style={{ padding: "10px 8px", flex: 1 }}>
            {MODULES.map(m => {
              const isActive = active === m.id;
              return (
                <button key={m.id} onClick={() => setActive(m.id)} style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "9px 12px", borderRadius: 6, border: "none",
                  background: isActive ? T.bg3 : "none",
                  cursor: "pointer", textAlign: "left", marginBottom: 1,
                  transition: "background 0.1s",
                }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = T.bg2; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "none"; }}
                >
                  <span style={{ fontFamily: FONT_MONO, fontSize: 9, color: isActive ? T.textTer : T.textTer, letterSpacing: "0.06em", minWidth: 16 }}>{m.tag}</span>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: isActive ? 500 : 400, color: isActive ? T.textPri : T.textSec, flex: 1 }}>{m.label}</span>
                  {m.id === "overview" && pendingCount > 0 && (
                    <span style={{ background: T.warn, color: T.bg0, borderRadius: 99, fontFamily: FONT_MONO, fontSize: 9, fontWeight: 700, padding: "1px 6px", minWidth: 16, textAlign: "center" }}>{pendingCount}</span>
                  )}
                  {isActive && <div style={{ width: 3, height: 3, borderRadius: "50%", background: T.accent, flexShrink: 0 }} />}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div style={{ padding: "14px 20px", borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent }} />
            <span style={{ fontFamily: FONT_MONO, fontSize: 9, color: T.textTer, letterSpacing: "0.1em" }}>ONLINE</span>
          </div>
        </aside>

        {/* Content pane */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.14 }}
              style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 10, padding: "32px 36px" }}
            >
              {active === "overview"     && <OverviewModule nillNotifications={nillNotifications} dailySummary={dailySummary} />}
              {active === "applications" && <ApplicationsModule />}
              {active === "travel"       && <TravelModule />}
              {active === "contracts"    && <ContractsModule />}
              {active === "onboarding"   && <OnboardingModule />}
              {active === "competitors"  && <CompetitorsModule />}
              {active === "meetings"     && <MeetingsModule />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </PageLayout>
  );
}
