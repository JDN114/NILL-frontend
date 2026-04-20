import { useState, useEffect, useRef } from "react";

const API = "/nill";

const STATUS_CONFIG = {
  new:         { label: "Neu",          color: "#6366f1", bg: "#eef2ff" },
  interesting: { label: "Interessant",  color: "#0891b2", bg: "#ecfeff" },
  interview:   { label: "Interview",    color: "#059669", bg: "#ecfdf5" },
  rejected:    { label: "Abgelehnt",    color: "#dc2626", bg: "#fef2f2" },
  hired:       { label: "Eingestellt",  color: "#7c3aed", bg: "#f5f3ff" },
};

const MODULES = [
  { id: "applications", label: "Bewerbungen",         icon: "👤", active: true },
  { id: "travel",       label: "Geschäftsreisen",     icon: "✈️", active: false },
  { id: "contracts",    label: "Verträge",             icon: "📄", active: false },
  { id: "onboarding",   label: "Onboarding",           icon: "🚀", active: false },
  { id: "competitors",  label: "Wettbewerber",         icon: "🔍", active: false },
  { id: "meetings",     label: "Meeting-Vorbereitung", icon: "📅", active: false },
];

function ScoreBadge({ score }) {
  const color =
    score >= 90 ? "#059669" :
    score >= 75 ? "#0891b2" :
    score >= 60 ? "#d97706" :
    score >= 40 ? "#ea580c" : "#dc2626";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 44, height: 44, borderRadius: "50%",
      border: `2px solid ${color}`, color, fontWeight: 700, fontSize: 14,
      flexShrink: 0,
    }}>
      {Math.round(score)}
    </span>
  );
}

function StatusPill({ status, onChange }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.new;
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}40`,
          borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {cfg.label} ▾
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "110%", left: 0, zIndex: 100,
          background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8,
          boxShadow: "0 4px 16px rgba(0,0,0,0.10)", minWidth: 140, overflow: "hidden",
        }}>
          {Object.entries(STATUS_CONFIG).map(([key, val]) => (
            <button
              key={key}
              onClick={() => { onChange(key); setOpen(false); }}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "8px 14px", background: "none", border: "none",
                fontSize: 13, color: val.color, cursor: "pointer",
                fontWeight: status === key ? 700 : 400,
              }}
            >
              {val.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ApplicationCard({ app, onStatusChange, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12,
        padding: "16px 20px", cursor: "pointer", transition: "box-shadow 0.15s",
        display: "flex", gap: 16, alignItems: "flex-start",
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      <ScoreBadge score={app.ai_score ?? 0} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>{app.candidate_name}</span>
          {app.position && (
            <span style={{ fontSize: 12, color: "#6b7280", background: "#f3f4f6", borderRadius: 4, padding: "1px 7px" }}>
              {app.position}
            </span>
          )}
        </div>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 8px", lineHeight: 1.4 }}>
          {app.ai_summary?.slice(0, 120)}{app.ai_summary?.length > 120 ? "…" : ""}
        </p>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <StatusPill
            status={app.status}
            onChange={status => { onStatusChange(app.id, status); }}
          />
          <span style={{ fontSize: 11, color: "#9ca3af" }}>
            {app.uploaded_at ? new Date(app.uploaded_at).toLocaleDateString("de-DE") : ""}
          </span>
        </div>
      </div>
    </div>
  );
}

function ApplicationDetail({ app, onClose, onStatusChange }) {
  if (!app) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
      zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 600,
        maxHeight: "90vh", overflowY: "auto", padding: "32px 36px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, color: "#111827" }}>{app.candidate_name}</h2>
            {app.email && <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>{app.email}</p>}
            {app.position && <p style={{ margin: "2px 0 0", fontSize: 13, color: "#6b7280" }}>Bewerbung: {app.position}</p>}
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <ScoreBadge score={app.ai_score ?? 0} />
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#9ca3af" }}>✕</button>
          </div>
        </div>

        <section style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", letterSpacing: "0.05em", margin: "0 0 8px" }}>ZUSAMMENFASSUNG</h3>
          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>{app.ai_summary}</p>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <section style={{ background: "#f0fdf4", borderRadius: 8, padding: "12px 16px" }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, color: "#15803d", margin: "0 0 8px" }}>STÄRKEN</h3>
            <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
              {(app.ai_strengths || []).map((s, i) => (
                <li key={i} style={{ fontSize: 13, color: "#166534", marginBottom: 4 }}>{s}</li>
              ))}
            </ul>
          </section>
          <section style={{ background: "#fef2f2", borderRadius: 8, padding: "12px 16px" }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, color: "#dc2626", margin: "0 0 8px" }}>SCHWÄCHEN</h3>
            <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
              {(app.ai_weaknesses || []).map((w, i) => (
                <li key={i} style={{ fontSize: 13, color: "#991b1b", marginBottom: 4 }}>{w}</li>
              ))}
            </ul>
          </section>
        </div>

        <section style={{ background: "#eff6ff", borderRadius: 8, padding: "12px 16px", marginBottom: 24 }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, color: "#1d4ed8", margin: "0 0 6px" }}>NILL-EMPFEHLUNG</h3>
          <p style={{ fontSize: 13, color: "#1e40af", margin: 0, lineHeight: 1.5 }}>{app.ai_recommendation}</p>
        </section>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#6b7280" }}>Status:</span>
          <StatusPill status={app.status} onChange={status => onStatusChange(app.id, status)} />
        </div>
      </div>
    </div>
  );
}

function UploadZone({ onUpload, loading }) {
  const [drag, setDrag] = useState(false);
  const [position, setPosition] = useState("");
  const inputRef = useRef();

  const handleFiles = files => {
    const pdfs = Array.from(files).filter(f => f.name.endsWith(".pdf"));
    pdfs.forEach(file => onUpload(file, position));
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${drag ? "#6366f1" : "#d1d5db"}`,
          borderRadius: 10, padding: "24px 16px", textAlign: "center",
          cursor: "pointer", background: drag ? "#f0f0ff" : "#fafafa",
          transition: "all 0.15s",
        }}
      >
        <input ref={inputRef} type="file" accept=".pdf" multiple style={{ display: "none" }}
          onChange={e => handleFiles(e.target.files)} />
        <div style={{ fontSize: 28, marginBottom: 8 }}>📎</div>
        {loading
          ? <p style={{ margin: 0, fontSize: 14, color: "#6366f1", fontWeight: 500 }}>NILL analysiert…</p>
          : <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>PDF hier ablegen oder klicken zum Hochladen</p>
        }
      </div>
      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="Stelle (optional, z.B. Frontend Developer)"
          value={position}
          onChange={e => setPosition(e.target.value)}
          style={{
            flex: 1, padding: "8px 12px", border: "1px solid #d1d5db",
            borderRadius: 8, fontSize: 13, color: "#374151", outline: "none",
          }}
        />
      </div>
    </div>
  );
}

function DailyReport({ summary }) {
  if (!summary) return null;
  return (
    <div style={{
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      borderRadius: 12, padding: "16px 20px", marginBottom: 24, color: "#fff",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 16 }}>🤖</span>
        <span style={{ fontWeight: 600, fontSize: 14 }}>NILL Tagesabschluss</span>
        <span style={{ fontSize: 12, opacity: 0.8, marginLeft: "auto" }}>
          {new Date().toLocaleDateString("de-DE")}
        </span>
      </div>
      <p style={{ margin: 0, fontSize: 13, opacity: 0.95, lineHeight: 1.5 }}>{summary.notification}</p>
      <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
        {[
          { label: "Eingegangen", value: summary.total_received },
          { label: "Interessant", value: summary.interesting_candidates },
          { label: "Ø Score", value: summary.average_score },
        ].map(stat => (
          <div key={stat.label}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{stat.value}</div>
            <div style={{ fontSize: 11, opacity: 0.75 }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlaceholderModule({ module }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: 48, textAlign: "center",
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{module.icon}</div>
      <h2 style={{ margin: "0 0 8px", fontSize: 20, color: "#111827" }}>{module.label}</h2>
      <p style={{ margin: 0, fontSize: 14, color: "#9ca3af" }}>Dieses Modul ist noch in Entwicklung.</p>
    </div>
  );
}

export default function NILLModule() {
  const [activeModule, setActiveModule] = useState("applications");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [summary, setSummary] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeModule === "applications") {
      fetchApplications();
      fetchSummary();
    }
  }, [activeModule]);

  async function fetchApplications() {
    setLoading(true);
    setError(null);
    try {
      const url = filterStatus
        ? `${API}/applications?status=${filterStatus}`
        : `${API}/applications`;
      const res = await fetch(url);
      const data = await res.json();
      setApplications(data);
    } catch (e) {
      setError("Fehler beim Laden der Bewerbungen.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchSummary() {
    try {
      const res = await fetch(`${API}/applications/summary/daily`);
      const data = await res.json();
      setSummary(data);
    } catch {}
  }

  async function handleUpload(file, position) {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      if (position) form.append("position", position);
      const res = await fetch(`${API}/applications/upload`, { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload fehlgeschlagen");
      const newApp = await res.json();
      setApplications(prev => [newApp, ...prev]);
      await fetchSummary();
    } catch (e) {
      setError("Fehler beim Hochladen. Bitte erneut versuchen.");
    } finally {
      setUploading(false);
    }
  }

  async function handleStatusChange(id, status) {
    try {
      const res = await fetch(`${API}/applications/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const updated = await res.json();
      setApplications(prev => prev.map(a => a.id === id ? updated : a));
      if (selected?.id === id) setSelected(updated);
    } catch {}
  }

  const filtered = filterStatus
    ? applications.filter(a => a.status === filterStatus)
    : applications;

  return (
    <div style={{
      display: "flex", height: "100vh", fontFamily: "'Inter', sans-serif",
      background: "#f9fafb", overflow: "hidden",
    }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: "#fff", borderRight: "1px solid #e5e7eb",
        display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0,
      }}>
        <div style={{ padding: "0 20px 20px", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: 14,
            }}>N</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>NILL</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>KI-Sekretärin</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "16px 8px" }}>
          {MODULES.map(m => (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                background: activeModule === m.id ? "#eff6ff" : "none",
                color: activeModule === m.id ? "#6366f1" : "#374151",
                fontWeight: activeModule === m.id ? 600 : 400,
                fontSize: 14, textAlign: "left", marginBottom: 2,
                transition: "background 0.1s",
              }}
            >
              <span style={{ fontSize: 16 }}>{m.icon}</span>
              <span>{m.label}</span>
              {!m.active && (
                <span style={{
                  marginLeft: "auto", fontSize: 10, background: "#f3f4f6",
                  color: "#9ca3af", padding: "1px 6px", borderRadius: 10,
                }}>bald</span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: "12px 20px", borderTop: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: 11, color: "#9ca3af" }}>Status</div>
          <div style={{ fontSize: 12, color: "#059669", fontWeight: 500, marginTop: 2 }}>● Online</div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: "auto", padding: 32 }}>
        {activeModule === "applications" ? (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 22, color: "#111827" }}>Bewerbungen</h1>
                <p style={{ margin: "4px 0 0", fontSize: 14, color: "#6b7280" }}>
                  {applications.length} Bewerbung{applications.length !== 1 ? "en" : ""} gesamt
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["", "new", "interesting", "interview", "rejected"].map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    style={{
                      padding: "6px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                      border: "1px solid",
                      borderColor: filterStatus === s ? "#6366f1" : "#d1d5db",
                      background: filterStatus === s ? "#eff6ff" : "#fff",
                      color: filterStatus === s ? "#6366f1" : "#6b7280",
                      fontWeight: filterStatus === s ? 600 : 400,
                    }}
                  >
                    {s ? STATUS_CONFIG[s]?.label : "Alle"}
                  </button>
                ))}
              </div>
            </div>

            <DailyReport summary={summary} />

            <UploadZone onUpload={handleUpload} loading={uploading} />

            {error && (
              <div style={{
                background: "#fef2f2", border: "1px solid #fecaca",
                borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#dc2626",
              }}>
                {error}
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: "center", padding: 40, color: "#9ca3af", fontSize: 14 }}>
                Bewerbungen werden geladen…
              </div>
            ) : filtered.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "48px 24px",
                border: "2px dashed #e5e7eb", borderRadius: 12, color: "#9ca3af",
              }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
                <p style={{ margin: 0, fontSize: 14 }}>
                  Noch keine Bewerbungen. PDF hochladen um zu starten.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filtered.map(app => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    onStatusChange={handleStatusChange}
                    onClick={() => setSelected(app)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <PlaceholderModule module={MODULES.find(m => m.id === activeModule)} />
        )}
      </main>

      {selected && (
        <ApplicationDetail
          app={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
